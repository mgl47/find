import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MainHeader from "../components/navigation/MainHeader";
import Screen from "../components/Screen";

const NotificationScreen = ({ navigation }) => {
  return (
    <Screen>
      <MainHeader navigation={navigation} title={"Notifications"} />
    </Screen>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({});
