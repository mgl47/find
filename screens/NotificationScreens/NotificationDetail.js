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
  ImageBackground,
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
import { Feather, FontAwesome6 } from "@expo/vector-icons";

import { useAuth } from "../../components/hooks/useAuth";
import { useData } from "../../components/hooks/useData";

import { LinearGradient } from "expo-linear-gradient";
import { useDesign } from "../../components/hooks/useDesign";
const NotificationDetail = ({ navigation, navigation: { goBack }, route }) => {
  const { user } = useAuth();
  const { events } = useData();
  const { height, width } = useDesign();
  const bottomSheetModalRef = useRef(null);

  const notification = route.params;

  //   useLayoutEffect(() => {
  //     navigation.setOptions({
  //       headerRight: () => (
  //         <View style={{ flexDirection: "row", alignItems: "center" }}>
  //           {selectedEvent?.store?.length > 0 && (
  //             <TouchableOpacity
  //               style={{
  //                 right: 35,
  //               }}
  //               onPress={handleStoreSheet}
  //             >
  //               <FontAwesome6 name="shop" size={22} color={colors.white} />
  //             </TouchableOpacity>
  //           )}
  //           <TouchableOpacity
  //             style={{ right: 20 }}
  //             onPress={handlePresentModalPress}
  //           >
  //             <Feather name="info" size={24} color={colors.lightGrey} />
  //           </TouchableOpacity>
  //         </View>
  //       ),
  //     });
  //   }, [navigation]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <LinearGradient
        // colors={["#00000000", "#000000"]}
        colors={[
          colors.background,
          colors.background,
          "rgba(0,0,0,0.6)",
          "rgba(0,0,0,0.6)",

          "rgba(0,0,0,0.6)",
          "rgba(0,0,0,0.6)",
          "rgba(0,0,0,0.6)",
          "rgba(0,0,0,0.6)",
          "rgba(0,0,0,0.6)",
        ]}
        style={{
          height,
          width,
          position: "absolute",
          bottom: 0,
          alignItems: "baseline",
        }}
      />
      <Text
        style={{
          color: colors.t3,
          fontSize: 20,
          fontWeight: "600",
        //   marginTop: 10,
          //   marginLeft: 40,
        }}
      >
        {notification?.title}
      </Text>
      <Text
        style={{
          color: colors.t4,
          fontSize: 17,
          fontWeight: "400",
          marginTop: 10,
          //   marginLeft: 40,
        }}
      >
        {notification?.message}
      </Text>
      <Text
        style={{
          color: colors.t3,
          fontSize: 15,
          fontWeight: "400",
          marginTop: 30,

          //   marginLeft: 40,
        }}
      >
        {"\u2B24  " + notification?.prize}
      </Text>
    </View>
  );
};

export default NotificationDetail;

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
