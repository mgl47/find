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
} from "react-native";

import React, { useEffect, useState } from "react";
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

const TicketDetails = ({ navigation, navigation: { goBack }, route }) => {
  const [index, setIndex] = useState(1);
  const { user } = useAuth();
  const { height, width } = useDesign();
  const [mediaIndex, setMediaIndex] = useState(0);
  function handleMediaScroll(event) {
    setMediaIndex(
      parseInt(event.nativeEvent.contentOffset.x / width).toFixed()
    );
  }
  const uuidKey = uuid.v4();
  const ticket = route.params;
  return (
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
        style={{ bottom: 40, zIndex: 2 }}
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
                      item?.category == "VIP" ? colors.darkGold : colors.dark2,
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
  );
};

export default TicketDetails;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    bottom: 50,
    backgroundColor: colors.background,
  },
  headerContainer: {
    position: "absolute",
    zIndex: 1,
    height: 40,
    width: "100%",
    // backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: {
    marginLeft: 15,
    top: 40,
  },
  share_like: {
    flexDirection: "row",
    justifyContent: "space-around",
    top: 40,
    marginRight: 20,
  },
  share: {
    marginRight: 10,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: colors.grey,
    marginVertical: 5,
    alignSelf: "center",
  },
  more: {
    position: "absolute",

    backgroundColor: colors.background,
    color: colors.primary,
    alignSelf: "flex-end",
    fontWeight: "500",
    // marginBottom: 5,
    right: -7,
    bottom: -10,

    zIndex: 1,
  },

  modalContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.background,
    // bottom:10,
  },
});
