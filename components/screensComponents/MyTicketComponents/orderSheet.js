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
  useState,
} from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";

import { ActivityIndicator, Checkbox, Chip } from "react-native-paper";

import colors from "../../colors";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from "react-native-reanimated";
import { TextInput } from "react-native-paper";

import axios from "axios";
import { useData } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";

const { height, width } = Dimensions.get("window");

export default orderSheet = ({ sheetRef, order }) => {
  // const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["55%", "75%"], []);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { apiUrl, formatNumber } = useData();
  const { user, headerToken, getUpdatedUser } = useAuth();

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
  const [loading, setLoading] = useState(false);
  const statusColor = () => {
    if (order?.state == "preparando") {
      return colors.primary;
    } else if (order?.state == "pendente") {
      return "orange";
    } else if (order?.state == "pronto") {
      return "green";
    } else if (order?.state == "concluído") {
      return colors.darkGrey;
    } else if (order?.state == "cancelado") {
      return colors.darkRed;
    }
  };
  //   function totalCalculator() {
  //     const total = order?.products?.reduce((cartTotal, cartItem) => {
  //       const { price, amount } = cartItem;
  //       const itemTotal = price * amount;

  //       cartTotal.total += itemTotal;
  //       cartTotal.amount += amount;

  //       return cartTotal;
  //     });
  //     return (total = parseFloat(total.toFixed(2)));
  //   }
  const total = order?.products?.reduce(
    (acc, val) => acc + val?.price * val?.amount,
    0
  );

  const color = statusColor();
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        //   backgroundStyle={{backgroundColor:colors.white_shade}}
        backg
        // style={{backgroundColor:}}
        ref={sheetRef}
        // index={keyboardVisible ? 1 : 0}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        // onDismiss={{}}
        // backgroundComponent={}
        handleStyle={
          {
            //   shadowOffset: { width: 0.5, height: 0.5 },
            //   shadowOpacity: 0.2,
            //   shadowRadius: 1,
            //   elevation: 0.7,
          }
        }
      >
        <BottomSheetView style={styles.contentContainer}>
          <BottomSheetFlatList
            style={{ padding: 10 }}
            data={order?.products}
            keyExtractor={(item) => item?.id}
            ListHeaderComponent={
              <View style={{ padding: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 2,
                  }}
                >
                  <Text
                    numberOfLines={2}
                    style={{ marginRight: 5, fontSize: 17 }}
                  >
                    Número:
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      alignSelf: "flex-start",
                      fontSize: 17,
                      fontWeight: "400",
                      color: colors.primary2,
                      marginVertical: 3,
                    }}
                  >
                    {order?.orderNum}
                  </Text>
                </View>
                <View style={styles.separator} />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 2,
                  }}
                >
                  <Text
                    numberOfLines={2}
                    style={{ marginRight: 5, fontSize: 17 }}
                  >
                    estado:
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      alignSelf: "flex-start",
                      fontSize: 17,
                      fontWeight: "400",
                      color: color,
                      marginVertical: 3,
                    }}
                  >
                    {order?.status}
                  </Text>
                </View>
                <View style={styles.separator} />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 2,
                  }}
                >
                  <Text
                    numberOfLines={2}
                    style={{ marginRight: 5, fontSize: 17 }}
                  >
                    Hora:
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      alignSelf: "flex-start",
                      fontSize: 16,
                      fontWeight: "500",
                      color: colors.primary2,
                      marginVertical: 3,
                    }}
                  >
                    {order?.hour}
                  </Text>
                </View>
                <View style={styles.separator} />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    color: colors.primary,
                    // marginLeft: 10,
                    marginTop: 15,
                    // marginBottom: 5,

                    // left: 10,
                  }}
                >
                  Produtos selecionados
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              return (
                <Animated.View
                  //   entering={FadeIn}
                  //   exiting={FadeOut}
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
                      color: colors.dark,
                      top: 2,
                      position: "absolute",
                      left: 25,
                    }}
                  >
                    {item?.displayName}
                  </Text>
                </Animated.View>
              );
            }}
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
            ListFooterComponent={
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                  marginLeft: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.black2,
                    fontWeight: "600",
                    marginLeft: 5,
                  }}
                >
                  Total:
                </Text>
                <Text
                  style={{
                    fontSize: 17,
                    color: colors.primary,
                    fontWeight: "600",
                    position: "absolute",
                    left: 50,
                  }}
                >
                  cve {formatNumber(total)}
                </Text>
              </View>
            }
          />
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
    // padding: 10,
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
  userName: {
    fontSize: 16,
    alignSelf: "flex-start",
    color: colors.description,
    fontWeight: "500",
    marginRight: 5,
    top: 2,

    // marginBottom: 5,
  },

  displayName: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginRight: 20,
    top: 2.5,
  },
});
