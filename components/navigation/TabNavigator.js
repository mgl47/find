import React from "react";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import HomeScreen from "../../screens/HomeScreens/HomeScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Appbar, Avatar } from "react-native-paper";
import NotificationScreen from "../../screens/NotificationScreen";
import ChatsScreen from "../../screens/ChatsScreen";
import colors, { darkColors } from "../colors";
import { Dimensions, Platform } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useDesign } from "../hooks/useDesign";
// import StackNavigator from "./StackNavigator";

const Tab = createMaterialBottomTabNavigator();

const TabNavigator = () => {
  const { AuthModalUp } = useAuth();
  const  {isIPhoneWithNotch}=useDesign()
  return (
    <Tab.Navigator
      keyboardHidesNavigationBar={true}
      // activeColor="#f0edf6"

      initialRouteName="início"
      // inactiveColor="#3e2465"
      barStyle={{
        backgroundColor: colors.background,
        borderTopWidth: 0.17,
        borderColor: colors.black2,
        // marginBottom: Platform.OS == "ios" ? -30 : -10,
        marginBottom: isIPhoneWithNotch ? -33 : -13,
        // display: AuthModalUp ? "none" : "flex",

        //         marginBottom: -10,
      }}
      backBehavior="initialRoute"
      shifting={true}
      sceneAnimationEnabled={false}
      activeColor={colors.primary2}
      inactiveColor={colors.t5}
      activeIndicatorStyle={{ backgroundColor: "transparent" }}
      screenOptions={{}}
    >
      <Tab.Screen
        name="Canais"
        component={ChatsScreen}
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              name={focused ? "message-text" : "message-text-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="início"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notificações"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              name={focused ? "bell" : "bell-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
