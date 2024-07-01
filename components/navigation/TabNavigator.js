import React from "react";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import HomeScreen from "../../screens/HomeScreens/HomeScreen";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Appbar, Avatar } from "react-native-paper";
import colors, { darkColors } from "../colors";
import { Dimensions, Platform } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useDesign } from "../hooks/useDesign";
import ExploreScreens from "../../screens/HomeScreens/ExploreScreens/ExploreScreens";
import NotificationScreen from "../../screens/NotificationScreens/NotificationScreen";
import ChatsScreen from "../../screens/ChatScreens/ChatsScreen";
// import StackNavigator from "./StackNavigator";

const Tab = createMaterialBottomTabNavigator();

const TabNavigator = () => {
  const { AuthModalUp, authSheetRef, user } = useAuth();
  const { isIPhoneWithNotch } = useDesign();
  return (
    <Tab.Navigator
      keyboardHidesNavigationBar={true}
      // activeColor="#f0edf6"

      initialRouteName="início"
      // inactiveColor="#3e2465"
      barStyle={{
        // backgroundColor: colors.background,
        backgroundColor: "rgba(1,1,1,0.03)",
        // borderTopWidth: 0.17,
        // borderColor: colors.black2,
        // marginBottom: Platform.OS == "ios" ? -30 : -10,
        marginBottom: isIPhoneWithNotch ? -33 : -13,
        // display: AuthModalUp ? "none" : "flex",

        //         marginBottom: -10,
      }}
      backBehavior="initialRoute"
      shifting={true}
      sceneAnimationEnabled={false}
      // activeColor={colors.primary2}
      // inactiveColor={colors.t5}
      activeIndicatorStyle={{ backgroundColor: "transparent" }}
      screenOptions={{}}
    >
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              name={focused ? "message-text" : "message-text-outline"}
              size={24}
              // color={color}

              color={
                // !user ? colors.darkGrey: focused ? colors.t2 : colors.t4
                focused ? colors.t2 : colors.t4
              }
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              authSheetRef?.current?.present();
            }
          },
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
              color={focused ? colors.t2 : colors.t4}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notificações"
        // name="Explorar"
        component={NotificationScreen}
        // component={ExploreScreens}
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              name={focused ? "bell" : "bell-outline"}
              size={24}
              color={focused ? colors.t2 : colors.t4}
            />
            // <MaterialIcons
            //   name="manage-search"
            //   size={30}
            //   color={focused ? colors.primary : colors.t5}
            // />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              authSheetRef?.current?.present();
            }
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
