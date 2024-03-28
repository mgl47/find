import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";
import Animated, {
  FadeInRight,
  FadeOutLeft,
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
import { useData } from "../hooks/useData";
import { TextInput } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
export const PurchaseModal = ({
  Event,
  bottomSheetModalRef,
  setPurchaseModalUp,
}) => {
  const { formatNumber, apiUrl } = useData();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
  const { height } = Dimensions.get("window");
  // console.log(height / Event?.tickets?.length/3.5);

  // console.log(height / Event?.tickets?.length/5.5);

  // const baseSnapPont = height / 5 * Event?.tickets?.length+(height<700?10:-100)

  // const baseSnapPont = height / 2 * Event?.tickets?.length+(height<700?10:-100)

  //2
  // const baseSnapPont =
  //  ( height * 0.04 )* Event?.tickets?.length + (height < 700 ? 0 : -10);

  //1
  //  const baseSnapPont =
  //  ( height * 0.05 )* Event?.tickets?.length + (height < 700 ? 0 : -10);

  //3
  // const baseSnapPont =
  // ( height * 0.05 )* Event?.tickets?.length + (height < 700 ? 0 : -10);

  const baseSnapPont = Event?.tickets?.length * height * 0.05;
  const TL = Event?.tickets?.length;
  const customSnap = `${
    TL >= 4 ? "80" : TL == 3 ? "60" : TL == 2 ? "45" : "35"
  }%`;

  // const snapPoints = useMemo(() => ["40%", `${baseSnapPont}`, "80%"], []);

  const snapPoints = useMemo(() => ["50%", `${customSnap}`, "80%"], []);
  const { headerToken, user } = useAuth();
  const handleSheetChanges = useCallback((index) => {}, []);
  // Event?.tickets?.length>2?
  const [firstRender, setFirstRender] = useState(true);
  // const [onConfirming, setOnConfirming] = useState(false);
  const [onPayment, setOnPayment] = useState(false);
  useEffect(() => {
    setFirstRender(false);
  }, []);
  const initialState = {
    loading: false,
    cart: Event?.tickets,
    total: 0,
    amount: 0,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    dispatch({ type: "GET_TOTALS" });
  }, [state.cart]);
  function reducer(state, action) {
    switch (action.type) {
      case "INCREASE": {
        let tempCart = state.cart.map((cartItem) => {
          if (cartItem?.id === action.payload?.id) {
            cartItem = { ...cartItem, amount: cartItem.amount + 1 };
          }

          return cartItem;
        });

        return { ...state, cart: tempCart };
      }
      case "DECREASE": {
        let tempCart = state.cart.map((cartItem) => {
          if (cartItem?.id === action.payload?.id) {
            if (cartItem?.amount == 0) {
              return cartItem;
            }

            cartItem = { ...cartItem, amount: cartItem.amount - 1 };
          }

          return cartItem;
        });

        return { ...state, cart: tempCart };
      }
      case "CLEAR": {
        return { cart: Event?.tickets, total: 0, amount: 0 };
      }
      case "GET_TOTALS": {
        let { total, amount } = state.cart.reduce(
          (cartTotal, cartItem) => {
            const { price, amount } = cartItem;
            const itemTotal = price * amount;

            cartTotal.total += itemTotal;
            cartTotal.amount += amount;

            return cartTotal;
          },
          {
            total: 0,
            amount: 0,
          }
        );
        total = parseFloat(total.toFixed(2));
        return { ...state, total, amount };
      }
    }
    throw Error("Unknown action: " + action.type);
  }

  function handleClick() {
    dispatch({ type: "incremented_age" });
  }
  const increase = (item) => {
    dispatch({ type: "INCREASE", payload: item });
  };
  const decrease = (item) => {
    dispatch({ type: "DECREASE", payload: item });
  };
  const clear = (item) => {
    dispatch({ type: "CLEAR", payload: item });
  };

  console.log(state.total);

  const [paymentInfo, setPaymentInfo] = useState({
    cardInfo: {
      number: 0,
      date: "",
      ccv: 0,
    },
  });
  const buyTickets = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/purchase/`,
        {
          cardInfo: paymentInfo,
          details: {
            buyer: user,
            event: Event,
            eventId: Event?._id,
            cardDetails: paymentInfo?.cardInfo,
            purchaseDate: new Date(),
            tickets: state.cart?.filter((ticket) => ticket?.amount != 0),
            total: state.total,
          },
        },
        {
          headers: { Authorization: headerToken },
        }
      );
      console.log(response?.data);
      // getUpdatedUserInfo();
    } catch (error) {
      console.log("Error updating liked events:", error);
    }
  };
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        // style={{backgroundColor:}}
        ref={bottomSheetModalRef}
        index={keyboardVisible? 2 : onPayment? 0:1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onDismiss={() => {
          setPurchaseModalUp(false), clear();
        }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              left: "8%",
              // width: "80%",
              color: colors.primary,
              // marginLeft: 5,
              marginTop: 10,
            }}
          >
            Bilhetes
          </Text>
          <Animated.FlatList
            entering={firstRender ? null : SlideInRight}
            data={onPayment ? [] : state?.cart}
            keyExtractor={(item) => item?.id}
            ListHeaderComponent={
              onPayment ? (
                <Animated.View entering={SlideInRight} exiting={SlideOutRight}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
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

                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
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
                    </View>
                  </View>
                </Animated.View>
              ) : (
                <View style={{ marginBottom: 10 }} />
              )
            }
            renderItem={({ item }) => {
              return (
                <Animated.View
                  entering={SlideInLeft}
                  exiting={SlideOutLeft}
                  activeOpacity={0.5}
                  style={{
                    shadowOffset: { width: 0.5, height: 0.5 },
                    shadowOpacity: 0.3,
                    shadowRadius: 1,
                    elevation: 2,
                    width: "100%",
                  }}
                  // onPress={() => navigation.navigate("event", item)}
                >
                  <View style={styles.card}>
                    <View
                      style={{
                        width: "70%",
                        // backgroundColor: colors.light2,
                        padding: 10,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text numberOfLines={2} style={[styles.price]}>
                          cve {formatNumber(item?.price)}
                        </Text>
                        <Text numberOfLines={2} style={[styles.priceType]}>
                          {item?.type}
                        </Text>
                      </View>

                      <Text style={styles.description}>
                        {item?.description}
                      </Text>
                    </View>
                    <View style={styles.counterView}>
                      <TouchableOpacity
                        disabled={
                          state?.cart?.filter((cartItem) => {
                            if (cartItem?.id == item?.id)
                              return cartItem?.amount;
                          }) == 0
                        }
                        onPress={() => decrease(item)}
                      >
                        <AntDesign
                          name="minuscircle"
                          size={24}
                          color={
                            state?.cart?.filter((cartItem) => {
                              if (cartItem?.id == item?.id)
                                return cartItem?.amount;
                            }) == 0
                              ? colors.grey
                              : colors.darkGrey
                          }
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: "600",
                          color: colors.primary,
                        }}
                      >
                        {item?.amount}
                      </Text>
                      <TouchableOpacity onPress={() => increase(item)}>
                        <AntDesign
                          name="pluscircle"
                          size={24}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              );
            }}
            ListFooterComponent={
              onPayment ? (
                <View entering={SlideInRight} exiting={SlideOutRight}>
                  <Animated.View
                  entering={SlideInRight} exiting={SlideOutRight}
                    style={{
                      flex: 1,
                      padding: 10,
                    }}
                  >
                    <TextInput
                      // error={!firstAt}
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
                          cardInfo: { ...paymentInfo?.cardInfo, number: text },
                        })
                      }
                    />

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginVertical: 10,
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
                        underlineStyle={{ backgroundColor: colors.primary }}
                        outlineColor={colors.primary}
                        // contentStyle={{  fontWeight: "500",borderColor:"red" }}
                        label="Data de validade"
                        defaultValue={paymentInfo?.cardInfo?.date}
                        activeUnderlineColor={colors.primary}
                        value={paymentInfo?.cardInfo?.date}
                        onChangeText={(text) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            cardInfo: { ...paymentInfo?.cardInfo, date: text },
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
                        underlineStyle={{ backgroundColor: colors.primary }}
                        outlineColor={colors.primary}
                        // contentStyle={{  fontWeight: "500",borderColor:"red" }}
                        label="ccv"
                        defaultValue={paymentInfo?.cardInfo?.ccv}
                        activeUnderlineColor={colors.primary}
                        value={paymentInfo?.cardInfo?.ccv}
                        onChangeText={(text) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            cardInfo: { ...paymentInfo?.cardInfo, ccv: text },
                          })
                        }
                      />
                    </View>
                    <Animated.View
                      // entering={SlideInRight}
                      // exiting={SlideOutLeft}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        margin: 20,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 19,
                            color: colors.black2,
                            fontWeight: "600",
                            marginRight: 5,
                          }}
                        >
                          Total:
                        </Text>
                        <Text
                          style={{
                            fontSize: 19,
                            color: colors.primary,
                            fontWeight: "600",
                          }}
                        >
                          cve {formatNumber(state?.total)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        disabled={state.total == 0}
                        onPress={() =>
                          onPayment ? buyTickets() : setOnPayment(true)
                        }
                        style={{
                          width: 150,
                          height: 40,
                          backgroundColor:
                            state?.total != 0
                              ? colors.primary
                              : colors.darkGrey, // position: "absolute",
                          zIndex: 1,
                          // top: 10,
                          // left: 10,
                          borderRadius: 10,
                          alignItems: "center",
                          justifyContent: "center",
                          shadowOffset: { width: 1, height: 1 },
                          shadowOpacity: 0.3,
                          shadowRadius: 1,
                          elevation: 3,
                          shadowColor: colors.dark,
                          flexDirection: "row",
                        }}
                        activeOpacity={0.5}
                      >
                        <Text
                          style={{
                            fontSize: 15,
                            color: colors.white,
                            fontWeight: "500",
                            marginRight: 10,
                          }}
                        >
                          {onPayment ? "Pagar" : "Confirmar"}
                        </Text>
                        {/* <Ionicons name="ticket-outline" size={24} color={colors.white} /> */}
                      </TouchableOpacity>
                    </Animated.View>
                  </Animated.View>
                </View>
              ) : (
                // <View />

                <Animated.View
                  entering={SlideInLeft}
                  exiting={SlideOutLeft}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    margin: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 19,
                        color: colors.black2,
                        fontWeight: "600",
                        marginRight: 5,
                      }}
                    >
                      Total:
                    </Text>
                    <Text
                      style={{
                        fontSize: 19,
                        color: colors.primary,
                        fontWeight: "600",
                      }}
                    >
                      cve {formatNumber(state?.total)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    disabled={state.total == 0}
                    onPress={() =>
                      onPayment ? buyTickets() : setOnPayment(true)
                    }
                    style={{
                      width: 150,
                      height: 40,
                      backgroundColor:
                        state?.total != 0 ? colors.primary : colors.darkGrey, // position: "absolute",
                      zIndex: 1,
                      // top: 10,
                      // left: 10,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      shadowOffset: { width: 1, height: 1 },
                      shadowOpacity: 0.3,
                      shadowRadius: 1,
                      elevation: 3,
                      shadowColor: colors.dark,
                      flexDirection: "row",
                    }}
                    activeOpacity={0.5}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        color: colors.white,
                        fontWeight: "500",
                        marginRight: 10,
                      }}
                    >
                      {onPayment ? "Pagar" : "Confirmar"}
                    </Text>
                    {/* <Ionicons name="ticket-outline" size={24} color={colors.white} /> */}
                  </TouchableOpacity>
                </Animated.View>
              )
            }
          />
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export const GiftModal = ({ Event, bottomSheetModalRef2, setGiftModalUp }) => {
  // const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["35%", "55%", "75%"], []);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
  const handleSheetChanges = useCallback((index) => {}, []);
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [advance, setAdvance] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    setFirstRender(false);
  }, []);
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        // style={{backgroundColor:}}
        ref={bottomSheetModalRef2}
        index={keyboardVisible ? 2 : advance ? 1 : 0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onDismiss={() => {
          setGiftModalUp(false), setAdvance(false);
        }}
      >
        <BottomSheetView style={styles.contentContainer}>
          {advance ? (
            <Animated.FlatList
              entering={firstRender ? null : SlideInRight}
              exiting={SlideOutRight}
              data={Event?.tickets}
              keyExtractor={(item) => item?.id}
              ListHeaderComponent={
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setAdvance(false)}
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

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Feather name="gift" size={20} color={colors.black} />

                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: 15,
                        marginRight: 20,
                        marginLeft: 5,
                        color: colors.primary,
                      }}
                    >
                      veiga.erickson
                    </Text>
                  </View>
                </View>
              }
              renderItem={({ item }) => {
                return (
                  <View
                    activeOpacity={0.5}
                    style={{
                      shadowOffset: { width: 0.5, height: 0.5 },
                      shadowOpacity: 0.3,
                      shadowRadius: 1,
                      elevation: 2,
                      width: "100%",
                    }}
                    // onPress={() => navigation.navigate("event", item)}
                  >
                    <View style={styles.card}>
                      <View
                        style={{
                          width: "70%",
                          // backgroundColor: colors.light2,
                          padding: 10,
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text numberOfLines={2} style={[styles.price]}>
                            cve {item?.amount}
                          </Text>
                          <Text numberOfLines={2} style={[styles.priceType]}>
                            {item?.type}
                          </Text>
                        </View>

                        <Text style={styles.description}>
                          {item?.description}
                        </Text>
                      </View>
                      <View style={styles.counterView}>
                        <TouchableOpacity>
                          <AntDesign
                            name="minuscircle"
                            size={24}
                            color={colors.black2}
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            fontSize: 22,
                            fontWeight: "600",
                            color: colors.primary,
                          }}
                        >
                          {item?.amount}
                        </Text>
                        <TouchableOpacity>
                          <AntDesign
                            name="pluscircle"
                            size={24}
                            color={colors.primary}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              }}
              ListFooterComponent={
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    margin: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 19,
                        color: colors.black2,
                        fontWeight: "600",
                        marginRight: 5,
                      }}
                    >
                      Total:
                    </Text>
                    <Text
                      style={{
                        fontSize: 19,
                        color: colors.primary,
                        fontWeight: "600",
                      }}
                    >
                      cve 36,000
                    </Text>
                  </View>
                  <TouchableOpacity
                    // onPress={handlePresentModalPress}
                    style={{
                      width: 150,
                      height: 40,
                      backgroundColor: colors.primary, // position: "absolute",
                      zIndex: 1,
                      // top: 10,
                      // left: 10,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      shadowOffset: { width: 1, height: 1 },
                      shadowOpacity: 0.3,
                      shadowRadius: 1,
                      elevation: 3,
                      shadowColor: colors.dark,
                      flexDirection: "row",
                    }}
                    activeOpacity={0.5}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        color: colors.white,
                        fontWeight: "500",
                        marginRight: 10,
                      }}
                    >
                      Avançar
                    </Text>
                    {/* <Ionicons name="ticket-outline" size={24} color={colors.white} /> */}
                  </TouchableOpacity>
                </View>
              }
            />
          ) : (
            <Animated.View
              entering={firstRender ? null : SlideInLeft}
              exiting={SlideOutLeft}
              style={{ alignItems: "center" }}
            >
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Pesquise por um usuário"
                returnKeyType="search"
                // autoFocus
                style={styles.search}
              />
              <Text style={{ color: colors.darkGrey, bottom: 10 }}>
                1 resultado encontrado
              </Text>
              <View
                activeOpacity={0.5}
                style={{
                  shadowOffset: { width: 0.5, height: 0.5 },
                  shadowOpacity: 0.3,
                  shadowRadius: 1,
                  elevation: 2,
                  width: "100%",
                }}
                // onPress={() => navigation.navigate("event", item)}
              >
                <View style={styles.card}>
                  <Image
                    source={{
                      uri: "https://i0.wp.com/techweez.com/wp-content/uploads/2022/03/vivo-lowlight-selfie-1-scaled.jpg?fit=2560%2C1920&ssl=1",
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
                      Erickson{" "}
                    </Text>
                    <Text numberOfLines={2} style={[styles.userName]}>
                      veiga.erickson{" "}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss(), setAdvance(true);
                }}
                style={{
                  marginTop: 20,
                  width: 150,
                  height: 40,
                  backgroundColor: colors.primary, // position: "absolute",
                  zIndex: 1,
                  // top: 10,
                  // left: 10,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowOffset: { width: 1, height: 1 },
                  shadowOpacity: 0.3,
                  shadowRadius: 1,
                  elevation: 3,
                  shadowColor: colors.dark,
                  flexDirection: "row",
                }}
                activeOpacity={0.5}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: colors.white,
                    fontWeight: "500",
                    marginRight: 10,
                  }}
                >
                  Avançar
                </Text>
                {/* <Ionicons name="ticket-outline" size={24} color={colors.white} /> */}
              </TouchableOpacity>
            </Animated.View>
          )}
        </BottomSheetView>
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

  priceType: {
    alignSelf: "flex-start",
    fontSize: 15,
    fontWeight: "600",
    color: colors.grey,
    lineHeight: 30,
    // width: "65%",
    marginLeft: 5,
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
});
