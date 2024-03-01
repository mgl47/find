import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import colors from "../colors";

function SmallCard({ title, date, uri, interest, city }) {
  return (
    <View style={styles.card}>
      <Image style={styles.image} source={{ uri }} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.city}>{city}</Text>
      <Text style={styles.interest}>{interest}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 120,
    borderRadius: 20,
    backgroundColor: colors.soft,
    overflow: "hidden",
    width: "95%",
    alignSelf: "center",
    marginBottom: 15,
  },

  image: {
    width: 175,
    height: 120,
    borderRadius: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    bottom: 105,
    color: colors.black,
    left: 185,
  },

  date: {
    fontSize: 13,
    alignSelf: "flex-start",
    color: colors.description,
    lineHeight: 15,
    bottom: 90,
    left: 180,
  },
  city: {
    fontSize: 13,
    alignSelf: "flex-start",
    color: colors.description,
    lineHeight: 30,
    bottom: 95,
    left: 190,
  },
  interest: {
    fontSize: 13,
    alignSelf: "flex-start",
    color: colors.description,
    lineHeight: 25,
    bottom: 95,
    left: 185,
  },
});

export default SmallCard;
