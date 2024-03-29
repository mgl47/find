import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  ImageBackground,
} from "react-native";
import colors from "../colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

function BigCard(item) {
  // const title = "Sessão anual da literatura caboverdiana sd g das ag dsag das";
  // const item?.title =
  //   "ds bvnads b vadn vknad sa dsdds";
  return (
    <ImageBackground
      style={{
        height: height * 0.43,
        right: 30,
        borderRadius: 10,
        overflow: "hidden",
        width: "100%",
        marginTop: 10,
      }}
      source={{
        uri: item?.photos[0]?.[0]?.uri,
      }}
    >
      <LinearGradient
        // colors={["#00000000", "#000000"]}
        colors={["transparent", "black", colors.primary]}
        style={{
          height: 200,
          width: "100%",
          position: "absolute",
          bottom: 0,
          alignItems: "baseline",
        }}
      >
        <View
          style={{
            position: "absolute",
            bottom: 0,
            padding: 10,
            width: "100%",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={[
                styles.date,
                {
                  fontWeight: "600",
                  color: colors.white,
                  fontSize: 16,
                  marginBottom: 3,
                  // top: title2?.length > 39 ? 1 : 0,
                },
              ]}
            >
              {item?.dates?.[item?.dates?.length - 1]?.displayDate?.split(
                ","
              )[0] + ", "}
            </Text>
            <Text style={[styles.date, { color: colors.lightGrey }]}>
              {item?.dates?.[item?.dates?.length - 1]?.displayDate?.split(
                ", "
              )[1] + " - "}
            </Text>
            <Text style={[styles.date, { color: colors.lightGrey }]}>
              {item?.dates?.[0]?.hour}
            </Text>
          </View>

          <Text
            numberOfLines={2}
            style={[
              styles.title,
              {
                fontSize: 19,
                lineHeight: 19,
                fontWeight: "700",

                // fontSize: title?.length > 39 ? 16 : 18,
                // lineHeight: title?.length > 39 ? 15 : 30,
              },
            ]}
          >
            {/* {title2} */}
            {item?.title}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={[
                styles.venue,
                {
                  marginBottom: item?.title?.length > 39 ? 7 : 3,
                  //    color: colors.white,
                  color: colors.lightGrey,
                },
              ]}
            >
              {item?.venue?.displayName}, {item?.venue?.city}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  venue: {
    fontSize: 14.5,
    alignSelf: "flex-start",
    fontWeight: "600",
    color: colors.white,
  },
  title: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
    lineHeight: 30,
    width: "95%",
    marginVertical: 5,
  },

  date: {
    fontSize: 15,
    alignSelf: "flex-start",
    fontWeight: "600",
    color: colors.white,

    marginTop: 3,
  },
});

export default BigCard;
