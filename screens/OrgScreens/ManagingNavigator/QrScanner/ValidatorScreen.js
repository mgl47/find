import {
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
  Entypo,
  FontAwesome,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import colors from "../../../../components/colors";
import Animated, {
  FadeIn,
  FadeOut,
  FadeOutRight,
  SlideInDown,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";
import { Tab as Tab2, Text as Text2, TabView } from "@rneui/themed";

import { Camera, FlashMode } from "expo-camera";
import axios from "axios";
import { useData } from "../../../../components/hooks/useData";
import { Button } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import LottieView from "lottie-react-native";
import { useAuth } from "../../../../components/hooks/useAuth";

import { useDesign } from "../../../../components/hooks/useDesign";
import formattedDates from "../../../../components/formattedDates";

const Tab = createMaterialTopTabNavigator();

export default function ValidatorScreen({
  navigation,
  navigation: { goBack, canGoBack },
  route,
}) {
  const selectedEvent = route.params;
  const [hasPermission, setHasPermission] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [loading, setLoading] = useState(false);
  const animation = useRef(null);

  const [index, setIndex] = useState(0);

  const [showScanModal, setShowScanModal] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [statusCode, setStatusCode] = useState(0);
  const [scannedTicket, setScannedTicket] = useState("");

  const { getUpdatedUser, myEvents, headerToken, user } = useAuth();
  const { apiUrl } = useData();
  const { isIPhoneWithNotch } = useDesign();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const clean = () => {
    setFlashMode(FlashMode.off);
    setLoading(false);
    setStatusCode(0);
    setScannedTicket("");
    setScanned(false);
  };

  const scanQr = async (item) => {
    const selectedDate = formattedDates();
    if (scanned) return;
    setScanned(true);
    setLoading(true);

    try {
      const result = await axios.patch(
        `${apiUrl}/purchase/checkin/${selectedEvent?._id}`,
        {
          uuid: item?.data,
          exiting: index == 1,
          currentDate: selectedDate?.date,
          exitingTime: selectedDate?.displayDate + " às " + selectedDate?.hour,
          checkedAt: selectedDate?.displayDate + " às " + selectedDate?.hour,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: headerToken,
          },
        }
      );
      console.log(result?.data?.msg);

      if (result.status == 200 || 201 || 202 || 204) {
        setLoading(false);
        setStatusCode(result?.status);
        setScannedTicket(result?.data);
      }
    } catch (error) {
      setLoading(false);
      setStatusCode(error?.response?.status);
    }
  };

  //   console.log(statusCode);
  //   useLayoutEffect(() => {
  //     navigation.setOptions({
  //       headerRight: () => (
  //         <TouchableOpacity
  //           style={{ right: 20 }}
  //           onPress={() => setShowScanModal(true)}
  //         >
  //           <MaterialCommunityIcons
  //             name="qrcode-scan"
  //             size={24}
  //             color={colors.white}
  //           />
  //         </TouchableOpacity>
  //       ),
  //     });
  //   }, [navigation]);

  useEffect(() => {
    getUpdatedUser();
  }, []);
  const toggleFlashMode = () => {
    setFlashMode(
      flashMode == FlashMode.torch ? FlashMode.off : FlashMode.torch
    );
  };
  // if (!permission) {
  //   return (
  //     <View style={styles.container}>
  //       <Button
  //         title="Permitir acceso a la cámara"
  //         onPress={requestPermission}
  //       />
  //     </View>
  //   );
  // }

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        // paddingTop: isIPhoneWithNotch ? 44 : 0,
      }}
    >
      <View style={{ backgroundColor: colors.primary2, height: 200 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
            //   backgroundColor: colors.primary2,

            //   marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setIndex(0)}
            style={{
              backgroundColor: index == 0 ? colors.primary : colors.grey,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
              width: 100,
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                color: index == 0 ? colors.white : colors.black2,
                fontSize: 15,
                fontWeight: "500",
              }}
            >
              Entrada
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIndex(1)}
            style={{
              backgroundColor: index == 1 ? colors.primary : colors.grey,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
              width: 100,
              // marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                color: index == 1 ? colors.white : colors.black2,
                fontSize: 15,
                fontWeight: "500",
              }}
            >
              Saída
            </Text>
          </TouchableOpacity>
        </View>

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
              height: 400,
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
          {statusCode == 200 && (
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
          {statusCode == 204 && (
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
              source={require("../../../../components/animations/valid.json")}
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
          )}
        </View>
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
                <ActivityIndicator animating={true} color={colors.primary} />
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
                          : statusCode == 204
                          ? "Validado: "
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
                      backgroundColor: colors.grey,
                      borderRadius: 20,
                      left: 4,
                    }}
                  />
                  {/* <View
                style={{
                  height: 15,
                  width: 60,
                  backgroundColor: colors.grey,
                  borderRadius: 20,
                  left: 10,
                  top: 2,
                }}
              /> */}
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
                      backgroundColor: colors.grey,
                      borderRadius: 20,
                      left: 4,
                    }}
                  />
                  <View
                    style={{
                      height: 20,
                      width: 100,
                      backgroundColor: colors.grey,
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
                    backgroundColor: colors.grey,
                    borderRadius: 20,
                    left: 4,
                    top: 4,
                  }}
                />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity
          onPress={() => {
            setScanned(false),
              setScannedTicket(""),
              setStatusCode(0),
              setLoading(false);
          }}
          activeOpacity={0.5}
          style={{
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "flex-end",
            shadowOffset: { width: 0.5, height: 0.5 },
            shadowOpacity: 0.3,
            shadowRadius: 1,
            elevation: 0.5,
            width: 50,
            height: 50,
            marginRight: 10,
            marginTop: 10,
            zIndex: 2,
            backgroundColor: colors.white,
            borderRadius: 10,
          }}
          // onPress={() => navigation.navigate("addEvent", item)}
          // onPress={() => navigation.navigate("manageEvent", item)}
        >
          <FontAwesome name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,

    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 40,
    borderBottomWidth: 0.2,
    borderColor: colors.grey,
  },
  card: {
    height: 95,
    borderRadius: 10,
    backgroundColor: colors.white,
    overflow: "hidden",
    width: "100%",
    alignSelf: "center",

    elevation: 0.5,
    marginTop: 5,
    padding: 10,
  },
});
