import React from "react";
import Constants from "expo-constants";
import { StyleSheet, View, Platform, StatusBar } from "react-native";
import colors from "./colors";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function ModalScreen({ children, style }) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, style, ]}>
      <View style={[styles.screen]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 10,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,

    // backgroundColor:"transparent"
  },
});

export default ModalScreen;
