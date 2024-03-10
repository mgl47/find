import { createStackNavigator } from "@react-navigation/stack";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EventScreen from "../../screens/HomeScreens/EventScreen";
import TabNavigator from "./TabNavigator";
import SearchScreen from "../../screens/HomeScreens/SearchScreen";
import ArtistScreen from "../../screens/HomeScreens/ArtistScreen";
import VenueScreen from "../../screens/HomeScreens/VenueScreen";
import ProfileScreen from "../../screens/authScreens/ProfileScreen";
import AuthScreens from "../../screens/authScreens/AuthScreens";
import { ActivityIndicator } from "react-native-paper";

import colors from "../colors";
import {
  MaterialCommunityIcons,
  Entypo,
  FontAwesome5,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import VenueExploreScreen from "../../screens/HomeScreens/VenueExploreScreen";
import CalendarScreen from "../../screens/HomeScreens/CalendarScreen";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { useAuth } from "../hooks/useAuth";
import SearchScreen2 from "../../screens/HomeScreens/SearchScreen2";

// import TabNavigator from "./TabNavigator";
const Stack = createStackNavigator();

function StackNavigator() {
  const navigation = useNavigation();
  const { user, authLoading } = useAuth();

  const invisibleHeaders = ["event", "artist", "venue"];
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        // headerLeft: () => (
        //   <TouchableOpacity
        //     onPress={() => navigation.goBack()}
        //     style={{ left: 20 }}
        //   >
        //     <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        //   </TouchableOpacity>
        // ),

        // headerShown: false,
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "transparent" },
        headerBackgroundContainerStyle: !invisibleHeaders?.includes(route.name)
          ? {
              backgroundColor: colors.white,
              shadowOffset: { width: 0.5, height: 0.5 },
              elevation: 2,

              shadowOpacity: 0.3,
              shadowRadius: 1,
            }
          : {},
      })}
    >
      <Stack.Screen
        name="home"
        component={TabNavigator}
        options={({ route }) => ({
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                user ? navigation.openDrawer() : navigation.navigate("auth")
              }
              // onPress={handleAuthSheet}
              style={{ left: 20, bottom: 1 }}
            >
              {user ? (
                <Image
                  source={{
                    uri: "https://i0.wp.com/techweez.com/wp-content/uploads/2022/03/vivo-lowlight-selfie-1-scaled.jpg?fit=2560%2C1920&ssl=1",
                  }}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 50,
                    // left:20
                  }}
                />
              ) : (
                // <TouchableOpacity
                //   onPress={() => {
                //     navigation.navigate("auth");
                //   }}
                //   style={{
                //     padding: 10,
                //     // right: 10,
                //     // alignSelf: "flex-end",
                //     // position: "absolute",
                //     // marginBottom: 10,
                //   }}
                // >
                //   <Text
                //     style={{
                //       color: colors.primary,
                //       fontSize: 16,
                //       fontWeight: "600",
                //     }}
                //   >
                //     Entrar
                //   </Text>
                // </TouchableOpacity>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={35}
                  color={colors.darkSeparator}
                />
              )}
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
          headerTitle: () => (
            <Image
              source={require("../../assets/logos/logo1.png")}
              style={{ width: 35, height: 35, bottom: 3 }}
              resizeMode="contain"
            />
          ),
          headerRight: () => (
            <View
              style={{ position: "absolute", right: 10, flexDirection: "row" }}
            >
              <TouchableOpacity
                // onPress={() => setVenueModalVisible(true)}
                onPress={() => navigation.navigate("venuesExplorer")}
                style={{
                  borderRadius: 50,
                  padding: 5,
                  marginRight: 5,
                }}
              >
                <Entypo name="location" size={24} color={colors.darkSeparator} />
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={() => setCalendarModalVisible(true)}

                onPress={() => navigation.navigate("calendar")}
                style={{
                  borderRadius: 50,
                  padding: 5,
                  marginRight: 5,
                }}
              >
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={26}
                  color={colors.darkSeparator}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderRadius: 50,
                  padding: 5,
                  // backgroundColor: colors.grey,
                }}
                onPress={() => navigation.navigate("search")}
              >
                {/* <MaterialCommunityIcons
              name="magnify"
              size={26}
              color={colors.black}
            /> */}
                <Entypo
                  name="magnifying-glass"
                  size={25}
                  color={colors.darkSeparator}
                />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        options={{
          presentation: "transparentModal",
          title: "Conta",

          headerRight: () => (
            <TouchableOpacity
              // onPress={() => {
              //   navigation.goBack();
              // }}
              onPress={() => {
                navigation.navigate("home");
              }}
              style={{
                padding: 10,
                right: 10,
                // alignSelf: "flex-end",
                position: "absolute",
                // marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Sair
              </Text>
            </TouchableOpacity>
          ),
          headerLeft: () => null,
          // headerTitle: () =>  ( authLoading==true? <ActivityIndicator color={colors.primary} />:"")
        }}
        name="auth"
        component={AuthScreens}
      />
      <Stack.Screen
        options={{
          presentation: "transparentModal",
          headerShown: true,
        }}
        name="search"
        component={SearchScreen}
      />
      <Stack.Screen
        options={{
          presentation: "transparentModal",
          headerShown: true,
        }}
        name="search2"
        component={SearchScreen2}
      />

      <Stack.Screen
        options={{
          headerTransparent: true,
        }}
        name="event"
        component={EventScreen}
      />
      <Stack.Screen
        options={{
          headerTransparent: true,
        }}
        name="artist"
        component={ArtistScreen}
      />
      <Stack.Screen
        options={{
          headerTransparent: true,
        }}
        name="venue"
        component={VenueScreen}
      />
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              // onPress={() => {
              //   navigation.goBack();
              // }}
              onPress={() => {
                navigation.navigate("home");
              }}
              style={{
                padding: 10,
                right: 10,
                // alignSelf: "flex-end",
                position: "absolute",
                // marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Sair
              </Text>
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", left: 20 }}
            >
              <TouchableOpacity onPress={() => navigation.navigate("calendar")}>
                <Entypo name="chevron-right" size={30} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ),
          title: "Lugares",
          headerShown: true,
          presentation: "transparentModal",
        }}
        name="venuesExplorer"
        component={VenueExploreScreen}
      />
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              // onPress={() => {
              //   navigation.goBack();
              // }}
              onPress={() => {
                navigation.navigate("home");
              }}
              style={{
                padding: 10,
                right: 10,
                // alignSelf: "flex-end",
                position: "absolute",
                // marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Sair
              </Text>
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", left: 20 }}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.canGoBack("venuesExplorer")
                    ? navigation.goBack("venuesExplorer")
                    : navigation.navigate("venuesExplorer")
                }
              >
                <Entypo name="chevron-left" size={30} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("search")}>
                <Entypo name="chevron-right" size={30} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ),
          title: "Calendário",
          headerShown: true,
          presentation: "transparentModal",
        }}
        name="calendar"
        component={CalendarScreen}
      />

      <Stack.Screen
        options={{
          headerShown: true,
          title: "Perfil",
        }}
        name="profile"
        component={ProfileScreen}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;
const styles = StyleSheet.create({
  search: {
    height: 40,
    width: "90%",
    backgroundColor: colors.light2,
    borderRadius: 30,
    paddingLeft: 35,
    paddingRight: 30,
  },
  headerText: {
    fontSize: 19,
    fontWeight: "500",
    // padding: 5,
    zIndex: 2,
    left: 20,
    marginVertical: 10,
  },
});
