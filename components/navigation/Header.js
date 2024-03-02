import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../colors";
const Header = ({
  title,
  navigation,
  mainScreen,
  onPressSearch,
  onPressCalendar,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ position: "absolute", left: 20, top: 10 }}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      {title ? (
        <Text style={styles.title}>{title}</Text>
      ) : (
        <Image
          source={require("../../assets/logos/mainLogo.png")}
          style={{ width: 100, flex: 1, marginBottom: 5 }}
          resizeMode="contain"
        />
      )}
      {mainScreen && (
        <View style={{ position: "absolute", right: 10, flexDirection: "row" }}>
          <TouchableOpacity
            onPress={onPressCalendar}
            style={{
              borderRadius: 50,
              padding: 5,
              marginRight: 10,
            }}
          >
            <MaterialCommunityIcons
              name="calendar-month"
              size={26}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderRadius: 50,
              padding: 5,
              // backgroundColor: colors.grey,
            }}
            onPress={onPressSearch}
          >
            <MaterialCommunityIcons name="magnify" size={26} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 60,
    borderBottomWidth: 0.2,
    borderColor: colors.grey,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
  },
});
