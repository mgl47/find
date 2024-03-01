import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../screens/HomeScreen";
import { Image } from "react-native";
import TabNavigator from "./TabNavigator";

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen
        name="home"
        component={TabNavigator}
        options={{
          headerTitle: () => (
            <Image
              source={require("../../assets/logos/mainLogo.png")}
              style={{ width: 120, flex: 1, marginBottom: 5 }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;
