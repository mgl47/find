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
export default function BigTicket({ uri, tickets, event }) {
  const { width, height } = useDesign();
  //  const totalAmount = tickets.reduce((accumulator, ticket) => {
  //     const ticketAmount = ticket.amount * ticket.price;
  //     return accumulator + ticketAmount;
  //   }, 0);

  // const totalAmount = tickets.reduce((accumulator, ticket) => {
  //   const ticketAmount = ticket.amount * ticket.price;
  //   return accumulator + ticketAmount;
  // }, 0);
  // console.log(
  //   tickets.forEach((ticket) => {
  //     // const ticketAmount = ticket.reduce((acc, item) => acc + item.amount, 0);

  //     console.log(`Ticket ID: ${ticket.id}, Total Amount: ${ticket.amount}`);
  //   })
  // );
  // const totalAmount = tickets.map(ticket => ticket.amount);
  const totalAmount = tickets.reduce((accumulator, ticket) => {
    const ticketAmount = ticket.amount + accumulator;

    return ticketAmount;
  }, 0);

  function calculateTotalAmount(tickets) {
    let totalAmount = 0;
    for (let i = 0; i < tickets.length; i++) {
      totalAmount += tickets[i].amount;
    }
    return totalAmount;
  }
  // const totalAmount = calculateTotalAmount(tickets);
  return (
    <View
      style={{
        // width: width,
        // height: 250,
        backgroundColor: colors.background,
        padding: 10,
        // alignItems: "center",
        // justifyContent: "center",
      }}
    >
      <ImageBackground
        blurRadius={8}
        // tintColor={"black"}
        style={{
          height: 200,
          // width: 350,

          width: width * 0.95,
          borderRadius: 20,
          overflow: "hidden",
        }}
        source={{
          uri,
        }}
      >
        <View style={{ left: "40%", width: "60%" }}>
          <Text
            style={{
              color: "white",
              fontSize: 17,
              fontWeight: "600",
              marginRight: 10,
              // left: 20,
            }}
          >
            {event?.title}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-end",
            padding: 10,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 17,
              fontWeight: "600",
              marginRight: 10,
              // left: 20,
            }}
          >
            {tickets?.length} Bilhetes
          </Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={25}
            color={colors.white}
          />
        </View>
        <LinearGradient
          // colors={["#00000000", "#000000"]}
          colors={["transparent", colors.black]}
          style={{
            height: 200,
            width: "100%",
            position: "absolute",
            bottom: 0,
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                backgroundColor: colors.background,
                height: 50,
                width: 50,
                // position: "absolute",
                left: 80,
                bottom: -175,
                zIndex: 6,
                borderRadius: 100,
              }}
            />
            <View
              style={{
                backgroundColor: colors.background,
                height: 50,
                width: 50,
                position: "absolute",
                left: 80,
                top: -30,
                zIndex: 2,
                borderRadius: 100,
              }}
            />
            <View
              style={{
                transform: [{ rotate: "90deg" }],
                position: "absolute",
                bottom: 100,
                // left: 35,
                left: width * 0.1,
                zIndex: 2,
                // backgroundColor: "blue",
              }}
            >
              {/* <Text
              style={{
                color: colors.background,
                fontSize: 50,
                // textShadowColor: "rgba(0, 0, 0, 0.75)",
                // textShadowOffset: { width: 0, height: 1 },
                // textShadowRadius: 20,
                left: Platform.OS === "android" ? 33 : 16,

                bottom: Platform.OS === "android" ? 0 : -20,
              }}
            >
              - - - - - -
            </Text> */}
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({});
