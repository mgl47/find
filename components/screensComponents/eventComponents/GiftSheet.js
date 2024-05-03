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
export default GiftSheet = ({
  giftModalRef,
  purchaseSheetRef,
  setGiftModalUp,
  setGiftedUser,
  giftedUser,
  setPurchaseModalUp
}) => {
  const { apiUrl } = useData();
  const [searched, setSearched] = useState(false);
  const [search, setSearch] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const snapPoints = useMemo(() => ["50%", "60%", "80%"], []);
  const handleSheetChanges = useCallback((index) => {}, []);
  const [firstRender, setFirstRender] = useState(true);
  const [onPayment, setOnPayment] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const findUser = async () => {
    setUserLoading(true);
    setSearched(false);
    setGiftedUser(null);
    try {
      const response = await axios.get(
        `${apiUrl}/users/?username=${search?.toLowerCase()}`
      );
      if (response.status === 200) {
        setGiftedUser(response?.data);
      }
    } catch (error) {
      console.log(error?.response?.data?.msg);
      console.log(error);
    }
    setSearched(true);
    setUserLoading(false);
  };

  const clean = () => {
     setGiftModalUp(false);

    setSearch("");
    // setGiftedUser(null);
    setSearched(false);
    // giftModalRef.current.close();
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

  const advance = async () => {
    purchaseSheetRef.current.present();
    // giftModalRef.current.dismiss();
    setPurchaseModalUp(true);
    setTimeout(() => {
      setGiftModalUp(false);
      giftModalRef.current.dismiss();

      // setPurchaseModalUp(true);
    }, 500);
  };

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
        <View
          style={{ padding: 10 }}
          // entering={firstRender ? null : SlideInRight}
          // exiting={SlideOutRight}
        >
          <Text
            style={{
              fontSize: 19,
              fontWeight: "500",
              // alignSelf: "center",
              color: colors.primary2,
              left: 10,
              marginRight: 15,
            }}
          >
            Presentear
          </Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
          >
            <Image
              style={{ height: 120, width: 120 }}
              source={require("../../../assets/icons/voucher.png")}
            />

            <View style={{ padding: 10, width: "70%" }}>
              <Text
                style={{
                  color: colors.black2,
                  fontSize: 18,
                  fontWeight: "600",
                  //   alignSelf: "center",
                  textAlign: "center",
                  bottom: 5,
                  // top: 30,
                  // right: 10,
                  // position: "absolute",
                }}
              >
                Sentindo-se generoso?
              </Text>

              <Text
                style={{
                  color: colors.darkGrey,
                  fontSize: 17,
                  textAlign: "center",

                  //   padding:10
                  //   alignSelf: "center",
                  // bottom: -10,
                  // top: 30,
                  // right: 10,
                  // position: "absolute",
                }}
              >
                Presenteie a sua pessoa favorita com um bilhete para este
                evento!
              </Text>
            </View>
          </View>

          <View>
            <TextInput
              // error={!searchText}
              style={{
                marginBottom: 10,
                backgroundColor: colors.background,
                borderRadius: 20,
              }}
              // autoFocus
              outlineStyle={{ borderRadius: 10, borderWidth: 1.5 }}
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
          </View>
          {!userLoading && giftedUser ? (
            <View>
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
                    <Feather
                      name="gift"
                      style={{
                        top: 12,
                        right: 5,
                        transform: [{ rotate: "-45deg" }],
                      }}
                      size={20}
                      color={colors.white}
                    />
                  </View>
                  <Image
                    source={{
                      uri: giftedUser?.photos?.avatar?.[0]?.uri,
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
                      {giftedUser?.displayName}
                    </Text>
                    <Text numberOfLines={2} style={[styles.userName]}>
                      @{giftedUser?.username}
                    </Text>
                  </View>
                </Animated.View>
              </View>
              <TouchableOpacity
                onPress={advance}
                activeOpacity={0.5}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "flex-end",
                  paddingHorizontal: 50,
                  shadowOffset: { width: 0.5, height: 0.5 },
                  shadowOpacity: 0.3,
                  shadowRadius: 1,
                  elevation: 0.5,
                  //   width: 50,
                  height: 50,
                  marginRight: 10,
                  marginTop: 10,
                  zIndex: 2,
                  backgroundColor: colors.primary,
                  borderRadius: 10,
                }}
                // onPress={() => navigation.navigate("addEvent", item)}
                // onPress={() => navigation.navigate("manageEvent", item)}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 15,
                    fontWeight: "500",
                  }}
                >
                  Avançar
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {searched && !giftedUser && !userLoading && (
            <Text
              style={{
                color: colors.darkRed,
                alignSelf: "center",
                // bottom: -10,
                // top: 30,
                // right: 10,
                // position: "absolute",
              }}
            >
              {" Este usuário não existe!"}
            </Text>
          )}
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
