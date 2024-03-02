import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import MainHeader from "../components/navigation/MainHeader";
import Screen from "../components/Screen";
const ChatsScreen = ({ navigation }) => {
  return (
    <Screen>
      <MainHeader navigation={navigation} title={"Canais"} />
      <Button title="dafds" onPress={() => navigation.navigate("event")} />
    </Screen>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
