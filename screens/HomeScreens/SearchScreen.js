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
        {/* <Image
          style={{ height: 300, width: 200, marginBottom: 50 }}
          source={{
            uri: "https://d1mnxluw9mpf9w.cloudfront.net/media/13277/Rolling-loud-logo.jpg",
          }}
          blurRadius={10}
        /> */}
        <BigTicket />

        {/* <Svg
          width={200}
          height={300}
          viewBox="0 0 443 743"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Defs>
            <ClipPath id="clipPath">
              <Path
                d="M.502 42.003c0-22.92 18.58-41.5 41.5-41.5h358c22.92 0 41.5 18.58 41.5 41.5v471.504c-27.66.268-50 22.774-50 50.497 0 27.724 22.34 50.229 50 50.498v85.502c0 22.92-18.58 41.5-41.5 41.5h-358c-22.92 0-41.5-18.58-41.5-41.5v-85.502c27.66-.269 50-22.774 50-50.498 0-27.723-22.34-50.229-50-50.497V42.003z"
                fill="#E2E2E2"
                stroke="#000"
              />
            </ClipPath>
          </Defs>


          <Text style={{ fontSize: 18, top: 30 }}>sgh jhgjfjiujgdajfvhskl</Text>
          <SvgImage
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            href={{
              uri: "https://d1mnxluw9mpf9w.cloudfront.net/media/13277/Rolling-loud-logo.jpg",
            }}
            clipPath="url(#clipPath)"
          />
        </Svg> */}
      </View>
    </Screen>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
