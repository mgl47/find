import {
  Button,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetFooter,
  BottomSheetFlatList,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import colors from "../../colors";
import Animated, {
  FadeIn,
  FadeInRight,
  FadeOut,
  FadeOutLeft,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
} from "react-native-reanimated";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
  FontAwesome5,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { useData } from "../../hooks/useData";
import { ActivityIndicator, TextInput } from "react-native-paper";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import uuid from "react-native-uuid";
import toast from "../../toast";
import { useDesign } from "../../hooks/useDesign";
import { useNavigation } from "@react-navigation/native";
import formattedDates from "../../formattedDates";
import DoorTicketSheet from "./DoorTicketSheet";
export default GiftSheet = ({
  Event,
  giftModalRef,
  gift,
  setGift,
  setPurchaseModalUp,
}) => {
  const { headerToken, user,  } = useAuth();
  const { formatNumber, apiUrl, getOneEvent } = useData();
  const purchaseDates = formattedDates();
  const { isIPhoneWithNotch, height, width } = useDesign();
  const [event, setEvent] = useState(Event);
  const [available, setAvailable] = useState([]);
  const [searched, setSearched] = useState(false);
  const [search, setSearch] = useState("");
  const [searchedUser, setSearchedUSer] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const doorTicketModalRef = useRef(null);

  const TL = event?.tickets?.length;
  const customSnap = `${
    TL >= 4 ? "80" : TL == 3 ? "60" : TL == 2 ? "45" : "35"
  }%`;
  const snapPoints = useMemo(() => ["50%", `${customSnap}`, "80%"], []);
  const handleSheetChanges = useCallback((index) => {}, []);
  const [firstRender, setFirstRender] = useState(true);
  const [onPayment, setOnPayment] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const initialState = {
    cart: event?.tickets,
    total: 0,
    amount: 0,
  };

  const findUser = async () => {
    setUserLoading(true);
    setSearched(false);
    setSearchedUSer(null);
    try {
      const response = await axios.get(
        `${apiUrl}/users/?username=${search?.toLowerCase()}`
      );
      if (response.status === 200) {
        setSearchedUSer(response?.data);
      }
    } catch (error) {
      console.log(error?.response?.data?.msg);
      console.log(error);
    }
    setSearched(true);
    setUserLoading(false);
  };

  const clean = () => {
    setSearch("");
    setSearchedUSer(null);
    setSearched(false);
    setGift(false);
    giftModalRef.current.close();
    setPurchaseModalUp(false);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />,
    []
  );

  return (
    <BottomSheetModal
      // style={{backgroundColor:}}
      ref={giftModalRef}
      backdropComponent={renderBackdrop}
      index={keyboardVisible ? 2 : onPayment ? 0 : 1}
      // index={onPayment ? 0 : 1}
      keyboardBehavior={"interactive"}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onDismiss={() => {
        clean();
      }}
    >
      <BottomSheetView style={styles.contentContainer}>
        {!onPayment && gift ? (
          <View
            style={{ padding: 10 }}
            // entering={firstRender ? null : SlideInRight}
            // exiting={SlideOutRight}
          >
            <Animated.View
              entering={firstRender ? null : SlideInLeft}
              // exiting={userLoading ? FadeOut :SlideOutLeft}
              style={{
                flexDirection: "row",
                // justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "500",
                  // alignSelf: "center",
                  color: colors.primary2,
                  left: 10,
                  marginRight: 15,
                }}
              >
                Presentear
              </Text>

              <Feather name="gift" size={20} color={colors.primary} />
              <TouchableOpacity
                // disabled={!searchedUser}
                disabled={true}
                // onPress={save}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  // opacity: searchedUser ? 1 : 0,
                  opacity: 0,
                }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Avançar
                </Text>
                <MaterialCommunityIcons
                  style={{ top: 1 }}
                  name="arrow-right"
                  size={22}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </Animated.View>
            {!onPayment && searched && !searchedUser && !userLoading && (
              <Text
                style={{
                  color: colors.darkGrey,
                  alignSelf: "center",
                  // bottom: -10,
                  top: 30,
                  right: 10,
                  position: "absolute",
                }}
              >
                {" Este usuário não existe!"}
              </Text>
            )}
            <Animated.View
              entering={firstRender ? null : SlideInLeft}
              exiting={SlideOutLeft}
            >
              <TextInput
                // error={!searchText}
                style={{
                  marginBottom: 10,
                  backgroundColor: colors.background,
                  borderRadius: 20,
                }}
                // autoFocus
                outlineStyle={{ borderRadius: 10, borderWidth: 1.3 }}
                underlineStyle={{ backgroundColor: colors.primary }}
                // contentStyle={{
                //   backgroundColor: colors.background,
                //   fontWeight: "500",
                // }}

                outlineColor={colors.primary}
                mode="outlined"
                // placeholder="Pesquise por um usuário"
                activeOutlineColor={colors.primary}
                label="Nome de usuário"
                activeUnderlineColor={colors.primary}
                returnKeyType="search"
                value={search}
                cursorColor={colors.primary}
                // onChangeText={(text) => setPerson({ ...person, email: text })}
                onChangeText={setSearch}
                onSubmitEditing={findUser}
              />
            </Animated.View>
            {!onPayment && !userLoading && searchedUser ? (
              <Animated.View
                entering={firstRender ? null : SlideInLeft}
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
                  // onPress={() => navigation.navigate("event", {item})}
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
            ) : null}
          </View>
        ) : onPayment ? (
          <>
            <Animated.View
              style={{ flex: 1 }}
              entering={SlideInRight}
              exiting={SlideOutRight}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => setOnPayment(false)}
                    style={{
                      padding: 10,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="arrow-left"
                      size={20}
                      color={colors.primary}
                    />
                    <Text
                      style={{
                        color: colors.primary,
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      Voltar
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text
                          style={{
                            fontWeight: "500",
                            fontSize: 19,
                            marginRight: 20,
                            marginLeft: 5,
                            color: colors.primary,
                          }}
                        >
                          Confirmar compra
                        </Text>
                      </View> */}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    alignSelf: "flex-end",
                    // marginRight: 20,
                    marginRight: 0,
                    marginLeft: 5,
                    zIndex: 3,
                    padding: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "500",
                      color: colors.primary2,

                      // left: 10,
                    }}
                  >
                    Balanço:
                  </Text>

                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "500",
                      color: colors.primary,
                      // top: 2,
                      // position: "absolute",
                      // left: 20,
                    }}
                  >
                    {" cve " + formatNumber(user?.balance?.amount) || 0}
                  </Text>
                </View>
              </View>
              {gift && searchedUser && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 10,
                    marginTop: 5,
                  }}
                >
                  <Feather name="gift" size={20} color={colors.primary2} />

                  <Text
                    style={{
                      fontWeight: "500",
                      fontSize: 15,
                      marginRight: 5,
                      marginLeft: 2,
                      top: 2,
                      color: colors.primary2,
                    }}
                  >
                    Presente para:
                  </Text>

                  <Text
                    style={{
                      fontWeight: "500",
                      fontSize: 15,
                      marginRight: 20,
                      // marginLeft: 2,
                      top: 2,

                      color: colors.primary,
                    }}
                  >
                    @{searchedUser?.username}
                  </Text>
                </View>
              )}
              <View
                style={{
                  flex: 1,
                  padding: 10,
                }}
              >
                {user?.balance?.amount < state?.total && (
                  <View>
                    <TextInput
                      // error={!firstAt}
                      //  onFocus={() => {
                      //     shouldHandleKeyboardEvents.value = true;
                      //   }}
                      //   onBlur={() => {
                      //     shouldHandleKeyboardEvents.value = false;
                      //   }}
                      style={{
                        marginVertical: 10,
                        marginBottom: 5,
                        backgroundColor: colors.background,
                      }}
                      // autoFocus
                      mode="outlined"
                      activeOutlineColor={colors.primary}
                      underlineStyle={{ backgroundColor: colors.primary }}
                      outlineColor={colors.primary}
                      // contentStyle={{  fontWeight: "500",borderColor:"red" }}
                      label="Número de cartão"
                      defaultValue={paymentInfo?.cardInfo?.number}
                      activeUnderlineColor={colors.primary}
                      value={paymentInfo?.cardInfo?.number}
                      onChangeText={(text) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          cardInfo: {
                            ...paymentInfo?.cardInfo,
                            number: text,
                          },
                        })
                      }
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginVertical: 10,
                        marginBottom: 20,
                      }}
                    >
                      <TextInput
                        // error={!firstAt}
                        style={{
                          marginBottom: 5,
                          backgroundColor: colors.background,
                          width: "48%",
                        }}
                        // autoFocus
                        mode="outlined"
                        activeOutlineColor={colors.primary}
                        underlineStyle={{
                          backgroundColor: colors.primary,
                        }}
                        outlineColor={colors.primary}
                        // contentStyle={{  fontWeight: "500",borderColor:"red" }}
                        label="Data de validade"
                        defaultValue={paymentInfo?.cardInfo?.date}
                        activeUnderlineColor={colors.primary}
                        value={paymentInfo?.cardInfo?.date}
                        onChangeText={(text) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            cardInfo: {
                              ...paymentInfo?.cardInfo,
                              date: text,
                            },
                          })
                        }
                      />
                      <TextInput
                        // error={!firstAt}
                        style={{
                          marginBottom: 5,
                          backgroundColor: colors.background,
                          width: "48%",
                        }}
                        // autoFocus
                        mode="outlined"
                        activeOutlineColor={colors.primary}
                        underlineStyle={{
                          backgroundColor: colors.primary,
                        }}
                        outlineColor={colors.primary}
                        // contentStyle={{  fontWeight: "500",borderColor:"red" }}
                        label="ccv"
                        defaultValue={paymentInfo?.cardInfo?.ccv}
                        activeUnderlineColor={colors.primary}
                        value={paymentInfo?.cardInfo?.ccv}
                        onChangeText={(text) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            cardInfo: {
                              ...paymentInfo?.cardInfo,
                              ccv: text,
                            },
                          })
                        }
                      />
                    </View>
                  </View>
                )}
              </View>
            </Animated.View>
          </>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: 30,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                left: "8%",
                // width: "80%",
                color: colors.primary,
                // marginLeft: 5,
                marginVertical: 10,
              }}
            >
              Bilhetes
            </Text>
            {event?.ticketsLimit > 0 && (
              <Text
                style={{
                  fontSize: 14,
                  // fontWeight: "600",
                  left: "8%",
                  // width: "80%",
                  color: colors.darkGrey,
                  marginLeft: 5,
                  marginVertical: 10,
                }}
              >
                limite por usuário:{" " + event?.ticketsLimit}
              </Text>
            )}
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
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
  card: {
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,

    // height: 95,
    backgroundColor: colors.white,
    overflow: "hidden",
    width: "95%",
    alignSelf: "center",

    borderRadius: 10,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 1,
    // shadowRadius: 1,
    // elevation: 3,
  },

  price: {
    alignSelf: "flex-start",
    fontSize: 21,
    fontWeight: "600",
    color: colors.primary,
    lineHeight: 30,
    // width: "65%",
    // marginBottom: 5,
  },
  displayName: {
    alignSelf: "flex-start",
    fontSize: 19,
    fontWeight: "600",
    color: colors.primary,
    marginTop: 10,
    marginVertical: 5,
  },

  ticketCategory: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "600",
    color: colors.description2,
    lineHeight: 30,
    // width: "65%",
    marginLeft: 10,
  },
  userName: {
    fontSize: 14,
    alignSelf: "flex-start",
    color: colors.description,
    fontWeight: "600",
  },
  description: {
    fontSize: 13,
    alignSelf: "flex-start",
    color: colors.darkGrey,
    fontWeight: "500",
  },
  counterView: {
    flexDirection: "row",
    // backgroundColor: "red",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  search: {
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
  userCard: {
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,

    // height: 95,
    backgroundColor: colors.white,
    overflow: "hidden",
    width: "95%",
    alignSelf: "center",

    borderRadius: 10,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 1,
    // shadowRadius: 1,
    // elevation: 3,
  },
});
