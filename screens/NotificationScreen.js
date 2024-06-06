import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";

import colors from "../components/colors";
import { useDesign } from "../components/hooks/useDesign";
import { Constants } from "expo-camera/legacy";

const NotificationScreen = ({ navigation }) => {
  const { isIPhoneWithNotch } = useDesign();
  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 5,
          backgroundColor: "rgba(5, 19, 29,0.96)",
          position: "absolute",
          paddingTop: isIPhoneWithNotch ? 44 : Constants.statusBarHeight,

          top: 0,
          zIndex: 3,
          width: "100%",
          paddingBottom: 5,
          // backgroundColor:"transparent"
        }}
      >
        <Text
          style={{
            color: colors.white,
            fontSize: 22,
            fontWeight: "600",
            marginTop: 10,
            marginLeft: 30,
          }}
        >
          Notificações
        </Text>
      </View>
      <Button title="dafds" onPress={() => navigation.navigate("event")} />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({});
