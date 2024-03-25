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
    <View style={{ backgroundColor: colors.background }}>
      <View style={{ padding: 10 }}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "600",
            color: colors.primary,
            alignSelf: "center",
            marginVertical: 20,
          }}
        >
          {ticket?.event?.title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <MaterialCommunityIcons
            name="calendar-month"
            size={25}
            color={colors.darkSeparator}
          />
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",
              // width: "80%",
              color: colors.darkSeparator,
              marginLeft: 10,
            }}
          >
            {
              ticket?.event?.dates[ticket?.event?.dates?.length - 1]
                ?.displayDate+" - "+    ticket?.event?.dates[ticket?.event?.dates?.length - 1]
                ?.hour
            }
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Entypo name="location" size={25} color={colors.darkSeparator} />
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",
              //   width: "70%",
              color: colors.primary,
              marginLeft: 10,
              textDecorationLine: "underline",
            }}
          >
            {ticket?.event?.venue?.displayName},
            {" " + ticket?.event?.venue?.city}
          </Text>
        </View>
        <Text
          style={{
            color: colors.black,
            fontSize: 18,
            fontWeight: "600",
            alignSelf: "flex-end",
          }}
        >
          {Number(mediaIndex) + 1 + " / " + ticket?.tickets?.length}
        </Text>
      </View>

      <FlatList
        // style={{ marginTop: 10 }}
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
                marginBottom:1
              }}
            
            >
              <View
                style={{
                  shadowOffset: { width: 0.5, height: 0.5 },
                  shadowOpacity: 0.1,
                  shadowRadius: 1,
                  elevation: 0.5,
                  backgroundColor: "white",
                  padding: 10,
                  paddingHorizontal: 20,
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
            </View>
          );
        }}
      />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: colors.primary,
          alignSelf: "flex-start",
          marginLeft: 20,
          marginVertical: 20,
        }}
      >
        {ticket?.buyer?.displayName}
      </Text>
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
