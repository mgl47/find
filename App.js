import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./components/navigation/StackNavigator";
export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        {/* <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text
        <StatusBar style="auto" />
      </View> */}
        <StackNavigator />
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
