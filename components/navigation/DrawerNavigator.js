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
  MaterialIcons,
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
import { useData } from "../hooks/useData";

export const Drawer = createDrawerNavigator();

export function DrawerContent(props) {
  const { user, setUser } = useAuth();
  const { formatNumber } = useData();
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
        {user?.photos?.avatar[0]?.uri? (
          <Image
            source={{
              uri: user?.photos?.avatar[0]?.uri,
            }}
            style={{
              width: 55,
              height: 55,
              borderRadius: 50,
              marginLeft: 20,
              //   marginTop: 5,
              // position: "absolute",
            }}
          />
        ) : (
          <MaterialCommunityIcons
            style={{
              marginLeft: 20,
              //   marginTop: 5,
              // position: "absolute",
            }}
            name="account-circle"
            size={50}
            color={colors.t3}
          />
        )}
        <TouchableOpacity style={{ marginRight: 20 }}>
          {/* <MaterialCommunityIcons name="logout" size={25} color="white" /> */}
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          marginLeft: 20,
          marginLeft: 20,
          marginTop: 10,
          paddingBottom: 2,
          color: colors.white,
        }}
      >
        {user?.displayName || "Nome"}
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "400",
          marginLeft: 20, // marginTop: 10,
          color: colors.t4,

          // paddingBottom: 5,
        }}
      >
        @{user?.username}
      </Text>
      <View
        style={[styles.separator, { marginTop: 10, width: "100%", right: 0 }]}
      />
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          paddingTop: 5,
          width: "100%",
          backgroundColor: colors.background,
        }}
      >
        <DrawerItem
          style={{}}
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="account-outline"
              color={colors.t2}
              size={30}
            />
          )}
          label="Perfil"
          labelStyle={{
            fontSize: 16,
            fontWeight: "500",
            right: 20,
            color: colors.t4,
          }}
          onPress={() => navigation.navigate("profile")}
        />
        <DrawerItem
          style={{ width: "100%" }}
          icon={({ color, size }) => (
            // <MaterialCommunityIcons
            //   name="account-outline"
            //   color={colors.t2}
            //   size={30}
            // />
            <Image
              style={{ height: 30, width: 30 }}
              source={require("../../assets/coin.png")}
            />
          )}
          label={`Carteira: cve ${formatNumber(user?.balance?.amount) || 0}`}
          labelStyle={{
            fontSize: 16,
            fontWeight: "500",
            right: 20,
            color: colors.t4,
          }}
          onPress={() => navigation.navigate("profile")}
        />
        <View style={styles.separator} />
        <DrawerItem
          style={{ left: 2 }}
          icon={({ color, size }) => (
            <MaterialIcons name="event-note" size={28} color={colors.t2} />
          )}
          label="Meus Eventos"
          labelStyle={{
            fontSize: 16,
            fontWeight: "500",
            right: 20,
            color: colors.t4,
          }}
          onPress={() => navigation.navigate("myEvents")}
        />
        <DrawerItem
          style={{ left: 2 }}
          icon={({ color, size }) => (
            <Ionicons name="ticket-outline" size={28} color={colors.t2} />
          )}
          label="Meus Bilhetes"
          labelStyle={{
            fontSize: 16,
            fontWeight: "500",
            right: 20,
            color: colors.t4,
          }}
          onPress={() => navigation.navigate("myTickets")}
        />
        <View style={styles.separator} />
        <DrawerItem
          style={{}}
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name={"heart"}
              color={colors.t2}
              size={28}
            />
          )}
          label="Favoritos"
          labelStyle={{
            fontSize: 16,
            fontWeight: "500",
            right: 20,
            color: colors.t4,
          }}
          // onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
          onPress={() => navigation.navigate("favorite")}
        />
        <View style={styles.separator} />

        <DrawerItem
          style={{ left: 2 }}
          icon={({ color, size }) => (
            <Octicons name="gear" size={26} color={colors.t2} />
          )}
          label="Definições"
          labelStyle={{
            fontSize: 16,
            fontWeight: "500",
            right: 20,
            color: colors.t4,
          }}
          onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
        />
        <View style={styles.separator} />
        <DrawerItem
          style={{}}
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="logout" size={30} color={colors.t2} />
          )}
          label="Sair"
          labelStyle={{
            fontSize: 16,
            fontWeight: "500",
            right: 25,
            color: colors.t4,
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
        drawerType: "slide",
        // drawerHideStatusBarOnOpen:true,
        overlayColor: "rgba(0,0,0,0.83)",
        headerBackground: "red",
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
  separator: {
    width: "80%",
    height: 1,
    right: 10,
    // backgroundColor: colors.darkSeparator,
    // marginVertical: 10,
    alignSelf: "flex-end",
  },
});
