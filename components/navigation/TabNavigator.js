import React from "react";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import HomeScreen from "../../screens/HomeScreens/HomeScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Appbar, Avatar } from "react-native-paper";
import NotificationScreen from "../../screens/NotificationScreen";
import ChatsScreen from "../../screens/ChatsScreen";
import colors from "../colors";
import { Platform } from "react-native";
// import StackNavigator from "./StackNavigator";

const Tab = createMaterialBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      keyboardHidesNavigationBar={true}
      // activeColor="#f0edf6"
      initialRouteName="Home"
      // inactiveColor="#3e2465"
      barStyle={{
        backgroundColor: "white",
        borderTopWidth: 0.2,
        borderColor: colors.grey,
        marginBottom: Platform.OS == "ios" ? -30 : -10,
        //         marginBottom: -10,
      }}
      backBehavior="initialRoute"
      shifting={true}
      sceneAnimationEnabled={false}
      activeColor={colors.primary}
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
        name="Home"
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
        name="Notifications"
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
