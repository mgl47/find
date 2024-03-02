import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../screens/HomeScreen";
import { Image, TouchableOpacity } from "react-native";
import EventScreen from "../../screens/EventScreen";
import TabNavigator from "./TabNavigator";
import SearchScreen from "../../screens/HomeScreens/SearchScreen";
// import TabNavigator from "./TabNavigator";

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerLeft: () => (
          <TouchableOpacity>
            <Image
              source={{
                uri: "https://i0.wp.com/techweez.com/wp-content/uploads/2022/03/vivo-lowlight-selfie-1-scaled.jpg?fit=2560%2C1920&ssl=1",
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                marginLeft: 20,
              }}
              // resizeMode="contain"
            />
          </TouchableOpacity>
        ),
        headerShown: false,
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "transparent" },
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
      <Stack.Screen name="search" component={SearchScreen} />

      <Stack.Screen name="event" component={EventScreen} />
    </Stack.Navigator>
  );
}

export default StackNavigator;
