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



import colors from "../colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const authSheetRef = useRef(null);

  const [headerToken, setHeaderToken] = useState("");

  const getUser = async () => {
    try {
      const tokenValue = await AsyncStorage.getItem("headerToken");
      const userValue = await AsyncStorage.getItem("user");
      if (tokenValue !== null) {
        setUser(JSON.parse(userValue));
        setHeaderToken(tokenValue);
        // getUpdatedUserInfo(tokenValue);
        getUpdatedUserInfo();

        // console.log(tokenValue);
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getUser();
  }, []);

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

        // console.log(response.data);

        setUser(response.data);
        const jsonValue = JSON.stringify(response.data);
        await AsyncStorage.setItem("user", jsonValue);
      }
    } catch (error) {
      console.log(error.response.data);

      console.log(error);
    }
  };

  const signIn = async () => {
    Keyboard.dismiss();

    await new Promise((resolve, reject) => {
      setTimeout(resolve, 1500);
    });
    try {
      if (validated) {
        const response = await axios.post(
          `${url}/auth/login`,
          {
            username: user?.username,
            password: user?.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setUser(response.data.user);

        await AsyncStorage.setItem(
          "headerToken",
          "Bearer " + response.data.token
        );
        const jsonValue = JSON.stringify(response.data.user);
        await AsyncStorage.setItem("user", jsonValue);
        // JSON.parse(jsonValue);
      }
    } catch (error) {}
  };
  const [AuthModalUp, setAuthModalUp] = useState(false);

  const memoedValue = useMemo(
    () => ({
      headerToken,
      user,
      setUser,
      authLoading,
      setAuthModalUp,
      AuthModalUp,
      authSheetRef,
      setHeaderToken,
      getUpdatedUserInfo,
    }),
    [headerToken, user, authLoading, AuthModalUp, authSheetRef]
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
