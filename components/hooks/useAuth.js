import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SignInScreen from "../../screens/authScreens/SignInScreen";
import SignUpScreen from "../../screens/authScreens/SignUpScreen";
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

  const AuthBottomSheet = ({ Event, bottomSheetModalRef, setAuthModalUp }) => {
    const snapPoints = useMemo(() => ["25%", "50%"], []);

    // const[purch aseModalUp,setAuthModalUp]=useState(false)

    const handleSheetChanges = useCallback((index) => {
      console.log("handleSheetChanges", index);
    }, []);
    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          onDismiss={() => {
            setAuthModalUp(false);
          }}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Screen
              style={{
                backgroundColor: colors.white,
                flex: 0,
              }}
            ></Screen>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: colors.white,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",

                height: 50,

                // padding: 5,
                // marginBottom: 10,
              }}
            >
              {/* <Text
                    style={{
                      // position: "absolute",
                      alignSelf: "center",
                      fontSize: 22,
                      // left:1,
                      color:colors.primary,
      
                      fontWeight: "500",
                    }}
                  >
                    Conta
                  </Text> */}
              <FontAwesome5
                name="user-circle"
                size={40}
                color={colors.black2}
              />
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={{ padding: 10, right: 5, position: "absolute" }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
            <Tab.Navigator
              screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.darkGrey,
                tabBarIndicatorContainerStyle: {
                  backgroundColor: colors.background,
                },
                tabBarLabelStyle: {
                  fontWeight: "600",
                  fontSize: 14,
                  color: colors.black2,
                },
                tabBarIndicatorStyle: {
                  width: "40%",
                  left: "5%",
                },
              }}
            >
              <Tab.Screen name="Entrar" component={SignInScreen} />
              <Tab.Screen name="Criar Conta" component={SignUpScreen} />
            </Tab.Navigator>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  };

  const memoedValue = useMemo(
    () => ({
      AuthBottomSheet,
      headerToken,
      user,
      setUser: setUser,
      authLoading,
      setAuthLoading,
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
