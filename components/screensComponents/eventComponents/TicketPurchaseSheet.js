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
import GiftSheet from "./GiftSheet";
import TopUpSheet from "./TopUpSheet";
export default TicketPurchaseSheet = ({
  Event,
  purchaseSheetRef,
  setPurchaseModalUp,
  purchaseModalUp,
  doorTicket,
  giftModalRef,
  setGiftModalUp,
  setGiftedUser,
  giftedUser,
}) => {
  const { headerToken, user, myTickets, getUpdatedUser } = useAuth();
  const { formatNumber, apiUrl, getOneEvent } = useData();
  const purchaseDates = formattedDates();
  const { isIPhoneWithNotch } = useDesign();
  const [event, setEvent] = useState(Event);
  const [available, setAvailable] = useState([]);
  const [searched, setSearched] = useState(false);
  const [search, setSearch] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const doorTicketModalRef = useRef(null);
  const topUpModalRef = useRef(null);
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
  const [purchaseDone, setPurchaseDone] = useState(false);
  const purchaseId = uuid.v4();
  const initialState = {
    cart: event?.tickets,
    total: 0,
    amount: 0,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigation = useNavigation();
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
    if (purchaseModalUp) {
      getSelectedEvent();
    }
    if (!purchaseModalUp) {
      purchaseSheetRef.current.close();
    }
  }, []);
  // useEffect(() => {
  //   if (purchaseModalUp) {
  //     getSelectedEvent();
  //   }
  //   if (!purchaseModalUp) {
  //     purchaseSheetRef.current.close();
  //   }
  // }, [purchaseModalUp]);

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
          (item) => item?.amount > 0 && !item?.category?.startsWith("VIP")
        );
        const cartHasVipItem = state.cart?.some(
          (item) => item?.amount > 0 && item?.category?.startsWith("VIP")
        );
        const payloadHasVipItem = action?.payload?.category?.startsWith("VIP");
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
    giftedUser && setGiftedUser(null);
    purchaseModalUp && setPurchaseModalUp(false);
    setFirstRender(true);
    setAvailable([]);
    setLimitReached(false);
    setPurchaseDone(false);
    clear(event?.tickets);
  };

  const cartTickets = state.cart?.filter((ticket) => ticket?.amount != 0);
  const separatedTickets = cartTickets?.flatMap((item) => {
    const { amount, ...rest } = item;
    return Array.from({ length: item.amount }, () => ({
      ...rest,
      uuid: uuid.v4(),
      username: giftedUser ? giftedUser?.username : user?.username,
      displayName: giftedUser ? giftedUser?.displayName : user?.displayName,
      purchaseId,
      purchaseDate: {
        date: purchaseDates?.date,
        displayDate: purchaseDates?.displayDate,
        hour: purchaseDates?.hour,
      },
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
    if (state.total > user?.balance?.amount) {
      topUpModalRef.current.present();
      return;
    }

    setLoading(true);
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
            task: giftedUser ? "gift" : "purchase",
            eventId: event?._id,
          },
          details: {
            purchaseId,
            gift: giftedUser ? true : false,
            user: {
              endUser: {
                userId: giftedUser ? giftedUser?._id : user?._id,
                username: giftedUser ? giftedUser?.username : user?.username,
                email: giftedUser ? giftedUser?.email : user?.email,
                displayName: giftedUser
                  ? giftedUser?.displayName
                  : user?.displayName,
                uri: giftedUser
                  ? giftedUser?.photos?.avatar?.[0]?.uri
                  : user?.photos?.avatar?.[0]?.uri,
              },
              buyer: {
                userId: user?._id,
                username: user?.username,
                email: user?.email,
                displayName: user?.displayName,
                uri: user?.photos?.avatar?.[0]?.uri,
              },
            },
            event: filteredEvent,
            cardDetails: paymentInfo?.cardInfo,
            purchaseDate: {
              date: purchaseDates?.date,
              displayDate: purchaseDates?.displayDate,
              hour: purchaseDates?.hour,
            },
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
      await new Promise((resolve, reject) => setTimeout(resolve, 2000));

      if (response.status == 200) {
        setPurchaseDone(true);

        await purchaseSheetRef.current.close();

        await new Promise((resolve, reject) => setTimeout(resolve, 500));

        if (!giftedUser) {
          navigation.navigate("ticketDetails", response?.data);
        }
        getUpdatedUser();
        clean();

        setOnPayment(false);
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

  const renderFooter = useCallback(
    (props) => (
      // purchaseModalUp &&

      <BottomSheetFooter {...props}>
        <Animated.View
          // entering={firstRender ? SlideInDown : null}
          // exiting={SlideOutLeft}
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: isIPhoneWithNotch ? 80 : 55,
            backgroundColor: colors.background,
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
                fontSize: 17,
                color: colors.t5,
                fontWeight: "500",
                marginRight: 5,
              }}
            >
              Total:
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: colors.t1,
                fontWeight: "600",
                bottom:1
              }}
            >
              cve {formatNumber(state?.total)}
            </Text>
          </View>
          <TouchableOpacity
            disabled={state.total == 0 || purchaseDone}
            onPress={() =>
              doorTicket
                ? doorTicketModalRef.current.present()
                : onPayment
                ? buyTickets()
                : (setOnPayment(true), setFirstRender(false))
            }
            style={{
              width: 150,
              height: 40,
              backgroundColor:
                state?.total == 0 ? colors.background2 : colors.primary2, // position: "absolute",
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
            {loading ? (
              <ActivityIndicator
                style={{ position: "absolute" }}
                color={colors.white}
              />
            ) : (
              <Text
                style={{
                  fontSize: 15,
                  color: state?.total == 0 ?colors.t5 : colors.t2,
                  fontWeight: "500",
                  marginRight: 10,
                }}
              >
                {onPayment ? "Pagar" : "Confirmar"}
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </BottomSheetFooter>
    ),
    [
      state?.amount,
      // !firstRender ? loading : null,
      loading,
      onPayment,
      firstRender,
      giftedUser,
      user,
      // purchaseModalUp,
    ]
  );
  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />,
    []
  );
  // if (loading) {
  //   return (
  //     <BottomSheetModalProvider>
  //       <BottomSheetModal
  //         // style={{backgroundColor:}}

  //         ref={bottomSheetModalRef}
  //         index={keyboardVisible ? 2 : onPayment ? 0 : 1}
  //         snapPoints={snapPoints}
  //         onChange={handleSheetChanges}
  //         onDismiss={() => {
  //           // setPurchaseModalUp(false)
  //           clean();
  //         }}
  //       >
  //         <BottomSheetView style={styles.contentContainer}>
  //           <Animated.View
  //             style={{
  //               // position: "absolute",
  //               alignSelf: "center",
  //               // top: 10,
  //               // zIndex: 2,
  //               marginVertical: 20,
  //             }}
  //             // entering={SlideInUp.duration(300)}
  //             // exiting={SlideOutUp.duration(300)}
  //           >
  //             <ActivityIndicator animating={true} color={colors.primary} />
  //           </Animated.View>
  //         </BottomSheetView>
  //       </BottomSheetModal>
  //     </BottomSheetModalProvider>
  //   );
  // }
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        style={{ zIndex: 4 }}
        ref={purchaseSheetRef}
        backdropComponent={renderBackdrop}
        index={keyboardVisible ? 2 : onPayment ? 0 : 1}
        // index={onPayment ? 0 : 1}
        keyboardBehavior={"interactive"}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onDismiss={() => {
          // setPurchaseModalUp(false),
          clean();
          setOnPayment(false);
        }}
        footerComponent={renderFooter}
        handleStyle={{
          backgroundColor: colors.background,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.t5 }}
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
                    shadowOpacity: 0.1,
                    shadowRadius: 1,
                    elevation: 1,
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
                        <Text
                          numberOfLines={2}
                          style={[
                            styles.price,
                            {
                              color:
                                !unavailable || event?.haltedSales
                                  ? colors.t1
                                  : colors.t1,
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
                        {unavailable || event?.haltedSales
                          ? "Indisponível"
                          : item?.description}
                      </Text>
                    </View>
                    <View style={styles.counterView}>
                      <TouchableOpacity
                        disabled={
                          state?.cart?.filter((cartItem) => {
                            if (cartItem?.id == item?.id)
                              return cartItem?.amount;
                          }) == 0 || event?.haltedSales
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
                            }) == 0 || event?.haltedSales
                              ? colors.gray2
                              : colors.t4
                          }
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: "600",
                          color:
                            unavailable || event?.haltedSales
                              ? colors.gray2
                              : colors.t3,
                        }}
                      >
                        {item?.amount}
                      </Text>
                      <TouchableOpacity
                        disabled={
                          limitReached ||
                          available?.includes(item?.id) ||
                          unavailable ||
                          event?.haltedSales
                        }
                        onPress={() => increase(item)}
                      >
                        <AntDesign
                          name="pluscircle"
                          size={24}
                          color={
                            limitReached ||
                            available?.includes(item?.id) ||
                            unavailable ||
                            event?.haltedSales
                              ? colors.gray2
                              : colors.t2
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  // marginHorizontal: 0,
                  // marginVertical: giftedUser ? 5 : 10,
                }}
              >
                {onPayment ? (
                  <TouchableOpacity
                    onPress={() => setOnPayment(false)}
                    style={{
                      padding: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 5,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="arrow-left"
                      size={25}
                      color={colors.t4}
                    />
                    <Text
                      style={{
                        color: colors.t3,
                        fontSize: 16,
                        fontWeight: "500",
                        marginLeft: 10,
                      }}
                    >
                      Confirmar compra
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      // left: "8%",
                      // width: "80%",
                      color: colors.t2,
                      marginLeft: 30,
                    }}
                  >
                    Bilhetes
                  </Text>
                )}
                <View
                  style={{
                    flexDirection: "row",
                    // alignItems: "center",
                    // alignSelf: "flex-end",
                    // marginRight: 20,
                    // marginRight: 0,
                    // marginLeft: 5,
                    zIndex: 3,
                    padding: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "500",
                      color: colors.t5,

                      // left: 10,
                    }}
                  >
                    Balanço:
                  </Text>

                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "500",
                      color: colors.t2,
                      // top: 2,
                      // position: "absolute",
                      // left: 20,
                    }}
                  >
                    {" cve " + formatNumber(user?.balance?.amount) || 0}
                  </Text>
                </View>
              </View>
              {(giftedUser || event?.ticketsLimit > 0) && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: onPayment ? 20 : 28,
                      marginBottom: 10,
                      opacity: giftedUser ? 1 : 0,
                    }}
                  >
                    <Feather name="gift" size={20} color={colors.t5} />

                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: 15,
                        marginRight: 5,
                        marginLeft: 2,
                        top: 2,
                        color: colors.t5,
                      }}
                    >
                      Presente para
                    </Text>

                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: 15,
                        marginRight: 20,

                        top: 2,

                        color: colors.t3,
                      }}
                    >
                      @{giftedUser?.username}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      opacity: event?.ticketsLimit > 0 ? 1 : 0,

                      right: 10,
                      color: colors.t5,
                      alignSelf: "flex-end",

                      bottom: 3,
                    }}
                  >
                    limite por usuário:{` ${event?.ticketsLimit}`}
                  </Text>
                </View>
              )}
              {onPayment ? (
                <>
                  <Animated.View
                    style={{ flex: 1 }}
                    entering={SlideInRight}
                    exiting={SlideOutRight}
                  >
                    <View
                      style={{
                        flex: 1,
                        padding: 10,
                      }}
                    >
                      <Animated.FlatList
                        entering={FadeIn}
                        exiting={FadeOut}
                        data={state?.cart?.filter((item) => item?.amount != 0)}
                        keyExtractor={(item) => item?.id}
                        ListHeaderComponent={
                          <Text
                            style={{
                              fontSize: 17,
                              fontWeight: "500",
                              color: colors.t4,
                              marginLeft: 10,
                              // marginTop: 10,
                              marginBottom: 10,
                              // marginTop: giftedUser ? 5 : 0,

                              // left: 10,
                            }}
                          >
                            {state?.cart?.filter((item) => item?.amount != 0)
                              ?.amount > 1
                              ? " Bilhetes selecionados:"
                              : " Bilhete selecionado:"}
                          </Text>
                        }
                        ItemSeparatorComponent={
                          <View
                            style={{
                              alignSelf: "center",
                              width: "95%",
                              backgroundColor: colors.separator,
                              height: 1,
                              marginVertical: 10,
                            }}
                          />
                        }
                        renderItem={({ item }) => {
                          return (
                            <View
                              key={item.id}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginLeft: 5,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontWeight: "500",
                                  color: colors.t2,
                                  // left: 10,
                                }}
                              >
                                {item?.amount}x
                              </Text>

                              <Text
                                style={{
                                  fontSize: 15,
                                  fontWeight: "500",
                                  color: colors.t5,
                                  top: 1,
                                  // position: "absolute",
                                  // left: 20,
                                  // fontSize: 17,
                                  // fontWeight: "500",
                                  // color: colors.primary,
                                  // marginLeft: 10,
                                  // // marginTop: 10,
                                  // marginBottom: 10,
                                }}
                              >
                                {(item?.amount > 1
                                  ? " Bilhetes "
                                  : " Bilhete ") +
                                  '"' +
                                  item?.category +
                                  '"' +
                                  (item?.amount > 1
                                    ? " selecionados!"
                                    : " selecionado!")}
                              </Text>
                            </View>
                          );
                        }}
                      />
                    </View>
                  </Animated.View>
                </>
              ) : (
                <View style={{}}></View>
              )}
              {/* {giftedUser && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 30,
                    marginBottom: 10,
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
                    @{giftedUser?.username}
                  </Text>
                </View>
              )} */}
            </BottomSheetView>
          }
        />
      </BottomSheetModal>

      <DoorTicketSheet
        doorTicketModalRef={doorTicketModalRef}
        event={event}
        bottomSheetModalRef={purchaseSheetRef}
        total={state.total}
        separatedTickets={separatedTickets}
      />
      <GiftSheet
        giftModalRef={giftModalRef}
        setPurchaseModalUp={setPurchaseModalUp}
        purchaseSheetRef={purchaseSheetRef}
        setGiftedUser={setGiftedUser}
        giftedUser={giftedUser}
        setGiftModalUp={setGiftModalUp}
      />
      <TopUpSheet state={state} topUpModalRef={topUpModalRef} />
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

  price: {
    alignSelf: "flex-start",
    fontSize: 21,
    fontWeight: "600",
    color: colors.t1,
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
    fontWeight: "500",
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
    color: colors.t5,
    fontWeight: "400",
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
