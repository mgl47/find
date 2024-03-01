import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const MainHeader = ({ title, navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={{ position: "absolute", left: 20, top: 10 }}
      >
        <Image
          source={{
            uri: "https://i0.wp.com/techweez.com/wp-content/uploads/2022/03/vivo-lowlight-selfie-1-scaled.jpg?fit=2560%2C1920&ssl=1",
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 50,
            // marginLeft: 20,
            // position: "absolute",
          }}
          // resizeMode="contain"
        />
      </TouchableOpacity>
      {title ? (
        <Text style={styles.title}>{title}</Text>
      ) : (
        <Image
          source={require("../../assets/logos/mainLogo.png")}
          style={{ width: 120, flex: 1, marginBottom: 5 }}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

export default MainHeader;

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 60,
    // backgroundColor: "red",
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
  },
});
