import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import colors from "../colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
function SmallCard({ title, dates, photos, venue, city }) {
  return (
    <View style={styles.card}>
      <Image style={styles.image} source={{ uri: photos[2]?.[0]?.uri }} />
      <View style={{ width: "100%" }}>
        <View style={{ padding: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={[
                styles.venue,
                { marginBottom: title?.length > 27 ? 7 : 3 },
              ]}
            >
              {venue?.displayName}, {venue?.address?.city}
            </Text>
          </View>
          <Text
            numberOfLines={2}
            style={[
              styles.title,
              {
                fontSize: title?.length > 27 ? 16 : 18,
                lineHeight: title?.length > 27 ? 15 : 30,
              },
            ]}
          >
            {title}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="calendar-blank"
              size={18}
              color="black"
            />
            <Text style={styles.date}>
              {dates?.[dates?.length - 1]?.displayDate}
            </Text>
          </View>

          {/* <Text style={styles.interest}>{interest}</Text> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    // alignItems:"center",
    height: 95,
    // borderRadius: 5,
    backgroundColor: colors.white,
    overflow: "hidden",
    width: "100%",
    alignSelf: "center",

    borderRadius: 10,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 3,
  },

  image: {
    width: 130,
    height: "100%",
    borderRadius: 10,
  },
  venue: {
    fontSize: 14,

    fontWeight: "500",

    // bottom: 105,
    color: colors.dark2,
    //  marginLeft: 185,
    marginBottom: 3,
  },
  title: {
    alignSelf: "flex-start",
    fontSize: 17,
    fontWeight: "600",
    color: colors.primary,
    lineHeight: 30,
    width: "65%",
    marginBottom: 5,
  },

  date: {
    fontSize: 13,
    alignSelf: "flex-start",
    color: colors.darkGrey,
    fontWeight: "500",
    marginLeft: 5,
    top: 1,
    // lineHeight: 15,
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
