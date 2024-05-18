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
  useReducer,
  useState,
} from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import uuid from "react-native-uuid";

import { ActivityIndicator, Checkbox, Chip } from "react-native-paper";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  AntDesign,
  FontAwesome5,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import colors from "../../colors";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutDown,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
} from "react-native-reanimated";
import { TextInput } from "react-native-paper";

import axios from "axios";
import { useData } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";
import { cocktails } from "../../Data/cocktails";
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  collection,
  where,
  orderBy,
  limit,
  query,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useDesign } from "../../hooks/useDesign";

const { height, width } = Dimensions.get("window");

export default EventStoreSheet = ({
  sheetRef,
  storeSheetUp,
  setStoreSheetUp,
  type,
  users,
  setUsers,
  filter,

  ticket,
}) => {
  const { getOneEvent } = useData();
  const { isIPhoneWithNotch } = useDesign();
  const eventId = ticket?.event?._id;
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(true);
  // console.log(eventId);
  const ticketQrs = ticket?.tickets.map((qr) => qr.uuid);
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
  const handleSheetChanges = useCallback((index) => {
    setBlockButtons(true);
  }, []);
  const [paymentInfo, setPaymentInfo] = useState({
    cardInfo: {
      number: 0,
      date: "",
      ccv: 0,
    },
  });
  const purchaseId = uuid.v4();

  const initialState = {
    cart: [],
    // cart: cocktails,

    total: 0,
    amount: 0,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  // console.log(event);

  const getSelectedEvent = async () => {
    // if (storeSheetUp) {
    try {
      setLoading(true);

      const selectedEvent = await getOneEvent(eventId);
      setEvent(selectedEvent);

      dispatch({ type: "CLEAR", payload: selectedEvent?.store });
      // dispatch({ type: "CLEAR", payload: cocktails });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    // }
  };
  useEffect(() => {
    getSelectedEvent();
  }, []);

  function reducer(state, action) {
    switch (action.type) {
      case "INCREASE": {
        // if (limitReached) {
        //   return state;
        // }
        let tempCart = state.cart.map((cartItem) => {
          if (cartItem?.id === action.payload?.id) {
            // console.log("|FAsad");
            cartItem = {
              ...cartItem,
              amount: cartItem.amount + 1,
              //   available: cartItem.available - 1,
            };
            if (cartItem?.available == 0) {
              //   setAvailable([...available, cartItem?.id]);
              //   toast({
              //     msg: `Quantidade disponível atingida para o bilhete "${cartItem?.category}"!`,
              //     color: colors.white,
              //     textcolor: colors.primary,
              //   });
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
              //   available: cartItem.available + 1,
            };
            // if (available?.includes(cartItem?.id)) {
            //   const newAvailable = available.filter((id) => id != cartItem?.id);
            //   console.log("removed from available");
            //   //   setAvailable(newAvailable);
            // }
            // setLimitReached(false);
          }

          return cartItem;
        });

        return { ...state, cart: tempCart };
      }
      case "CLEAR": {
        return { cart: action?.payload, total: 0, amount: 0 };
      }

      case "GET_TOTALS": {
        let { total, amount } = state?.cart?.reduce(
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
        total = parseFloat(total?.toFixed(2));
        return { ...state, total, amount };
      }
    }
    throw Error("Unknown action: " + action.type);
  }
  useEffect(() => {
    dispatch({ type: "GET_TOTALS" });
  }, [state.cart]);
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
  const clean = async () => {
    setOnPayment(false),
      setTopUp(false),
      setFirstRender(true),
      setStoreSheetUp(false);
    clear(event?.store);
    setPaymentInfo({});
    sheetRef?.current?.close();
  };
  const snapPoints = useMemo(() => ["60%", "70%", "90%"], []);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { apiUrl, formatNumber } = useData();
  const { user, headerToken, getUpdatedUser } = useAuth();
  const [blockButtons, setBlockButtons] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [onPayment, setOnPayment] = useState(false);
  const [topUp, setTopUp] = useState(false);

  // const [emptyCardInfo, setEmptyCardInfo] = useState(false);

  const validator = async () => {
    if (state?.total == 0) {
      return;
    } else if (!onPayment) {
      setOnPayment(true);
    } else if (onPayment && user?.balance?.amount >= state?.total) {
      buyProduct();
    } else if (onPayment && !topUp) {
      setTopUp(true);
    } else {
      topUpAccount();
    }

    // onPress={() =>
    //   topUp
    //     ? topUpAccount()
    //     : onPayment
    //     ? setTopUp(!topUp)
    //     : setOnPayment(true)
    // }
  };
  const buyProduct = async () => {
    const orderId = uuid.v4();
    if (user?.balance?.total < state?.total) {
      setTopUp(true);
      return;
    }
    setLoading(true);

    try {
      const response = await axios.patch(
        `${apiUrl}/user/current/${user?._id}`,
        {
          operation: { type: "accountBalance", task: "charge" },
          amount: Number(state?.total),
        },
        { headers: { Authorization: headerToken } }
      );

      if (response.status === 200) {
        const docRef = collection(db, "transactions");
        const q = query(
          docRef,
          where("eventId", "==", eventId),
          orderBy("time", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        let orderNum = 1;
        querySnapshot.forEach((doc) => {
          const currNumb = doc.data()?.orderNum;
          if (doc.exists() && currNumb && currNumb < 100) {
            orderNum = currNumb + 1;
          }
        });
        const hour = new Date()?.getHours();
        const minutes = new Date()?.getMinutes();
        await setDoc(doc(db, "transactions", orderId), {
          orderNum,
          orderId,
          eventId,
          ticketQrs,
          total: state?.total,
          orderedBy: user?._id,
          products: state?.cart?.filter((item) => item?.amount != 0),
          time: new Date(),
          hour: `${hour < 10 ? "0" + hour : hour}:${
            minutes < 10 ? "0" + minutes : minutes
          }`,
          status: "pendente",
        });
        getUpdatedUser({field:"user"})  
                clean();
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  emptyCardInfo =
    !paymentInfo?.cardInfo?.amount ||
    Number(paymentInfo?.cardInfo?.amount) <= 0 ||
    !paymentInfo?.cardInfo?.number ||
    !paymentInfo?.cardInfo?.ccv ||
    !paymentInfo?.cardInfo?.date;

  const topUpAccount = async () => {
    if (emptyCardInfo) {
      return;
    }
    setLoading(true);

    try {
      const response = await axios.patch(
        `${apiUrl}/user/current/${user?._id}`,
        {
          operation: { type: "accountBalance", task: "topUp" },
          amount: Number(paymentInfo?.cardInfo?.amount),
        },
        { headers: { Authorization: headerToken } }
      );

      if (response.status === 200) {
        await       getUpdatedUser({field:"user"})  

        setTopUp(false);
        // setOnPayment(false);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props}>
        <Animated.View
          // entering={SlideInDown.duration(200)}
          // exiting={SlideOutDown.duration(200)}
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
                fontSize: 18,
                color: colors.t5,
                fontWeight: "400",
                marginRight: 5,
              }}
            >
              Total:
            </Text>
            <Text
              style={{
                fontSize: 19,
                color: colors.t2,
                fontWeight: "500",
                position: "absolute",
                left: 50,
                bottom: 2,
              }}
            >
              cve {formatNumber(state?.total)}
            </Text>
          </View>
          <TouchableOpacity
            // onPress={handlePurchaseSheet}
            // onPress={handleClick}
            disabled={state.total == 0 || loading}
            onPress={validator}
            style={{
              width: 150,
              height: 40,
              backgroundColor:
                state?.total == 0 ? colors.background2 : colors.primary2, // position: "absolute",
              zIndex: 1,
              //   top: 10,
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
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text
                style={{
                  fontSize: 15,
                  color: state?.total == 0 ? colors.t5 : colors.t2,
                  fontWeight: "500",
                  marginRight: 10,
                }}
              >
                {topUp ? "Carregar" : onPayment ? "Pagar" : "Confirmar"}
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </BottomSheetFooter>
    ),
    [state?.amount, loading, onPayment, topUp]
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

  //         ref={sheetRef}
  //         index={keyboardVisible ? 2 : onPayment ? 0 : 1}
  //         snapPoints={snapPoints}
  //         // onChange={handleSheetChanges}
  //         onDismiss={() => {
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

  if (event?.store?.length > 0)
    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          // style={{backgroundColor:}}
          ref={sheetRef}
          // index={keyboardVisible ? 1 : 0}
          index={keyboardVisible ? 2 : onPayment ? 0 : 1}
          snapPoints={snapPoints}
          // onChange={() => setStoreSheetUp(true)}
          onDismiss={clean}
          footerComponent={renderFooter}
          backdropComponent={renderBackdrop}
          handleStyle={{
            backgroundColor: colors.background,
          }}
          handleIndicatorStyle={{ backgroundColor: colors.t5 }}
        >
          <BottomSheetFlatList
            data={state?.cart}
            style={{ backgroundColor: colors.background }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.contentContainer]}
            numColumns={2}
            keyExtractor={(item) => item?.id}
            ListHeaderComponent={
              <>
                {/* {!onPayment && !topUp && ( */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 40,
                  }}
                >
                  {onPayment ? (
                    <TouchableOpacity
                      onPress={() => {
                        setOnPayment(false), setTopUp(false);
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 20,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="arrow-left"
                        size={23}
                        color={colors.t2}
                      />
                      <Text
                        style={{
                          color: colors.t4,
                          fontSize: 16,
                          fontWeight: "500",
                          marginLeft: 5,
                        }}
                      >
                        Voltar
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "500",
                        color: colors.t2,
                        padding: 10,
                        marginLeft: 30,
                        // alignSelf: "center",
                      }}
                    >
                      Loja
                    </Text>
                  )}
                  <View
                    style={{
                      flexDirection: "row",

                      marginRight: 20,
                      marginLeft: 5,
                      zIndex: 3,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "500",
                        color: colors.t4,

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

                {/* )} */}
                {onPayment && (
                  <Animated.View
                    style={{ zIndex: 3 }}
                    entering={SlideInRight}
                    exiting={SlideOutRight}
                  >
                    <Animated.FlatList
                      entering={FadeIn}
                      exiting={FadeOut}
                      data={state?.cart?.filter((item) => item?.amount != 0)}
                      keyExtractor={(item) => item?.id}
                      ListHeaderComponent={
                        <>
                          {topUp && (
                            <Animated.View
                              entering={SlideInUp.duration(200)}
                              exiting={SlideOutUp.duration(80)}
                              style={{
                                padding: 10,
                                zIndex: 1,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontWeight: "400",
                                  marginBottom: 5,
                                  color: colors.darkRed,
                                  textAlign: "center",
                                }}
                              >
                                Não tens saldo suficiente.{"\n"}Por favor
                                carregue a sua conta!
                              </Text>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginBottom: 5,
                                  // marginVertical: 10,
                                  // marginBottom: 20,
                                }}
                              >
                                <TextInput
                                  error={
                                    (emptyCardInfo &&
                                      paymentInfo?.cardInfo?.amount < 0) ||
                                    !paymentInfo?.cardInfo?.amount
                                  }
                                  style={{
                                    backgroundColor: "transparent",
                                    width: "25%",
                                  }}
                                  // autoFocus
                                  mode="outlined"
                                  activeOutlineColor={colors.primary}
                                  underlineStyle={{
                                    backgroundColor: colors.primary,
                                  }}
                                  outlineColor={colors.primary}
                                  // contentStyle={{  fontWeight: "500",borderColor:"red" }}
                                  label="Valor"
                                  defaultValue={paymentInfo?.cardInfo?.amount}
                                  activeUnderlineColor={colors.primary}
                                  value={paymentInfo?.cardInfo?.amount}
                                  onChangeText={(text) =>
                                    setPaymentInfo({
                                      ...paymentInfo,
                                      cardInfo: {
                                        ...paymentInfo?.cardInfo,
                                        amount: text,
                                      },
                                    })
                                  }
                                />
                                <TextInput
                                  error={
                                    emptyCardInfo &&
                                    !paymentInfo?.cardInfo?.number
                                  }
                                  style={{
                                    width: "72%",
                                    backgroundColor: "transparent",
                                  }}
                                  // autoFocus
                                  mode="outlined"
                                  activeOutlineColor={colors.primary}
                                  underlineStyle={{
                                    backgroundColor: colors.primary,
                                  }}
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
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  // marginVertical: 10,
                                  // marginBottom: 20,
                                }}
                              >
                                <TextInput
                                  error={
                                    emptyCardInfo &&
                                    !paymentInfo?.cardInfo?.date
                                  }
                                  style={{
                                    marginBottom: 5,
                                    backgroundColor: "transparent",
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
                                  keyboardType="number-pad"
                                  onKeyPress={({ nativeEvent }) => {
                                    nativeEvent.key === "Backspace" &&
                                    paymentInfo?.cardInfo?.date?.length == 5
                                      ? paymentInfo?.cardInfo?.date?.slice(2)
                                      : null;
                                  }}
                                  value={paymentInfo?.cardInfo?.date}
                                  onChangeText={(text) => {
                                    return setPaymentInfo({
                                      ...paymentInfo,
                                      cardInfo: {
                                        ...paymentInfo?.cardInfo,
                                        date:
                                          paymentInfo?.cardInfo?.date?.length ==
                                            1 &&
                                          text.length === 2 &&
                                          text.charAt(1) === "/"
                                            ? text + " / "
                                            : text,
                                      },
                                    });
                                  }}
                                  // onChange={({
                                  //   nativeEvent: { eventCount, target, text },
                                  // }) =>
                                  //   setPaymentInfo({
                                  //     ...paymentInfo,
                                  //     cardInfo: {
                                  //       ...paymentInfo?.cardInfo,
                                  //       date:
                                  //         paymentInfo?.cardInfo?.date?.length ==
                                  //           1 && nativeEvent.key != "Backspace"
                                  //           ? text + " / "
                                  //           : text,
                                  //     },
                                  //   })
                                  // }
                                />
                                <TextInput
                                  error={
                                    emptyCardInfo && !paymentInfo?.cardInfo?.ccv
                                  }
                                  style={{
                                    marginBottom: 5,
                                    backgroundColor: "transparent",
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
                                  label="cvv"
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
                            </Animated.View>
                          )}
                          <Text
                            style={{
                              fontSize: 17,
                              fontWeight: "400",
                              color: colors.t3,
                              marginLeft: 10,
                              // marginTop: 10,
                              marginBottom: 10,

                              // left: 10,
                            }}
                          >
                            Produtos selecionados
                          </Text>
                        </>
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
                          <Animated.View
                            entering={FadeIn}
                            exiting={FadeOut}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginLeft: 10,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 17,
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
                                top: 2,
                                position: "absolute",
                                left: 30,
                              }}
                            >
                              {item?.displayName +
                                (item?.amount > 1
                                  ? " selecionados!"
                                  : " selecionado!")}
                            </Text>
                          </Animated.View>
                        );
                      }}
                    />
                  </Animated.View>
                )}
              </>
            }
            renderItem={({ item }) => {
              return !onPayment ? (
                <Animated.View
                  entering={FadeIn}
                  exiting={FadeOut.duration(10)}
                  style={{
                    margin: 10,
                    marginBottom: 50,

                    alignItems: "center",
                    backgroundColor: colors.background2,
                    //   width: width * 0.45,
                    //   height: height * 0.2,
                    width: width * 0.45,
                    height: 150,
                    shadowOffset: { width: 0.5, height: 0.5 },
                    shadowOpacity: 0.2,
                    shadowRadius: 1,
                    elevation: 0.5,
                    paddingHorizontal: 10,
                    padding: 10,
                    //   marginTop: 50,
                    borderRadius: 10,
                  }}
                  // onPress={() => navigation.navigate("addEvent", item)}
                >
                  <View
                    style={{
                      // height: height * 0.15,
                      // width: width * 0.3,
                      height: 120,
                      width: 130,
                      borderRadius: 10,
                      // bottom: 40,
                      zIndex: 1,
                      // overflow: "hidden",

                      // marginLeft: 20,
                      bottom: 70,
                      position: "absolute",
                      shadowOffset: { width: 1, height: 1 },
                      shadowOpacity: 1,
                      shadowRadius: 3,
                      elevation: 2,
                      // shadowColor: colors.grey,
                      // backgroundColor: colors.background,
                    }}
                  >
                    <View
                      style={{
                        height: 20,
                        // width: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: colors.background,
                        position: "absolute",
                        // right: width * 0.12,
                        right: 0,

                        // top: 100,
                        // transform: [{ rotate: "45deg" }],
                        // borderRadius: 10,

                        borderTopLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        bottom: 0,
                        // borderWidth: 1,
                        // borderColor: colors.grey,
                        // borderStyle: "dashed",
                        zIndex: 3,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.white,
                          fontWeight: "500",
                          padding: 2,
                          paddingHorizontal: 5,
                        }}
                      >
                        cve {formatNumber(item?.price)}
                      </Text>
                    </View>
                    <Image
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: 10,

                        //   borderRadius: 5,
                      }}
                      source={{ uri: item?.photo }}
                    />
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      bottom: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        zIndex: 3,
                        bottom: 10,
                        fontSize: 14,
                        fontWeight: "500",
                        color: colors.t2,
                      }}
                    >
                      {item?.displayName}
                    </Text>
                    <View style={styles.counterView}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => decrease(item)}
                      >
                        <AntDesign
                          name="minuscircle"
                          size={24}
                          color={
                            state?.cart?.filter((cartItem) => {
                              if (cartItem?.id == item?.id)
                                return cartItem?.amount;
                            })== 0
                              ? colors.description
                              : colors.t4
                          }
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: "600",
                          color: colors.t4,
                        }}
                      >
                        {item?.amount}
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => increase(item)}
                      >
                        <AntDesign
                          name="pluscircle"
                          size={24}
                          color={colors.t1}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              ) : null;
            }}
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
    // marginTop: 70,
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
  counterView: {
    flexDirection: "row",
    // backgroundColor: "red",
    width: "100%",
    flex: 1,

    zIndex: 5,
    alignItems: "center",
    justifyContent: "space-around",
  },
});
