import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
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
export const PurchaseModal = ({
  Event,
  bottomSheetModalRef,
  setPurchaseModalUp,
}) => {
  const { formatNumber } = useData();
  const snapPoints = useMemo(() => ["25%", "65%"], []);
  const snapPoints2 = useMemo(() => ["25%", "65%"], []);

  const handleSheetChanges = useCallback((index) => {}, []);
  // Event?.tickets?.length>2?
  const [firstRender, setFirstRender] = useState(true);

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
  console.log(state?.cart);
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        // style={{backgroundColor:}}
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onDismiss={() => {
          setPurchaseModalUp(false), clear();
        }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Animated.FlatList
            entering={firstRender ? null : SlideInRight}
            data={state?.cart}
            keyExtractor={(item) => item?.id}
            ListHeaderComponent={<View style={{ marginBottom: 10 }} />}
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
                    cve {formatNumber(state?.total)}
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
