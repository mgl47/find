import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "../../components/navigation/Header";
import Screen from "../../components/Screen";

const SearchScreen = ({ navigation: { goBack }, route }) => {
  return (
    <Screen>
      <Header />
    </Screen>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
