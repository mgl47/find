import {
  Button,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { ActivityIndicator, Checkbox, Chip } from "react-native-paper";

import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutLeft,
} from "react-native-reanimated";
import { TextInput } from "react-native-paper";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import axios from "axios";
import { useData } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";
import colors from "../../colors";
import { Camera } from "expo-camera/legacy";
import toast from "../../toast";
import formattedDates from "../../formattedDates";

const { height, width } = Dimensions.get("window");
import uuid from "react-native-uuid";
import { FlashMode } from "expo-camera/build/legacy/Camera.types";

export default DoorTicketSheet = ({
  doorTicketModalRef,
  event,
  users,
  setUsers,
  filter,
  eventId,
  bottomSheetModalRef,
  total,
  separatedTickets,
}) => {
  // const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["55%", "95%"], []);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { apiUrl } = useData();
  const { user, headerToken, getUpdatedUser } = useAuth();
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [scanned, setScanned] = useState(false);
  const [statusCode, setStatusCode] = useState(0);
  const [scannedTicket, setScannedTicket] = useState(""); // const [hasPermission, setHasPermission] = useState(null);
  const [searchedUser, setSearchedUSer] = useState(null);
  const purchaseDates = formattedDates();

  const clean = () => {
    setScanned(false);
    setSearchedUSer(null);
    setScannedTicket("");
    setStatusCode(0);
    setLoading(false);
    bottomSheetModalRef.current.close();
  };

  const toggleFlashMode = () => {
    setFlashMode(
      flashMode == FlashMode.torch ? FlashMode.off : FlashMode.torch
    );
  };
  const scanQr = async (item) => {
    if (scanned) return;
    setScanned(true);
    setLoading(true);

    // setSearched(false);
    setSearchedUSer(null);
    try {
      const response = await axios.get(
        `${apiUrl}/users/?username=${item.data}`
      );
      if (response.status === 200) {
        setSearchedUSer(response?.data);
      }
    } catch (error) {
      console.log(error?.response?.data?.msg);
      console.log(error);
    }
    // setSearched(true);
  };

  const handleSheetChanges = useCallback((index) => {}, []);
  const [loading, setLoading] = useState(false);
  const purchaseId = uuid.v4();
  const doorTicketSeparatedTickets = separatedTickets?.map((ticket) => {
    return {
      ...ticket,

      doorTicket: true,
      soldBy: user?.username,
    };
  });

  const buyTickets = async () => {
    if (!searchedUser) {
      toast({
        msg: "Usuário não encontrado",
        color: colors.darkRed,
        textcolor: colors.white,
        hide: false,
        // duration: 1000,
      });
      return;
    }

    setLoading(true);
    let updateInterested = [];
    let updatedGoing = [];
    updatedGoing = searchedUser?.goingToEvents || [];
    updateInterested = searchedUser?.likedEvents || [];
    const index = updatedGoing.indexOf(event?._id);
    if (searchedUser?.goingToEvents?.includes(event?._id) && index !== -1) {
      updatedGoing.splice(index, 1);
    } else {
      updatedGoing.push(event?._id);
    }

    const filteredEvent = { ...event };
    delete filteredEvent.goingUsers;
    delete filteredEvent.interestedUsers;
    delete filteredEvent.attendees;
    delete filteredEvent.staffIds;
    delete filteredEvent.staff;

    try {
      const response = await axios.post(
        `${apiUrl}/purchase/`,
        {
          // cardInfo: paymentInfo,
          operation: {
            type: "ticketPurchase",
            task: "doorPurchase",
            eventId: event?._id,
          },
          details: {
            purchaseId,
            doorTicket: true,
            user: {
              endUser: {
                userId: searchedUser?._id,
                username: searchedUser?.username,
                email: searchedUser?.email,
                displayName: searchedUser?.displayName,
                uri: searchedUser?.photos?.avatar?.[0]?.uri,
              },
              buyer: {
                userId: searchedUser?._id,
                username: searchedUser?.username,
                email: searchedUser?.email,
                displayName: searchedUser?.displayName,
                uri: searchedUser?.photos?.avatar?.[0]?.uri,
              },
            },
            event: filteredEvent,
            // cardDetails: paymentInfo?.cardInfo,
            purchaseDate: {
              date: purchaseDates?.date,
              displayDate: purchaseDates?.displayDate,
              hour: purchaseDates?.hour,
            },
            tickets: doorTicketSeparatedTickets,
            total,
            uri: event?.photos[0]?.[0]?.uri,
          },
          userUpdates: {
            likedEvents: updateInterested,
            goingToEvents: updatedGoing,
          },
        },
        {
          headers: { Authorization: headerToken },
        }
      );
      await new Promise((resolve, reject) => setTimeout(resolve, 2000));

      if (response.status == 200) {
        // setPurchaseDone(true);
        await bottomSheetModalRef.current.close();

        await doorTicketModalRef.current.close();

        await new Promise((resolve, reject) => setTimeout(resolve, 500));

        // getUpdatedUser();
        clean();

        // setOnPayment(false);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.restart) {
        restart();
      }
      toast({
        msg: error?.response?.data?.msg,
        color: colors.darkRed,
        textcolor: colors.white,
        hide: false,
        // duration: 1000,
      });
      console.log(error?.response?.data?.invalidTickets);
      console.log(error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    // <BottomSheetModalProvider>
    <BottomSheetModal
      // style={{backgroundColor:}}
      ref={doorTicketModalRef}
      // index={keyboardVisible ? 1 : 0}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onDismiss={clean}
      enableOverDrag={false}
      handleStyle={{
        backgroundColor: colors.background,
      }}
      handleIndicatorStyle={{ backgroundColor: colors.t5 }}
    >
      <BottomSheetView style={styles.contentContainer}>
        {/* <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        // paddingTop: isIPhoneWithNotch ? 44 : 0,
      }}
    > */}
        <View style={{ backgroundColor: colors.background, height: 200 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
              //   backgroundColor: colors.primary2,

              //   marginBottom: 10,
            }}
          ></View>

          <View style={{ padding: 10, borderRadius: 15, zIndex: 5 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                //   marginVertical: 10,
                position: "absolute",
                height: 200,
                zIndex: 4,
                backgroundColor: colors.primary2,

                //   marginBottom: 10,
              }}
            />
            <TouchableOpacity
              onPress={toggleFlashMode}
              style={{
                position: "absolute",
                bottom: 20,
                right: 15,
                zIndex: 5,

                backgroundColor: "transparent",
                zIndex: 2,
              }}
            >
              <MaterialCommunityIcons
                name={
                  flashMode == FlashMode.off ? "flashlight" : "flashlight-off"
                }
                size={30}
                color={flashMode == FlashMode.off ? colors.white : colors.white}
              />
            </TouchableOpacity>
            <Camera
              //  flashMode={flashMode}
              style={{
                height: 350,
                width: "100%",
                // marginTop: 50,
                alignItems: "center",
                justifyContent: "center",
                // shadowOffset: { width: 0.5, height: 0.5 },
                // shadowOpacity: 0.3,
                // shadowRadius: 1,
                // elevation: 2,
                overflow: "hidden",
                borderRadius: 15,
              }}
              // flashMode={Camera.Constants.FlashMode.torch}
              // flashMode={flashMode}

              flashMode={flashMode}
              onBarCodeScanned={scanQr}
              type={"back"}
              autoFocus={true}

              // barCodeScannerSettings={{
              //   barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
              // }}
            />
            {/* {statusCode == 200 && (
                <LottieView
                  autoPlay
                  ref={animation}
                  style={{
                    width: 200,
                    height: 200,
                    position: "absolute",
                    alignSelf: "center",
                    bottom: -85, // backgroundColor: "#eee",
                  }}
                  // Find more Lottie files at https://lottiefiles.com/featured
                  source={require("../../../../components/animations/check.json")}
                />
              )}
              {statusCode == 203 && (
                <LottieView
                  autoPlay
                  ref={animation}
                  style={{
                    width: 200,
                    height: 200,
                    position: "absolute",
                    alignSelf: "center",
                    bottom: -85, // backgroundColor: "#eee",
                  }}
                  // Find more Lottie files at https://lottiefiles.com/featured
                  source={require("../../../../components/animations/reenter.json")}
                />
              )}
              {statusCode == 201 && (
                <LottieView
                  autoPlay
                  ref={animation}
                  style={{
                    width: 200,
                    height: 200,
                    position: "absolute",
                    alignSelf: "center",
                    bottom: -85, // backgroundColor: "#eee",
                  }}
                  // Find more Lottie files at https://lottiefiles.com/featured
                  source={require("../../../../components/animations/attention.json")}
                />
              )}
              {statusCode == 202 && (
                <LottieView
                  autoPlay
                  ref={animation}
                  renderMode={"SOFTWARE"}
                  resizeMode="contain"
                  style={{
                    width: 200,
                    zIndex: 3,
                    height: 200,
                    position: "absolute",
                    alignSelf: "center",
                    bottom: -85, // backgroundColor: "#eee",
                  }}
                  // Find more Lottie files at https://lottiefiles.com/featured
                  source={require("../../../../components/animations/exit.json")}
                />
              )}
              {statusCode == 404 && (
                <LottieView
                  autoPlay
                  ref={animation}
                  style={{
                    width: 160,
                    height: 160,
                    position: "absolute",
                    alignSelf: "center",
                    bottom: -65, // backgroundColor: "#eee",
                  }}
                  // Find more Lottie files at https://lottiefiles.com/featured
                  source={require("../../../../components/animations/invalid.json")}
                />
              )} */}
          </View>

          {searchedUser ? (
            <Animated.View
              //   entering={firstRender ? null : SlideInLeft}
              exiting={SlideOutLeft}
            >
              <View
                // onPress={addUser}

                style={{
                  shadowOffset: { width: 0.5, height: 0.5 },
                  shadowOpacity: 0.3,
                  shadowRadius: 1,
                  elevation: 2,
                  width: "100%",
                  marginTop: 10,
                }}
                // onPress={() => navigation.navigate("event", item)}
              >
                <Animated.View
                  style={styles.userCard}
                  entering={FadeIn}
                  exiting={FadeOut}
                >
                  <View
                    style={{
                      backgroundColor: colors.primary,
                      width: 100,
                      height: 40,
                      position: "absolute",
                      alignItems: "center",
                      right: -40,
                      top: 0,
                      zIndex: 1,
                      shadowOffset: { width: 0.5, height: 0.5 },
                      shadowOpacity: 0.5,
                      shadowRadius: 1,
                      elevation: 2,

                      transform: [{ rotate: "45deg" }],
                    }}
                  >
                    <FontAwesome
                      style={{
                        top: 10,
                        right: 5,
                        transform: [{ rotate: "-45deg" }],
                      }}
                      name="check-circle"
                      size={24}
                      color={colors.white}
                    />
                  </View>
                  <Image
                    source={{
                      uri: searchedUser?.photos?.avatar?.[0]?.uri,
                    }}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 50,

                      // marginLeft: 20,
                      // position: "absolute",
                    }}

                    // resizeMode="contain"
                  />
                  <View style={{ alignItems: "center", marginLeft: 10 }}>
                    <Text numberOfLines={2} style={[styles.displayName]}>
                      {searchedUser?.displayName}
                    </Text>
                    <Text numberOfLines={2} style={[styles.userName]}>
                      @{searchedUser?.username}
                    </Text>
                  </View>
                </Animated.View>
              </View>
            </Animated.View>
          ) : (
            <Animated.View
              style={{
                shadowOffset: { width: 0.5, height: 0.5 },
                shadowOpacity: 0.1,
                shadowRadius: 1,
                elevation: 0.5,
                paddingHorizontal: 10,
                marginTop: 40,
                zIndex: 2,
              }}
              entering={FadeIn}
              exiting={FadeOut}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.card}
                // onPress={() => navigation.navigate("addEvent", item)}
                // onPress={() => navigation.navigate("manageEvent", item)}
              >
                {loading ? (
                  <View
                    style={{
                      // position: "absolute",
                      alignSelf: "center",
                      // top: 10,
                      // zIndex: 2,
                      marginVertical: 20,
                    }}
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(200)}
                  >
                    <ActivityIndicator
                      animating={true}
                      color={colors.primary}
                    />
                  </View>
                ) : scannedTicket && statusCode != 404 ? (
                  <View entering={FadeIn} exiting={FadeOut}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 5,
                        left: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "600",
                          color: colors.primary,
                          left: 4,
                        }}
                      >
                        {scannedTicket?.displayName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          marginLeft: 5,
                          top: 1,
                          color: colors.darkGrey,
                          left: 4,
                        }}
                      >
                        @{scannedTicket?.username}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        // marginBottom: 5,
                        left: 2,
                      }}
                    >
                      <MaterialIcons
                        name={
                          statusCode == 201 ||
                          statusCode == 202 ||
                          statusCode == 203
                            ? "check-circle"
                            : "check-circle-outline"
                        }
                        size={24}
                        color={
                          statusCode == 202 || statusCode == 203
                            ? colors.primary
                            : statusCode == 201
                            ? "#ff8000"
                            : "green"
                        }
                      />
                      <View>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: "600",
                              marginLeft: 5,
                              color:
                                statusCode == 202 || statusCode == 203
                                  ? colors.primary
                                  : statusCode == 201
                                  ? "#ff8000"
                                  : "green",
                            }}
                          >
                            {statusCode == 201
                              ? "Escaneado: "
                              : statusCode == 200
                              ? "CHECK IN: "
                              : statusCode == 202
                              ? "Saída: "
                              : statusCode == 203
                              ? "Checked In: "
                              : ""}
                          </Text>
                          {scannedTicket?.checkedAt && (
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: "600",
                                //   marginLeft: 8,
                                color: colors.primary2,
                              }}
                            >
                              {`${
                                statusCode == 202
                                  ? scannedTicket?.leftAt
                                  : scannedTicket?.checkedAt
                              }.`}
                            </Text>
                          )}
                        </View>
                        {statusCode == 203 && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: "600",
                                marginLeft: 5,
                                color:
                                  statusCode == 202 || statusCode == 203
                                    ? colors.primary
                                    : statusCode == 201
                                    ? "#ff8000"
                                    : "green",
                              }}
                            >
                              {"Saída: "}
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontWeight: "600",
                                  marginLeft: 8,
                                  color: colors.primary2,
                                }}
                              >
                                {scannedTicket?.lastLeftAt}.
                              </Text>
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "600",
                        marginLeft: 5,
                        color: colors.black2,
                      }}
                    >
                      {scannedTicket?.category}
                    </Text>
                  </View>
                ) : (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 5,
                        left: 2,
                      }}
                    >
                      <View
                        style={{
                          height: 20,
                          width: 150,
                          backgroundColor: colors.background,
                          borderRadius: 20,
                          left: 4,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        // marginBottom: 5,
                        left: 2,
                      }}
                    >
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          backgroundColor: colors.background,
                          borderRadius: 20,
                          left: 4,
                        }}
                      />
                      <View
                        style={{
                          height: 20,
                          width: 100,
                          backgroundColor: colors.background,
                          borderRadius: 20,
                          left: 10,
                        }}
                      />
                      {scannedTicket?.checkedAt && (
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "600",
                            marginLeft: 8,
                            color: colors.darkGrey,
                          }}
                        >
                          {statusCode == 202
                            ? scannedTicket?.leftAt
                            : scannedTicket?.checkedAt}
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        height: 18,
                        width: 100,
                        backgroundColor: colors.background,
                        borderRadius: 20,
                        left: 4,
                        top: 4,
                      }}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}
          <TouchableOpacity
          disabled={!searchedUser}
            onPress={() => {
              buyTickets();
            }}
            activeOpacity={0.5}
            style={{
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              paddingHorizontal: 50,
              shadowOffset: { width: 0.5, height: 0.5 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              elevation: 0.5,
              //   width: 50,
              height: 50,
              marginRight: 10,
              marginTop: 10,
              zIndex: 2,
              backgroundColor: searchedUser
                ? colors.primary
                : colors.background2,

              borderRadius: 10,
            }}
            // onPress={() => navigation.navigate("addEvent", item)}
            // onPress={() => navigation.navigate("manageEvent", item)}
          >
            <Text
              style={{ color: colors.white, fontSize: 15, fontWeight: "500" }}
            >
              Confirmar
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
    // </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    // padding: 24,
    // justifyContent: "center",
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,

    // alignItems: "center",
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
  },
  map: {
    width: "100%",
    // borderRadius: 5,
    height: height * 0.35,
    backgroundColor: colors.grey,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // overflow:"hidden",

    // borderRadius: 10,
  },
  separator: {
    width: "95%",
    height: 1,
    backgroundColor: colors.grey,
    marginBottom: 2,
    alignSelf: "center",
  },
  userCard: {
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,

    // height: 95,
    backgroundColor: colors.background2,
    overflow: "hidden",
    width: "95%",
    alignSelf: "center",

    borderRadius: 10,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 1,
    // shadowRadius: 1,
    // elevation: 3,
  },
  userName: {
    fontSize: 14,
    alignSelf: "flex-start",
    color: colors.description,
    fontWeight: "600",
  },
  userSearch: {
    height: 40,
    width: "90%",
    alignSelf: "center",
    backgroundColor: colors.white,
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 15,
    // paddingLeft: 40,
  },
  displayName: {
    alignSelf: "flex-start",
    fontSize: 19,
    fontWeight: "600",
    color: colors.primary,
    marginTop: 10,
    marginVertical: 5,
  },
  card: {
    height: 95,
    borderRadius: 10,
    backgroundColor: colors.background2,
    overflow: "hidden",
    width: "100%",
    alignSelf: "center",

    elevation: 0.5,
    marginTop: 5,
    padding: 10,
  },
});
