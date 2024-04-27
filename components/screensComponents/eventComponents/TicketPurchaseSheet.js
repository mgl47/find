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
export default TicketPurchaseSheet = ({
  Event,
  bottomSheetModalRef,
  setPurchaseModalUp,
  purchaseModalUp,
  gift,
  setGift,
}) => {
  const { headerToken, user, myTickets, getUpdatedUser } = useAuth();
  const { formatNumber, apiUrl, getOneEvent } = useData();
  const purchaseDates = formattedDates();
  const { isIPhoneWithNotch } = useDesign();
  const [event, setEvent] = useState(Event);
  const [available, setAvailable] = useState([]);
  const [searched, setSearched] = useState(false);
  const [search, setSearch] = useState("");
  const [searchedUser, setSearchedUSer] = useState(null);
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
  const [userLoading, setUserLoading] = useState(false);
  const [loading, setLoading] = useState(true);
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
      bottomSheetModalRef.current.close();
    }
  }, [purchaseModalUp]);

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
    setSearch("");
    setSearchedUSer(null);
    setSearched(false);
    setGift(false);
    setPurchaseModalUp(false);
    setFirstRender(true);
    setAvailable([]);
    setLimitReached(false);
    setPurchaseDone(false);
  };

  const cartTickets = state.cart?.filter((ticket) => ticket?.amount != 0);
  const separatedTickets = cartTickets?.flatMap((item) => {
    const { amount, ...rest } = item;
    return Array.from({ length: item.amount }, () => ({
      ...rest,
      uuid: uuid.v4(),
      username: gift ? searchedUser?.username : user?.username,
      displayName: gift ? searchedUser?.displayName : user?.displayName,
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
            task: gift ? "gift" : "purchase",
            eventId: event?._id,
          },
          details: {
            purchaseId,
            gift,
            user: {
              endUser: {
                userId: gift ? searchedUser?._id : user?._id,
                username: gift ? searchedUser?.username : user?.username,
                email: gift ? searchedUser?.email : user?.email,
                displayName: gift
                  ? searchedUser?.displayName
                  : user?.displayName,
                uri: gift
                  ? searchedUser?.photos?.avatar?.[0]?.uri
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

        await bottomSheetModalRef.current.close();

        await new Promise((resolve, reject) => setTimeout(resolve, 500));

        if (!gift) {
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
            disabled={
              state.total == 0 || (gift && !searchedUser) || purchaseDone
            }
            onPress={() =>
              onPayment
                ? buyTickets()
                : (setOnPayment(true), setFirstRender(false))
            }
            style={{
              width: 150,
              height: 40,
              backgroundColor:
                (gift && searchedUser == null) || state?.total == 0
                  ? colors.description2
                  : colors.primary, // position: "absolute",
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
                  color: colors.white,
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
      !firstRender ? loading : null,
      onPayment,
      firstRender,
      searchedUser,
      gift,
      // purchaseModalUp,
    ]
  );
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
      />
    ),
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
        // style={{backgroundColor:}}
        ref={bottomSheetModalRef}
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
                          <View
                            style={{ alignItems: "center", marginLeft: 10 }}
                          >
                            <Text
                              numberOfLines={2}
                              style={[styles.displayName]}
                            >
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
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
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
                        <Feather
                          name="gift"
                          size={20}
                          color={colors.primary2}
                        />

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
                              color: colors.primary,
                              // marginLeft: 10,
                              // marginTop: 10,
                              marginBottom: 10,
                              marginTop: gift ? 5 : 0,

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
                              backgroundColor: colors.grey,
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
                                  fontSize: 17,
                                  fontWeight: "500",
                                  color: colors.primary,
                                  // left: 10,
                                }}
                              >
                                {item?.amount}x
                              </Text>

                              <Text
                                style={{
                                  fontSize: 15,
                                  fontWeight: "500",
                                  color: colors.primary2,
                                  top: 2,
                                  position: "absolute",
                                  left: 20,
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
                      <View></View>
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

{
  /*

: gift ? (
                    <Animated.View
                      entering={firstRender ? null : SlideInLeft}
                      exiting={SlideOutLeft}
                      style={{
                        shadowOffset: { width: 0.5, height: 0.5 },
                        shadowOpacity: 0.1,
                        shadowRadius: 1,
                        elevation: 1,
                        backgroundColor: colors.white,
                        padding: 10,
                        borderRadius: 10,
                      }}
                    >
                      {userLoading && (
                        <Animated.View
                          style={{
                            // position: "absolute",
                            alignSelf: "center",
                            // top: 10,
                            // zIndex: 4,
                            left: 18,
                            top: 13,
                            // bottom: 5,
                            zIndex: 3,
                            padding: 10,
                            position: "absolute",
                          }}
                          // entering={SlideInUp.duration(300)}
                          // exiting={SlideOutUp.duration(300)}
                        >
                          <ActivityIndicator
                            animating={true}
                            color={colors.primary}
                          />
                        </Animated.View>
                      )}
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
                            height: 50,
                            width: 50,
                            backgroundColor: colors.grey,
                            borderRadius: 50,
                            left: 4,
                          }}
                        />
                        <View style={{ marginLeft: 10 }}>
                          <View
                            style={{
                              height: 18,
                              width: 100,
                              backgroundColor: colors.grey,
                              borderRadius: 20,
                              marginBottom: 5,
                              // left: 4,
                              // top: 4,
                            }}
                          />
                          <View
                            style={{
                              height: 15,
                              width: 80,
                              backgroundColor: colors.grey,
                              borderRadius: 20,
                              // left: 4,
                              // top: 4,
                            }}
                          />
                        </View>
                      </View>
                    </Animated.View>
                  )
*/
}
