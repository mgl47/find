import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import colors from "../colors";
import Screen from "../Screen2";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();
const Tab = createMaterialTopTabNavigator();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [headerToken, setHeaderToken] = useState("");

  const getUser = async () => {
    try {
      const tokenValue = await AsyncStorage.getItem("headerToken");
      const userValue = await AsyncStorage.getItem("user");
      if (tokenValue !== null) {
        setUser(JSON.parse(userValue));
        setHeaderToken(tokenValue);
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const memoedValue = useMemo(
    () => ({
      headerToken,
      user,
      setUser: setUser,
      authLoading,
    }),
    [, user, authLoading]
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
