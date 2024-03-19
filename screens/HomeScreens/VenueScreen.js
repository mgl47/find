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
import React, { useEffect, useState } from "react";
import colors from "../../components/colors";
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
import { Chip } from "react-native-paper";
import { ImageBackground } from "react-native";
const VenueScreen = ({ navigation, navigation: { goBack }, route }) => {
  const { width, height } = Dimensions.get("window");
const item=route.params
  const [venue, setVenue] = useState(item);

  const [initialWidth, setInitalWidth] = useState(width);
  const [scrolling, setScrolling] = useState(false);
  // const handleScroll = (event) => {
  //   setScrolling(event.nativeEvent.contentOffset.y > 200);
  //   console.log(event.nativeEvent.contentOffset.y);
  // };
  const [scrollingPos, setScrollingPos] = useState(0);
  const handleScroll = (event) => {
    setScrolling(event.nativeEvent.contentOffset.y > 200);
    setScrollingPos(event.nativeEvent.contentOffset.y / 20);
  };
  const [inFullscreen, setInFullsreen] = useState(false);

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
            color={scrolling ? colors.black : colors.white}
            style={{
              shadowOffset: { width: 0.5, height: 0.5 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              elevation: 2,
            }}
          />
        </TouchableOpacity>
      ),
      headerRight: () => null,

      headerTitle: () =>
        scrolling ? (
          <Text
            numberOfLines={1}
            style={{
              fontSize: 18,
              fontWeight: "500",
              color: colors.black,
            }}
          >
            {venue?.displayName}
          </Text>
        ) : null,
    });
  }, [scrolling]);
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

      <FlatList
        data={venue?.upcomingEvents}
        keyExtractor={(item) => item?.id}
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
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              horizontal
              scrollEventThrottle={20}
              data={venue?.photos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                {
                  return (
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

                      {/* <Image
                      style={{ width: initialWidth, height: 270 }}
                      source={{ uri: item?.uri }}
                      blurRadius={scrollingPos}


                    /> */}
                      {/* </LinearGradient> */}
                    </ImageBackground>
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
                    borderRadius: 12,
                  }}
                  onPress={() => console.log("Pressed")}
                >
                  Seguindo
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
              <View style={styles.separator} />
              <ViewMoreText
                numberOfLines={6}
                renderViewMore={renderViewMore}
                renderViewLess={renderViewLess}
                textStyle={{ textAlign: "left" }}
              >
                <Text style={{ fontSize: 15 }}>{venue?.description}</Text>
              </ViewMoreText>
            </View>

            <View style={styles.container}>
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
                    latitude: venue?.address?.lat,
                    longitude: venue?.address?.long,
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
                  color: colors.black2,
                  marginLeft: 5,
                  marginTop: 5,
                  marginBottom: 5,
                }}
              >
                {venue?.upcomingEvents?.length > 1
                  ? venue?.upcomingEvents?.length + " Eventos"
                  : venue?.upcomingEvents?.length > 0
                  ? venue?.upcomingEvents?.length + " Evento"
                  : ""}
              </Text>

              <View style={{ marginBottom: 100 }} />
            </View>
          </>
        }
        style={{ backgroundColor: colors.background }}
        renderItem={({ item, index }) => {
          // console.log(index);
          return (
            <TouchableOpacity
              style={{
                borderRadius: 10,
                padding: 10,
                marginBottom: 10,
                backgroundColor: colors.white,
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 1,
                elevation: 1,
                bottom: 100,
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
    // borderRadius: 5,
    height: 150,
    backgroundColor: colors.grey,
  },
});
