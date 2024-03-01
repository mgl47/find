import React from "react";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import HomeScreen from "../../screens/HomeScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const Tab = createMaterialBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: (color, focused) =>
            focused ? (
              <MaterialCommunityIcons name="home" size={24} color={color} />
            ) : (
              <MaterialCommunityIcons
                name="home-outline"
                size={24}
                color={color}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused, size }) =>
            focused ? (
              <MaterialCommunityIcons name="account" size={24} color={color} />
            ) : (
              <MaterialCommunityIcons
                name="account-outline"
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
