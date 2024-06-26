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

import colors from "../../../components/colors";

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

import { categories } from "../../../components/Data/categories";
import { recommendedEvents } from "../../../components/Data/stockEvents";
import { artist } from "../../../components/Data/artist";

import SmallCard from "../../../components/cards/SmallCard";
import MediumCard from "../../../components/cards/MediumCard";
import { markers } from "../../../components/Data/markers";
import { useData } from "../../../components/hooks/useData";
import axios from "axios";
import VenuesList from "../../../components/cards/Venues/VenueList";
import Screen from "../../../components/Screen";
const SearchScreen2 = ({
  navigation,
  navigation: { goBack, canGoBack },
  route,
}) => {
  const { text, category, code } = route.params;
  const { apiUrl } = useData();
  const [searchText, setSearchText] = useState(text);
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [users, setUsers] = useState([]);

  const [firstMount, setFirstMount] = useState(true);
  const [inSearch, setInSearch] = useState(text ? true : false);
  const [loading, setLoading] = useState(true);
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

  const getCategoryEvents = async () => {
    try {
      const result = await axios.get(`${apiUrl}/events/?category=${code}`);
      setEvents(result?.data);
    } catch (error) {
    } finally {
      // setFetched(true);
      setLoading(false);
    }
    // console.log(result?.data);
  };

  useEffect(() => {
    if (!inSearch) {
      getCategoryEvents();
    } else {
      getEvents();
      getVenues();
      getUsers();
    }

    setFirstMount(false);
    // getResults();
  }, []);

  const getResults = async () => {
    setInSearch(true);
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
  }, [users, events, venues]);

  return (
    <Screen style={{ flex: 1, backgroundColor: colors.background }}>
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          zIndex: 2,
          width: "100%",
        }}
      >
     
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              // left: 20,
              marginLeft: 20,
            }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color={colors.t2}
            />
          </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            width: "80%",
            left: 10,
          }}
        >
          <Entypo
            style={{ position: "absolute", zIndex: 1, left: 10, top: 10 }}
            name="magnifying-glass"
            size={19}
            color={colors.t4}
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
                  zIndex: 3,
                  right: 10,
                  top: 8,
                  // backgroundColor:"red"
                }}
                name="circle-with-cross"
                size={20}
                color={colors.darkGrey}
              />
            </TouchableOpacity>
          )}
        </View>

       
      </View>
      {inSearch && !loading && (
        <Animated.View entering={FadeIn.duration(250)}>
          <Tab
            indicatorStyle={{
              backgroundColor: colors.primary,
              height: 2,
              width: "33%",
            }}
            value={index}
            onChange={setIndex}
            style={{ top: 5 }}
            disableIndicator
            titleStyle={(active) => ({
              color: active ? colors.primary : colors.t5,
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
                    backgroundColor: active ? colors.primary : colors.t4,
                    // padding: 5 ,
                    borderRadius: 30,
                    // position: "absolute",
                    height: 20,
                    width: 20,
                  }}
                >
                  <Text
                    style={{
                      color: active ? colors.t2 : colors.black,
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {users?.length}
                  </Text>
                </View>
              )}
              title={"Artistas"}
              iconPosition="right"
            />

            <Tab.Item
              icon={(active) => (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    left: 10,
                    backgroundColor: active ? colors.primary : colors.t4,
                    // padding: 5 ,
                    borderRadius: 30,
                    // position: "absolute",
                    height: 20,
                    width: 20,
                  }}
                >
                  <Text
                    style={{
                      color: active ? colors.t2 : colors.black,
                      fontSize: 12,
                      fontWeight: "600",
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
                    backgroundColor: active ? colors.primary : colors.t4,
                    // padding: 5 ,
                    borderRadius: 30,
                    // position: "absolute",
                    height: 20,
                    width: 20,
                  }}
                >
                  <Text
                    style={{
                      color: active ? colors.t2 : colors.black,
                      fontSize: 12,
                      fontWeight: "600",
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
        </Animated.View>
      )}
      {!inSearch && !loading && (
        <Animated.FlatList
          entering={FadeIn.duration(250)}
          data={events}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={
            !inSearch ? (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  // padding: 5,
                  zIndex: 2,
                  left: 20,
                  marginTop: 20,
                  color: colors.t2,
                }}
              >
                {category}
              </Text>
            ) : (
              <View style={{ marginTop: 0 }} />
            )
          }
          renderItem={({ item }) => {
            return (
              <Animated.View entering={FadeIn} exiting={FadeOut.duration(200)}>
                <SmallCard {...item} />
              </Animated.View>
            );
          }}
          ListFooterComponent={<View style={{ marginBottom: 50 }} />}
          ListEmptyComponent={
            !loading && (
              <Animated.Text
                entering={FadeIn}
                style={{
                  color: colors.t4,
                  fontSize: 16,
                  fontWeight: "500",
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                Nenhum evento encontrado
              </Animated.Text>
            )
          }
        />
      )}
      {inSearch && !loading && (
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
                onPress={() => navigation.navigate("artist", { item })}
                activeOpacity={0.5}
                style={{
                  shadowOffset: { width: 0.5, height: 0.5 },
                  shadowOpacity: 0.3,
                  shadowRadius: 1,
                  elevation: 2,
                  width: "100%",
                  marginTop: 10,
                }}
                // onPress={() => navigation.navigate("event", {item})}
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
          ListEmptyComponent={
            !loading && (
              <Animated.Text
                entering={FadeIn}
                style={{
                  color: colors.t4,
                  fontSize: 16,
                  fontWeight: "500",
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                Nenhum artista encontrado
              </Animated.Text>
            )
          }
        />
      )}
      {inSearch && !loading && (
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
              return <SmallCard {...item} />;
            }}
            ListFooterComponent={<View style={{ marginBottom: 50 }} />}
            ListEmptyComponent={
              !loading && (
                <Animated.Text
                  entering={FadeIn}
                  style={{
                    color: colors.t4,
                    fontSize: 16,
                    fontWeight: "500",
                    textAlign: "center",
                    marginTop: 20,
                  }}
                >
                  Nenhum evento encontrado
                </Animated.Text>
              )
            }
          />
        </>
      )}
      {inSearch && !loading && (
        <Animated.FlatList
          style={{
            width: index != 2 ? 0 : "",
            height: index != 2 ? 0 : "",
            position: index != 2 ? "absolute" : "relative",
          }}
          data={venues}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={<View style={{ marginTop: 5 }} />}
          renderItem={({ item }) => {
            return <VenuesList {...item} />;
          }}
          ListFooterComponent={<View style={{ marginBottom: 50 }} />}
          ListEmptyComponent={
            !loading && (
              <Animated.Text
                entering={FadeIn}
                style={{
                  color: colors.t4,
                  fontSize: 16,
                  fontWeight: "500",
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                Nenhum lugar encontrado
              </Animated.Text>
            )
          }
        />
      )}
    </Screen>
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
