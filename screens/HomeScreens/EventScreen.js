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
  FontAwesome5,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";
import { TouchableWithoutFeedback } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import ViewMoreText from "react-native-view-more-text";
import MapView, { Marker } from "react-native-maps";
import { venue } from "../../components/Data/venue";
import { Chip } from "react-native-paper";
const EventScreen = ({ navigation, navigation: { goBack }, route }) => {
  const { width, height } = Dimensions.get("window");
  const Event = route.params;
  const videoRef = React.useRef(null);
  const [muted, setMuted] = useState(true);
  const [initialWidth, setInitalWidth] = useState(width);
  const [scrolling, setScrolling] = useState(false);
  const handleScroll = (event) => {
    setScrolling(event.nativeEvent.contentOffset.y > 200);
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
                  fontSize: 17,
                  fontWeight: "500",
                  top: 40,
                  color: colors.black,
                }}
              >
                {Event?.title}
              </Text>
            </View>
          )}
          <View style={styles.share_like}>
            {/* <TouchableOpacity
              // onPress={() => }
              style={styles.share}
            >
              <MaterialIcons
                name="ios-share"
                size={25}
                color={scrolling ? colors.black : colors.white}
              />
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              onPress={() => setLiked(!liked)}
              style={styles.like}
            >
              <MaterialCommunityIcons
                name={liked ? "cards-heart" : "cards-heart-outline"}
                size={28}
                color={scrolling ? colors.black : colors.white}
              />
            </TouchableOpacity> */}
          </View>
        </View>
      )}
      {/* </SafeAreaView> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        scrollEnabled={!inFullscreen}
        onScroll={handleScroll}
        bounces={false}
      >
        <FlatList
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
          data={Event?.photos}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setMuted(!muted)}
            >
              <VideoPlayer
                fullscreen={{
                  inFullscreen: inFullscreen,
                  enterFullscreen: async () => {
                    setInFullsreen(true);

                    // setStatusBarHidden(true, "fade");
                    await ScreenOrientation.lockAsync(
                      ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
                    );

                    videoRef.current.setStatusAsync({
                      shouldPlay: true,
                    });
                  },
                  exitFullscreen: async () => {
                    // setStatusBarHidden(false, "fade");

                    await ScreenOrientation.lockAsync(
                      ScreenOrientation.OrientationLock.PORTRAIT_UP
                    );
                    setInFullsreen(false);
                  },
                }}
                mute={{
                  visible: true,
                  enterMute: () => setIsMute(true),
                  exitMute: () => setIsMute(false),
                  isMute: isMute,
                }}
                // style={{
                //   height: inFullscreen ? height : 270,
                //   width: inFullscreen ? "90%" : width,
                // }}

                style={{
                  videoBackgroundColor: "black",
                  height: inFullscreen ? width : 270,
                  width: inFullscreen ? height : initialWidth,
                }}
                videoProps={{
                  ref: videoRef,
                  source: {
                    uri: Event?.video?.uri,
                  },

                  // source: require("../assets/rolling.mp4"),
                  resizeMode: inFullscreen ? "contain" : "cover",
                  // useNativeControls
                  isMuted: isMute,
                  shouldPlay: true,
                  isLooping: true,
                }}
              />
            </TouchableOpacity>
          }
          renderItem={({ item }) => {
            {
              return !inFullscreen ? (
                <Image
                  style={{ width: initialWidth, height: 270 }}
                  source={{ uri: item?.uri }}
                />
              ) : (
                []
              );
            }
          }}
        />
        <View style={styles.container}>
          <Text style={{ fontSize: 20, fontWeight: "500", marginBottom: 5 }}>
            {Event?.title}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                // alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                // marginBottom: 0,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "500",
                  width: "70%",
                  color: colors.darkGrey,
                  marginBottom: 3,
                }}
              >
                {Event?.venue?.displayName}, {Event?.venue?.city}
              </Text>

              <View style={{ position: "absolute", right: 0 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                    // width: "80%",
                    color: colors.darkGrey,
                    // marginLeft: 5,
                    textAlign: "right",
                  }}
                >
                  {Event?.prices?.length > 1 ? "apartir de " : ""}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "500",
                    // width: "80%",
                    color: colors.primary,
                    // marginLeft: 5,
                  }}
                >
                  cve {Event?.prices[0]?.amount}
                </Text>
              </View>
            </View>
          </View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              // width: "80%",
              color: colors.primary,
            }}
          >
            {Event?.date}
          </Text>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 1,
              right: 5,
              // justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name="lightning-bolt-outline"
              size={24}
              color={colors.primary}
            />
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                // width: "70%",
                color: colors.darkGrey,
              }}
            >
              {Event?.going} Pessoas vão!
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginVertical: 3 }}>
            <Chip
              // elevated
              elevation={1}
              icon={() => (
                <MaterialCommunityIcons
                  name="calendar-heart"
                  color={colors.black2}
                  size={20}
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
                marginRight: 10,
                borderRadius: 20,
              }}
              onPress={() => console.log("Pressed")}
            >
              Interressado
            </Chip>
            <Chip
              elevation={1}
              icon={() => (
                <Ionicons
                  name="ticket-outline"
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
                borderRadius: 20,
              }}
              onPress={() => console.log("Pressed")}
            >
              Vou
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
          <View style={styles.separator} />
          <View>
            <ViewMoreText
              numberOfLines={6}
              renderViewMore={renderViewMore}
              renderViewLess={renderViewLess}
              textStyle={{ textAlign: "left" }}
            >
              <Text style={{ fontSize: 15 }}>{Event?.description}</Text>
            </ViewMoreText>
          </View>
          <View style={[styles.separator, { marginTop: 15 }]} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "500",
                // width: "80%",
                color: colors.primary,
                // marginLeft: 5,
                marginTop: 10,
              }}
            >
              Artistas
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "500",
                  // width: "80%",
                  color: colors.primary,
                  // marginLeft: 5,
                  marginTop: 10,
                }}
              >
                Ver todos
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={Event?.artists}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={{
                  padding: 5,
                  alignItems: "center",
                  // justifyContent: "center",
                }}
                onPress={() => navigation.navigate("artist", item)}
              >
                <Image
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 50,
                    marginBottom: 2,
                    borderWidth: 0.009,
                  }}
                  source={{ uri: item?.avatar }}
                />
                <Text
                  style={{
                    width: item?.displayName?.length > 15 ? 100 : null,
                    textAlign: "center",
                  }}
                >
                  {item?.displayName}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        <View style={styles.container}>
          {/* <View style={styles.separator} /> */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "500",

              color: colors.primary,

              marginBottom: 5,
            }}
          >
            Espaço
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("venue")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: colors.white,
              marginTop: 5,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              shadowOffset: { width: 0.5, height: 0.5 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              elevation: 2,
              height: 50,
              padding: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  borderWidth: 0.1,
                  marginRight: 10,
                }}
                source={{
                  uri: Event?.venue?.uri,
                }}
              />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "500",
                  // color: colors.white,
                }}
              >
                {Event?.venue?.displayName}
              </Text>
            </View>
            <Entypo name="chevron-right" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View
            style={{
              // height: 200,
              backgroundColor: colors.white,
              //   padding: 10,
              alignItems: "center",
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
              shadowOffset: { width: 0.5, height: 0.5 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              elevation: 2,
              // shadowColor: colors.light2,
            }}
          >
            <MapView
              initialRegion={{
                latitude: Event?.venue?.lat,
                longitude: Event?.venue?.long,
                latitudeDelta: 0.01,
                longitudeDelta: 0.011,
              }}
              provider="google"
              mapType="standard"
              style={styles.map}
            >
              <Marker
                pinColor={colors.primary}
                coordinate={{
                  latitude: Event?.venue?.lat,
                  longitude: Event?.venue?.long,
                }}
                //listing?.latitude listing?.longitude
              />
            </MapView>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 5,
                padding: 10,
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 15, fontWeight: "500", marginBottom: 3 }}
                >
                  Direções
                </Text>
                <Text>
                  {Event?.venue?.displayName}, {Event?.venue?.city}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="car"
                size={25}
                color={colors.primary}
              />
            </TouchableOpacity>
            {/* <View style={styles.separator} /> */}
            {/* <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                // marginTop: 5,
                padding: 10,

                // backgroundColor: colors.light2,
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 15, fontWeight: "500", marginBottom: 3 }}
                >
                  Telefonar
                </Text>
                <Text>{Event?.venue?.phone1}</Text>
              </View>
              <MaterialCommunityIcons
                name="phone"
                size={25}
                color={colors.primary}
              />
            </TouchableOpacity> */}
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "500",

              color: colors.primary,

              marginVertical: 10,
            }}
          >
            Promotor
          </Text>
          <View
            style={{
              backgroundColor: colors.white,

              borderRadius: 10,
              shadowOffset: { width: 0.5, height: 0.5 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              elevation: 2,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 10,
                alignItems: "center",

                // height: 50,
                // padding: 5,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    marginRight: 10,
                    borderWidth: 0.1,
                  }}
                  source={{
                    uri: Event?.promoter?.avatar,
                  }}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                    // color: colors.white,
                  }}
                >
                  {Event?.promoter?.displayName}
                </Text>
              </View>
              <Entypo name="chevron-right" size={24} color={colors.primary} />
            </TouchableOpacity>
            <View style={[styles.separator, { width: "90%" }]} />

            <TouchableOpacity
              style={{
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                // marginVertical: 5,
              }}
            >
              <View>
                <Text style={{ fontSize: 15, fontWeight: "500" }}>
                  Telefonar
                </Text>
                <Text>{Event?.promoter?.phone1}</Text>
              </View>
              <MaterialCommunityIcons
                name="phone"
                size={25}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 100 }} />
        </View>
      </ScrollView>
      {!inFullscreen && (
        <View
          style={{
            justifyContent: "space-around",
            width: "100%",
            height: Platform.OS === "android" ? 55 : 70,
            backgroundColor: colors.white,
            position: "absolute",
            zIndex: 1,
            bottom: 0,
            flexDirection: "row",
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 1,
            elevation: 3,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={{
              width: 150,
              height: 40,
              backgroundColor: colors.white, // position: "absolute",
              zIndex: 1,
              top: 10,
              // left: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              shadowOffset: { width: 1, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              elevation: 3,
              shadowColor: colors.dark,
              flexDirection: "row",
            }}
            activeOpacity={0.5}
          >
            <Text
              style={{
                fontSize: 15,
                color: colors.primary,
                fontWeight: "500",
                marginRight: 10,
              }}
            >
              Presentear
            </Text>
            <Feather name="gift" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            // onPress={() =>

            // }
            style={{
              width: 150,
              height: 40,
              backgroundColor: colors.primary, // position: "absolute",
              zIndex: 1,
              top: 10,
              // left: 10,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              shadowOffset: { width: 1, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              elevation: 3,
              shadowColor: colors.dark,
              flexDirection: "row",
            }}
            activeOpacity={0.5}
          >
            <Text
              style={{
                fontSize: 15,
                color: colors.white,
                fontWeight: "500",
                marginRight: 10,
              }}
            >
              Comprar
            </Text>
            <Ionicons name="ticket-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
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