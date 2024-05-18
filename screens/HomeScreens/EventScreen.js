import {
  Button,
  Dimensions,
  FlatList,
  Image,
  PixelRatio,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp,
} from "react-native-reanimated";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useReducer,
} from "react";
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
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Chip } from "react-native-paper";

import axios from "axios";
import { useData } from "../../components/hooks/useData";
import { useAuth } from "../../components/hooks/useAuth";
import ImageView from "react-native-image-viewing";
import { useDesign } from "../../components/hooks/useDesign";

import TicketPurchaseSheet from "../../components/screensComponents/eventComponents/TicketPurchaseSheet";
import { LinearGradient } from "expo-linear-gradient";
import { captureRef } from "react-native-view-shot";
import { ImageBackground } from "react-native";

const EventScreen = ({ navigation, navigation: { goBack }, route }) => {
  const { width, height, isIPhoneWithNotch } = useDesign();

  const defautlsizes = { width, height };
  const [print, setPrint] = useState(null);
  const mapPrintRef = useRef(null);
  const takePrint = async () => {
    const targetPixelCount = 1080; // If you want full HD pictures
    const pixelRatio = PixelRatio.get(); // The pixel ratio of the device
    // pixels * pixelratio = targetPixelCount, so pixels = targetPixelCount / pixelRatio
    const pixels = targetPixelCount / pixelRatio;

    const result = await captureRef(mapPrintRef, {
      result: "tmpfile",
      // height: pixels,
      // width: pixels,
      height: 1080,
      width: 1920,
      quality: 1,
      format: "png",
    });
    setPrint(result);
  };
  // console.log(print);
  const [firstMount, setFirstMount] = useState(true);
  useEffect(() => {
    setFirstMount(false);
    // takePrint();
  }, []);

  const Event = route.params;
  const videoRef = React.useRef(null);
  const [purchaseModalUp, setPurchaseModalUp] = useState(false);
  const [giftedUser, setGiftedUser] = useState(null);

  const [giftModalUp, setGiftModalUp] = useState(false);
  const [gift, setGift] = useState(false);
  const [muted, setMuted] = useState(true);
  const [initialWidth, setInitalWidth] = useState(width);
  const [scrolling, setScrolling] = useState(false);
  const [scrollingPos, setScrollingPos] = useState(0);
  const [mediaIndex, setMediaIndex] = useState(0);
  const { apiUrl, formatNumber } = useData();
  const [imageVisible, setImageVisible] = useState(false);
  const [currentImageIndex, setImageIndex] = useState(0);
  const onShowGallery = (index) => {
    setImageIndex(index);
    setImageVisible(true);
  };
  const { user, headerToken, getUpdatedUser } = useAuth();
  const handleScroll = (event) => {
    setScrolling(event.nativeEvent.contentOffset.y > height * 0.25);
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
  const [isMute, setIsMute] = useState(true);

  const [interested, setInterested] = useState(false);
  const [going, setGoing] = useState(false);

  const purchaseSheetRef = useRef(null);
  const giftModalRef = useRef(null);

  const handlePurchaseSheet = useCallback((gift) => {
    if (gift) {
      setGiftModalUp(true);
      giftModalRef.current?.present();
    } else {
      purchaseSheetRef.current?.present();
      setPurchaseModalUp(true);
    }
  }, []);

  const renderViewMore = (onPress) => {
    return (
      <TouchableOpacity style={styles.more} onPress={onPress}>
        {/* <Text style={[styles.more]}>Ver mais</Text> */}
        <MaterialCommunityIcons
          name="unfold-more-horizontal"
          size={26}
          color={colors.t5}
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
          color={colors.t5}
        />
        {/* <Entypo name="chevron-up" size={24} color={colors.primary} /> */}
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        !inFullscreen ? (
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
              style={{
                shadowOffset: !scrolling ? { width: 0.5, height: 0.5 } : {},
                shadowOpacity: !scrolling ? 0.3 : 0,
                shadowRadius: !scrolling ? 1 : 0,
                elevation: !scrolling ? 2 : 0,
              }}
            />
          </TouchableOpacity>
        ) : null,
      headerRight: () =>
        !inFullscreen &&
        !scrolling && (
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
                Number(
                  Event?.videos?.length > 0
                    ? Event?.photos?.[0]?.length + 1
                    : Event?.photos?.[0]?.length
                )}
            </Text>
          </View>
        ),
      headerTitle: () =>
        // scrolling ? (
        //   <Text
        //     numberOfLines={1}
        //     style={{
        //       fontSize: 17,
        //       fontWeight: "500",
        //       // top: 40,
        //       // width:"100%",
        //       color: colors.white,
        //     }}
        //   >
        //     {Event?.title}
        //   </Text>
        // ) :
        null,
    });
  }, [scrolling, inFullscreen, mediaIndex]);
  useEffect(() => {
    if (user?.goingToEvents?.includes(Event?._id)) {
      setGoing(true);
      setInterested(false);
    } else if (user?.likedEvents?.includes(Event?._id)) {
      setInterested(true);
    }
  }, [user]);

  const likeEvent = async () => {
    let updateInterested = [];
    let updatedGoing = [];

    updatedGoing = user?.goingToEvents || [];
    updateInterested = user?.likedEvents || [];

    const index = updateInterested.indexOf(Event?._id);
    if (user?.likedEvents?.includes(Event?._id) && index !== -1) {
      setInterested(false);

      updateInterested.splice(index, 1);
    } else {
      setInterested(true);
      setGoing(false);

      updateInterested.push(Event?._id);
    }
    if (user?.goingToEvents?.includes(Event?._id)) {
      const index = updatedGoing.indexOf(Event?._id);
      if (index !== -1) {
        // setGoing(false);
        updatedGoing.splice(index, 1);
      }
    }
    try {
      const response = await axios.patch(
        `${apiUrl}/user/current/${user?._id}`,
        {
          operation: {
            type: "eventStatus",
            task: "interest",
            eventId: Event?._id,
          },
          updates: {
            likedEvents: updateInterested,
            goingToEvents: updatedGoing,
          },
        },
        { headers: { Authorization: headerToken } }
      );

      await  getUpdatedUser({field:"favEvents"})  
    
    } 
      
      
      catch (error) {
      console.log(error?.response?.data?.msg);
    }
  };
  const goingtoEvent = async () => {

    let updateInterested = [];
    let updatedGoing = [];

    updatedGoing = user?.goingToEvents || [];
    updateInterested = user?.likedEvents || [];

    const index = updatedGoing.indexOf(Event?._id);
    if (user?.goingToEvents?.includes(Event?._id) && index !== -1) {
      setGoing(false);

      updatedGoing.splice(index, 1);
    } else {
      setGoing(true);
      setInterested(false);

      updatedGoing.push(Event?._id);
    }
    if (user?.likedEvents?.includes(Event?._id)) {
      const index = updateInterested.indexOf(Event?._id);
      if (index !== -1) {
        // setGoing(false);
        updateInterested.splice(index, 1);
      }
    }


    try {


      const response = await axios.patch(
        `${apiUrl}/user/current/${user?._id}`,
        {
          operation: {
            type: "eventStatus",
            task: "going",
            eventId: Event?._id,
          },
          updates: {
            likedEvents: updateInterested,
            goingToEvents: updatedGoing,
          },
        },
        { headers: { Authorization: headerToken } }
      );



      await  getUpdatedUser({field:"favEvents"})  
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
  };
  return (
    <>
      {scrolling && (
        <Animated.View
          entering={SlideInUp.duration(300)}
          // exiting={FadeOutUp.duration(200)}
          exiting={SlideOutUp.duration(500)}
          style={{
            position: "absolute",
            height: isIPhoneWithNotch ? 90 : 65,
            width: "100%",
            // backgroundColor: colors.background2,
            backgroundColor: "rgba(32, 40, 47,0.95)",

            zIndex: 2,
            shadowOffset: { width: 0.5, height: 0.5 },
            elevation: 2,

            shadowOpacity: 0.3,
            shadowRadius: 1,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: 17,
              fontWeight: "500",
              position: "absolute",
              bottom: 10,
              // marginLeft:70,
              marginLeft: 50,

              textAlign: "center",
              // width:"100%",
              color: colors.t1,
              width: "75%",
            }}
          >
            {Event?.title}
          </Text>
        </Animated.View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        scrollEnabled={!inFullscreen}
        onScroll={handleScroll}
        bounces={false}
      >
      

        <FlatList
          showsHorizontalScrollIndicator={false}
          style={{ backgroundColor: colors.background }}
          pagingEnabled
          onScroll={(e) => handleMediaScroll(e)}
          scrollEnabled={
            Event?.videos?.length > 0 || Event?.photos?.[0]?.length > 1
          }
          horizontal
          data={Event?.photos?.[1]}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            Event?.videos?.length > 0 ? (
              <View>
                {/* <LinearGradient
                  colors={[
                    "transparent",
                    "transparent",
                    "transparent",
                    "transparent",
                    colors.background,
                  ]}
                  //                         colors={["#00000000", "#0000000000", "#000000000"]}

                  style={{
                    height: height * 0.37,
                    width: "100%",
                    position: "absolute",zIndex:3
                  }}
                /> */}
                <VideoPlayer
                  // defaultControlsVisible={false}

                  // playbackCallback={()=>console.log("fdasfsdgafdsF")}
                  fullscreen={{
                    inFullscreen: inFullscreen,
                    enterFullscreen: async () => {
                      setInFullsreen(true);

                      // setStatusBarHidden(true, "fade");
                      await ScreenOrientation.lockAsync(
                        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
                      );

                      videoRef.current.setStatusAsync({
                        shouldPlay: true,
                      });
                    },
                    exitFullscreen: async () => {
                      // setStatusBarHidden(false, "fade");
                      setInFullsreen(false);

                      await ScreenOrientation.lockAsync(
                        ScreenOrientation.OrientationLock.PORTRAIT_UP
                      );
                    },
                  }}
                  mute={{
                    visible: true,
                    enterMute: () => setIsMute(true),
                    exitMute: () => setIsMute(false),
                    isMute: isMute,
                  }}
                  style={{
                    videoBackgroundColor: "black",
                    height: inFullscreen ? width : height * 0.37,
                    width: inFullscreen ? height : initialWidth,
                  }}
                  videoProps={{
                    ref: videoRef,

                    source: {
                      uri: Event?.videos[0]?.uri,
                    },

                    // source: require("../assets/rolling.mp4"),
                    resizeMode: inFullscreen ? "contain" : "cover",
                    // useNativeControls:true,
                    isMuted: isMute,
                    shouldPlay: true,
                    isLooping: true,
                  }}
                />
              </View>
            ) : // </TouchableOpacity>
            null
          }
          renderItem={({ item, index }) => {
            {
              return !inFullscreen ? (
                <>
                  <ImageView
                    // images={savingMode ? listing?.thumb : listing?.photos}
                    images={Event?.photos[0]}
                    imageIndex={currentImageIndex}
                    onRequestClose={() => setImageVisible(false)}
                    visible={imageVisible}
                  />
                  <TouchableHighlight
                    underlayColor={colors.black}
                    // activeOpacity={0.7}
                    onPress={() => onShowGallery(index)}
                  >
                    <>
                      <ImageBackground
                        source={{ uri: item?.uri }}
                        style={{ width: initialWidth, height: height * 0.37 }}
                      >
                        {/* <Image
                        style={{ width: initialWidth, height: height * 0.37 }}
                        source={{ uri: item?.uri }}
                        // blurRadius={scrollingPos}
                      /> */}
                        {/* <LinearGradient
                          colors={[
                            "transparent",
                            "transparent",
                            "transparent",
                            "transparent",
                            colors.background,
                          ]}
                          //                         colors={["#00000000", "#0000000000", "#000000000"]}

                          style={{ height: "100%", width: "100%" }}
                        /> */}
                      </ImageBackground>
                    </>
                  </TouchableHighlight>
                </>
              ) : (
                []
              );
            }
          }}
        />
        <View style={{ backgroundColor: colors.background }}>
          <View style={styles.container}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "500",
                marginBottom: 5,
                color: colors.t1,
              }}
            >
              {Event?.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                width,
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
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 7,
                    width: "100%",
                  }}
                >
                  <Entypo name="location" size={17} color={colors.light} />
                  <Text
                    style={{
                      fontSize: 16.5,
                      fontWeight: "500",
                      width: "70%",
                      color: colors.t3,
                      marginLeft: 5,
                    }}
                  >
                    {Event?.venue?.displayName}, {Event?.venue?.address?.city}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 3,
              }}
            >
              <MaterialCommunityIcons
                name="calendar-month"
                size={19}
                color={colors.light}
              />
              <Text
                style={{
                  fontSize: 15.5,
                  fontWeight: "500",
                  // width: "80%",
                  color: colors.t3,
                  marginLeft: 5,
                }}
              >
                {Event?.dates[Event?.dates?.length - 1]?.displayDate}
              </Text>
            </View>
            {Event?.goingUsers?.length > 0 && (
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 2,
                  // right: 3,
                  // justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="lightning-bolt-outline"
                  size={23}
                  color={colors.light}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    // width: "70%",
                    color: colors.t5,
                  }}
                >
                  {Event?.goingUsers?.length}
                  {Event?.goingUsers?.length > 1
                    ? " Pessoas vão!"
                    : " Pessoa vai!"}
                </Text>
              </View>
            )}
            <View style={{ flexDirection: "row", marginVertical: 5 }}>
              <Chip
                // elevated

                elevation={1}
                icon={() => (
                  <MaterialCommunityIcons
                    name="calendar-heart"
                    color={colors.t3}
                    size={20}
                  />
                )}
                textStyle={{
                  // color: interested ? colors.white : colors.black,
                  color: interested ? colors.t2 : colors.t3,
                }}
                style={{
                  // backgroundColor: interested ? colors.primary : colors.background2,
                  backgroundColor: interested
                    ? colors.primary
                    : colors.background2,

                  // paddingHorizontal: 2,
                  marginRight: 10,
                  borderRadius: 12,
                }}
                onPress={() => {

                  likeEvent();



                }}
              >
                Interressado
              </Chip>
              <Chip
                elevation={1}
                icon={() => (
                  <Ionicons name="ticket-outline" size={20} color={colors.t3} />
                )}
                textStyle={{
                  // color: going ? colors.white : colors.black,
                  color: going ? colors.t2 : colors.t3,
                }}
                style={{
                  backgroundColor: going ? colors.primary : colors.background2, // paddingHorizontal: 2,
                  borderRadius: 12,
                }}
                onPress={goingtoEvent}
              >
                Vou
              </Chip>
              <Chip
                elevation={1}
                icon={() => (
                  <MaterialIcons name="ios-share" size={20} color={colors.t3} />
                )}
                textStyle={{
                  color: colors.t3,
                }}
                style={{
                  backgroundColor: colors.background2, // paddingHorizontal: 2,
                  marginHorizontal: 10,
                  borderRadius: 12,
                }}
                onPress={() => console.log("Pressed")}
              >
                Partilhar
              </Chip>
            </View>
            <View style={[styles.separator, { marginVertical: 10 }]} />
            <View>
              <ViewMoreText
                numberOfLines={6}
                renderViewMore={renderViewMore}
                renderViewLess={renderViewLess}
                textStyle={{ textAlign: "left" }}
              >
                <Text style={{ fontSize: 15, color: colors.t3 }}>
                  {Event?.description}
                </Text>
              </ViewMoreText>
            </View>
            <View
              style={[styles.separator, { marginTop: 10, marginBottom: 5 }]}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  left: 10,
                  // width: "80%",
                  color: colors.t2,
                  // marginLeft: 5,
                  marginTop: 10,
                }}
              >
                Artistas
              </Text>
              {Event?.artists?.length > 5 && (
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
              )}
            </View>
          </View>
          <FlatList
            style={{ backgroundColor: colors.background, bottom: 10 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={Event?.artists}
            keyExtractor={(item) => item?.uuid}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    padding: 5,
                    alignItems: "center",
                    // justifyContent: "center",
                  }}
                  onPress={() => navigation.navigate("artist", item)}
                >
                  <Image
                    style={{
                      height: 55,
                      width: 55,
                      borderRadius: 50,
                      marginBottom: 2,
                      borderWidth: 0.009,
                      backgroundColor: colors.darkGrey,
                    }}
                    source={{ uri: item?.photos?.avatar?.[0]?.uri }}
                  />
                  <Text
                    style={{
                      width: item?.displayName?.length > 15 ? 100 : null,
                      textAlign: "center",
                      color: colors.t3,
                    }}
                  >
                    {item?.displayName}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          <View style={styles.container}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                left: 10,

                color: colors.t2,

                marginBottom: 5,
              }}
            >
              Local
            </Text>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.navigate("venue", Event?.venue)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: colors.background2,
                marginTop: 5,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                // shadowOffset: { width: 0.5, height: 0.5 },
                // shadowOpacity: 0.3,
                // shadowRadius: 1,
                // elevation: 2,
                shadowOffset: { width: 0.5, height: 0.5 },
                shadowOpacity: 0.1,
                shadowRadius: 1,
                elevation: 0.5,
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
                    uri: Event?.venue?.photos?.[2]?.[
                      Event?.venue?.photos[3]?.length - 1
                    ]?.uri,
                  }}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                    color: colors.t3,
                  }}
                >
                  {Event?.venue?.displayName}
                </Text>
              </View>
              <Entypo name="chevron-right" size={24} color={colors.t3} />
            </TouchableOpacity>
            <View
              style={{
                // height: 200,
                backgroundColor: colors.background2,
                //   padding: 10,
                alignItems: "center",
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
                // shadowOffset: { width: 0.5, height: 0.5 },
                // shadowOpacity: 0.3,
                // shadowRadius: 1,
                // elevation: 2,
                shadowOffset: { width: 0.5, height: 0.5 },
                shadowOpacity: 0.1,
                shadowRadius: 1,
                elevation: 0.5,
                // shadowColor: colors.light2,
              }}
            >
              <MapView
                scrollEnabled={false}
                zoomEnabled={false}
                ref={mapPrintRef}
                initialRegion={{
                  latitude: Event?.venue?.location?.coordinates?.[1] + 0.001,
                  longitude: Event?.venue?.location?.coordinates?.[0] - 0.001,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.011,
                }}
                // provider="google"
                mapType="standard"
                style={styles.map}
              >
                <Marker
                  pinColor={colors.primary}
                  coordinate={{
                    latitude: Event?.venue?.location?.coordinates?.[1],
                    longitude: Event?.venue?.location?.coordinates?.[0],
                  }}
                />
              </MapView>

              <TouchableOpacity
                activeOpacity={0.6}
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
                      fontWeight: "500",
                      marginBottom: 3,
                      color: colors.t2,
                    }}
                  >
                    Direções
                  </Text>
                  <Text style={{ color: colors.t3 }}>
                    {Event?.venue?.address?.zone}, {Event?.venue?.address?.city}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome5 name="walking" size={20} color={colors.t3} />
                  <Text style={{ fontSize: 22, color: colors.t5 }}> | </Text>
                  <MaterialCommunityIcons
                    name="car"
                    size={25}
                    color={colors.t3}
                  />
                </View>
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
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "500",
              left: 20,
              color: colors.t2,

              marginVertical: 10,
            }}
          >
            {Event?.organizers?.length > 1 ? "Organizações" : "Organizaçåo"}
          </Text>

          <FlatList
            style={{ padding: 10 }}
            contentContainerStyle={{}}
            data={Event?.organizers}
            // horizontal={Event?.organizers?.length > 1}
            keyExtractor={(item) => item?.uuid}
            // renderItem={({ item }) => {
            //   return Event?.organizers?.length > 1 ? (
            //     <TouchableOpacity
            //       style={{
            //         padding: 5,
            //         alignItems: "center",
            //         // justifyContent: "center",
            //       }}
            //       onPress={() => navigation.navigate("artist", item)}
            //     >
            //       <Image
            //         style={{
            //           height: 65,
            //           width: 65,
            //           borderRadius: 20,
            //           marginBottom: 2,
            //           borderWidth: 0.009,
            //           backgroundColor: colors.darkGrey,
            //         }}
            //         source={{ uri: item?.photos?.avatar?.[0]?.uri }}
            //       />
            //       <Text
            //         style={{
            //           width: item?.displayName?.length > 15 ? 100 : null,
            //           textAlign: "center",
            //           fontSize: 14,
            //           fontWeight: "500",
            //         }}
            //       >
            //         {item?.displayName}
            //       </Text>
            //     </TouchableOpacity>
            //   ) : (
            //     <View
            //       style={{
            //         backgroundColor: colors.background2,
            //         borderRadius: 10,
            //         // shadowOffset: { width: 0.5, height: 0.5 },
            //         // shadowOpacity: 0.3,
            //         // shadowRadius: 1,
            //         // elevation: 2,
            //         shadowOffset: { width: 0.5, height: 0.5 },
            //         shadowOpacity: 0.1,
            //         shadowRadius: 1,
            //         elevation: 0.5,
            //       }}
            //     >
            //       <TouchableOpacity
            //         onPress={() => navigation.navigate("artist", item)}
            //         style={{
            //           flexDirection: "row",
            //           alignItems: "center",
            //           justifyContent: "space-between",
            //           padding: 10,
            //           alignItems: "center",

            //           // height: 50,
            //           // padding: 5,
            //         }}
            //       >
            //         <View
            //           style={{ flexDirection: "row", alignItems: "center" }}
            //         >
            //           <Image
            //             style={{
            //               width: 40,
            //               height: 40,
            //               borderRadius: 50,
            //               marginRight: 10,
            //               borderWidth: 0.1,
            //             }}
            //             source={{ uri: item?.photos?.avatar?.[0]?.uri }}
            //           />
            //           <Text
            //             style={{
            //               fontSize: 15,
            //               fontWeight: "500",
            //               color: colors.t5,
            //               // color: colors.white,
            //             }}
            //           >
            //             {item.displayName}
            //           </Text>
            //         </View>
            //         <Entypo
            //           name="chevron-right"
            //           size={24}
            //           color={colors.t3}
            //         />
            //       </TouchableOpacity>
            //       <View style={[styles.separator, { width: "90%" }]} />

            //       <TouchableOpacity
            //         style={{
            //           padding: 10,
            //           flexDirection: "row",
            //           alignItems: "center",
            //           justifyContent: "space-between",
            //           width: "100%",
            //           // marginVertical: 5,
            //         }}
            //       >
            //         <View>
            //           <Text style={{ fontSize: 15, fontWeight: "500" }}>
            //             Telefonar
            //           </Text>
            //           <Text>{item.phone1}</Text>
            //         </View>
            //         <MaterialCommunityIcons
            //           name="phone"
            //           size={25}
            //           color={colors.primary}
            //         />
            //       </TouchableOpacity>
            //     </View>
            //   );
            // }}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    backgroundColor: colors.background2,
                    borderRadius: 10,

                    shadowOffset: { width: 0.5, height: 0.5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 1,
                    elevation: 0.5,
                    marginBottom: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate("artist", item)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 10,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 50,
                          marginRight: 10,
                          borderWidth: 0.1,
                        }}
                        source={{ uri: item?.photos?.avatar?.[0]?.uri }}
                      />
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                          color: colors.t2,
                          // color: colors.white,
                        }}
                      >
                        {item.displayName}
                      </Text>
                    </View>
                    <Entypo name="chevron-right" size={24} color={colors.t3} />
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
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                          color: colors.t2,
                        }}
                      >
                        Telefonar
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: colors.t4,
                          left:1
                          ,top:1
                        }}
                      >
                        9123456
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name="phone"
                      size={25}
                      color={colors.t3}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
          <View style={{ marginBottom: 100 }} />
        </View>
      </ScrollView>

      <TicketPurchaseSheet
        purchaseSheetRef={purchaseSheetRef}
        giftModalRef={giftModalRef}
        setPurchaseModalUp={setPurchaseModalUp}
        purchaseModalUp={purchaseModalUp}
        setGiftModalUp={setGiftModalUp}
        setGiftedUser={setGiftedUser}
        giftedUser={giftedUser}
        Event={Event}
        setGift={setGift}
        gift={gift}
      />
      {/* {!inFullscreen && ( */}
      {!inFullscreen && !purchaseModalUp && !giftModalUp && (
        <Animated.View
          entering={!firstMount && SlideInDown.duration(180)}
          exiting={SlideOutDown}
          style={{
            justifyContent: "space-around",
            width: "100%",
            height: isIPhoneWithNotch ? 70 : 55,
            backgroundColor: colors.background,
            position: "absolute",
            zIndex: 2,
            bottom: 0,
            flexDirection: "row",
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 1,
            elevation: 3,
            borderTopWidth: 1,
            borderRightWidth: 1,
            borderLeftWidth: 1,
            borderColor: colors.background2,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            opacity: inFullscreen ? 0 : 1,
            // paddingHorizontal: 10,
            // padding: 10,
          }}
        >
          <View
            style={{ top: Event?.tickets?.length > 1 ? 0 : -5, padding: 10 }}
          >
            <Text
              style={{
                fontSize: Event?.tickets?.length > 1 ? 14 : 15,
                fontWeight: "500",
                // width: "80%",
                color: colors.t3,
                // marginLeft: 5,
                // textAlign: "center",
              }}
            >
              {Event?.tickets?.length > 1 ? "apartir de " : ""}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "600",
                  // width: "80%",
                  color: colors.t3,
                  textAlign: "center",
                  marginRight: 3,
                  top: 1,
                  // marginLeft: 5,
                }}
              >
                cve
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  // width: "80%",
                  color: colors.t1,
                  textAlign: "center",
                  // marginLeft: 5,
                }}
              >
                {formatNumber(Event?.tickets[0]?.price)}
              </Text>
            </View>
          </View>
          <View
            style={{ flexDirection: "row", alignItems: "center", bottom: 5 }}
          >
            <TouchableOpacity
              // onPress={handleGiftSheet}
              disabled={inFullscreen}
              onPress={() => handlePurchaseSheet(true)}
              style={{
                width: 38,
                // padding:5,
                height: 38,
                // backgroundColor: colors.t2, // position: "absolute",
                zIndex: 1,
                marginRight: 10,
                // left: 10,
                borderRadius: 10,
                // borderWidth: 1.3,
                borderColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1,
                elevation: 3,
                shadowColor: colors.dark,
                flexDirection: "row",
              }}
              activeOpacity={0.5}
            >
              <Feather name="gift" size={24} color={colors.t2} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handlePurchaseSheet()}
              style={{
                width: 140,
                height: 40,
                backgroundColor: colors.primary2, // position: "absolute",
                zIndex: 1,
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
                  color: colors.t2,
                  fontWeight: "500",
                  marginRight: 10,
                }}
              >
                Comprar
              </Text>
              <Ionicons name="ticket-outline" size={24} color={colors.t2} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </>
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    // bottom: 10,
    // borderRadius: 10,

    overflow: "hidden",
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
    backgroundColor: colors.separator,
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
