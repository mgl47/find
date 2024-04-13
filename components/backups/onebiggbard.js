import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ImageBackground } from "react-native";
import colors from "../colors";
import { useDesign } from "../hooks/useDesign";
import { LinearGradient } from "expo-linear-gradient";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
  FontAwesome5,
  Feather,
  Ionicons,
} from "@expo/vector-icons";

export default function OneBigTicket({ uri, tickets, event }) {
  const { width, height } = useDesign();
  const totalAmount = tickets?.reduce((accumulator, ticket) => {
    const ticketAmount = ticket.amount + accumulator;

    return ticketAmount;
  }, 0);

  const weekdy = tickets?.[0]?.dates?.[0]?.displayDate?.split(",")[0];
  const day = tickets?.[0]?.dates?.[0]?.displayDate?.split(" ")[1];
  const month = tickets?.[0]?.dates?.[0]?.displayDate?.split(" ")[2];
  const hour = tickets?.[0]?.dates?.[0]?.hour;
  return (
    <ImageBackground
      blurRadius={8}
      // tintColor={"black"}
      style={{
        height: 200,
        // width: 350,
        //     padding: 10,

        width: width * 0.95,
        borderRadius: 15,
        overflow: "hidden",
      }}
      source={{
        uri,
      }}
    >
      <View
        style={{ left: "24%", width: "80%", padding: 12, zIndex: 2, top: 20 }}
      >
        <Text
          style={{
            color: colors.white,
            fontSize: 19,
            fontWeight: "600",
            marginRight: 10,
            // textAlign: "center",
            // top: 30,
            // left: 20,
          }}
        >
          {event?.title}
        </Text>
        <Text
          style={{
            color: colors.lightGrey,
            fontSize: 15,
            fontWeight: "500",
            marginRight: 10,
            // textAlign: "center",
            top: 10,
            // left: 20,
          }}
        >
          {event?.venue?.displayName+", "+event?.venue?.city}
        </Text>
        {/* <Text
          style={{
            color: colors.lightGrey,
            fontSize: 13,
            fontWeight: "600",
            marginRight: 10,
            textAlign: "center",
            top: 50,
            // left: 20,
          }}
        >
          {event?.venue?.address?.zone},{event?.venue?.address?.city}
        </Text> */}
      </View>
      <View
        style={{
          backgroundColor: colors.background,
          height: 40,
          width: 50,
          position: "absolute",
          left: -34,
          top: 80,
          zIndex: 5,
          borderRadius: 30,
        }}
      />
      <LinearGradient
        // colors={["#00000000", "#000000"]}
        colors={["transparent", colors.black]}
        style={{
          height: 200,
          width: "100%",
          position: "absolute",
          bottom: 0,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          // padding: 10,
          // alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: 80,
          height: "100%",
          width: "25%",
        }}
      >
        <View style={{ alignItems: "center", zIndex: 5, bottom: 50 }}>
          <Text
            style={{
              fontSize: 18,
              color: colors.white,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            {weekdy}
          </Text>
          <Text
            style={{
              fontSize: 25,
              color: colors.lightGrey,
              fontWeight: "700",
              marginBottom: 8,
            }}
          >
            {day}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.grey,
              fontWeight: "500",
              marginBottom: 8,
            }}
          >
            {month}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: colors.white,
              fontWeight: "500",
              top: 20,
            }}
          >
            {hour}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-end",
          padding: 10,
          position: "absolute",
          bottom: 0,
          right: 0,
          zIndex: 3,
        }}
      >
        <Text
          style={{
            color: colors.grey,
            fontSize: 15,
            fontWeight: "600",
            marginRight: 5,
            // left: 20,
          }}
        >
          {tickets?.length + (tickets?.length > 1 ? " Bilhetes" : " Bilhete")}
        </Text>
        <MaterialCommunityIcons
          name="arrow-right"
          size={20}
          color={colors.grey}
        />
      </View>
      <View
        style={{
          height: 1,
          width: 200,
          // backgroundColor: "blue",
          position: "absolute",
          // right: width * 0.12,
          left: -10,

          top: 100,
          transform: [{ rotate: "90deg" }],
          borderRadius: 1,
          borderWidth: 1,
          borderColor: colors.grey,
          borderStyle: "dashed",
          zIndex: 3,
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
