import { createStackNavigator } from "@react-navigation/stack";
import { Image, Text, TouchableOpacity } from "react-native";
import EventScreen from "../../screens/HomeScreens/EventScreen";
import TabNavigator from "./TabNavigator";
import SearchScreen from "../../screens/HomeScreens/SearchScreen";
import ArtistScreen from "../../screens/HomeScreens/ArtistScreen";
import VenueScreen from "../../screens/HomeScreens/VenueScreen";
import ProfileScreen from "../../screens/authScreens/ProfileScreen";
import colors from "../colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import VenueExploreScreen from "../../screens/HomeScreens/VenueExploreScreen";
import CalendarScreen from "../../screens/HomeScreens/CalendarScreen";

// import TabNavigator from "./TabNavigator";
const Stack = createStackNavigator();

function StackNavigator() {
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ left: 20 }}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
        ),
        headerShown: false,
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "transparent" },
        headerBackgroundContainerStyle: {
          backgroundColor: colors.white,
          shadowOffset: { width: 0.5, height: 0.5 },
          elevation: 2,

          shadowOpacity: 0.3,
          shadowRadius: 1,
        },
      })}
    >
      <Stack.Screen
        name="home"
        component={TabNavigator}
        options={({ route }) => ({
          // headerShown: true,
          // headerTitle: () => (
          //   <Image
          //     source={require("../../assets/logos/mainLogo.png")}
          //     style={{ width: 120, flex: 1, marginBottom: 5 }}
          //     resizeMode="contain"
          //   />
          // ),
          headerTitle: "Notification",
        })}
      />
      <Stack.Screen
        options={{
          presentation: "transparentModal",
        }}
        name="search"
        component={SearchScreen}
      />

      <Stack.Screen name="event" component={EventScreen} />
      <Stack.Screen name="artist" component={ArtistScreen} />
      <Stack.Screen name="venue" component={VenueScreen} />
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
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
                Voltar
              </Text>
            </TouchableOpacity>
          ),
          headerLeft: () => null,
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
              onPress={() => {
                navigation.goBack();
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
                Voltar
              </Text>
            </TouchableOpacity>
          ),
          headerLeft: () => null,
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
