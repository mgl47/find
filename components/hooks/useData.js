import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import SignInScreen from "../../screens/authScreens/SignInScreen";
import SignUpScreen from "../../screens/authScreens/SignUpScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Animated, { SlideInDown } from "react-native-reanimated";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import colors from "../colors";
import Screen from "../Screen2";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useAuth } from "./useAuth";
import { doc, getDoc } from "firebase/firestore";
import {db} from "../../firebase"
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [calDays, setCalDays] = useState([]);
  //   const [headerToken, setHeaderToken] = useState("");
  const { headerToken } = useAuth();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const getEvents = async () => {
    const result = await axios.get(`${apiUrl}/events/`);
    // console.log(result?.data);
    setEvents(result?.data);
  };

  const getOneEvent = async (eventId) => {
    try {
      const result = await axios.get(
        `${apiUrl}/user/event/one/?eventId=${eventId}`,
        {
          headers: {
            Authorization: headerToken,
          },
        }
      );

      return result?.data;
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
  };
  const getVenues = async () => {
    try {
      const result = await axios.get(`${apiUrl}/venues/`);

      setVenues(result?.data);
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
  };
  const getCalendarDates = async () => {
    const docRef = doc(db, "Data", "activeDays");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data()?.calendar);
      setCalDays(docSnap.data()?.calendar);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getCalendarDates();

    getEvents();
    getVenues();
  }, []);
  function formatNumber(number) {
    if (typeof number !== "number" && typeof number !== "string") {
      return "";
    }

    const stringNumber = number
      .toString()
      ?.replace(/,/g, "")
      ?.replace(/\./g, "");
    const parts = stringNumber.split(".");
    parts[0] = parts[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (parts[1]) {
      return parts.join(".");
    } else {
      return parts[0];
    }
  }

  // const venues2 = memo(() => {

  // }, [is_wishlist]);
  const memoedValue = useMemo(
    () => ({
      events,
      getEvents,
      apiUrl,
      venues,
      formatNumber,
      getOneEvent,
      calDays
    }),
    [events, venues,calDays]
  );

  return (
    <DataContext.Provider value={memoedValue}>{children}</DataContext.Provider>
  );
};

export default DataContext;

export function useData() {
  const context = useContext(DataContext);

  return context;
}

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
});
