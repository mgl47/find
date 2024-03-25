// import {
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   Modal,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableHighlight,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import React, { useEffect, useLayoutEffect, useState } from "react";
// import colors from "../../../components/colors";
// import {
//   MaterialCommunityIcons,
//   MaterialIcons,
//   Entypo,
//   AntDesign,
//   Fontisto,
//   Feather,
//   Foundation,
//   Ionicons,
// } from "@expo/vector-icons";

// import { artist as arti } from "../../../components/Data/artist";
// import { useAuth } from "../../../components/hooks/useAuth";
// import { useData } from "../../../components/hooks/useData";

// import uuid from "react-native-uuid";
// import { Tab, Text as Text2, TabView } from "@rneui/themed";
// import BigTicket from "../../../components/tickets/BigTicket";
// import { useDesign } from "../../../components/hooks/useDesign";
// import QRCode from "react-native-qrcode-svg";
// import { ActivityIndicator } from "react-native-paper";

// const EventManagingScreen = ({ navigation, navigation: { goBack }, route }) => {
//   const uuidKey = uuid.v4();
//   const item = route.params;
//   const [index, setIndex] = useState(1);
//   const { user, myEvents } = useAuth();
//   const { height, width } = useDesign();
//   const [loading, setLoading] = useState(false);
//   const [event, setEvent] = useState("");

//   // const asd = myEvents?.filter((myEvent) => myEvent?._id == item?._id);
//   const getSelectedEvent = async () => {
//     setLoading(true);
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     setEvent(myEvents?.filter((myEvent) => myEvent?._id == item?._id)[0]);

//     setLoading(false);
//   };
//   useEffect(() => {
//     getSelectedEvent();
//   }, []);

//   // useEffect(() => {
//   //   navigation.setOptions({
//   //     headerTitle: () => item?.title,
//   //   });
//   // }, []);

//   console.log(item?.title);
//   return (
//     <View style={{ backgroundColor: colors.background }}>
//       {loading && (
//         <ActivityIndicator
//           style={{ top: 10, position: "absolute", alignSelf: "center" }}
//           color={colors.primary}
//         />
//       )}

//       <View style={{ padding: 10 }}>
//         <Text
//           style={{
//             fontSize: 20,
//             fontWeight: "600",
//             color: colors.primary,
//             alignSelf: "center",
//             // marginVertical: 10,
//           }}
//         >
//           {event?.title}
//         </Text>
//         {/* <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             marginBottom: 10,
//           }}
//         >
//           <MaterialCommunityIcons
//             name="calendar-month"
//             size={25}
//             color={colors.darkSeparator}
//           />
//           <Text
//             style={{
//               fontSize: 17,
//               fontWeight: "600",
//               // width: "80%",
//               color: colors.darkSeparator,
//               marginLeft: 10,
//             }}
//           >
//             {event?.dates[event?.dates?.length - 1]
//               ?.displayDate +
//               " - " +
//               event?.dates[event?.dates?.length - 1]?.hour}
//           </Text>
//         </View> */}
//       </View>

//       <Text
//         style={{
//           fontSize: 20,
//           fontWeight: "600",
//           color: colors.primary,
//           alignSelf: "flex-start",
//           marginLeft: 20,
//           marginVertical: 20,
//         }}
//       >
//         {/* {ticket?.buyer?.displayName} */}
//       </Text>
//     </View>
//   );
// };

// export default EventManagingScreen;

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//     flex: 1,
//     bottom: 50,
//     backgroundColor: colors.background,
//   },
//   headerContainer: {
//     position: "absolute",
//     zIndex: 1,
//     height: 40,
//     width: "100%",
//     // backgroundColor: colors.white,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   back: {
//     marginLeft: 15,
//     top: 40,
//   },
//   share_like: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     top: 40,
//     marginRight: 20,
//   },
//   share: {
//     marginRight: 10,
//   },
//   separator: {
//     width: "100%",
//     height: 1,
//     backgroundColor: colors.grey,
//     marginVertical: 5,
//     alignSelf: "center",
//   },
//   more: {
//     position: "absolute",

//     backgroundColor: colors.background,
//     color: colors.primary,
//     alignSelf: "flex-end",
//     fontWeight: "500",
//     // marginBottom: 5,
//     right: -7,
//     bottom: -10,

//     zIndex: 1,
//   },

//   modalContainer: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: colors.background,
//     // bottom:10,
//   },
// });

