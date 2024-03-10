import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useMemo } from "react";

import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import SignInScreen from "../../screens/authScreens/SignInScreen";
import SignUpScreen from "../../screens/authScreens/SignUpScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import colors from "../../components/colors";
import Animated, { SlideInDown } from "react-native-reanimated";
const Tab = createMaterialTopTabNavigator();

const AuthScreens = () => {
  return (
    <Animated.View
    style={{flex:1}}
    entering={SlideInDown}
    >

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
            backgroundColor:colors.primary

          },
        }}
      >
        <Tab.Screen name="Entrar" component={SignInScreen} />
        <Tab.Screen name="Criar Conta" component={SignUpScreen} />
      </Tab.Navigator>
    </Animated.View>
  );
};

export default AuthScreens;

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
