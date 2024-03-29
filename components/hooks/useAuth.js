import {
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
import { useNavigation, DrawerActions } from "@react-navigation/native";

import colors from "../colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const authSheetRef = useRef(null);

  const [headerToken, setHeaderToken] = useState("");
  const [myEvents, setMyEvents] = useState([]);
  const [myTickets, setMyTickets] = useState([]);

  const [cacheChecked, setCacheChecked] = useState(false);
  const getUser = async () => {
    try {
      const tokenValue = await AsyncStorage.getItem("headerToken");
      const userValue = await AsyncStorage.getItem("user");
      if (tokenValue !== null) {
        setUser(JSON.parse(userValue));
        setHeaderToken(tokenValue);
      }

      setCacheChecked(true);

      console.log("before uppdate");
    } catch (e) {}
  };

  useEffect(() => {
    if (!cacheChecked) {
      getUser();
    }
    if (cacheChecked && user) {
      getUpdatedUser();
    }
  }, [cacheChecked]);

  const getUpdatedUser = async (id,token) => {

    try {
      // if (headerToken) {
        const response = await axios.get(
          `${apiUrl}/user/current/${id??user?._id}`,
          {
            headers: {
              Authorization:token?? headerToken,
            },
          }
        );

        setMyEvents(response?.data?.events);
        setMyTickets(response?.data?.tickets);
        setUser(response?.data?.user);

        const jsonValue = JSON.stringify(response.data?.user);
        await AsyncStorage.setItem("user", jsonValue);
      // }
    } catch (error) {
      console.log(error?.response?.data?.msg);

    }
  };

  const [AuthModalUp, setAuthModalUp] = useState(false);
  const logOut = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("headerToken");
    setCacheChecked(false);

    setMyEvents([]);
    setMyTickets([]);
    setHeaderToken(null);
    setUser(null);

    navigation.dispatch(DrawerActions.closeDrawer());
  };
  const memoedValue = useMemo(
    () => ({
      headerToken,
      user,
      myEvents,
      myTickets,
      setUser,
      AuthModalUp,
      setAuthModalUp,
      authSheetRef,
      setHeaderToken,
      getUpdatedUser,
      logOut,
    }),
    [headerToken, user, AuthModalUp, authSheetRef]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;

export function useAuth() {
  const context = useContext(AuthContext);

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
