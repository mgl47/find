import "react-native-gesture-handler";
// import { StatusBar } from "expo-status-bar";
import {
  LogBox,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
import { DesignProvider } from "./components/hooks/useDesign";
import FlashMessage from "react-native-flash-message";
LogBox.ignoreLogs([
  "ViewPropTypes will be removed from React Native, along with all other PropTypes. We recommend that you migrate away from PropTypes and switch to a type system like TypeScript. If you need to continue using ViewPropTypes, migrate to the 'deprecated-react-native-prop-types' package.",
  "Sending `onAnimatedValueUpdate` with no listeners registered.",
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.",
  // "`flexWrap: `wrap`` is not supported with the `VirtualizedList` components.Consider using `numColumns` with `FlatList` instead.",
  // "No native splash screen registered for given view controller. Call 'SplashScreen.show' for given view controller first.",
  // "TypeError: Cannot read property 'indexOf' of undefined",
]);
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
            <DesignProvider>
              <DataProvider>
                {/* <StackNavigator /> */}
                <DrawerNavigator />
              </DataProvider>
            </DesignProvider>
          </AuthProvider>
          <FlashMessage position="top" />
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
