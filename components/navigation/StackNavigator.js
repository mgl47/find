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
import SearchScreen from "../../screens/HomeScreens/ExploreScreens/SearchScreen";
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
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CalendarScreen from "../../screens/HomeScreens/ExploreScreens/CalendarScreen";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { useAuth } from "../hooks/useAuth";
import SearchScreen2 from "../../screens/HomeScreens/ExploreScreens/SearchScreen2";
import ExploreScreens from "../../screens/HomeScreens/ExploreScreens/ExploreScreens";
import EventAddingScreen from "../../screens/OrgScreens/EventAddingScreen";
import MyTickets from "../../screens/authScreens/MyTickets";
import TicketDetails from "../../screens/authScreens/TicketsDetails";
import MyEvents from "../../screens/OrgScreens/MyEvents";
import EventManagingScreen from "../../screens/OrgScreens/ManagingNavigator/EventManagingScreen";
import ValidatorScreen from "../../screens/OrgScreens/ManagingNavigator/QrScanner/ValidatorScreen";
import StoreScreen from "../../screens/OrgScreens/ManagingNavigator/QrScanner/StoreScreen";
import AddVenueScreen from "../../screens/AdminScreens/AddVenueScreen";
import AddArtistScreen from "../../screens/AdminScreens/AddArtistScreen";
import FavoriteScreens from "../../screens/authScreens/FavoriteScreens/FavoriteScreens";
import NotificationDetail from "../../screens/NotificationScreens/NotificationDetail";

// import TabNavigator from "./TabNavigator";
const Stack = createStackNavigator();

