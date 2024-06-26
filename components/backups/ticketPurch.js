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
  useReducer,
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
import { AntDesign } from "@expo/vector-icons";
import colors from "../../colors";
import Animated, {
  FadeIn,
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
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import uuid from "react-native-uuid";
import toast from "../../toast";
import { useDesign } from "../../hooks/useDesign";

export default TicketPurchaseSheet = ({
  Event,
  bottomSheetModalRef,
  setPurchaseModalUp,
  purchaseModalUp,
}) => {
  const { headerToken, user, myTickets, getUpdatedUser } = useAuth();
  const { formatNumber, apiUrl, getOneEvent } = useData();
  const { isIPhoneWithNotch } = useDesign();
  const [event, setEvent] = useState(Event);
  const [available, setAvailable] = useState([]);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const TL = event?.tickets?.length;
  const customSnap = `${
    TL >= 4 ? "80" : TL == 3 ? "60" : TL == 2 ? "45" : "35"
  }%`;
  const snapPoints = useMemo(() => ["50%", `${customSnap}`, "80%"], []);
  const handleSheetChanges = useCallback((index) => {}, []);
  const [firstRender, setFirstRender] = useState(true);
  const [onPayment, setOnPayment] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [loading, setLoading] = useState(true);
  const purchaseId = uuid.v4();
  const initialState = {
    cart: event?.tickets,
    total: 0,
    amount: 0,
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const getSelectedEvent = async () => {
    if (purchaseModalUp) {
      try {
        setLoading(true);
        const event = await getOneEvent(Event?._id);
        setEvent(event);
        dispatch({ type: "CLEAR", payload: event?.tickets });
      } catch (error) {
        console.log(error);
      }
    }
    setLoading(false);
  };
  const restart = async () => {
    try {
      setLoading(true);
      // setOnPayment(false), setFirstRender(true);
      // setAvailable([]);
      // setLimitReached(false);
      const event = await getOneEvent(Event?._id);
      setEvent(event);
      dispatch({ type: "CLEAR", payload: event?.tickets });
      setLoading(false);
      clean();
    } catch (error) {
      console.log(error);
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

  const uuidKey = uuid.v4();

  useEffect(() => {
    dispatch({ type: "GET_TOTALS" });
  }, [state.cart]);
  let purchasedAlready = 0;
  myTickets.forEach((purchase) => {
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
      }
      // else {
      //   setLimitReached(false);
      // }
    }
  }, [user, event, state.amount]);

  useEffect(() => {
    if (limitReached && state.amount != 0) {
      toast({
        msg: "Limite por usúario atingido!",
        color: colors.white,
        textcolor: colors.primary,
      });
    }
  }, [limitReached, state]);

  function reducer(state, action) {
    switch (action.type) {
      case "INCREASE": {
        if (limitReached) {
          return state;
        }
        const cartHasNonVipItem = state.cart?.some(
          (item) => item?.amount > 0 && !item?.category.startsWith("VIP")
        );
        const cartHasVipItem = state.cart?.some(
          (item) => item?.amount > 0 && item?.category.startsWith("VIP")
        );
        const payloadHasVipItem = action?.payload?.category.startsWith("VIP");
        if (
          (cartHasNonVipItem && payloadHasVipItem) ||
          (cartHasVipItem && !payloadHasVipItem)
        ) {
          toast({
            msg: `Bilhetes VIPs e de outras cactegorias não podem ser comprados juntos!`,
            color: colors.white,
            textcolor: colors.primary,
          });
          return state;
        }

        // console.log(action?.payload?.category);

        // if()
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
            setLimitReached(false);
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
    setAvailable([]);
    setLimitReached(false);
  };

  const cartTickets = state.cart?.filter((ticket) => ticket?.amount != 0);

  const separatedTickets = cartTickets?.flatMap((item) => {
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
            task: "purchase",
            eventId: event?._id,
          },
          details: {
            purchaseId,
            buyer: {
              userId: user?._id,
              username: user?.username,
              email: user?.email,
              displayName: user?.displayName,
              uri: user?.photos?.avatar?.[0]?.uri,
            },
            event: filteredEvent,
            cardDetails: paymentInfo?.cardInfo,
            purchaseDate: new Date(),
            tickets: separatedTickets,
            total: state.total,
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
      if (response.status == 200) {
        // console.log();
        bottomSheetModalRef.current.close();

        setPurchaseModalUp(false);
        getUpdatedUser();
      }
    } catch (error) {
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
    }
  };

  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props}>
        <Animated.View
          entering={firstRender ? FadeIn : null}
          // exiting={SlideOutLeft}
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: isIPhoneWithNotch ? 80 : 55,
            backgroundColor: colors.white,
            // position: "absolute",
            zIndex: 4,
            bottom: 0,
            flexDirection: "row",
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 1,
            elevation: 3,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            paddingHorizontal: 30,
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
          </TouchableOpacity>
        </Animated.View>
      </BottomSheetFooter>
    ),
    [state?.amount, loading, onPayment, firstRender]
  );
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}

        
      />
    ),
    []
  );
  
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
        backdropComponent={renderBackdrop}

        index={keyboardVisible ? 2 : onPayment ? 0 : 1}

        // index={onPayment ? 0 : 1}
        keyboardBehavior={"interactive"}
        
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onDismiss={() => {
          setPurchaseModalUp(false), clean();
        }}
        footerComponent={renderFooter}
      >
        <BottomSheetFlatList
          style={{ backgroundColor: colors.background }}
          entering={firstRender ? null : SlideInLeft}
          exiting={SlideOutLeft}
        
          data={state?.cart}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => {
            const unavailable = event?.tickets?.some(
              (ticket) => ticket?.id === item?.id && ticket?.available === 0
            );

            return (
              !onPayment && (
                <Animated.View
                  entering={firstRender ? null : SlideInLeft}
                  exiting={SlideOutLeft}
                  activeOpacity={0.5}
                  style={{
                    shadowOffset: { width: 0.5, height: 0.5 },
                    shadowOpacity: 0.3,
                    shadowRadius: 1,
                    elevation: 2,
                    width: "100%",
                  }}
                  // onPress={() => navigation.navigate("event", {item})}
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
                        <Text
                          numberOfLines={2}
                          style={[
                            styles.price,
                            {
                              color: !unavailable
                                ? colors.primary
                                : colors.darkGrey,
                            },
                          ]}
                        >
                          cve {formatNumber(item?.price)}
                        </Text>
                        <Text numberOfLines={2} style={[styles.ticketCategory]}>
                          {item?.category}
                        </Text>
                      </View>

                      <Text style={styles.description}>
                        {!unavailable ? item?.description : "Indisponível"}
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
                          color: !unavailable
                            ? colors.primary
                            : colors.darkGrey,
                        }}
                      >
                        {item?.amount}
                      </Text>
                      <TouchableOpacity
                        disabled={
                          limitReached ||
                          available?.includes(item?.id) ||
                          unavailable
                        }
                        onPress={() => increase(item)}
                      >
                        <AntDesign
                          name="pluscircle"
                          size={24}
                          color={
                            limitReached ||
                            available?.includes(item?.id) ||
                            unavailable
                              ? colors.grey
                              : colors.primary
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              )
            );
          }}
          ListHeaderComponent={
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
                            color: colors.black,

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