import {
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  MaterialCommunityIcons,
  FontAwesome5,
  Entypo,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import colors from "../../../components/colors";
import Animated, {
  SlideInDown,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";

import { recommendedEvents } from "../../../components/Data/stockEvents";
import Overview from "./Overview";
import Attendees from "./Attendees";
import Staff from "./Staff";
import Screen from "../../../components/Screen";
import { Camera } from "expo-camera";

const Tab = createMaterialTopTabNavigator();

const EventManagingScreen = ({
  navigation,
  navigation: { goBack, canGoBack },
  route,
}) => {
  const item = route.params;
  const [hasPermission, setHasPermission] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanned, setScanned] = useState(false);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  const scanQr = async (item) => {
    if (scanned) return;
    console.log(item?.data);
    // navigation.goBack();
    setScanned(true);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ right: 20 }}
          onPress={() => setShowScanModal(true)}
        >
          <MaterialCommunityIcons
            name="qrcode-scan"
            size={24}
            color={colors.white}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]); // Add inputRef as dependency if used

  return (
    <>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: colors.primary,

            tabBarInactiveTintColor: colors.darkGrey,
            tabBarIndicatorContainerStyle: {
              backgroundColor: colors.primary2,
            },
            tabBarIndicatorStyle: {
              backgroundColor: colors.white,
              // bottom: 2,
              height: 4,
            },
            tabBarLabelStyle: (active) => ({
              color: active ? colors.white : colors.lightGrey,
            }),
          }}
        >
          <Tab.Screen
            initialParams={item}
            options={{
              tabBarLabelStyle: {
                fontWeight: "600",
                fontSize: 13,
                color: colors.white,
              },
            }}
            name="Overview"
            component={Overview}
          />

          <Tab.Screen
            initialParams={item}
            options={{
              tabBarLabelStyle: {
                fontWeight: "600",
                fontSize: 13,
                color: colors.white,
              },
            }}
            name="Attendees"
            component={Attendees}
          />
          <Tab.Screen
            initialParams={item}
            options={{
              tabBarLabelStyle: {
                fontWeight: "600",
                fontSize: 13,
                color: colors.white,
              },
            }}
            name="Staff"
            component={Staff}
          />
        </Tab.Navigator>
      </View>
      <Modal
        presentationStyle="formSheet"
        animationType="slide"
        visible={showScanModal}
        onRequestClose={() => setShowScanModal(false)}
      >
        <Screen style={{ backgroundColor: colors.primary }}>
          <View
            style={{
              flexDirection: "row",
              // backgroundColor: "red",
              height: 40,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              //  backgroundColor: "red"
            }}
          >
            <Text
              style={{
                // position: "absolute",
                alignSelf: "center",
                fontSize: 22,
                // left:1,
                color: colors.white,

                fontWeight: "500",
              }}
            >
              Validar
            </Text>
            {/* <FontAwesome5 name="user-circle" size={40} color={colors.black2} /> */}
            <TouchableOpacity
              onPress={() => setShowScanModal(false)}
              style={{ padding: 10, right: 5, position: "absolute" }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
          <Camera
            style={{
              height: 450,
              width: "100%",
              // marginTop: 50,
              alignItems: "center",
              justifyContent: "center",
              // shadowOffset: { width: 0.5, height: 0.5 },
              // shadowOpacity: 0.3,
              // shadowRadius: 1,
              // elevation: 2,
            }}
            onBarCodeScanned={scanQr}
            type={"back"}
            autoFocus={true}


            // barCodeScannerSettings={{
            //   barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            // }}
          >
            {/* <View style={styles.buttonContainer}> */}
            <SimpleLineIcons
              style={{ alignSelf: "center" }}
              name="frame"
              size={280}
              color={colors.white}
            />
            {/* </View> */}
          </Camera>
          <View
            style={{
              backgroundColor: colors.white,
              // height: "95%",
              marginTop: 20,
              width: "95%",
              alignSelf: "center",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: colors.white,
                height: 200,
                width: "95%",
                alignSelf: "center",
                borderRadius: 10,
              }}
            ></View>
          </View>
        </Screen>
      </Modal>
    </>
  );
};

export default EventManagingScreen;

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    backgroundColor: colors.white,

    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 40,
    borderBottomWidth: 0.2,
    borderColor: colors.grey,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.3,
    // shadowRadius: -3,
    // elevation: 2
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
  },
  search: {
    height: 37,
    width: "90%",
    backgroundColor: colors.background,
    borderRadius: 30,
    paddingLeft: 35,
    paddingRight: 30,
  },
  headerText: {
    fontSize: 19,
    fontWeight: "500",
    // padding: 5,
    zIndex: 2,
    left: 20,
    marginVertical: 10,
  },
});
