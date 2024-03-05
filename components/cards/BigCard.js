import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import colors from "../colors";

function BigCard({ title, date, image }) {
  return (
    <View style={styles.card}>
      <Image style={styles.image} source={image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 185,
    borderRadius: 20,
    // backgroundColor: colors.white,
    overflow: "hidden",
    width: "95%",
    alignSelf: "center",
  },

  image: {
    width: "100%",
    height: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    bottom: 180,
    left: 10,
    color: colors.white,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    shadowOpacity: 1,
  },

  date: {
    fontSize: 14,
    left: 10,
    color: colors.description,
    lineHeight: 15,
    color: colors.white,
    bottom: 90,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    shadowOpacity: 1,
  },
});

export default BigCard;
