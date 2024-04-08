import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Button,
} from "react-native";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import colors from "../../components/colors";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
  AntDesign,
  Fontisto,
  Feather,
  Foundation,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";

import { artist as arti } from "../../components/Data/artist";
import { useAuth } from "../../components/hooks/useAuth";
import { useData } from "../../components/hooks/useData";

import uuid from "react-native-uuid";
import { Tab, Text as Text2, TabView } from "@rneui/themed";
import BigTicket from "../../components/tickets/BigTicket";
import { useDesign } from "../../components/hooks/useDesign";
import QRCode from "react-native-qrcode-svg";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

import EventStoreSheet from "../../components/screensComponents/MyTicketComponents/EventStoreSheet";
import OrderSheet from "../../components/screensComponents/MyTicketComponents/orderSheet";
import Animated, { FadeIn } from "react-native-reanimated";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
const TicketDetails = ({ navigation, navigation: { goBack }, route }) => {
  const [index, setIndex] = useState(1);
  const { user } = useAuth();
  const { events } = useData();
  const { height, width } = useDesign();
  const [mediaIndex, setMediaIndex] = useState(0);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  const [storeSheetUp, setStoreSheetUp] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [orders, setOrders] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const uuidKey = uuid.v4();
  const ticket = route.params;
  const data = new Date();
  const selectedEvent = events?.filter(
    (event) => event?._id == ticket?.tickets?.[0]?.eventId
  )?.[0];
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  function handleMediaScroll(event) {
    setMediaIndex(
      parseInt(event.nativeEvent.contentOffset.x / width).toFixed()
    );
  }

  const eventStoreSheetRef = useRef(null);
  const orderSheetRef = useRef(null);

  const handleOrderSheet = useCallback((item) => {
    setSelectedOrder(item);
    orderSheetRef.current?.present();
  }, []);

  const handleStoreSheet = useCallback(() => {
    // setSelectedTicket();
    // setStoreSheetUp(true);
    setStoreSheetUp(true);

    eventStoreSheetRef.current?.present();
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {selectedEvent?.store?.length > 0 && (
            <TouchableOpacity
              style={{
                // position: "absolute",
                // right: 30,

                // height: 50,
                // width: 50,
                // bottom: 10,
                // alignItems: "center",
                // justifyContent: "center",
                // shadowOffset: { width: 1, height: 1 },
                // shadowOpacity: 1,
                // shadowRadius: 1,
                // elevation: 3,
                right: 35,
              }}
              // onPress={() => setShowScanModal(true)}
              onPress={handleStoreSheet}
            >
              <FontAwesome6 name="shop" size={22} color={colors.white} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{ right: 20 }}
            onPress={handlePresentModalPress}
          >
            <Feather name="info" size={24} color={colors.lightGrey} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const q = query(
      collection(db, "transactions"),
      where("orderedBy", "==", user?._id),
      where("eventId", "==", ticket?.tickets?.[0]?.eventId),
      orderBy("time", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newOrders = [];
      querySnapshot.forEach((doc) => {
        newOrders.push({ id: doc?.id, ...doc?.data() }); // Add unique identifier to each order
      });

      setOrders(newOrders);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  return (
    <>
      <FlatList
        bounces={false}
        style={{ backgroundColor: colors.background }}
        ListHeaderComponent={
          <>
            <View style={{ backgroundColor: colors.background, zIndex: 2 }}>
              <View
                style={{
                  padding: 10,
                  backgroundColor: colors.primary2,
                  zIndex: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: colors.white,
                    alignSelf: "center",
                    textAlign: "center",
                    marginBottom: 10,
                    // marginVertical: 20,
                  }}
                >
                  {ticket?.event?.title}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                >
                  <MaterialCommunityIcons
                    style={{ left: 3 }}
                    name="calendar-month"
                    size={23}
                    color={colors.white}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      // width: "80%",
                      color: colors.lightGrey,
                      marginLeft: 14,
                    }}
                  >
                    {ticket?.event?.dates[ticket?.event?.dates?.length - 1]
                      ?.displayDate +
                      " - " +
                      ticket?.event?.dates[ticket?.event?.dates?.length - 1]
                        ?.hour}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // marginBottom: 10,
                  }}
                >
                  <Entypo
                    style={{ left: 5 }}
                    name="location"
                    size={20}
                    color={colors.white}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      //   width: "70%",
                      color: colors.lightGrey,
                      marginLeft: 18,
                      // textDecorationLine: "underline",
                    }}
                  >
                    {ticket?.event?.venue?.displayName},
                    {" " + ticket?.event?.venue?.city}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                    // marginBottom: 60,
                    // marginBottom: 10,
                  }}
                >
                  <MaterialCommunityIcons
                    style={{ left: 2 }}
                    name="account-outline"
                    size={28}
                    color={colors.white}
                  />
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "600",
                      color: colors.lightGrey,
                      // alignSelf: "flex-start",
                      marginLeft: 10,
                    }}
                  >
                    {ticket?.buyer?.displayName}
                  </Text>
                </View>

                {ticket?.tickets?.length > 1 && (
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 15,
                      fontWeight: "600",
                      alignSelf: "flex-end",
                      position: "absolute",
                      // marginBottom: 40,
                      // top: 40,
                      right: 10,
                      bottom: -50,
                    }}
                  >
                    {Number(mediaIndex) + 1 + "/" + ticket?.tickets?.length}
                  </Text>
                )}
              </View>
              <View
                style={{
                  height: 220,
                  backgroundColor: colors.primary2,
                  width,
                  zIndex: 0,
                  position: "absolute",
                }}
              />

              <FlatList
                // entering={FadeIn.duration(100)}

                style={{ zIndex: 0 }}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={(e) => handleMediaScroll(e)}
                horizontal
                data={ticket?.tickets}
                keyExtractor={(item) => item?.uuid}
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{
                        width,
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          shadowOffset: { width: 0.5, height: 0.5 },
                          shadowOpacity: 0.2,
                          shadowRadius: 1,
                          elevation: 0.7,
                          backgroundColor: "white",
                          padding: 10,
                          paddingHorizontal: 20,
                          borderRadius: 10,
                          marginBottom: 1,
                        }}
                      >
                        {/* <Text>{item?.uuid}</Text> */}
                        <Text
                          style={{
                            fontSize: 25,
                            fontWeight: "600",
                            textAlign: "center",
                            color:
                              item?.category == "VIP"
                                ? colors.darkGold
                                : colors.dark2,
                            marginBottom: 10,
                            //   marginLeft: 10,
                            //   textDecorationLine: "underline",
                          }}
                        >
                          {item?.category}
                        </Text>

                        <QRCode
                          // key={ite}
                          // value={item.uuid}

                          value={item.uuid}
                          size={260}
                          enableLinearGradient={item?.category !== "VIP"}
                          color={colors.darkGold}
                          //   quietZone={10}
                          backgroundColor={colors.white}
                        />
                      </View>
                      {item?.checkedIn && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 10,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: "600",
                              textAlign: "center",
                              color:
                                item?.category == "VIP"
                                  ? colors.darkGold
                                  : colors.dark2,
                              // marginBottom: 10,
                              //   marginLeft: 10,
                              //   textDecorationLine: "underline",
                            }}
                          >
                            Check In:{" "}
                          </Text>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: "600",
                              textAlign: "center",
                              color: "green",
                              // marginBottom: 10,
                              //   marginLeft: 10,
                              //   textDecorationLine: "underline",
                            }}
                          >
                            {item?.checkedAt}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                }}
              />
            </View>
            {selectedEvent?.store?.length > 0 && (
              <View style={{ marginVertical: 10 }}>
                {orders?.length > 0 && (
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "500",
                      color: colors.primary,
                      marginLeft: 30,

                      marginVertical: 10,

                      // left: 10,
                    }}
                  >
                    Pedidos
                  </Text>
                )}
              </View>
            )}
          </>
        }
        data={orders}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item?.orderId}
        renderItem={({ item }) => {
          const statusColor = (item) => {
            if (item?.status == "preparando") {
              return colors.primary;
            } else if (item?.status == "pronto") {
              return "green";
            } else if (item?.status == "concluído") {
              return colors.softGrey;
            } else {
              return colors.primary2;
            }
          };
          const color = statusColor(item);
          return selectedEvent?.store?.length > 0
            ? orders?.length > 0 && (
                <Animated.View entering={FadeIn.duration(180)}>
                  <TouchableOpacity
                    onPress={() => handleOrderSheet(item)}
                    activeOpacity={0.5}
                    style={{
                      shadowOffset: { width: 0.5, height: 0.5 },
                      shadowOpacity: 0.1,
                      shadowRadius: 1,
                      elevation: 2,
                      width: "100%",
                      // marginTop: 10,
                    }}
                    // onPress={() => navigation.navigate("event", item)}
                  >
                    <Animated.View
                      style={styles.userCard}
                      // entering={FadeIn}
                      // exiting={FadeOut}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text numberOfLines={2} style={[styles.userName]}>
                          número:
                        </Text>
                        <Text numberOfLines={2} style={[styles.displayName]}>
                          {item?.orderNum}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          position: "absolute",
                          left: 120,
                        }}
                      >
                        <Text numberOfLines={2} style={[styles.userName]}>
                          estado:
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={[styles.displayName, { color }]}
                        >
                          {item?.status}
                        </Text>
                      </View>
                    </Animated.View>
                  </TouchableOpacity>
                </Animated.View>
              )
            : null;
        }}
        ListFooterComponent={<View style={{ marginBottom: 20 }} />}
      />
      {
        <EventStoreSheet
          // users={members}

          ticket={ticket}
          sheetRef={eventStoreSheetRef}
          storeSheetUp={storeSheetUp}
          setStoreSheetUp={setStoreSheetUp}
        />
      }
      <OrderSheet
        order={selectedOrder}
        setUsers={setMembers}
        sheetRef={orderSheetRef}
        eventId={ticket?.event?._id}
        // storeSheetUp={storeSheetUp}
        // setStoreSheetUp={setStoreSheetUp}
      />
    </>
  );
};

export default TicketDetails;

const styles = StyleSheet.create({
  sheetContainer: {
    // flex: 1,
    // padding: 24,
    zIndex: 2,
    // justifyContent: "center",
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,

    // alignItems: "center",
    backgroundColor: colors.background,
  },
  userCard: {
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,
    alignItems: "center",
    height: 50,
    // justifyContent:""

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
  separator: {
    width: "95%",
    height: 1,
    right: 10,
    backgroundColor: colors.grey,
    marginVertical: 5,
    alignSelf: "center",
  },
});
