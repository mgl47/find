import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import colors from "../colors";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground } from "react-native";

function MediumCard({ title, date, photos, Category, city, venue }) {
  return (
    // <View style={styles.card}>
    //   {/* <Image style={styles.image} source={{ uri: photos[0]?.uri }} /> */}

    <ImageBackground
      style={styles.card}
      source={{
        uri: photos[0]?.uri,
      }}
    >

      <LinearGradient
        colors={["#00000000", "#000000"]}
        style={{ height: "100%", width: "100%"}}
      >
        <View style={{position:"absolute",bottom:10}}>
        <Text numberOfLines={2} style={styles.title}>{title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.venue}>{venue?.displayName}</Text>
          <Text style={styles.venue}>, </Text>
          <Text style={styles.venue}>{venue?.city}</Text>
        </View>
        <Text style={styles.date}>{date}</Text></View>
      </LinearGradient>

      {/* <Text style={styles.Category}>{Category}</Text> */}
    </ImageBackground>
    // </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 185,
    borderRadius: 20,

    overflow: "hidden",
    width: 195,
    marginLeft: 8,
    
  },


  title: {
    fontSize: 15,
    fontWeight: "500",

    left: 10,
    color: colors.white,
    marginBottom:2,
    // textShadowColor: "rgba(0, 0, 0, 0.75)",
    // textShadowOffset: { width: 0, height: 4 },
    // textShadowRadius: 10,
    // shadowOpacity: 10,
  },
  venue: {
    fontSize: 14,
    left: 10,
    color: colors.light,
    // lineHeight: 15,
    fontWeight: "400",
    color: colors.white,
    marginBottom:2,

    // bottom: 40,
    // textShadowColor: "rgba(0, 0, 0, 0.75)",
    // textShadowOffset: { width: 0, height: 4 },
    // textShadowRadius: 10,
    // shadowOpacity: 1,
  },
  date: {
    fontSize: 12,
    left: 10,
    color: colors.lightGrey2,
    // lineHeight: 15,
    fontWeight: "500",

    // bottom: 10,
    // textShadowColor: "rgba(0, 0, 0, 0.75)",
    // textShadowOffset: { width: 0, height: 4 },
    // textShadowRadius: 10,
    // shadowOpacity: 1,
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
