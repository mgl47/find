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
import { useAuth } from "../../../components/hooks/useAuth";
import axios from "axios";
import { useData } from "../../../components/hooks/useData";

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
  const { getMyEvents, myEvents, headerToken, user } = useAuth();
  const { apiUrl } = useData();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const selectedEvent = myEvents?.filter(
    (myEvent) => myEvent?._id == item?._id
  )[0];
  const attendeesId = selectedEvent?.attendees?.map((item) => item?.uuid);

  const scanQr = async (item) => {
    if (scanned) return;
    setScanned(true);
    const ticketUser = selectedEvent?.attendees?.filter(
      (attendee) => attendee?.uuid == item?.data
    )[0];

    if (attendeesId?.includes(item.data)) {
      checkIn(ticketUser);
      console.log("Valid Ticket");
    } else {
      console.log("Invalid Ticket");
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setScanned(false);
    // navigation.goBack();
  };

  const checkIn = async (ticketUser) => {
    const result = await axios.patch(
      `${apiUrl}/user/event/${selectedEvent?._id}`,

      {
        operation: {
          type: "eventAttendees",
          task: "checkIn",
          eventId: selectedEvent?._id,
        },
        updates: {
          ticketUser,
        },
      },

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: headerToken,
        },
      }
    );
    console.log(result?.status);
  };

  // console.log(attendeesId);
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

  useEffect(() => {
    getMyEvents();

  }, [])
  
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
