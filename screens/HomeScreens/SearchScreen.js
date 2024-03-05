import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  ImageBackground,
} from "react-native";
import React from "react";
import Header from "../../components/navigation/Header";
import Screen from "../../components/Screen";
import Svg, { Path, Defs, ClipPath, Image as SvgImage } from "react-native-svg";
import { RNHoleView } from "react-native-hole-view";
import BigTicket from "../../components/tickets/BigTicket";
import { LinearGradient } from "expo-linear-gradient";

const SearchScreen = ({ navigation: { goBack }, route }) => {
  const { height, width } = useWindowDimensions();

  return (
    <Screen>
      <Header />
      <View
        style={{
          height,
          width,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <LinearGradient
        // Background Linear Gradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={styles.background}
      /> */}
        <View style={{ borderRadius: 20, overflow: "hidden" }}>
          <Image
            style={{
              height: 195,
              width: 200,
              borderRadius: 20,

              marginBottom: 50,
              zIndex: 1,
              top: 150,
            }}
            source={{
              uri: "https://d1mnxluw9mpf9w.cloudfront.net/media/13277/Rolling-loud-logo.jpg",
            }}
            // blurRadius={10}
          />
          <LinearGradient
            // Button Linear Gradient
            colors={["transparent", "#00233aE", "#0072CE"]}
            style={{ height: 150, zIndex: 2 }}
          ></LinearGradient>
        </View>

        {/* <BigTicket /> */}
      </View>
    </Screen>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
