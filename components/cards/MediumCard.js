import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import colors from "../colors";

function MediumCard({ title, date, uri, Category, city }) {
  console.log(uri);
  return (
    <View style={styles.card}>
      <Image style={styles.image} source={{ uri }} />
      <Text style={styles.Category}>{Category}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.city}>{city}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 185,
    borderRadius: 20,
    backgroundColor: colors.white,
    overflow: "hidden",
    width: 195,
    marginRight: 3,
    marginLeft: 8,
  },

  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 14,
    fontWeight: "400",
    bottom: 100,
    left: 10,
    color: colors.white,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    shadowOpacity: 10,
  },

  date: {
    fontSize: 11,
    left: 10,
    color: colors.description,
    lineHeight: 15,
    fontWeight: "500",
    color: colors.white,
    bottom: 92,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    shadowOpacity: 1,
  },
  city: {
    fontSize: 11,
    left: 10,
    color: colors.description,
    lineHeight: 15,
    fontWeight: "500",
    color: colors.white,
    bottom: 62,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    shadowOpacity: 1,
  },
  Category: {
    fontSize: 18,
    fontWeight: "500",
    left: 10,
    bottom: 175,
    color: colors.white,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    shadowOpacity: 1,
  },
});

export default MediumCard;
