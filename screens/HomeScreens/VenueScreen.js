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
import Animated, { FadeIn, FadeOut, SlideOutUp } from "react-native-reanimated";
import React, { useEffect, useState } from "react";
import colors from "../../components/colors";
import { ActivityIndicator, Checkbox, Chip } from "react-native-paper";

import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
  FontAwesome5,
  Feather,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import ViewMoreText from "react-native-view-more-text";
import MapView, { Marker } from "react-native-maps";
import { venues } from "../../components/Data/venue";

import { ImageBackground } from "react-native";
import { useData } from "../../components/hooks/useData";
import { useDesign } from "../../components/hooks/useDesign";
import axios from "axios";
import uuid from "react-native-uuid";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from "rn-placeholder";
import ImageView from "react-native-image-viewing";
import { useAuth } from "../../components/hooks/useAuth";
import SmallCard from "../../components/cards/SmallCard";

const VenueScreen = ({ navigation, navigation: { goBack }, route }) => {
  const item = route.params;

  const { width, height, isIPhoneWithNotch } = useDesign();
  const { user, headerToken, getUpdatedUser } = useAuth();

  const { apiUrl } = useData();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [imageVisible, setImageVisible] = useState(false);
  const [currentImageIndex, setImageIndex] = useState(0);
  const [following, setFollowing] = useState(false);
  const [followBlock, setFollowBlock] = useState(false);
  const [events, setEvents] = useState([]);

  const getVenues = async () => {
    try {
      const result = await axios.get(`${apiUrl}/venues/?&filter=${item?.uuid}`);

      if (result?.data?.length > 0) {
        setVenue(result?.data?.[0]);

        setLoading(false);
      }
    } catch (error) {
      console.log(error?.response?.data?.msg);
    } finally {
    }
  };
  const getEvents = async () => {
    const result = await axios.get(`${apiUrl}/events/?venue=${item?.uuid}`);
    // console.log(result?.data);
    setEvents(result?.data);
  };

  useEffect(() => {
    getVenues();
    getEvents();
  }, []);
  useEffect(() => {
    if (user?.followedVenues?.includes(venue?._id)) setFollowing(true);
  }, [venue]);
  console.log(item?.mapSnap);

  const followVenue = async () => {
    setFollowBlock(true);
    let updateFollowedVenue = [];

    updateFollowedVenue = user?.followedVenues || [];

    const index = updateFollowedVenue.indexOf(venue?._id);
    if (user?.followedVenues?.includes(venue?._id) && index !== -1) {
      setFollowing(false);

      updateFollowedVenue.splice(index, 1);
    } else {
      setFollowing(true);

      updateFollowedVenue.push(venue?._id);
    }

    try {
      const response = await axios.patch(
        `${apiUrl}/user/current/${user?._id}`,
        {
          operation: {
            type: "follow",
            task: "venue",
            target: venue?._id,
          },
          updates: {
            followedVenues: updateFollowedVenue,
          },
        },
        { headers: { Authorization: headerToken } }
      );
      // console.log(response?.data);
      await getUpdatedUser();
    } catch (error) {
      console.log(error?.response?.data?.msg);
    } finally {
      setFollowBlock(false);
    }
  };
  const [initialWidth, setInitalWidth] = useState(width);
  const [scrolling, setScrolling] = useState(false);
  const onShowGallery = (index) => {
    setImageIndex(index);
    setImageVisible(true);
  };
  const [scrollingPos, setScrollingPos] = useState(0);
  const handleScroll = (event) => {
    setScrolling(event.nativeEvent.contentOffset.y > 200);
    setScrollingPos(event.nativeEvent.contentOffset.y / 20);
  };

  function handleMediaScroll(event) {
    setMediaIndex(
      parseInt(
        event.nativeEvent.contentOffset.x / Dimensions.get("window").width
      ).toFixed()
    );
  }
  const [inFullscreen, setInFullsreen] = useState(false);

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
  const [categoryIndex, setCategoryIndex] = useState(0);

  function onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCategoryIndex(pageNum);
    // console.log(categoryIndex);
  }
  // useEffect(() => {
  //   // console.log(categoryIndex);
  // }, [categoryIndex]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            left: 20,
          }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color={colors.white}
            style={
              !scrolling && {
                shadowOffset: { width: 0.5, height: 0.5 },
                shadowOpacity: 0.3,
                shadowRadius: 1,
                elevation: 2,
              }
            }
          />
        </TouchableOpacity>
      ),
      headerRight: () =>
        !inFullscreen &&
        !scrolling &&
        venue && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              // zIndex: 3,
              // position: "absolute",
              right: 10,
              // opacity: indexVisible ? 0 : 1,
              // top: height * 0.33,
              // top: height * 0.05,
              shadowOffset: { width: 0.5, height: 0.5 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              elevation: 2,
            }}
          >
            <MaterialIcons
              style={{
                right: 30,
                // shadowOffset: { width: 0.5, height: 0.5 },
                // shadowOpacity: 0.3,
                // shadowRadius: 1,
                // elevation: 2,
                position: "absolute",
              }}
              name="photo-library"
              size={20}
              color={colors.white}
            />
            <Text
              style={{
                color: colors.white,
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              {Number(mediaIndex) +
                1 +
                "/" +
                Number(venue?.photos?.[1]?.length)}
            </Text>
          </View>
        ),
      headerTitle: () => null,
    });
  }, [scrolling, mediaIndex, venue]);

  if (loading) {
    return (
      <Animated.View
        style={{ flex: 1 }}
        entering={FadeIn}
        // exiting={FadeOut}
      >
        <Placeholder
          Animation={Fade}

          // Left={PlaceholderMedia}
          // Right={PlaceholderMedia}
        >
          <ActivityIndicator
            style={{
              position: "absolute",
              zIndex: 2,
              alignSelf: "center",
              paddingTop: isIPhoneWithNotch ? 60 : 10,
            }}
            animating={true}
            color={colors.light2}
          />
          <PlaceholderLine style={{ borderRadius: 0, height: 270, width }} />
          <View style={{ padding: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <PlaceholderLine
                style={{
                  borderRadius: 20,
                  height: 30,
                  width: "27%",
                  marginRight: 10,
                  // marginHorizontal: 10,
                }}
              />
              <Animated.View
                style={{
                  // position: "absolute",
                  alignSelf: "center",
                  // top: 10,
                  // zIndex: 2,
                  marginVertical: 20,
                }}
                // entering={SlideInUp.duration(300)}
                // exiting={SlideOutUp.duration(300)}
              ></Animated.View>

              <PlaceholderLine
                style={{ borderRadius: 20, height: 30, width: "27%" }}
              />
              <PlaceholderLine
                style={{
                  borderRadius: 5,
                  height: 30,
                  width: 45,
                  position: "absolute",
                  right: 10,
                  bottom: 3,
                }}
              />
              <PlaceholderLine
                style={{
                  borderRadius: 5,
                  height: 30,
                  width: 45,
                  position: "absolute",
                  right: 70,
                  bottom: 3,
                }}
              />
            </View>
            <PlaceholderLine
              style={{
                borderRadius: 20,
                height: 15,
                width: "90%",
                marginTop: 10,
              }}
            />
            <PlaceholderLine
              style={{ borderRadius: 20, height: 15, width: "90%", bottom: 2 }}
            />
            <PlaceholderLine
              style={{ borderRadius: 20, height: 15, width: "70%", bottom: 2 }}
            />
            <PlaceholderLine
              style={{
                width: "100%",
                marginTop: 10,
                // borderRadius: 5,
                height: 250,
              }}
            />
            <PlaceholderLine
              style={{
                borderRadius: 20,
                height: 20,
                width: "30%",
                marginTop: 10,
              }}
            />
          </View>
        </Placeholder>
      </Animated.View>
    );
  }
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
            backgroundColor: colors.primary2,
            zIndex: 2,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: 18,
              fontWeight: "500",
              color: colors.white,
              fontWeight: "500",
              position: "absolute",
              bottom: 10,
              // marginLeft:70,
              marginLeft: 50,

              textAlign: "center",
              width: "75%",
            }}
          >
            {venue?.displayName}
          </Text>
        </Animated.View>
      )}

      <Animated.FlatList
        showsVerticalScrollIndicator={false}
        entering={FadeIn.duration(400)}
        data={events}
        keyExtractor={(item) => item?.uuid}
        scrollEventThrottle={16}
        scrollEnabled={!inFullscreen}
        onScroll={handleScroll}
        // onMomentumScrollEnd={onScrollEnd}
        bounces={false}
        ListHeaderComponent={
          <>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "500",
                marginBottom: 5,
                color: colors.white,
                position: "absolute",
                top: 230,
                zIndex: 2,
                marginLeft: 10,
              }}
            >
              {venue?.displayName}
            </Text>
            <FlatList
              scrollEnabled={venue?.photos?.[0]?.length > 1}
              style={{ backgroundColor: colors.grey }}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              horizontal
              onScroll={(e) => handleMediaScroll(e)}
              scrollEventThrottle={20}
              data={venue?.photos?.[1]}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.95}
                      onPress={() => onShowGallery(index)}
                    >
                      <ImageBackground
                        source={{ uri: item?.uri }}
                        style={{ width: initialWidth, height: 270 }}
                      >
                        <LinearGradient
                          colors={[
                            "transparent",
                            "transparent",
                            "transparent",
                            "transparent",
                            colors.dark2,
                          ]}
                          //                         colors={["#00000000", "#0000000000", "#000000000"]}

                          style={{ height: "100%", width: "100%" }}
                        ></LinearGradient>

                        <ImageView
                          // images={savingMode ? listing?.thumb : listing?.photos}
                          images={venue?.photos?.[1]}
                          imageIndex={currentImageIndex}
                          onRequestClose={() => setImageVisible(false)}
                          visible={imageVisible}
                        />
                      </ImageBackground>
                    </TouchableOpacity>
                  );
                }
              }}
            />
            <View style={styles.container}>
              {/* <Text
                style={{ fontSize: 20, fontWeight: "500", marginBottom: 5 }}
              >
                {venue?.displayName}
              </Text> */}

              <View style={{ flexDirection: "row", marginVertical: 3 }}>
                <Chip
                  // elevated
                  elevation={1}
                  icon={() => (
                    <MaterialCommunityIcons
                      name={following ? "heart" : "heart-outline"}
                      color={following ? colors.white : colors.black2}
                      size={20}
                    />
                  )}
                  textStyle={{
                    color: following ? colors.white : colors.black,
                  }}
                  style={{
                    backgroundColor: following ? colors.primary : colors.white,
                    // paddingHorizontal: 2,
                    marginRight: 0,
                    borderRadius: 12,
                    width: 110,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  disabled={followBlock}
                  onPress={followVenue}
                >
                  {following ? "Seguindo" : "Seguir"}
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
                    borderRadius: 12,
                  }}
                  onPress={() => console.log("Pressed")}
                >
                  Partilhar
                </Chip>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // marginVertical: 10,
                    marginLeft: 10,
                  }}
                >
                  <TouchableOpacity style={{ marginRight: 10 }}>
                    <AntDesign
                      name="facebook-square"
                      size={26}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginRight: 10 }}>
                    <AntDesign
                      name="instagram"
                      size={26}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginRight: 10 }}>
                    <AntDesign
                      name="twitter"
                      size={27}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {venue?.description && (
                <>
                  <View style={styles.separator} />
                  <ViewMoreText
                    numberOfLines={6}
                    renderViewMore={renderViewMore}
                    renderViewLess={renderViewLess}
                    textStyle={{ textAlign: "left" }}
                  >
                    <Text style={{ fontSize: 15 }}>{venue?.description}</Text>
                  </ViewMoreText>
                </>
              )}
            </View>

            <View style={styles.container}>
              {/* <Image
                resizeMode="contain"
                source={{ uri: venue?.mapSnap }}
                height={200}
                width={"100%"}

                // style={{
                //   width: "100%",
                //   height: 150,
                //   borderRadius: 10,
                // }}
                // style={styles.map}
              /> */}

              <View
                style={{
                  // height: 200,
                  backgroundColor: colors.white,
                  //   padding: 10,
                  alignItems: "center",
                  borderBottomRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  shadowOffset: { width: 0.5, height: 0.5 },
                  shadowOpacity: 0.1,
                  shadowRadius: 1,
                  elevation: 2,
                  // shadowColor: colors.light2,
                }}
              >
                <MapView
                  initialRegion={{
                    latitude: venue?.address?.lat,
                    longitude: venue?.address?.long,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.011,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  mapType="standard"
                  style={styles.map}
                >
                  <Marker
                    pinColor={colors.primary}
                    coordinate={{
                      latitude: venue?.address?.lat,
                      longitude: venue?.address?.long,
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
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        marginBottom: 3,
                      }}
                    >
                      Direções
                    </Text>
                    <Text style={{ color: colors.black2 }}>
                      {venue?.address?.zone}, {venue?.address?.city}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome5
                      name="walking"
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={{ fontSize: 22, color: colors.black2 }}>
                      {" "}
                      |{" "}
                    </Text>
                    <MaterialCommunityIcons
                      name="car"
                      size={25}
                      color={colors.primary}
                    />
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    width: "95%",
                    height: 1,
                    backgroundColor: colors.grey,

                    alignSelf: "center",
                  }}
                />
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
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        marginBottom: 3,
                      }}
                    >
                      Telefonar
                    </Text>
                    <Text style={{ color: colors.black2 }}>
                      {venue?.phone1}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="phone"
                    size={25}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  // width: "80%",
                  color: colors.primary,
                  marginLeft: 5,
                  marginTop: 15,
                  //   marginBottom: 5,
                }}
              >
                Próximos Eventos
              </Text>
              <Text
                style={{
                  fontSize: 19,
                  fontWeight: "500",
                  // width: "80%",
                  color: colors.primary2,
                  marginLeft: 5,
                  marginTop: 5,
                }}
              >
                {events?.length > 1
                  ? events?.length + " Eventos"
                  : events?.length > 0
                  ? events?.length + " Evento"
                  : ""}
              </Text>

              {/* <View style={{ marginBottom: 100 }} /> */}
            </View>
          </>
        }
        style={{ backgroundColor: colors.background }}
        renderItem={({ item, index }) => {
          // console.log(index);
          return (
            events?.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  // shadowOffset: { width: 0.5, height: 0.5 },
                  // shadowOpacity: 0.3,
                  // shadowRadius: 1,
                  // elevation: 2,
                  shadowOffset: { width: 0.5, height: 0.5 },
                  shadowOpacity: 0.1,
                  shadowRadius: 1,
                  elevation: 0.5,
                  paddingHorizontal: 10,
                  marginTop: 10,
                }}
                onPress={() => navigation.navigate("event", item)}
              >
                <SmallCard {...item} />
              </TouchableOpacity>
            )
          );
        }}
        ListFooterComponent={<View style={{ marginBottom: 50 }} />}
      />
    </>
  );
};

export default VenueScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: colors.background,
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
    borderRadius: 5,
    borderBottomRightRadius: 0,
    overflow: "hidden",
    borderBottomLeftRadius: 0,
    height: 200,

    backgroundColor: colors.grey,
  },
});
