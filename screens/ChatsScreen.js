import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";

import colors from "../components/colors";
const ChatsScreen = ({ navigation }) => {
  return (

      

      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        <Button title="dafds" onPress={() => navigation.navigate("event")} />
      </View>)

};

export default ChatsScreen;

const styles = StyleSheet.create({});
