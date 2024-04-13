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

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
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

      // getOneEvent
      // console.log(result?.data);
      return result?.data;
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
  };
  const getVenues = async () => {
    try {
      const result = await axios.get(`${apiUrl}/venues/`);
      // console.log(result?.data);
      setVenues(result?.data);
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
  };

  useEffect(() => {
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
    }),
    [events, venues]
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
