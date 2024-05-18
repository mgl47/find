
import React from "react";
import Constants from "expo-constants";
import { StyleSheet, View, Platform, StatusBar } from "react-native";

import colors from "./colors";
import { useDesign } from "./hooks/useDesign";

function Screen({ children, style }) {
const{isIPhoneWithNotch}=useDesign()
  return (
    <View
      style={[
        styles.container,
       
        style,
      ]}
    >

      
        {children}

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight+5,
    // backgroundColor:colors.light
  },
  screen: {
    flex: 1,
    // backgroundColor:"transparent"
  },
});

export default Screen;
