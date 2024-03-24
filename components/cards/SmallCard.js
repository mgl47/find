import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import colors from "../colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
function SmallCard({ title, dates, photos, venue, city }) {
  // const title = "Sessão anual da literatura caboverdiana sd g das ag dsag das";
  return (
    <View style={styles.card}>
      <Image style={styles.image} source={{ uri: photos[2]?.[0]?.uri }} />
      <View style={{ width: "100%" }}>
        <View style={{ padding: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={[
                styles.date,
                {
                  fontWeight: "600",
                  color: colors.dark,
                  fontSize: 16,
                  // marginBottom: title?.length > 27 ? 3 : 0,
                  bottom: 2,
                },
              ]}
            >
              {dates?.[dates?.length - 1]?.displayDate?.split(",")[0] + ", "}
            </Text>
            <Text style={[styles.date, { color: "#585858" }]}>
              {dates?.[dates?.length - 1]?.displayDate?.split(", ")[1] + " - "}
            </Text>
            <Text style={[styles.date, { color: "#585858" }]}>
              {dates?.[0]?.hour}
            </Text>
          </View>

          <Text
            numberOfLines={2}
            style={[
              styles.title,
              {
                fontSize: 18,
                lineHeight: 18,
                fontWeight: "600",

                // fontSize: title?.length > 27 ? 16 : 18,
                // lineHeight: title?.length > 27 ? 15 : 30,
              },
            ]}
          >
            {title}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={[
                styles.venue,
                // { marginBottom: title?.length > 27 ? 7 : 3, color: "#585858" },
              ]}
            >
              {venue?.displayName}, {venue?.address?.city}
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
    borderRadius: 10,
    backgroundColor: colors.white,
    overflow: "hidden",
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    // borderRadius: 10,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 1,
    // shadowRadius: 1,
    elevation: 0.5,
  },

  image: {
    width: 110,
    height: "100%",
    borderRadius: 10,
  },
  venue: {
    fontSize: 14.5,
    alignSelf: "flex-start",
    fontWeight: "600",
    // marginLeft: 3,
  },
  title: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary2,
    lineHeight: 30,
    width: "70%",
    marginVertical:5
  },

  date: {
    fontSize: 15,
    alignSelf: "flex-start",
    fontWeight: "600",

    // marginTop: 3,
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
