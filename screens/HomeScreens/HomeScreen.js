import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  newEvents,
  recommendedEvents,
  trendingEvents,
} from "../../components/Data/stockEvents";
import MediumCard from "../../components/cards/MediumCard";
import BigCard from "../../components/cards/BigCard";
import SmallCard from "../../components/cards/SmallCard";

import colors from "../../components/colors";

import {
  MaterialCommunityIcons,
  Entypo,
  FontAwesome5,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";

import { useAuth } from "../../components/hooks/useAuth";
import axios from "axios";
import { useData } from "../../components/hooks/useData";
import BigCard2 from "../../components/cards/BigCards2";
import Carousel from "react-native-snap-carousel";
import { ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native";
import Screen from "../../components/Screen";
import Animated, {
  FadeIn,
  FadeOut,
  SlideOutLeft,
} from "react-native-reanimated";
import { ActivityIndicator } from "react-native-paper";
import AuthBottomSheet from "../../components/screensComponents/AuthComponents/AuthBottomSheet";
import OneBigTicket from "../../components/tickets/OneBigTicket";
import CountDown from "react-native-countdown-component";
import { TouchableWithoutFeedback } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from "rn-placeholder";
import { useDesign } from "../../components/hooks/useDesign";
import BigTicket from "../../components/tickets/BigTicket";
import Constants from "expo-constants";

export default function HomeScreen({ navigation }) {
  const { user, userData, setAuthModalUp, authSheetRef } = useAuth();
  const bottomSheetModalRef = useRef(null);
  const { isIPhoneWithNotch, width, height } = useDesign();
  const { events, getEvents } = useData();
  const [refreshing, setRefreshing] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const homeTabRef = useRef(null);
  const isFocused = useIsFocused();
  const [ipmaData, setIpmaData] = useState(null);
  const handleScroll = (event) => {
    setScrolling(event.nativeEvent.contentOffset.y > height * 0.25);
    // setScrollingPos(event.nativeEvent.contentOffset.y / 20);
  };
  // let Caldates = [];
  // const dates = events.forEach((event) =>
  //   event.dates.forEach((date) => Caldates.push(date.calendarDate))
  // );

  // console.log(Caldates);

  // let Caldates = [];
  // const dates = events.forEach((event) =>
  //   event.dates.forEach((date) => Caldates.push(date.calendarDate))
  // );

  // console.log(Caldates);

  const carouselRef = useRef(null);
  // const user = false;
  _renderItem = ({ item, index }) => {
    return <BigCard {...item} />;
  };
  const currentDate = new Date();
  // Target date
  const targetDate = new Date(
    userData?.myTickets?.[0]?.event?.dates?.[0]?.date
  );
  // Calculate the difference in milliseconds between the two dates
  const differenceInMilliseconds = targetDate.getTime() - currentDate.getTime();
  // Convert milliseconds to seconds
  const differenceInSeconds = differenceInMilliseconds / 1000;

  const reco = [...events];

  console.log(events?.[0]?.attendees);

  reco?.reverse();
  useEffect(() => {
    const unsubscribe = navigation?.addListener("tabPress", (e) => {
      console.log(e);
      authSheetRef?.current?.close();

      if (isFocused && events?.length > 0) {
        homeTabRef?.current?.scrollToOffset({ offset: 0, animated: true });
      }
    });

    return unsubscribe;
  }, [navigation, isFocused]);
  return (

    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 5,
          backgroundColor: "rgba(5, 19, 29,0.96)",
          position: "absolute",
          paddingTop: isIPhoneWithNotch ? 44 : Constants.statusBarHeight,

          top: 0,
          zIndex: 3,
          width: "100%",
          paddingBottom: 10,
          // backgroundColor:"transparent"
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}
        >
          <TouchableOpacity
            onPress={() =>
              user
                ? navigation.openDrawer()
                : (authSheetRef?.current?.present(), setAuthModalUp(true))
            }
            style={{ left: 20, bottom: 1 }}
          >
            {user ? (
              user?.photos?.avatar[0]?.uri ? (
                <Image
                  source={{
                    uri: user?.photos?.avatar[0]?.uri,
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    // left:20
                  }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="account-circle"
                  size={40}
                  color={colors.t3}
                />
              )
            ) : (
              <MaterialCommunityIcons
                name="account-outline"
                size={35}
                color={colors.white}
              />
            )}
          </TouchableOpacity>

          <Text
            style={{
              color: colors.t2,
              fontSize: 24,
              fontWeight: "600",
              marginTop: 0,
              marginLeft: 40,
            }}
          >
            Início
          </Text>
        </View>

        {/* <Animated.View exiting={SlideOutLeft.duration(300)}> 
          <TouchableOpacity
            style={{
              borderRadius: 50,
              padding: 7,
              right: 20,
              backgroundColor: colors.background2,
            }}
            onPress={() => navigation.navigate("search")}
          >
            <Feather name="search" size={25} color={colors.t3} />
          </TouchableOpacity>
         </Animated.View> */}

        <TouchableOpacity
          style={{
            borderRadius: 50,
            padding: 7,
            // paddingHorizontal: 10,
            right: 20,
            backgroundColor: colors.background2,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("search")}
        >
          {/* <Text
            style={{
              color: colors.t3,
              fontSize: 14,
              fontWeight: "500",
              marginRight: 5,
            }}
          >
            Explorar
          </Text> */}
          <Feather name="search" size={25} color={colors.t3} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingTop: isIPhoneWithNotch ? 44 : Constants.statusBarHeight,
          backgroundColor: "rgba(5, 19, 29,0.98)",
        }}
      >
        <FlatList
          contentContainerStyle={{
            backgroundColor: colors.background,
            top: 50,
          }}
          onRefresh={getEvents}
          // bounces={false}
          ref={homeTabRef}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <>
              <Text style={styles.headerText}>Destaques</Text>

              <View
                style={{
                  backgroundColor: colors.background,
                  position: "absolute",
                  width: "100%",
                  height: 250,
                }}
              />
              {events?.length > 0 ? ( //
                <Carousel
                  layout="stack"
                  // inactiveSlideOpacity={1}
                  ref={carouselRef}
                  data={events}
                  renderItem={_renderItem}
                  // sliderWidth={300}
                  sliderWidth={width}
                  itemWidth={width * 0.85}
                  loop={true}
                />
              ) : (
                // null
                // null
                // <Animated.View
                //   style={{ flex: 1 }}
                //   entering={FadeIn}
                //   // exiting={FadeOut}
                // >
                //   <Placeholder
                //     Animation={Fade}

                //     // Left={PlaceholderMedia}
                //     // Right={PlaceholderMedia}
                //   >
                //     <ActivityIndicator
                //       style={{
                //         position: "absolute",
                //         zIndex: 2,
                //         alignSelf: "center",
                //         paddingTop: isIPhoneWithNotch ? 60 : 10,
                //       }}
                //       animating={true}
                //       color={colors.light2}
                //     />

                //     <PlaceholderLine
                //       style={{
                //         borderRadius: 0,
                //         height: 270,
                //         width,
                //         backgroundColor: colors.black2,
                //       }}
                //     >
                //       <View style={{ zIndex: 4 }}>
                //         <PlaceholderLine
                //           style={{
                //             borderRadius: 20,
                //             height: 15,
                //             width: "90%",
                //             marginTop: 10,
                //           }}
                //         />
                //         <PlaceholderLine
                //           style={{
                //             borderRadius: 20,
                //             height: 15,
                //             width: "90%",
                //             bottom: 2,
                //           }}
                //         />
                //         <PlaceholderLine
                //           style={{
                //             borderRadius: 20,
                //             height: 15,
                //             width: "70%",
                //             bottom: 2,
                //           }}
                //         />
                //       </View>
                //     </PlaceholderLine>
                //   </Placeholder>
                // </Animated.View>
                <Animated.View
                  style={{
                    // position: "absolute",
                    alignSelf: "center",
                    // top: 10,
                    // zIndex: 2,
                    // marginVertical: 10,
                    height: height * 0.442,
                  }}
                  // entering={SlideInUp.duration(300)}
                  // exiting={SlideOutUp.duration(300)}
                >
                  <ActivityIndicator
                    style={{ top: "30%" }}
                    animating={true}
                    color={colors.white}
                  />
                </Animated.View>
              )}
              {user &&
                userData?.myTickets?.length > 0 &&
                differenceInSeconds > 0 &&
                false && (
                  <Animated.View
                    // style={{ marginBottom: 20 }}
                    entering={FadeIn}
                    exiting={FadeOut}
                  >
                    <Text style={styles.headerText}>Bu próximo evento</Text>
                    <TouchableOpacity
                      activeOpacity={0.95}
                      style={{ padding: 10 }}
                      // onPress={() =>
                      //   navigation.navigate("ticketDetails", myTickets?.[0])
                      // }
                      onPress={() => navigation.navigate("addArtist")}
                    >
                      <BigTicket {...userData?.myTickets?.[0]} />
                    </TouchableOpacity>
                  </Animated.View>
                )}
              <Text style={styles.headerText}>Recomendados</Text>

              <FlatList
                style={{ backgroundColor: colors.background }}
                // data={recommendedEvents}
                data={reco}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.uuid}
                renderItem={({ item }) => {
                  return <SmallCard {...item} />;
                }}
                ListFooterComponent={
                  <View
                    style={{
                      marginBottom: 70,
                      backgroundColor: colors.background,
                    }}
                  />
                }
              />
            </>
          }
        />
        <AuthBottomSheet
          authSheetRef={authSheetRef}
          // setAuthModalUp={setAuthModalUp}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red",
    backgroundColor: colors.background,
    // backgroundColor: "rgba(5, 19, 29,0.9)",
  },
  headerContainer: {
    // backgroundColor: colors.white,

    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 42,
  },
  headerText: {
    fontSize: 19,
    fontWeight: "500",
    // padding: 5,
    left: 20,
    color: colors.t3,
    marginTop: 10,
    zIndex: 3,
  },
  search: {
    height: 40,
    width: "100%",
    backgroundColor: colors.light2,
    borderRadius: 30,
    paddingLeft: 40,
  },
  venue: {
    fontSize: 14.5,
    alignSelf: "flex-start",
    fontWeight: "600",
    color: colors.white,
  },
  title: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
    lineHeight: 30,
    width: "70%",
  },

  date: {
    fontSize: 15,
    alignSelf: "flex-start",
    fontWeight: "600",
    color: colors.white,

    marginTop: 3,
  },
});
