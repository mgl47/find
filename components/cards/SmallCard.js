import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import colors from "../colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
function SmallCard({ title, date, photos, venue, city }) {
  return (
    <View style={styles.card}>
      <Image style={styles.image} source={{ uri: photos[0]?.uri }} />
      <View style={{ padding: 10 }}>
        <Text style={styles.title}>{title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.venue}>
            {venue?.displayName}, {venue?.city}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="calendar-blank"
            size={18}
            color="black"
          />
          <Text style={styles.date}>{date}</Text>
        </View>

        {/* <Text style={styles.interest}>{interest}</Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    // alignItems:"center",
    height: 100,
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
  title: {
    fontSize: 17,
    fontWeight: "600",
    // bottom: 105,
    color: colors.black,
    //  marginLeft: 185,
    marginTop:2,
    marginBottom:2,
  },
  venue: {
    fontSize: 14,
    alignSelf: "flex-start",
    fontWeight: "500",
    color: colors.dark2,
    lineHeight: 30,
    marginBottom:2,

  },
  date: {
    fontSize: 14,
    alignSelf: "flex-start",
    color: colors.darkGrey,
    fontWeight: "500",
    marginLeft:5
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
