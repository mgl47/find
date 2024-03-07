import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import MainHeader from "../components/navigation/MainHeader";
import Screen from "../components/Screen";
import colors from "../components/colors";

const NotificationScreen = ({ navigation }) => {
  return (
    <Screen>
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <MainHeader navigation={navigation} title={"Notifications"} />

        <Button title="dafds" onPress={() => navigation.navigate("event")} />
      </View>
    </Screen>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({});
