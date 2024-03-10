import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import {
  MaterialCommunityIcons,
  Octicons,
  Entypo,
  Ionicons,
} from "@expo/vector-icons";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
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
import Screen from "../Screen";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import colors from "../colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../hooks/useAuth";

export const Drawer = createDrawerNavigator();

export function DrawerContent(props) {
  const { user, setUser } = useAuth();
  const navigation = useNavigation();

  return (
    <Screen style={{ backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image
          source={{
            uri: "https://i0.wp.com/techweez.com/wp-content/uploads/2022/03/vivo-lowlight-selfie-1-scaled.jpg?fit=2560%2C1920&ssl=1",
          }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 50,
            marginLeft: 20,
            //   marginTop: 5,
            // position: "absolute",
          }}
        />
        <TouchableOpacity style={{ marginRight: 20 }}>
          {/* <MaterialCommunityIcons name="logout" size={25} color="black" /> */}
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          marginLeft: 20,
          marginLeft: 20,
          marginTop: 10,
          paddingBottom: 5,
        }}
      >
        Erickson
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "400",
          marginLeft: 20, // marginTop: 10,
          // paddingBottom: 5,
        }}
      >
        @veiga.erickson
      </Text>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          paddingTop: 5,
          backgroundColor: colors.background,
        }}
      >
        <DrawerItem
          style={{}}
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="account-outline"
              color={colors.black}
              size={33}
            />
          )}
          label="Perfil"
          labelStyle={{
            fontSize: 18,
            fontWeight: "500",
            right: 20,
            color: colors.black,
          }}
          onPress={() => navigation.navigate("profile")}
        />
        {/* <View style={styles.separator} /> */}
        <DrawerItem
          style={{ left: 2 }}
          icon={({ color, size }) => (
            <Ionicons name="ticket-outline" size={30} color={colors.black} />
          )}
          label="Meus Bilhetes"
          labelStyle={{
            fontSize: 18,
            fontWeight: "500",
            right: 20,
            color: colors.black,
          }}
          onPress={() => {}}
        />
        {/* <View style={styles.separator} /> */}
        <DrawerItem
          style={{}}
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-heart"
              color={colors.black}
              size={35}
            />
          )}
          label="Interessado"
          labelStyle={{
            fontSize: 18,
            fontWeight: "500",
            right: 20,
            color: colors.black,
          }}
          onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
        />

        <DrawerItem
          style={{ left: 2 }}
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="logout"
              size={33}
              color={colors.black}
            />
          )}
          label="Sair"
          labelStyle={{
            fontSize: 18,
            fontWeight: "500",
            right: 20,
            color: colors.black,
          }}
          onPress={() => {
            Alert.alert(
              "Terminar Sessão",
              "Tem certeza que deseja terminar a sua sessão?",
              [
                { text: "Não", onPress: () => null },
                {
                  style: "destructive",
                  text: "Sim",

                  onPress: async () => {
                    try {
                      await AsyncStorage.removeItem("user");
                      setUser(null);
                      navigation.dispatch(DrawerActions.closeDrawer());
                    } catch (e) {
                      console.log(e);
                    }
                  },
                },
              ]
            );
          }}
        />
      </DrawerContentScrollView>
    </Screen>
  );
}
const sideMenuDisabledScreens = ["home", "notification", "chats"];

const DrawerNavigator = () => {
  const { user } = useAuth();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: "front",
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
          if (!sideMenuDisabledScreens.includes(routeName) || !user)
            return { swipeEnabled: false };
        }}
        name="Event"
        component={StackNavigator}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({
  separator: { width: "95%", height: 1, backgroundColor: colors.grey },
});
