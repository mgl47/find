import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import colors from "../colors";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground } from "react-native";
import {
  MaterialCommunityIcons,
  Octicons,
  Entypo,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
function BigCard2({ title, dates, photos, Category, city, venue }) {
  return (
    // <View style={styles.card}>
    //   {/* <Image style={styles.image} source={{ uri: photos[0]?.uri }} /> */}
    <View style={{ width: "95%", alignSelf: "center" }}>
      <ImageBackground
        style={styles.card}
        source={{
          uri: photos?.[0]?.[0]?.uri,
        }}
      >
        <LinearGradient
          colors={["#00000000", "#000000"]}
          style={{ height: "100%", width: "100%", width: "100%" }}
        >
          <View style={{ position: "absolute", bottom: 10 }}>
            <Text numberOfLines={2} style={styles.title}>
              {title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.venue}>{venue?.displayName}</Text>
              <Text style={styles.venue}>, </Text>
              <Text style={styles.venue}>{venue?.city}</Text>
            </View>

            <Text style={styles.date}>
              {dates[dates?.length - 1].displayDate +
                " - " +
                dates[dates?.length - 1].hour}
            </Text>
          </View>
          <MaterialCommunityIcons
            style={{ position: "absolute", bottom: 10, right: 10 }}
            name="arrow-right"
            size={25}
            color={colors.white}
          />
        </LinearGradient>

        {/* <Text style={styles.Category}>{Category}</Text> */}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 185,
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
    alignSelf: "center",
    marginTop: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",

    left: 10,
    color: colors.white,
    marginBottom: 5,
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
    fontWeight: "500",
    color: colors.white,
    marginBottom: 5,

    // bottom: 40,
    // textShadowColor: "rgba(0, 0, 0, 0.75)",
    // textShadowOffset: { width: 0, height: 4 },
    // textShadowRadius: 10,
    // shadowOpacity: 1,
  },
  date: {
    fontSize: 13,
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

export default BigCard2;
