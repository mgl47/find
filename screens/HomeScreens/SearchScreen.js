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
import colors from "../../components/colors";

const SearchScreen = ({ navigation: { goBack }, route }) => {
  const { height, width } = useWindowDimensions();

  return (
    <Screen>
      <Header />

      <View
        style={{
          borderRadius: 20,
          overflow: "hidden",
          backgroundColor: "red",
          height: 195,
          width: 200,
        }}
      >
        <Image
          style={{
            height: 195,
            width: 200,
            borderRadius: 20,
            position: "absolute",
            // marginBottom: 50,
            zIndex: 2,
            // top: 150,
          }}
          source={{
            uri: "https://d1mnxluw9mpf9w.cloudfront.net/media/13277/Rolling-loud-logo.jpg",
          }}
        />
        <LinearGradient
          // Button Linear Gradient

          colors={["transparent", colors.grey, colors.background]}
          style={{ height: 145, width: 200, zIndex: 2, top: 50 }}
        />
      </View>
      <ImageBackground
        style={{
          width: 225,
          height: 195,
          borderRadius: 10,
          overflow: "hidden",
          left:70,
        }}
        source={{
          uri: "https://d1mnxluw9mpf9w.cloudfront.net/media/13277/Rolling-loud-logo.jpg",
        }}
      >
        <LinearGradient
          colors={["#00000000", "#000000"]}
          style={{ height: "100%", width: "100%" }}
        ></LinearGradient>
      </ImageBackground>

      {/* <BigTicket /> */}
    </Screen>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});

// import {
//   StyleSheet,
//   Text,
//   View,
//   useWindowDimensions,
//   Image,
//   ImageBackground,
// } from "react-native";
// import React from "react";
// import Header from "../../components/navigation/Header";
// import Screen from "../../components/Screen";
// import Svg, { Path, Defs, ClipPath, Image as SvgImage } from "react-native-svg";
// import { RNHoleView } from "react-native-hole-view";
// import BigTicket from "../../components/tickets/BigTicket";
// import { LinearGradient } from "expo-linear-gradient";

// const SearchScreen = ({ navigation: { goBack }, route }) => {
//   const { height, width } = useWindowDimensions();

//   return (
//     <Screen>
//       <Header />
//       <View
//         style={{
//           height,
//           width,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <View
//           style={{
//             borderRadius: 20,
//             overflow: "hidden",
//             backgroundColor: "red",
//           }}
//         >
//           <Image
//             style={{
//               height: 195,
//               width: 200,
//               borderRadius: 20,

//               // marginBottom: 50,
//               zIndex: 2,
//               top: 150,
//             }}
//             source={{
//               uri: "https://d1mnxluw9mpf9w.cloudfront.net/media/13277/Rolling-loud-logo.jpg",
//             }}
//           />
//           <LinearGradient
//             // Button Linear Gradient
//             colors={["transparent", "#3b5998", "#192f6a"]}
//             style={{ height: 150, width: 200, zIndex: 2 }}
//           ></LinearGradient>
//         </View>
//       </View>
//       {/* <BigTicket /> */}
//     </Screen>
//   );
// };

// export default SearchScreen;

// const styles = StyleSheet.create({});
