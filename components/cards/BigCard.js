import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Pressable,
} from "react-native";
import colors, { darkColors } from "../colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableHighlight } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

function BigCard(item) {
  const navigation = useNavigation();
  // const title = "Sessão anual da literatura caboverdiana sd g das ag dsag das";

  return (
    <Pressable
      style={{
        right: 10,
        overflow: "hidden",
        borderRadius: 10,
        marginTop: 10,
        // backgroundColor: colors.dark2,
      }}
      onPress={() => navigation.navigate("event", { item })}

      // onPress={() => navigation.navigate("event", {eventId:item?._id})}

      // activeOpacity={1}
      // underlayColor={colors.background}
    >
      <ImageBackground
        style={{
          height: height * 0.43,
          width: "100%",
        }}
        source={{
          uri: item?.photos[1]?.[0]?.uri,
        }}
      >
        <LinearGradient
          // colors={["#00000000", "#000000"]}
          colors={["transparent", "black", colors.background]}
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
            {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[
                  styles.date,
                  {
                    fontWeight: "500",
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
            </View> */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[
                  styles.date,
                  {
                    fontWeight: "500",
                    color: colors.white,
                    fontSize: 16,
                    marginBottom: 3,
                    bottom: 1,
                    // top: title2?.length > 39 ? 1 : 0,
                  },
                ]}
              >
                {item?.dates?.[item?.dates?.length - 1]?.fullDisplayDate?.split(
                  ", "
                )[0] + ", "}
              </Text>
              <Text style={[styles.date, { color: colors.lightGrey }]}>
                {
                  item?.dates?.[
                    item?.dates?.length - 1
                  ]?.fullDisplayDate?.split(", ")[1]
                }
              </Text>
            </View>

            <Text
              numberOfLines={2}
              style={[
                styles.title,
                {
                  fontSize: 19,
                  lineHeight: 19,
                  fontWeight: "600",

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
                {item?.venue?.displayName}, {item?.venue?.address?.city}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  venue: {
    fontSize: 14.5,
    alignSelf: "flex-start",
    fontWeight: "400",
    color: colors.white,
  },
  title: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "500",
    color: colors.white,
    lineHeight: 30,
    width: "95%",
    marginVertical: 5,
  },

  date: {
    fontSize: 15,
    alignSelf: "flex-start",
    fontWeight: "400",
    color: colors.white,

    marginTop: 3,
  },
});

export default BigCard;
