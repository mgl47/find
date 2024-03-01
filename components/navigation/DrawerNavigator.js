import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import EventScreen from "../../screens/EventScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import {
  Avatar,
  Caption,
  Paragraph,
  Switch,
  Title,
  TouchableRipple,
} from "react-native-paper";
import StackNavigator from "./StackNavigator";
export const Drawer = createDrawerNavigator();

export function DrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      {/* <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Avatar.Image
            source={{
              uri: "https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg",
            }}
            size={50}
          />
          <Title style={styles.title}>Dawid Urbaniak</Title>
          <Caption style={styles.caption}>@trensik</Caption>
          <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                202
              </Paragraph>
              <Caption style={styles.caption}>Following</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                159
              </Paragraph>
              <Caption style={styles.caption}>Followers</Caption>
            </View>
          </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="account-outline"
                color={color}
                size={size}
              />
            )}
            label="Profile"
            onPress={() => {}}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="tune" color={color} size={size} />
            )}
            label="Preferences"
            onPress={() => {}}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="bookmark-outline"
                color={color}
                size={size}
              />
            )}
            label="Bookmarks"
            onPress={() => {}}
          />
        </Drawer.Section>
        <Drawer.Section title="Preferences">
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={false} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <Text>RTL</Text>
              <View pointerEvents="none">
                <Switch value={false} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </View> */}
      <Text>fdassfdvsafs</Text>
    </DrawerContentScrollView>
  );
}
const sideMenuDisabledScreens = ["event"];

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerIcon: () => (
          <Image
            source={{
              uri: "https://i0.wp.com/techweez.com/wp-content/uploads/2022/03/vivo-lowlight-selfie-1-scaled.jpg?fit=2560%2C1920&ssl=1",
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
              // marginLeft: 20,
              // position: "absolute",
            }}
            // resizeMode="contain"
          />
        ),
      }}
      drawerContent={() => <DrawerContent />}
    >
      <Drawer.Screen
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "Login";
          if (sideMenuDisabledScreens.includes(routeName))
            return { swipeEnabled: false };
        }}
        name="Event"
        component={StackNavigator}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({});
