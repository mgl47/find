import React from "react";
import Constants from "expo-constants";
import {
  StyleSheet,
  View,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import colors from "./colors";

function Screen2({ children, style }) {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <View style={[styles.screen]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 10,
    backgroundColor:colors.white
  },
  screen: {
    flex: 1,

    // backgroundColor:"transparent"
  },
});

export default Screen2;
