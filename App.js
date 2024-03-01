import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
// import { createDrawerNavigator } from "@react-navigation/drawer";

import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./components/navigation/StackNavigator";
// export const Drawer = createDrawerNavigator();
import DrawerNavigator, {
  Drawer,
} from "./components/navigation/DrawerNavigator";
export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
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
