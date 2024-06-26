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
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { ActivityIndicator } from "react-native-paper";
import AuthBottomSheet from "../../components/screensComponents/AuthComponents/AuthBottomSheet";
const { width, height } = Dimensions.get("window");
import OneBigTicket from "../../components/tickets/OneBigTicket";
import CountDown from "react-native-countdown-component";
import { TouchableWithoutFeedback } from "react-native";
export default function HomeScreen({ navigation }) {
  const { user, myTickets, setAuthModalUp, authSheetRef } = useAuth();
  const bottomSheetModalRef = useRef(null);
  const { events, getEvents } = useData();
  const [refreshing, setRefreshing] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const handleScroll = (event) => {
    setScrolling(event.nativeEvent.contentOffset.y > height * 0.25);
    // setScrollingPos(event.nativeEvent.contentOffset.y / 20);
  };
  const carouselRef = useRef(null);
  // const user = false;
  _renderItem = ({ item, index }) => {
    return <BigCard {...item} />;
  };
  const currentDate = new Date();
  // Target date
  const targetDate = new Date(myTickets?.[0]?.event?.dates?.[0]?.date);
  // Calculate the difference in milliseconds between the two dates
  const differenceInMilliseconds = targetDate.getTime() - currentDate.getTime();
  // Convert milliseconds to seconds
  const differenceInSeconds = differenceInMilliseconds / 1000;

  return (
    <Screen style={[styles.container]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 5,
          // backgroundColor: colors.primary2,
        }}
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
              name="account-outline"
              size={35}
              color={colors.white}
            />
          )}
        </TouchableOpacity>
        <Image
          // source={
          //   scrolling
          //     ? require("../../assets/logos/logo1.png")
          //     : require("../../assets/logos/logo_white.png")
          // }
          source={require("../../assets/logos/logo_white.png")}
          style={{ width: 35, height: 35, left: !user ? 5 : 3 }}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={{
            borderRadius: 50,
            padding: 5,
            right: 10,
            // backgroundColor: colors.grey,
          }}
          onPress={() => navigation.navigate("search")}
        >
          <MaterialIcons name="manage-search" size={35} color={colors.white} />
        </TouchableOpacity>
      </View>
      <FlatList
        contentContainerStyle={{ backgroundColor: colors.background }}
        onRefresh={getEvents}
        bounces={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            <View
              style={{
                backgroundColor: colors.primary2,
                position: "absolute",
                width: "100%",
                height: 250,
              }}
            />
            {events?.length > 0 ? (
              <Carousel
                inactiveSlideOpacity={1}
                ref={carouselRef}
                data={events}
                renderItem={_renderItem}
                // sliderWidth={300}
                sliderWidth={width}
                itemWidth={width * 0.8}
              />
            ) : (
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
            {user && myTickets?.length > 0 && differenceInSeconds > 0 && (
              <Animated.View
                // style={{ marginBottom: 20 }}
                entering={FadeIn}
                exiting={FadeOut}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                    marginBottom: 5,
                  }}
                >
                  <Text style={styles.headerText}>Bu próximo evento</Text>

                  <CountDown
                    size={15}
                    until={differenceInSeconds}
                    style={{
                      alignItems: "center",
                      // backgroundColor:colors.background,
                      // left: 10,
                      top: 10,

                      // position: "absolute",
                    }}
                    // onFinish={() => alert('Finished')}
                    digitStyle={{
                      backgroundColor: colors.white,
                      shadowOffset: { width: 0.5, height: 0.5 },
                      shadowOpacity: 0.3,
                      shadowRadius: 1,
                      elevation: 0.5,
                    }}
                    digitTxtStyle={{ color: colors.primary }}
                    timeLabelStyle={{
                      color: colors.primary,
                      fontWeight: "bold",
                    }}
                    separatorStyle={{ color: colors.white }}
                    timeToShow={[
                      differenceInSeconds > 86000 ? "D" : "",
                      "H",
                      "M",
                      "S",
                    ]}
                    timeLabels={{
                      d: "dias",
                      h: "horas",
                      m: "minutos",
                      s: "segundos",
                    }}
                    // showSeparator
                  />
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{ padding: 10 }}
                  onPress={() =>
                    navigation.navigate("ticketDetails", myTickets?.[0])
                  }
                >
                  <OneBigTicket {...myTickets?.[0]} />
                </TouchableOpacity>
              </Animated.View>
            )}
            <FlatList
              style={{ backgroundColor: colors.background }}
              data={recommendedEvents}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
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
                    // onPress={() => navigation.navigate("addEvent", item)}
                    onPress={() => navigation.navigate("manageEvent", item)}
                  >
                    <SmallCard {...item} />
                  </TouchableOpacity>
                );
              }}
              ListFooterComponent={<View style={{ marginBottom: 50 }} />}
            />
          </>
        }
      />
      <AuthBottomSheet
        authSheetRef={authSheetRef}
        setAuthModalUp={setAuthModalUp}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red",
    backgroundColor: colors.primary2,
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
    fontWeight: "600",
    // padding: 5,
    left: 20,
    color: colors.primary,
    marginTop: 10,
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
