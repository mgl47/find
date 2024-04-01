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

import EventShopSheet from "../../components/screensComponents/MyTicketComponents/EventShopSheet";
const TicketDetails = ({ navigation, navigation: { goBack }, route }) => {
  const [index, setIndex] = useState(1);
  const { user } = useAuth();
  const { height, width } = useDesign();
  const [mediaIndex, setMediaIndex] = useState(0);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  const [storeSheetUp, setStoreSheetUp] = useState(false);

  const [members, setMembers] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  function handleMediaScroll(event) {
    setMediaIndex(
      parseInt(event.nativeEvent.contentOffset.x / width).toFixed()
    );
  }
  const membersSheetRef = useRef(null);
  const eventStoreSheetRef = useRef(null);

  const handleMembersSheet = useCallback(() => {
    membersSheetRef.current?.present();
  }, []);

  const handleManageMembers = useCallback(() => {
    // setSelectedTicket();
    setStoreSheetUp(true)
    eventStoreSheetRef.current?.present();
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ right: 20 }}
          onPress={handlePresentModalPress}
        >
          <Feather name="info" size={24} color={colors.white} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const uuidKey = uuid.v4();
  const ticket = route.params;
  return (
    <>
      <View style={{ backgroundColor: colors.background, zIndex: 0 }}>
        <View style={{ padding: 10, backgroundColor: colors.primary2 }}>
          <Text
            style={{
              fontSize: 21,
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
              size={25}
              color={colors.white}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                // width: "80%",
                color: colors.lightGrey,
                marginLeft: 14,
              }}
            >
              {ticket?.event?.dates[ticket?.event?.dates?.length - 1]
                ?.displayDate +
                " - " +
                ticket?.event?.dates[ticket?.event?.dates?.length - 1]?.hour}
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
              style={{ left: 4 }}
              name="location"
              size={22}
              color={colors.white}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                //   width: "70%",
                color: colors.lightGrey,
                marginLeft: 18,
                textDecorationLine: "underline",
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
              marginBottom: 60,
              // marginBottom: 10,
            }}
          >
            <MaterialCommunityIcons
              name="account-outline"
              size={30}
              color={colors.white}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: colors.white,
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
                right: 5,
                bottom: 10,
              }}
            >
              {Number(mediaIndex) + 1 + "/" + ticket?.tickets?.length}
            </Text>
          )}
        </View>

        <FlatList
          style={{ bottom: 40, zIndex: 0 }}
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
                        fontSize: 17,
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
                      Hora de chegada:{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
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
      {<Button title="open Store" onPress={handleManageMembers} />}
      <EventShopSheet
        type={"members"}
        users={members}
        setUsers={setMembers}
        sheetRef={eventStoreSheetRef}
        eventId={ticket?.event?._id}
        storeSheetUp={storeSheetUp}
        setStoreSheetUp={setStoreSheetUp}
      />
      <BottomSheetModalProvider>
        <View style={styles.sheetContainer}>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
          >
            <BottomSheetView style={styles.contentContainer}>
              <Text>Awesome 🎉</Text>
            </BottomSheetView>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
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
});
