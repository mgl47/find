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
import { venues } from "../../components/Data/venue";
import { Chip } from "react-native-paper";
const VenueScreen = ({ navigation, navigation: { goBack }, route }) => {
  const { width, height } = Dimensions.get("window");
  const Event = route.params;
  const videoRef = React.useRef(null);
  const [muted, setMuted] = useState(true);
  const [venue, setVenue] = useState(venues[0]);
  const [initialWidth, setInitalWidth] = useState(width);
  const [scrolling, setScrolling] = useState(false);
  const handleScroll = (event) => {
    setScrolling(event.nativeEvent.contentOffset.y > 200);
    console.log(event.nativeEvent.contentOffset.y);
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
                fontSize: 19,
                fontWeight: "500",
                top: 40,
                color: colors.black,
              }}
            >
              {venue?.displayName}
            </Text>
          </View>
        )}
        <View style={styles.share_like}></View>
      </View>

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
          data={venue?.photos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            {
              return (
                <Image
                  style={{ width: initialWidth, height: 270 }}
                  source={{ uri: item?.uri }}
                />
              );
            }
          }}
        />
        <View style={styles.container}>
          <Text style={{ fontSize: 20, fontWeight: "500", marginBottom: 5 }}>
            {venue?.displayName}
          </Text>

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
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={venue?.artists}
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
                  style={{ fontSize: 15, fontWeight: "600", marginBottom: 3 }}
                >
                  Direções
                </Text>
                <Text style={{ color: colors.black2 }}>
                  {venue?.address?.zone}, {venue?.address?.city}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="car"
                size={25}
                color={colors.primary}
              />
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
                  style={{ fontSize: 15, fontWeight: "600", marginBottom: 3 }}
                >
                  Telefonar
                </Text>
                <Text style={{ color: colors.black2 }}>{venue?.phone1}</Text>
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
              // marginLeft: 5,
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
              // marginLeft: 5,
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
          <FlatList
            data={venue?.upcomingEvents}
            keyExtractor={(item) => item?.id}
            renderItem={({ item }) => {
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
          <View style={{ marginBottom: 100 }} />
        </View>
      </ScrollView>
    </>
  );
};

export default VenueScreen;

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
