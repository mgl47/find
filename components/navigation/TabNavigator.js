import React from "react";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import HomeScreen from "../../screens/HomeScreens/HomeScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Appbar, Avatar } from "react-native-paper";
import NotificationScreen from "../../screens/NotificationScreen";
import ChatsScreen from "../../screens/ChatsScreen";
import colors from "../colors";
import { Dimensions, Platform } from "react-native";
import { useAuth } from "../hooks/useAuth";
// import StackNavigator from "./StackNavigator";

const Tab = createMaterialBottomTabNavigator();
const isIPhoneWithNotch =
Platform.OS === 'ios' &&
(Dimensions.get('window').height === 852 ||Dimensions.get('window').height === 844 ||Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896||Dimensions.get('window').height === 926||Dimensions.get('window').height === 932 );

const TabNavigator = () => {
  const { AuthModalUp } = useAuth();
  return (
    <Tab.Navigator
      keyboardHidesNavigationBar={true}
      // activeColor="#f0edf6"

      initialRouteName="Home"
      // inactiveColor="#3e2465"
      barStyle={{
        backgroundColor: colors.white,
        borderTopWidth: 0.2,
        borderColor: colors.grey,
        // marginBottom: Platform.OS == "ios" ? -30 : -10,
        marginBottom:isIPhoneWithNotch?-33:-13,
        display: AuthModalUp ? "none" : "flex",
        //         marginBottom: -10,
      }}
      backBehavior="initialRoute"
      shifting={true}
      sceneAnimationEnabled={false}
      activeColor={colors.primary2}
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
