import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Button,
  TextInput,
  FlatList,
  Keyboard,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import colors from "../../components/colors";

import { Tab, Text as Text2, TabView } from "@rneui/themed";

import {
  ActivityIndicator,
  Chip,
  MD2Colors,
  SegmentedButtons,
} from "react-native-paper";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutLeft,
  FadeIn,
  SlideOutRight,
  SlideOutUp,
  SlideInDown,
  FadeOut,
} from "react-native-reanimated";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";

import { categories } from "../../components/Data/categories";
import { recommendedEvents } from "../../components/Data/stockEvents";
import { artist } from "../../components/Data/artist";

import SmallCard from "../../components/cards/SmallCard";
import MediumCard from "../../components/cards/MediumCard";
import { markers } from "../../components/Data/markers";
import { useData } from "../../components/hooks/useData";
import axios from "axios";
import VenuesList from "../../components/cards/Venues/VenueList";
const SearchScreen2 = ({
  navigation,
  navigation: { goBack, canGoBack },
  route,
}) => {
  const { text, category } = route.params;
  const { apiUrl } = useData();
  const [searchText, setSearchText] = useState(text);
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [users, setUsers] = useState([]);

  const [firstMount, setFirstMount] = useState(true);
  const [inSearch, setInSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(1);

  const fetchData = async (endpoint, setter) => {
    try {
      setLoading(true);
      const result = await axios.get(
        `${apiUrl}/${endpoint}/search/?search=${searchText.trim()}`
      );
      setter(result?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getEvents = async () => {
    await fetchData("events", setEvents);
  };

  const getUsers = async () => {
    await fetchData("users", setUsers);
  };

  const getVenues = async () => {
    await fetchData("venues", setVenues);
  };

  useEffect(() => {
    getEvents();
    getVenues();
    getUsers();
    setFirstMount(false);
    getResults();
  }, []);

  const getResults = async () => {
    setLoading(true);
    getEvents();
    getVenues();
    getUsers();
    setLoading(false);
  };

  useEffect(() => {
    let maxLength = Math.max(users.length, events.length, venues.length);

    if (maxLength === events.length) {
      setIndex(1);
    } else if (maxLength === venues.length) {
      setIndex(2);
    } else if (maxLength === users.length) {
      setIndex(0);
    }

    // Use index as needed...
  }, [users, events, venues]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerRight: () => (
        <Animated.View
          style={{
            padding: 10,
            right: 10,
            // alignSelf: "flex-end",
            position: "absolute",
            // marginBottom: 10,
            zIndex: 2,
          }}
          //   entering={SlideInRight.duration(570)}
        >
          <TouchableOpacity
            style={{ left: 8 }}
            onPress={() => {
              //   setcategory(false),
              //     setSearchText(""),
              Keyboard.dismiss(), navigation.goBack();
            }}
          >
            <Text
              style={{
                color: colors.white,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Voltar
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ),

      headerTitle: () =>
        category ? (
          <Text
            style={{ fontSize: 17, fontWeight: "600", color: colors.white }}
          >
            {category}
          </Text>
        ) : (
          <View
            style={{
              // marginTop: 40,
              flexDirection: "row",
              alignItems: "center",
              // backgroundColor: colors.white,
              zIndex: 2,
            }}
          >
            {/* {navigation.canGoBack("calendar") && (
              <TouchableOpacity
                style={{ position: "absolute", zIndex: 3, left: 4 }}
                onPress={() =>
                  navigation.canGoBack("calendar")
                    ? navigation.goBack()
                    : navigation.navigate("calendar")
                }
              >
                <Entypo name="chevron-left" size={30} color={colors.primary} />
              </TouchableOpacity>
            )} */}
            <Animated.View
              // entering={SlideInRight.duration(500)}
              // exiting={SlideOutRight.duration(250)}
              style={{
                width: "100%",

                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",

                zIndex: 1,
                // padding: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "85%",
                  // left: 10,
                  // width: "75%",
                  // left: 40,
                }}
              >
                <Entypo
                  style={{ position: "absolute", zIndex: 1, left: 10, top: 10 }}
                  name="magnifying-glass"
                  size={19}
                  color={colors.description}
                />

                <TextInput
                  value={searchText}
                  onChangeText={setSearchText}
                  onSubmitEditing={getResults}
                  // placeholder="encontre artistas, eventos ou lugares"
                  placeholder=" artistas, eventos ou lugares"
                  placeholderTextColor={colors.t5}
                  returnKeyType="search"
                  //   autoFocus
                  style={[styles.search, { width: "100%" }]}
                />
                {searchText && (
                  <TouchableOpacity
                    onPress={() => {
                      setSearchText("");
                    }}
                  >
                    <Entypo
                      style={{
                        position: "absolute",
                        zIndex: 1,
                        right: 10,
                        top: 8,
                      }}
                      name="circle-with-cross"
                      size={20}
                      color={colors.darkGrey}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          </View>
        ),
    });
  }, [searchText]);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      {loading && (
        <Animated.View
          style={{
            position: "absolute",
            alignSelf: "center",
            top: 10,
            zIndex: 0,
          }}
          entering={SlideInUp.duration(300)}
          // exiting={SlideOutUp.duration(300)}
        >
          <ActivityIndicator animating={loading} color={colors.primary} />
        </Animated.View>
      )}

      {!category && !loading && (
        <Tab
          // titleStyle={{ color: colors.primary }}

          indicatorStyle={{
            backgroundColor: colors.primary,
            height: 2,
            width: "33%",
          }}
          value={index}
          onChange={setIndex}
          // dense

          style={{ marginVertical: 5 }}
          disableIndicator
          titleStyle={(active) => ({
            color: active ? colors.primary : colors.darkGrey,
            fontSize: active ? 16 : 14,
            fontWeight: "500",
          })}
        >
          <Tab.Item
            icon={(active) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  left: 10,
                  backgroundColor: active ? colors.primary : colors.darkGrey,
                  // padding: 5 ,
                  borderRadius: 30,
                  // position: "absolute",
                  height: 20,
                  width: 20,
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 12,
                    fontWeight: "500",
                  }}
                >
                  {users?.length}
                </Text>
              </View>
            )}
            title={"Artistas"}
            iconPosition="right"
          />
          {/* <Tab.Item>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  color: colors.darkGrey,
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                Artistas
              </Text>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  left: 5,
                  backgroundColor: colors.darkGrey,
                  padding: 3,
                  borderRadius: 30,
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 12,
                    fontWeight: "500",
                  }}
                >
                  {artist?.length}
                </Text>
              </View>
            </View>
          </Tab.Item> */}
          <Tab.Item
            icon={(active) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  left: 10,
                  backgroundColor: active ? colors.primary : colors.darkGrey,
                  // padding: 5 ,
                  borderRadius: 30,
                  // position: "absolute",
                  height: 20,
                  width: 20,
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 12,
                    fontWeight: "500",
                  }}
                >
                  {events?.length}
                </Text>
              </View>
            )}
            title={"Eventos"}
            iconPosition="right"
          />
          <Tab.Item
            icon={(active) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  left: 10,
                  backgroundColor: active ? colors.primary : colors.darkGrey,
                  // padding: 5 ,
                  borderRadius: 30,
                  // position: "absolute",
                  height: 20,
                  width: 20,
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 12,
                    fontWeight: "500",
                  }}
                >
                  {venues?.length}
                </Text>
              </View>
            )}
            title={"Lugares"}
            iconPosition="right"
          />
        </Tab>
      )}
      {category && !loading && (
        <Animated.FlatList
          //  entering={index == 0 ? SlideInRight : SlideInLeft}
          // exiting={index == 0? SlideOutRight : SlideOutLeft}
          contentContainerStyle={{ alignItems: "center" }}
          entering={FadeIn.duration(250)}
          // data={newEvents?.slice().reverse()}
          data={events}
          showsVerticalScrollIndicator={false}
          // numColumns={2}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={<View style={{ marginTop: 5 }} />}
          renderItem={({ item }) => {
            return (
              <SmallCard {...item} />

              // <TouchableOpacity
              //   activeOpacity={0.8}
              //   style={{
              //     shadowOffset: { width: 1, height: 1 },
              //     shadowOpacity: 1,
              //     shadowRadius: 1,
              //     elevation: 3,
              //     // marginVertical: 5,

              //     // alignSelf: "center",
              //   }}
              //   onPress={() => navigation.navigate("event", item)}
              // >
              //* <MediumCard {...item} /> *
              // </TouchableOpacity>
            );
          }}
          ListFooterComponent={<View style={{ marginBottom: 50 }} />}
        />
      )}
      {!category && !loading && (
        <Animated.FlatList
          style={{
            width: index != 0 ? 0 : "",
            height: index != 0 ? 0 : "",
            position: index != 0 ? "absolute" : "relative",
          }}
          // entering={index == 0 ?SlideInRight:SlideInLeft}
          // exiting={SlideOutLeft}
          data={users}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={<View style={{ marginTop: 5 }} />}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate("artist", item)}
                activeOpacity={0.5}
                style={{
                  shadowOffset: { width: 0.5, height: 0.5 },
                  shadowOpacity: 0.3,
                  shadowRadius: 1,
                  elevation: 2,
                  width: "100%",
                  marginTop: 10,
                }}
                // onPress={() => navigation.navigate("event", item)}
              >
                <Animated.View
                  style={styles.userCard}
                  entering={FadeIn}
                  exiting={FadeOut}
                >
                  <Image
                    source={{
                      uri: item?.photos?.avatar?.[0]?.uri,
                    }}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 50,

                      // marginLeft: 20,
                      // position: "absolute",
                    }}

                    // resizeMode="contain"
                  />
                  <View style={{ alignItems: "center", marginLeft: 10 }}>
                    <Text numberOfLines={2} style={[styles.displayName]}>
                      {item?.displayName}
                    </Text>
                    <Text numberOfLines={2} style={[styles.userName]}>
                      @{item?.username}
                    </Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={<View style={{ marginBottom: 50 }} />}
        />
      )}
      {!category && !loading && (
        <>
          <Animated.FlatList
            style={{
              width: index != 1 ? 0 : "",
              height: index != 1 ? 0 : "",
              position: index != 1 ? "absolute" : "relative",
            }}
            //  entering={index == 0 ? SlideInRight : SlideInLeft}
            // exiting={index == 0? SlideOutRight : SlideOutLeft}
            // contentContainerStyle={{ alignItems: "center" }}
            entering={FadeIn.duration(250)}
            // data={newEvents}
            data={events}
            showsVerticalScrollIndicator={false}
            // numColumns={2}
            keyExtractor={(item) => item._id}
            ListHeaderComponent={<View style={{ marginTop: 5 }} />}
            renderItem={({ item }) => {
              return (
                // <TouchableOpacity
                //   activeOpacity={0.8}
                //   style={{
                //     shadowOffset: { width: 1, height: 1 },
                //     shadowOpacity: 1,
                //     shadowRadius: 1,
                //     elevation: 3,
                //     // marginVertical: 5,

                //     // alignSelf: "center",
                //   }}
                //   onPress={() => navigation.navigate("event", item)}
                // >
                //                   {/* <MediumCard {...item} />

                //  */}

                <SmallCard {...item} />
                // {/* </TouchableOpacity> */}
              );
            }}
            ListFooterComponent={<View style={{ marginBottom: 50 }} />}
          />
        </>
      )}
      {!category && !loading && (
        <Animated.FlatList
          style={{
            width: index != 2 ? 0 : "",
            height: index != 2 ? 0 : "",
            position: index != 2 ? "absolute" : "relative",
          }}
          // entering={SlideInRight}
          // exiting={SlideOutRight}
          //   style={{ zIndex: 0 }}
          data={venues}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={<View style={{ marginTop: 5 }} />}
          renderItem={({ item }) => {
            return <VenuesList {...item} />;
          }}
          ListFooterComponent={<View style={{ marginBottom: 50 }} />}
        />
      )}
    </View>
  );
};

export default SearchScreen2;

const styles = StyleSheet.create({
  search: {
    height: 37,
    width: "90%",
    backgroundColor: colors.background2,
    color: colors.t4,
    borderRadius: 30,
    paddingLeft: 35,
    paddingRight: 30,
  },
  headerText: {
    fontSize: 19,
    fontWeight: "500",
    // padding: 5,
    zIndex: 2,
    left: 20,
    marginVertical: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 10,
    padding: 10,
    // height: 95,
    backgroundColor: colors.white,
    overflow: "hidden",
    width: "95%",
    alignSelf: "center",

    borderRadius: 10,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 1,
    // shadowRadius: 1,
    // elevation: 3,
  },
  userCard: {
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,

    // height: 95,
    backgroundColor: colors.background2,
    overflow: "hidden",
    width: "95%",
    alignSelf: "center",

    borderRadius: 10,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 1,
    // shadowRadius: 1,
    // elevation: 3,
  },
  userName: {
    fontSize: 14,
    alignSelf: "flex-start",
    color: colors.t4,
    fontWeight: "600",
  },

  displayName: {
    alignSelf: "flex-start",
    fontSize: 19,
    fontWeight: "600",
    color: colors.t2,
    marginTop: 10,
    marginBottom: 3,
  },
});
