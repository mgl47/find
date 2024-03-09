
import React from "react";
import Constants from "expo-constants";
import { StyleSheet, View, Platform, StatusBar } from "react-native";

import colors from "./colors";

function Screen({ children, style }) {

  return (
    <View
      style={[
        styles.container,
       
        style,
      ]}
    >
      <View
        style={[
          styles.screen,
          // { backgroundColor: colors.background },
        ]}
      >
        {children}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    // backgroundColor:colors.light
  },
  screen: {
    flex: 1,
    // backgroundColor:"transparent"
  },
});

export default Screen;
