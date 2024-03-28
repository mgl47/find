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
import Animated from "react-native-reanimated";
import { ActivityIndicator } from "react-native-paper";
import AuthBottomSheet from "../../components/screensComponents/AuthComponents/AuthBottomSheet";
const { width, height } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  // const{authSheetRef}=useAuth()

  const { user, setAuthModalUp, authSheetRef } = useAuth();
  const bottomSheetModalRef = useRef(null);
  const { events, getEvents } = useData();
  const [refreshing, setRefreshing] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const handleScroll = (event) => {
    setScrolling(event.nativeEvent.contentOffset.y > height * 0.25);
    // setScrollingPos(event.nativeEvent.contentOffset.y / 20);
  };
  const carouselRef = useRef(null);

  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => navigation.navigate("event", item)}
      >
        <BigCard {...item} />
      </TouchableOpacity>
    );
  };

  return (
    <Screen style={[styles.container]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
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
          style={{ width: 35, height: 35, left: 5 }}
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
            {events?.length>0 ? (
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
                <ActivityIndicator style={{top:"30%"}} animating={true} color={colors.white} />
              </Animated.View>
            )}

            {/* <Text style={styles.headerText}>Bu próximo evento</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation?.navigate("event", trendingEvents[1])}
              style={{
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 1,
                shadowRadius: 1,
                elevation: 3,
                marginVertical: 10,
              }}
            >
              <BigCard2
                title={trendingEvents[1]?.title}
                date={trendingEvents[1]?.date}
                venue={{
                  displayName: trendingEvents[1]?.venue?.displayName,
                  city: trendingEvents[1]?.venue?.city,
                }}
                image={{
                  uri: trendingEvents[1]?.photos[0]?.[0]?.uri,
                }}
              />
          
            </TouchableOpacity> */}
            <Text style={styles.headerText}>Pa bó</Text>
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
