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
import BigCard2 from "../../components/cards/BigCards2";

const MyEvents = ({ navigation, navigation: { goBack }, route }) => {
  const [index, setIndex] = useState(1);
  const { user, myEvents } = useAuth();

  const { height, width } = useDesign();

  const uuidKey = uuid.v4();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tab
        // titleStyle={{ color: colors.primary }}

        indicatorStyle={{
          backgroundColor: colors.primary,
          //   height: 2,
          //   width: "33%",
        }}
        value={index}
        onChange={setIndex}
        // dense

        style={{ backgroundColor: colors.background }}
        disableIndicator
        titleStyle={(active) => ({
          color: active ? colors.white : colors.softGrey,
          fontSize: active ? 16 : 15,
          fontWeight: "600",
        })}
      >
        <Tab.Item>Passados</Tab.Item>

        <Tab.Item>Activos</Tab.Item>
      </Tab>

      <FlatList
        data={myEvents}
        keyExtractor={(item) => item?.uuid}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("manageEvent", item)}
            >
              <BigCard2 {...item} />
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={<View style={{ marginBottom: 50 }} />}
      />
    </View>
  );
};

export default MyEvents;

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
