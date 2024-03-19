import "react-native-gesture-handler";
// import { StatusBar } from "expo-status-bar";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
// import { createDrawerNavigator } from "@react-navigation/drawer";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import StackNavigator from "./components/navigation/StackNavigator";

// export const Drawer = createDrawerNavigator();
import DrawerNavigator, {
  Drawer,
} from "./components/navigation/DrawerNavigator";
import { AuthProvider } from "./components/hooks/useAuth";
import { DataProvider } from "./components/hooks/useData";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={"default"}
        translucent
        backgroundColor={"transparent"}
      />

      <PaperProvider>
        <NavigationContainer theme={DefaultTheme}>
          <AuthProvider>
            <DataProvider>
              {/* <StackNavigator /> */}
              <DrawerNavigator />
            </DataProvider>
          </AuthProvider>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
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
