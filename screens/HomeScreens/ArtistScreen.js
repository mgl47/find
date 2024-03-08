import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, SlideOutUp } from "react-native-reanimated";
import React, { useState } from "react";
import colors from "../../components/colors";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
  AntDesign,
  Fontisto,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";
import { TouchableWithoutFeedback } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import ViewMoreText from "react-native-view-more-text";
import MapView, { Marker } from "react-native-maps";
import { venues } from "../../components/Data/venue";
import { Chip } from "react-native-paper";
import { artist } from "../../components/Data/artist";
const ArtistScreen = ({ navigation, navigation: { goBack }, route }) => {
  const { width, height } = Dimensions.get("window");
  const Event = route.params;
  const videoRef = React.useRef(null);
  const [muted, setMuted] = useState(true);
  const [initialWidth, setInitalWidth] = useState(width);
  const [scrolling, setScrolling] = useState(false);
  const handleScroll = (event) => {
    setScrolling(event.nativeEvent.contentOffset.y > 120);
    console.log(event.nativeEvent.contentOffset.y);
  };
  const [inFullscreen, setInFullsreen] = useState(false);
  const [isMute, setIsMute] = useState(true);

  const [liked, setLiked] = useState(false);
  const renderViewMore = (onPress) => {
    return (
      <TouchableOpacity style={styles.more} onPress={onPress}>
        {/* <Text style={[styles.more]}>Ver mais</Text> */}
        <MaterialCommunityIcons
          name="unfold-more-horizontal"
          size={26}
          color={colors.primary}
        />
        {/* <Entypo name="chevron-down" size={24} color={colors.primary} /> */}
      </TouchableOpacity>
    );
  };
  const renderViewLess = (onPress) => {
    return (
      <TouchableOpacity style={styles.more} onPress={onPress}>
        {/* <Text style={[styles.more]}>Ver menos</Text> */}
        <MaterialCommunityIcons
          name="unfold-more-horizontal"
          size={26}
          color={colors.primary}
        />
        {/* <Entypo name="chevron-up" size={24} color={colors.primary} /> */}
      </TouchableOpacity>
    );
  };

  return (
    <>
      {scrolling && (
        <Animated.View
          entering={FadeIn.duration(200)}
          // exiting={FadeOutUp.duration(200)}
          exiting={SlideOutUp.duration(500)}
          style={{
            position: "absolute",
            height: 90,
            width: "100%",
            backgroundColor: colors.white,
            zIndex: 2,
          }}
        />
      )}
      {!inFullscreen && (
        <View
          style={[
            styles.headerContainer,
            {
              zIndex: 2,
              justifyContent: "space-between",
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.back}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color={scrolling ? colors.black : colors.white}
            />
          </TouchableOpacity>
          {scrolling && (
            <View style={{ width: "66%" }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  top: 40,
                  color: colors.black,
                }}
              >
                {artist?.displayName}
              </Text>
            </View>
          )}
          <View style={styles.share_like}></View>
        </View>
      )}

      <FlatList
        scrollEventThrottle={16}
        onScroll={handleScroll}
        bounces={false}
        data={artist?.upcomingEvents}
        keyExtractor={(item) => item?.id}
        ListHeaderComponent={
          <>
            <TouchableOpacity activeOpacity={0.9}>
              <Image
                style={{ height: 150, width: "100%" }}
                source={{ uri: artist?.cover }}
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "row" }}>
              <TouchableHighlight
                underlayColor={colors.light}
                onPress={() => {}}
                style={{
                  backgroundColor: colors.black,
                  borderRadius: 100,
                  bottom: 50,
                  marginLeft: 10,
                }}
                // activeOpacity={0.7}
              >
                <Image
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 100,
                    //   marginTop: 100,
                  }}
                  source={{ uri: artist?.avatar }}
                />
              </TouchableHighlight>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 10,
                  marginLeft: 20,
                  height: 30,
                }}
              >
                <Chip
                  // elevated
                  elevation={1}
                  icon={() => (
                    <MaterialCommunityIcons
                      name={!liked ? "heart" : "heart-outline"}
                      color={!liked ? colors.white : colors.black2}
                      size={20}
                    />
                  )}
                  textStyle={{
                    color: !liked ? colors.white : colors.black,
                  }}
                  style={{
                    backgroundColor: !liked ? colors.primary : colors.white,
                    // paddingHorizontal: 2,
                    marginRight: 10,
                    borderRadius: 20,
                  }}
                  onPress={() => console.log("Pressed")}
                >
                  Favorito
                </Chip>

                <Chip
                  elevation={1}
                  icon={() => (
                    <MaterialIcons
                      name="ios-share"
                      size={20}
                      color={colors.black2}
                    />
                  )}
                  textStyle={
                    {
                      // color: colors.white,
                    }
                  }
                  style={{
                    backgroundColor: colors.white,
                    // paddingHorizontal: 2,
                    marginHorizontal: 10,
                    borderRadius: 20,
                  }}
                  onPress={() => console.log("Pressed")}
                >
                  Partilhar
                </Chip>
              </View>
            </View>
            {/* </View> */}
            <View style={styles.container}>
              <Text
                style={{ fontSize: 21, fontWeight: "600", marginBottom: 5 }}
              >
                {artist?.displayName}
              </Text>
              {artist?.description && (
                <ViewMoreText
                  numberOfLines={6}
                  renderViewMore={renderViewMore}
                  renderViewLess={renderViewLess}
                  textStyle={{ textAlign: "left" }}
                >
                  <Text style={{ fontSize: 15 }}>{artist?.description}</Text>
                </ViewMoreText>
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <TouchableOpacity style={{ marginRight: 15 }}>
                  <AntDesign
                    name="facebook-square"
                    size={26}
                    color={colors.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 15 }}>
                  <AntDesign
                    name="instagram"
                    size={26}
                    color={colors.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 15 }}>
                  <AntDesign name="twitter" size={27} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 15 }}>
                  <Entypo name="spotify" size={27} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 15 }}>
                  <Fontisto
                    name="applemusic"
                    size={25}
                    color={colors.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 15 }}>
                  <Fontisto
                    name="youtube-play"
                    size={24}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.separator} />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  // width: "80%",
                  color: colors.primary,
                  marginLeft: 5,
                  marginTop: 5,
                  // marginBottom: 5,
                }}
              >
                Próximos Eventos
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "500",
                  // width: "80%",
                  color: colors.black2,
                  marginLeft: 5,
                  marginTop: 5,
                  // marginBottom: 5,
                }}
              >
                {artist?.upcomingEvents?.length > 1
                  ? artist?.upcomingEvents?.length + " Eventos"
                  : artist?.upcomingEvents?.length > 0
                  ? artist?.upcomingEvents?.length + " Evento"
                  : ""}
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={{
                borderRadius: 10,
                padding: 10,
                marginBottom: 12,
                backgroundColor: colors.white,
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 1,
                elevation: 1,
                bottom: 50,
                width: "95%",
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  color: colors.black,
                  marginBottom: 3,
                  fontWeight: "500",
                  fontSize: 15,
                }}
              >
                {item?.date}
              </Text>
              <Text
                style={{
                  color: colors.primary,
                  marginBottom: 3,
                  fontWeight: "500",
                  fontSize: 16,
                }}
              >
                {item?.title}
              </Text>

              <Text
                style={{
                  color: colors.black2,
                  marginBottom: 3,
                  fontWeight: "500",
                  fontSize: 15,
                }}
              >
                {item?.promoter}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
};

export default ArtistScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    bottom: 50,
    // backgroundColor: colors.white,
  },
  headerContainer: {
    position: "absolute",
    zIndex: 1,
    height: 40,
    width: "100%",
    // backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: {
    marginLeft: 15,
    top: 40,
  },
  share_like: {
    flexDirection: "row",
    justifyContent: "space-around",
    top: 40,
    marginRight: 20,
  },
  share: {
    marginRight: 10,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: colors.grey,
    marginVertical: 5,
    alignSelf: "center",
  },
  more: {
    position: "absolute",

    backgroundColor: colors.background,
    color: colors.primary,
    alignSelf: "flex-end",
    fontWeight: "500",
    // marginBottom: 5,
    right: -7,
    bottom: -10,

    zIndex: 1,
  },
  map: {
    width: "100%",
    // borderRadius: 5,
    height: 150,
    backgroundColor: colors.grey,
  },
});
