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
      // await getUpdatedUserInfo(userValue, tokenValue);

      console.log("before uppdate");
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    if (!cacheChecked) {
      getUser();
    }
    if (cacheChecked && user) {
      getUpdatedUserInfo();
    }
  }, [cacheChecked]);

  const getUpdatedUserInfo = async () => {
    try {
      if (headerToken) {
        const response = await axios.get(
          `${apiUrl}/user/current/${user?._id}`,
          {
            headers: {
              Authorization: headerToken,
            },
          }
        );

        setUser(response.data);

        const jsonValue = JSON.stringify(response.data);
        await AsyncStorage.setItem("user", jsonValue);

        getMyEvents();
      }
    } catch (error) {
      console.log(error.response.data);

      console.log(error);
    }
  };

  const getMyEvents = async () => {
    console.log("my events fetched");
    try {

    
    const result = await axios.get(`${apiUrl}/user/event/`, {
      headers: {
        Authorization: headerToken,
      },
    });
    setMyEvents(result?.data);
      
    } catch (error) {
      console.log(error);
    }
  };
  const [AuthModalUp, setAuthModalUp] = useState(false);
  const logOut = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("headerToken");
    setUser(null);
    setMyEvents([]);
    setHeaderToken(null);
    navigation.dispatch(DrawerActions.closeDrawer());
  };
  const memoedValue = useMemo(
    () => ({
      headerToken,
      user,
      myEvents,
      setUser,
      getMyEvents,
      AuthModalUp,
      setAuthModalUp,
      authSheetRef,
      setHeaderToken,
      getUpdatedUserInfo,
      logOut,
    }),
    [headerToken, user, myEvents, AuthModalUp, authSheetRef]
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
