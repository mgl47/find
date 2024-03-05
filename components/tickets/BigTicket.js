import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ImageBackground } from "react-native";

export default function BigTicket() {
  return (
    <View
      style={{
        width: 350,
        height: 250,
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "red",
          height: 50,
          width: 50,
          position: "absolute",
          left: 80,
          bottom: 0,
          zIndex: 1,
          borderRadius: 100,
        }}
      />
      <View
        style={{
          backgroundColor: "red",
          height: 50,
          width: 50,
          position: "absolute",
          left: 80,
          top: 0,
          zIndex: 1,
          borderRadius: 100,
        }}
      />
      <View
        style={{
          transform: [{ rotate: "90deg" }],
          position: "absolute",
          bottom: 100,
          left: 35,
          zIndex: 2,
          // backgroundColor: "blue",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 40,
            textShadowColor: "rgba(0, 0, 0, 0.75)",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 20,
          }}
        >
          - - - - - -
        </Text>
      </View>
      <ImageBackground
        blurRadius={10}
        // tintColor={"black"}
        style={{
          height: 200,
          width: 300,
          borderRadius: 10,
          overflow: "hidden",
        }}
        source={{
          uri: "https://d1mnxluw9mpf9w.cloudfront.net/media/13277/Rolling-loud-logo.jpg",
        }}
      ></ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({});
