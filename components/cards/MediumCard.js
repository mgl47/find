import React from "react";
import { View, StyleSheet, Image, Text, Dimensions } from "react-native";
import colors from "../colors";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground } from "react-native";
const { width, height } = Dimensions.get("window");

function MediumCard({ title, date, photos, Category, city, venue }) {
  return (
    // <View style={styles.card}>
    //   {/* <Image style={styles.image} source={{ uri: photos[0]?.uri }} /> */}

    <ImageBackground
      style={styles.card}
      source={{
        uri: photos[0]?.[0]?.uri,
      }}
    >
      <LinearGradient
        colors={["#00000000", "#000000"]}
        style={{ height: "100%", width: "100%" }}
      >
        <View style={{ position: "absolute", bottom: 10, width: "100%" }}>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>
          {/* <View style={{ flexDirection: "row", alignItems: "center" }}> */}
          {/* <Text numberOfLines={1} style={styles.venue}>
            {(venue?.displayName + ", " + venue?.city)?.slice(0, 24) +
              ((venue?.displayName + ", " + venue?.city)?.length > 24
                ? "..."
                : "")}
          </Text> */}
          <Text numberOfLines={1} style={styles.venue}>
            {venue?.displayName + ", " + venue?.city}
          </Text>
          {/* </View> */}
          <Text style={styles.date}>{date}</Text>
        </View>
      </LinearGradient>

      {/* <Text style={styles.Category}>{Category}</Text> */}
    </ImageBackground>
    // </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // height: 175,
    height: height * 0.3,
    width: width * 0.45,

    borderRadius: 20,
    margin: 5,
    overflow: "hidden",
    // width: 185,

    // marginLeft: 8,
  },

  title: {
    fontSize: 15,
    fontWeight: "500",
    width: "90%",
    left: 10,
    color: colors.white,
    marginBottom: 2,
    // textShadowColor: "rgba(0, 0, 0, 0.75)",
    // textShadowOffset: { width: 0, height: 4 },
    // textShadowRadius: 10,
    // shadowOpacity: 10,
  },
  venue: {
    fontSize: 13,
    left: 10,
    color: colors.light,
    width: "93%",
    // lineHeight: 15,
    fontWeight: "500",
    color: colors.lightGrey2,
    marginBottom: 2,

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
    fontWeight: "400",

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
