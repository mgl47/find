import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
// import { createDrawerNavigator } from "@react-navigation/drawer";

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import StackNavigator from "./components/navigation/StackNavigator";
// export const Drawer = createDrawerNavigator();
import DrawerNavigator, {
  Drawer,
} from "./components/navigation/DrawerNavigator";
export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer theme={DefaultTheme}>
        <StatusBar
          barStyle={
            // Platform.OS === "ios"
            //   ? "default"
            //   : darkMode
            //   ? "light-content"
            //   : "dark-content"
            "light-content"
          }
          backgroundColor={"transparent"}
          translucent={true}
        />
        {/* <StackNavigator /> */}
        <DrawerNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
