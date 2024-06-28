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
  Alert,
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
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";

import {
  ActivityIndicator,
  Checkbox,
  Chip,
  TextInput,
} from "react-native-paper";

import colors from "../../colors";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from "react-native-reanimated";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

import LottieView from "lottie-react-native";
import { set } from "firebase/database";
import axios from "axios";
import { useData } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";

const { height, width } = Dimensions.get("window");

export default AttendeeLotterySheet = ({ sheetRef, event }) => {
  const { apiUrl } = useData();
  const { headerToken } = useAuth();

  const snapPoints = useMemo(() => ["55%", "100%"], []);
  const animation = useRef(null);
  const animation2 = useRef(null);

  const [sortedUser, setSortedUser] = useState(null);
  const [sorted, setSorted] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const ticketColor = (category) => {
    if (category?.startsWith("Promo")) {
      return colors.t4;
    } else if (category?.startsWith("Normal")) {
      return colors.primary2;
    } else if (category?.startsWith("V")) {
      return colors.darkGold;
    } else {
      return colors.primary2;
    }
  };

  const handleSheetChanges = useCallback((index) => {}, []);
  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-2} />,
    []
  );
  const sort = async () => {
    setLoading(true);
    setSortedUser(null);
    setSorted(false);
    animation.current.play();
    await new Promise((resolve) => setTimeout(resolve, 4200));

    setSortedUser(
      event?.attendees[Math.floor(Math.random() * event?.attendees.length)]
    );
    setSorted(true);
    setLoading(false);

    // animation2.current.play();
  };

  const notifyUser = () => {
    Alert.alert(
      "Confirmar Sorteio!",
      "Ao confirmar, o usuário será notificado sobre o sorteio. Esta ação é irreversível! ",
      [
        {
          text: "Cancelar",
          onPress: null,
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: confirmSorted,
        },
      ]
    );
  };
  const confirmSorted = async () => {
    Keyboard.dismiss();
    setLoading(true);
    console.log("fadsas");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);

    try {
      const response = await axios.patch(
        `${apiUrl}/user/event/${event?._id}`,
        {
          // cardInfo: paymentInfo,
          operation: {
            type: "attendeeLottery",
            task: "add",
            eventId: event?._id,
          },
          updates: {
            lotteryAttendee: { ...sortedUser, lottery: description },
          },
        },
        {
          headers: { Authorization: headerToken },
        }
      );
      await new Promise((resolve, reject) => setTimeout(resolve, 2000));

      if (response.status == 200) {
        await sheetRef.current.close();

        await new Promise((resolve, reject) => setTimeout(resolve, 500));

        // await getUpdatedUser({ field: "myTickets" });
        // await getUpdatedUser({ field: "user" });
      }
    } catch (error) {
      console.log(error?.response?.data?.msg);
      console.log(error);
    }
  };
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        enableOverDrag={false}
        ref={sheetRef}
        backdropComponent={renderBackdrop}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        handleStyle={{
          backgroundColor: colors.background,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.t5 }}
        onDismiss={() => {
          setSortedUser(null),
            setSorted(false),
            setDescription(""),
            setLoading(false);
        }}
      >
        <BottomSheetFlatList
          style={{ backgroundColor: colors.background }}
          data={event?.attendees?.filter((attendee) => attendee?.lottery)}
          ListHeaderComponent={
            <BottomSheetView style={styles.contentContainer}>
              {sortedUser && !sorted ? (
                <Animated.View
                  style={{ padding: 10 }}
                  entering={FadeIn.duration(350)}
                  exiting={FadeOut}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Ionicons name="dice" size={50} color={colors.t4} />
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "500",
                        color: colors.t3,
                        //   alignSelf: "center",
                        //   bottom: 30,
                        left: 10,
                      }}
                    >
                      Participante Sorteado
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.card, {}]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 5,
                        // left: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "600",
                          color: colors.t3,
                          left: 4,
                        }}
                      >
                        {sortedUser?.displayName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          marginLeft: 5,
                          top: 1,
                          color: colors.t4,
                          left: 4,
                        }}
                      >
                        @{sortedUser?.username}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 5,
                        left: 2,
                      }}
                    >
                      <MaterialIcons
                        name={
                          sortedUser?.checkedIn
                            ? "check-circle"
                            : "check-circle-outline"
                        }
                        size={22}
                        color={
                          sortedUser?.checkedIn ? "green" : colors.description
                        }
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          marginLeft: 5,
                          color: sortedUser?.checkedIn
                            ? "green"
                            : colors.description,
                        }}
                      >
                        {"CHECK IN"}
                      </Text>
                      {sortedUser?.checkedAt && (
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "500",
                            marginLeft: 8,
                            color: colors.t4,
                          }}
                        >
                          {sortedUser?.checkedAt}
                        </Text>
                      )}
                    </View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        marginLeft: 5,
                        color: ticketColor(sortedUser?.category),
                      }}
                    >
                      {sortedUser?.category}
                    </Text>
                  </TouchableOpacity>

                  <TextInput
                    // error={!description}
                    style={{
                      marginTop: 20,
                      backgroundColor: colors.background,
                    }}
                    mode="outlined"
                    outlineColor={colors.description}
                    activeOutlineColor={colors.t4}
                    activeUnderlineColor={colors.primary}
                    label="descrição"
                    value={description}
                    // multiline
                    cursorColor={colors.primary}
                    // onChangeText={(text) => setPerson({ ...person, email: text })}
                    onChangeText={setDescription}
                  />
                  <TouchableOpacity
                    disabled={loading}
                    onPress={notifyUser}
                    style={[styles.button, { marginTop: 20 }]}
                  >
                    {loading ? (
                      <ActivityIndicator
                        animating={loading}
                        color={colors.t2}
                      />
                    ) : (
                      <Text style={styles.buttonText}>Confirmar</Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ) : (
                <View style={{ padding: 10 }}>
                  <View style={{ width: "60%" }}>
                    <Text
                      style={{
                        fontSize: 19,
                        fontWeight: "600",
                        //   alignSelf: "center",
                        //   textAlign: "center",
                        color: colors.t3,
                        marginBottom: 10,
                        // top: 30,
                        // right: 10,
                        // position: "absolute",
                      }}
                    >
                      Sortear Participantes!
                    </Text>

                    <Text
                      style={{
                        color: colors.t5,
                        fontSize: 16,
                        //   textAlign: "center",
                      }}
                    >
                      Faça um sorteio para as pesssoas que vão estar presentes
                      no teu evento!
                    </Text>
                  </View>
                  <LottieView
                    ref={animation}
                    style={{
                      width: 350,
                      height: 350,
                      position: "absolute",
                      alignSelf: "center",
                      bottom: 10,
                      // backgroundColor: "#eee",
                    }}
                    loop={false}
                    source={require("../../animations/wheel.json")}
                  />

                  <TouchableOpacity
                    disabled={loading}
                    onPress={sort}
                    style={styles.button}
                  >
                    {loading ? (
                      <ActivityIndicator
                        animating={loading}
                        color={colors.t2}
                      />
                    ) : (
                      <Text style={styles.buttonText}>Sortear</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
              {sorted && (
                <Animated.View
                  entering={FadeIn}
                  exiting={FadeOut}
                  style={{
                    width: "100%",
                    flex: 1,
                    height,
                    position: "absolute",
                    // backgroundColor: "rgba(0,0,0,0.94)",
                    // backgroundColor: "rgba(5, 19, 29,0.99)",
                    backgroundColor: colors.background,
                    padding: 10,

                    borderRadius: 10,
                    //   alignSelf: "center",
                    //   justifyContent: "center",
                    //   alignItems: "center",
                    //   marginTop: 10,
                    //   marginBottom: 10,
                    //   padding: 10,
                  }}
                >
                  <LottieView
                    ref={animation2}
                    style={{
                      width: 300,
                      height: 300,
                      //   position: "absolute",
                      alignSelf: "center",
                      bottom: 20,
                      // backgroundColor: "#eee",
                    }}
                    autoPlay
                    loop={false}
                    source={require("../../animations/ticketss.json")}
                  />
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "500",
                      color: colors.t3,
                      alignSelf: "center",
                      //   marginBottom: 10,
                      bottom: 30,
                    }}
                  >
                    Participante Sorteado
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.card, {}]}
                  >
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
                          color: colors.t3,
                          left: 4,
                        }}
                      >
                        {sortedUser?.displayName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          marginLeft: 5,
                          top: 1,
                          color: colors.t4,
                          left: 4,
                        }}
                      >
                        @{sortedUser?.username}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 5,
                        left: 2,
                      }}
                    >
                      <MaterialIcons
                        name={
                          sortedUser?.checkedIn
                            ? "check-circle"
                            : "check-circle-outline"
                        }
                        size={22}
                        color={
                          sortedUser?.checkedIn ? "green" : colors.description
                        }
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          marginLeft: 5,
                          color: sortedUser?.checkedIn
                            ? "green"
                            : colors.description,
                        }}
                      >
                        {"CHECK IN"}
                      </Text>
                      {sortedUser?.checkedAt && (
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "500",
                            marginLeft: 8,
                            color: colors.t4,
                          }}
                        >
                          {sortedUser?.checkedAt}
                        </Text>
                      )}
                    </View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        marginLeft: 5,
                        color: ticketColor(sortedUser?.category),
                      }}
                    >
                      {sortedUser?.category}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSorted(false)}
                    style={[styles.button, { marginTop: 20 }]}
                  >
                    <Text style={styles.buttonText}>Avançar</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}

              {event?.attendees?.some((attendee) => attendee?.lottery) &&
                !sortedUser &&
                !loading && (
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "500",
                      color: colors.t4,
                      //   alignSelf: "center",
                      //   bottom: 30,
                      left: 20,
                      marginBottom: 10,
                    }}
                  >
                    Participantes Sorteados
                  </Text>
                )}
            </BottomSheetView>
          }
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) =>
            !sortedUser &&
            !loading && (
              <View activeOpacity={0.8} style={[styles.card, { width: "95%" }]}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                    // left: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: colors.t3,
                      left: 4,
                    }}
                  >
                    {item?.displayName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      marginLeft: 5,
                      top: 1,
                      color: colors.t4,
                      left: 4,
                    }}
                  >
                    @{item?.username}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                    left: 2,
                  }}
                >
                  <MaterialIcons
                    name={
                      item?.checkedIn ? "check-circle" : "check-circle-outline"
                    }
                    size={22}
                    color={item?.checkedIn ? "green" : colors.description}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      marginLeft: 5,
                      color: item?.checkedIn ? "green" : colors.description,
                    }}
                  >
                    {"CHECK IN"}
                  </Text>
                  {item?.checkedAt && (
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                        marginLeft: 8,
                        color: colors.t4,
                      }}
                    >
                      {item?.checkedAt}
                    </Text>
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    marginLeft: 5,
                    color: ticketColor(item?.category),
                  }}
                >
                  {item?.category}
                </Text>
              </View>
            )
          }
        />
      </BottomSheetModal>
    </BottomSheetModalProvider>
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
  card: {
    // flexDirection: "row",
    // alignItems:"center",
    height: 95,
    borderRadius: 10,
    backgroundColor: colors.background2,
    overflow: "hidden",
    width: "100%",
    alignSelf: "center",
    // alignItems: "center",
    // borderRadius: 10,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 1,
    // shadowRadius: 1,
    elevation: 0.5,
    marginTop: 5,
    padding: 10,
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
    color: colors.t4,
    fontWeight: "600",
  },

  displayName: {
    alignSelf: "flex-start",
    fontSize: 19,
    fontWeight: "600",
    color: colors.t3,
    marginTop: 10,
    marginVertical: 5,
  },
  separator: {
    width: "95%",
    height: 1,
    right: 10,
    backgroundColor: colors.separator,
    marginVertical: 5,
    alignSelf: "center",
  },
  button: {
    alignSelf: "center",
    flexDirection: "row",
    height: 50,
    width: "60%",
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
    marginTop: 200,
    marginBottom: 30,
  },
  buttonText: {
    color: colors.white,
    marginLeft: 5,
    fontSize: 17,
    fontWeight: "500",
  },
});