function StackNavigator() {
  const navigation = useNavigation();
  const { user, authLoading, authSheetRef, setAuthModalUp } = useAuth();
  const fromHome = true;
  const invisibleHeaders = ["event", "artist", "venue"];

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              left: 20,
            }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color={colors.white}
              style={{
                shadowOffset: { width: 0.5, height: 0.5 },
                shadowOpacity: 0.3,
                shadowRadius: 1,
                elevation: 2,
              }}
            />
          </TouchableOpacity>
        ),
        // headerShown: false,
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "transparent" },
        headerBackgroundContainerStyle: !invisibleHeaders?.includes(route.name)
          ? {
              backgroundColor: colors.background,

              // shadowOffset: { width: 0.5, height: 0.5 },
              // elevation: 2,
              // shadowColor: colors.primary2,
              // shadowOpacity: 0.1,
              // shadowRadius: 1,
            }
          : {},
      })}
    >
      <Stack.Screen
        name="home"
        component={TabNavigator}
        options={({ route }) => ({
          headerShown: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                user
                  ? navigation.openDrawer()
                  : (authSheetRef?.current?.present(), setAuthModalUp(true))
              }
              style={{ left: 20, bottom: 1 }}
            >
              {user ? (
                <Image
                  source={{
                    uri: user?.photos?.avatar[0]?.uri,
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    // left:20
                  }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="account-outline"
                  size={35}
                  color={colors.white}
                />
              )}
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
          headerTitle: () => (
            <Image
              source={require("../../assets/logos/logo_white.png")}
              style={{ width: 35, height: 35 }}
              resizeMode="contain"
            />
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{
                borderRadius: 50,
                padding: 5,
                right: 10,
                // backgroundColor: colors.grey,
              }}
              onPress={() => navigation.navigate("search")}
            >
              <MaterialIcons
                name="manage-search"
                size={35}
                color={colors.white}
              />
            </TouchableOpacity>
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
                  color: colors.white,
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
          headerShown: false,
        }}
        name="search"
        component={ExploreScreens}
      />

      <Stack.Screen
        options={{
          presentation: "transparentModal",
          headerShown: false,
        }}
        name="search2"
        component={SearchScreen2}
      />
      <Stack.Screen
        options={
          {
            // presentation: "transparentModal",
            // headerShown: false,
          }
        }
        name="favorite"
        component={FavoriteScreens}
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
                  color: colors.white,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Sair
              </Text>
            </TouchableOpacity>
          ),
          // headerLeft: () => (
          //   <View
          //     style={{ flexDirection: "row", alignItems: "center", left: 20 }}
          //   >
          //     <TouchableOpacity onPress={() => navigation.navigate("calendar")}>
          //       <Entypo name="chevron-right" size={30} color={colors.primary} />
          //     </TouchableOpacity>
          //   </View>
          // ),
          headerLeft: () => null,
          title: "Lugares",
          headerShown: true,
          presentation: "transparentModal",
        }}
        name="venuesExplorer"
        component={ExploreScreens}
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
                  color: colors.white,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Sair
              </Text>
            </TouchableOpacity>
          ),
          // headerLeft: () => (
          //   <View
          //     style={{ flexDirection: "row", alignItems: "center", left: 20 }}
          //   >
          //     <TouchableOpacity
          //       onPress={() =>
          //         navigation.canGoBack("venuesExplorer")
          //           ? navigation.goBack("venuesExplorer")
          //           : navigation.navigate("venuesExplorer")
          //       }
          //     >
          //       <Entypo name="chevron-left" size={30} color={colors.primary} />
          //     </TouchableOpacity>
          //     <TouchableOpacity onPress={() => navigation.navigate("search")}>
          //       <Entypo name="chevron-right" size={30} color={colors.primary} />
          //     </TouchableOpacity>
          //   </View>
          // ),
          title: "Calendário",
          headerShown: true,
          presentation: "transparentModal",
        }}
        name="calendar"
        component={CalendarScreen}
      />

      <Stack.Screen
        options={
          {
            // headerTransparent: true,
            // headerBackgroundContainerStyle: { backgroundColor: "transparent" },
          }
        }
        name="profile"
        component={ProfileScreen}
      />
      <Stack.Screen
        options={{
          // headerTransparent: true,
          // headerBackgroundContainerStyle: { backgroundColor: "transparent" },
          headerTitle: "Meus Bilhetes",
          headerTitleStyle: { color: colors.white },
        }}
        name="myTickets"
        component={MyTickets}
      />
      <Stack.Screen
        options={{
          // headerTransparent: true,
          // headerBackgroundContainerStyle: { backgroundColor: "transparent" },
          headerTitle: "Detalhes do Bilhete",
          headerTitleStyle: { color: colors.white },
        }}
        name="ticketDetails"
        component={TicketDetails}
      />
      <Stack.Screen
        options={{
          // headerTransparent: true,
          // headerBackgroundContainerStyle: { backgroundColor: "transparent" },
          headerTitle: "Meus Eventos",
          headerTitleStyle: { color: colors.white },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("addEvent")}
              style={{ right: 20 }}
            >
              <FontAwesome
                name={"plus-circle"}
                size={30}
                color={colors.white}
              />
            </TouchableOpacity>
          ),
        }}
        name="myEvents"
        component={MyEvents}
      />
      <Stack.Screen
        options={{
          headerTitle: "Adicionar Local",
          headerTitleStyle: { color: colors.white },
        }}
        name="addVenue"
        component={AddVenueScreen}
      />
      <Stack.Screen
        options={{
          headerTitle: "Adicionar Local",
          headerTitleStyle: { color: colors.white },
        }}
        name="addArtist"
        component={AddArtistScreen}
      />
      <Stack.Screen
        options={{
          // headerTransparent: true,
          // headerBackgroundContainerStyle: { backgroundColor: "transparent" },
          headerTitle: "Gerenciar Evento",
          headerTitleStyle: { color: colors.t3 },
        }}
        name="manageEvent"
        component={EventManagingScreen}
      />
      <Stack.Screen
        options={{
          headerTitle: "Validar",
          headerTitleStyle: { color: colors.t2 },
        }}
        name="qrValidator"
        component={ValidatorScreen}
      />
      <Stack.Screen
        options={{
          headerTitle: "Loja",
          headerTitleStyle: { color: colors.t3 },
        }}
        name="eventStore"
        component={StoreScreen}
      />
      <Stack.Screen
        options={{
          headerTitle: "Notificação",
          headerTitleStyle: { color: colors.t3 },
        }}
        name="noti"
        component={NotificationDetail}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Criar Evento",
          headerTitleStyle: { color: colors.t2 },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                left: 20,
              }}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color={colors.white}
              />
            </TouchableOpacity>
          ),
        }}
        name="addEvent"
        component={EventAddingScreen}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;
const styles = StyleSheet.create({
  search: {
    height: 10,
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
