import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import colors, { darkColors } from "../colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useData } from "../hooks/useData";

function SmallCard(item, { selectedDay }) {
  const { title, photos, dates, venue } = item;
  // const title = "Sessão anual da literatura caboverdiana sd g das ag dsag das";
  const navigation = useNavigation();
  const { formatNumber } = useData();

  const chosenDay = dates?.find(
    (date) => date?.calendarDate == selectedDay
  )?.displayDate;

  let greyy = "#696969";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate("event", {item})}
      style={styles.card}
    >
      <Image style={styles.image} source={{ uri: photos[0]?.[0]?.uri }} />
      <View style={{ width: "100%", justifyContent: "space-evenly" }}>
        <View style={{ padding: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {selectedDay ? (
              <Text
                style={[
                  styles.date,
                  {
                    fontWeight: "500",
                    color: colors.t4,
                    fontSize: 15,
                    // marginBottom: title?.length > 27 ? 3 : 0,
                    // bottom: 1,
                  },
                ]}
              >
                {chosenDay + " - "}
              </Text>
            ) : (
              <>
                <Text
                  style={[
                    styles.date,
                    {                      color: colors.t4,
                      fontSize: 15,
                      bottom: 1,
                    },
                  ]}
                >
                
                    {dates?.[0]?.fullDisplayDate }
                </Text>
              </>
            )}
          
          </View>

          <Text
            numberOfLines={2}
            style={[
              styles.title,
             
            ]}
          >
            {title}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={[
                styles.venue,
                { color: colors.t4 },
              ]}
            >
              {venue?.displayName}, {venue?.address?.city}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={[
                styles.venue,
                { color: colors.t4 },

              ]}
            >
              {`Apartir de `}
            </Text>
            <Text
              style={[
                styles.venue,
                {
                  color: colors.t3,
                  fontWeight: "700",
                  fontSize: 15,
                  // color: greyy,
                },
              ]}
            >
              {`cve ${formatNumber(item?.tickets?.[0]?.price)}`}
            </Text>
          </View>

        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    // alignItems:"center",
    height: 110,

    borderRadius: 10,
    backgroundColor: colors.background,
    overflow: "hidden",
    width: "95%",
    alignSelf: "center",
    // alignItems: "center",
    // borderRadius: 10,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 1,
    // shadowRadius: 1,
    elevation: 0.5,
    marginTop: 15,
  },

  image: {
    width: 110,
    height: "100%",
    borderRadius: 10,
  },
  venue: {
    // fontSize: 14.5,
    // alignSelf: "flex-start",
    // fontWeight: "600",
    fontSize: 14.5,
    alignSelf: "flex-start",
    fontWeight: "400",
    marginBottom: 3,
    // color: greyy,
  },
  title: {
    alignSelf: "flex-start",
    fontSize: 17,
    fontWeight: "500",
    color: colors.t2,
    lineHeight: 18,
    width: "70%",
    // marginVertical: 5,
    marginTop: 5,
    marginBottom: 3,
  },

  date: {
    fontSize: 14.5,
    alignSelf: "flex-start",
    fontWeight: "400",

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
