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
  import formattedDates from "../../formattedDates";
  import { set } from "firebase/database";
  export default TopUpSheet = ({ topUpModalRef, state }) => {
    const { user, headerToken } = useAuth();
    const { formatNumber } = useData();
    const { isIPhoneWithNotch } = useDesign();
  
    const [searched, setSearched] = useState(false);
    const [search, setSearch] = useState("");
    const [keyboardVisible, setKeyboardVisible] = useState(false);
  
    const snapPoints = useMemo(() => ["50%", "60%", "80%"], []);
    const handleSheetChanges = useCallback((index) => {}, []);
    const [firstRender, setFirstRender] = useState(true);
    const [onPayment, setOnPayment] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const [paymentInfo, setPaymentInfo] = useState({
      cardInfo: {
        number: 0,
        date: "",
        ccv: 0,
      },
    });
  
    const clean = () => {
      topUpModalRef.current.close();
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
      (props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={1}
          appearsOnIndex={2}
        />
      ),
      []
    );
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
              disabled={paymentInfo?.cardInfo?.value <= 0}
              onPress={topUpAccount}
              style={{
                width: 150,
                height: 40,
                //   backgroundColor:
                //     state?.total == 0 ? colors.description2 : colors.primary, // position: "absolute",
                backgroundColor:
                  paymentInfo?.cardInfo?.value <= 0
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
                    //   marginRight: 10,
                  }}
                >
                  Carregar
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </BottomSheetFooter>
      ),
      [state?.amount, loading, onPayment, firstRender, state?.total, paymentInfo]
    );
    emptyCardInfo =
      !paymentInfo?.cardInfo?.amount ||
      Number(paymentInfo?.cardInfo?.amount) <= 0 ||
      !paymentInfo?.cardInfo?.number ||
      !paymentInfo?.cardInfo?.ccv ||
      !paymentInfo?.cardInfo?.date;
    const topUpAccount = async () => {
      if (emptyCardInfo) {
        toast({
          msg: "Preencha todos os campos!",
          color: colors.white,
          textcolor: colors.primary,
        });
  
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
          await getUpdatedUser();
  
          setTopUp(false);
          // setOnPayment(false);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    const advance = async () => {
      giftModalRef.current.close();
  
      setTimeout(() => {
        setPurchaseModalUp(true);
        purchaseSheetRef.current.present();
      }, 500);
    };
  
    //user?.balance?.amount < state?.total
    return (
      <BottomSheetModal
        // style={{backgroundColor:}}
  
        handleIndicatorStyle={{ backgroundColor: colors.primary }}
        ref={topUpModalRef}
        backdropComponent={renderBackdrop}
        index={keyboardVisible ? 2 : onPayment ? 0 : 1}
        // index={onPayment ? 0 : 1}
        keyboardBehavior={"interactive"}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        footerComponent={renderFooter}
        onDismiss={() => {
          clean();
        }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              // alignSelf: "flex-end",
              justifyContent:"space-between",
              // marginRight: 20,
              marginRight: 0,
              marginLeft: 5,
              zIndex: 3,
              padding: 10,
            }}
          >
            <Text
              style={{
                fontSize: 19,
                fontWeight: "500",
                // alignSelf: "center",
                color: colors.primary2,
              //   left: 10,
              //   marginRight: 15,
              }}
            >
              Carregar conta
            </Text>
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
            underlineStyle={{
              backgroundColor: colors.primary,
            }}
            outlineStyle={{ borderRadius: 10, borderWidth: 1.5 }}
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
              outlineStyle={{ borderRadius: 10, borderWidth: 1.5 }}
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
              outlineStyle={{ borderRadius: 10, borderWidth: 1.5 }}
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
      padding: 10,
  
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
  