import {
  Button,
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
import colors from "../../colors";
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
import { useData } from "../../hooks/useData";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import uuid from "react-native-uuid";
import toast from "../../toast";

export default TicketPurchaseSheet = ({
  Event,
  bottomSheetModalRef,
  setPurchaseModalUp,
  purchaseModalUp,
}) => {
  const { formatNumber, apiUrl, getOneEvent } = useData();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const purchaseId = uuid.v4();
  const [loading, setLoading] = useState(true);

  const [event, setEvent] = useState(Event);
  // const [initialState, setInitialState] = useState({});
  let initialState = {
    cart: event?.tickets,
    total: 0,
    amount: 0,
  };
  const getSelectedEvent = async () => {
    if (purchaseModalUp) {
      setLoading(true);
      const event = await getOneEvent(Event?._id);
      setEvent(event);
      dispatch({ type: "CLEAR", payload: event?.tickets });

      setLoading(false);
    }
  };

  useEffect(() => {
    getSelectedEvent();
  }, [purchaseModalUp]);

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

  const TL = event?.tickets?.length;
  const customSnap = `${
    TL >= 4 ? "80" : TL == 3 ? "60" : TL == 2 ? "45" : "35"
  }%`;

  const uuidKey = uuid.v4();

  const snapPoints = useMemo(() => ["50%", `${customSnap}`, "80%"], []);
  const { headerToken, user, getUpdatedUserInfo } = useAuth();
  const handleSheetChanges = useCallback((index) => {}, []);
  // Event?.tickets?.length>2?
  const [firstRender, setFirstRender] = useState(true);
  // const [onConfirming, setOnConfirming] = useState(false);
  const [onPayment, setOnPayment] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [available, setAvailable] = useState([]);

  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    dispatch({ type: "GET_TOTALS" });
  }, [state.cart]);
  let purchasedAlready = 0;
  user?.purchasedTickets?.forEach((purchase) => {
    purchase?.tickets?.forEach((ticket) => {
      if (ticket?.eventId == event?._id) {
        purchasedAlready += 1;
      }
    });
  });

  useEffect(() => {
    if (event?.ticketsLimit != 0) {
      if (
        state?.amount >= event?.ticketsLimit ||
        state?.amount + purchasedAlready >= event?.ticketsLimit
      ) {
        setLimitReached(true);
      } else {
        setLimitReached(false);
      }
    }
  }, [user, event, state.amount]);

  useEffect(() => {
    if (limitReached) {
      toast({
        msg: "Limite por usúario atingido!",
        color: colors.white,
        textcolor: colors.primary,
      });
    }
  }, [limitReached]);

  function reducer(state, action) {
    switch (action.type) {
      case "INCREASE": {
        if (limitReached) {
          return state;
        }
        let tempCart = state.cart.map((cartItem) => {
          if (cartItem?.id === action.payload?.id && cartItem?.available > 0) {
            cartItem = {
              ...cartItem,
              amount: cartItem.amount + 1,
              available: cartItem.available - 1,
            };
            if (cartItem?.available == 0) {
              setAvailable([...available, cartItem?.id]);
              toast({
                msg: `Quantidade disponível atingida para o bilhete "${cartItem?.category}"!`,
                color: colors.white,
                textcolor: colors.primary,
              });
            }
            // console.log(cartItem?.available);
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

            cartItem = {
              ...cartItem,
              amount: cartItem.amount - 1,
              available: cartItem.available + 1,
            };
            if (available?.includes(cartItem?.id)) {
              const newAvailable = available.filter((id) => id != cartItem?.id);
              console.log("removed from available");
              setAvailable(newAvailable);
            }
          }

          return cartItem;
        });

        return { ...state, cart: tempCart };
      }
      case "CLEAR": {
        return { cart: action?.payload, total: 0, amount: 0 };
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

  const increase = (item) => {
    dispatch({ type: "INCREASE", payload: item });
    setFirstRender(false);
  };
  const decrease = (item) => {
    dispatch({ type: "DECREASE", payload: item });
    setFirstRender(false);
  };
  const clear = (item) => {
    dispatch({ type: "CLEAR", payload: item });
  };
  const clean = () => {
    setOnPayment(false), setFirstRender(true);
  };

  const cartTickets = state.cart?.filter((ticket) => ticket?.amount != 0);

  const separatedTickets = cartTickets.flatMap((item) => {
    const { amount, ...rest } = item;
    return Array.from({ length: item.amount }, () => ({
      ...rest,
      uuid: uuid.v4(),
      username: user?.username,
      displayName: user?.displayName,
      purchaseId,
      eventId: event?._id,
    }));
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardInfo: {
      number: 0,
      date: "",
      ccv: 0,
    },
  });
  const buyTickets = async () => {
    let updateInterested = [];
    let updatedGoing = [];
    updatedGoing = user?.goingToEvents || [];
    updateInterested = user?.likedEvents || [];
    const index = updatedGoing.indexOf(event?._id);
    if (user?.goingToEvents?.includes(event?._id) && index !== -1) {
      updatedGoing.splice(index, 1);
    } else {
      updatedGoing.push(event?._id);
    }
    try {
      const response = await axios.post(
        `${apiUrl}/purchase/`,
        {
          // cardInfo: paymentInfo,
          details: {
            purchaseId,
            buyer: {
              userId: user?._id,
              username: user?.username,
              email: user?.email,
              displayName: user?.displayName,
              uri: event?.photos[0]?.[0]?.uri,
            },
            event: event,
            eventId: event?._id,
            cardDetails: paymentInfo?.cardInfo,
            purchaseDate: new Date(),
            tickets: separatedTickets,
            total: state.total,
            uri: event?.photos[0]?.[0]?.uri,
          },
          userUpdates: {
            operation: {
              type: "purchase",
              // task: "purchase",
              eventId: event?._id,
            },
            updates: {
              likedEvents: updateInterested,
              goingToEvents: updatedGoing,
            },
          },
        },
        {
          headers: { Authorization: headerToken },
        }
      );
      // console.log(response?.data);

      // getUpdatedUserInfo();
      // bottomSheetModalRef.current.close();
    } catch (error) {
      toast({
        msg: error?.response?.data?.msg,
        color: colors.darkRed,
        textcolor: colors.white,
        duration: 1000,
      });
      console.log(error?.response?.data?.invalidTickets);
      // console.log("Error updating liked events:", error);
    }
  };

  if (loading) {
    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          // style={{backgroundColor:}}
          ref={bottomSheetModalRef}
          index={keyboardVisible ? 2 : onPayment ? 0 : 1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          onDismiss={() => {
            setPurchaseModalUp(false), clean();
          }}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Animated.View
              style={{
                // position: "absolute",
                alignSelf: "center",
                // top: 10,
                // zIndex: 2,
                marginVertical: 20,
              }}
              // entering={SlideInUp.duration(300)}
              // exiting={SlideOutUp.duration(300)}
            >
              <ActivityIndicator animating={true} color={colors.primary} />
            </Animated.View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  }
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        // style={{backgroundColor:}}
        ref={bottomSheetModalRef}
        index={keyboardVisible ? 2 : onPayment ? 0 : 1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onDismiss={() => {
          setPurchaseModalUp(false), clean();
        }}
      >
        <BottomSheetView style={styles.contentContainer}>
          {onPayment ? (
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

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                <View
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

                  <View>
                    {state?.cart
                      ?.filter((item) => item?.amount != 0)
                      ?.map((ticket) => {
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 17,
                                fontWeight: "500",
                                color: colors.primary,
                                // left: 10,
                              }}
                            >
                              {ticket?.amount}x
                            </Text>

                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: "500",
                                color: colors.darkSeparator,
                                top: 2,
                                position: "absolute",
                                left: 20,
                              }}
                            >
                              {(ticket?.amount > 1
                                ? " Bilhetes "
                                : " Bilhete ") +
                                '"' +
                                ticket?.category +
                                '"' +
                                (ticket?.amount > 1
                                  ? " selecionados!"
                                  : " selecionado!")}
                            </Text>
                          </View>
                        );
                      })}
                  </View>

                  <View
                    // entering={SlideInRight}
                    // exiting={SlideOutLeft}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 20,
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
                        onPayment
                          ? buyTickets()
                          : (setOnPayment(true), setFirstRender(false))
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
                  </View>
                </View>
              </Animated.View>
            </>
          ) : (
            <Animated.FlatList
              entering={firstRender ? null : SlideInLeft}
              exiting={SlideOutLeft}
              data={state?.cart}
              keyExtractor={(item) => item?.id}
              ListHeaderComponent={
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
                            cve {formatNumber(item?.price)}
                          </Text>
                          <Text
                            numberOfLines={2}
                            style={[styles.ticketCategory]}
                          >
                            {item?.category}
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
                        <TouchableOpacity
                          disabled={
                            limitReached || available?.includes(item?.id)
                          }
                          onPress={() => increase(item)}
                        >
                          <AntDesign
                            name="pluscircle"
                            size={24}
                            color={
                              limitReached || available?.includes(item?.id)
                                ? colors.grey
                                : colors.primary
                            }
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              }}
              ListFooterComponent={
                // <View />

                <Animated.View
                  entering={firstRender ? null : SlideInLeft}
                  exiting={SlideOutLeft}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    margin: 20,
                  }}
                >
                  {/* <Button
                      title="refresh"
                      onPress={() =>
                        toast({ msg: "Limite por usúario atingido!" })
                      }
                    /> */}
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
              }
            />
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
});
