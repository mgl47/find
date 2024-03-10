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
} from "react-native-reanimated";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";

import { categories } from "../../components/Data/categories";
import { newEvents, recommendedEvents } from "../../components/Data/events";
import SmallCard from "../../components/cards/SmallCard";
import MediumCard from "../../components/cards/MediumCard";
const SearchScreen = ({
  navigation,
  navigation: { goBack, canGoBack },
  route,
}) => {
  const [searchText, setSearchText] = useState("");
  const[firstMount,setFirstMount]=useState(true)
  const [inSearch, setInSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(1);


  useEffect(() => {
 setFirstMount(false)
  }, [])
  
  const getResults = async () => {
    setLoading(true);
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 1500);
    });

    setInSearch(true);
    setLoading(false);
  };

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
          entering={SlideInRight.duration(570)}
        >
          <TouchableOpacity
            style={{ left: inSearch ? 5 : 0 }}
            onPress={
              inSearch
                ? () => {
                    setInSearch(false), setSearchText(""), Keyboard.dismiss();
                  }
                : () => navigation.navigate("home")
            }
          >

            <Text
              style={{
                color: colors.primary,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              {inSearch ? "Voltar" : "sair"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ),

      headerTitle: () => (
        <View
          style={{
            // marginTop: 40,
            flexDirection: "row",
            alignItems: "center",
            // backgroundColor: "white",
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
            entering={SlideInRight.duration(500)}
            exiting={SlideOutRight.duration(250)}
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
                // onSubmitEditing={() => navigation.navigate("search", searchText)}
                onSubmitEditing={getResults}
                // placeholder="encontre artistas, eventos ou lugares"
                placeholder="artistas, eventos ou lugares"
                placeholderTextColor={colors.description}
                returnKeyType="search"
                autoFocus
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
                    color={colors.grey}
                  />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      ),
    });
  }, [searchText, inSearch]);
  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        zIndex: 1,
        width: "100%",
      }}
    >
      <Animated.FlatList
      entering={firstMount&&SlideInDown}
        ListFooterComponent={
          <>
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
                <ActivityIndicator
                  animating={loading}
                  color={MD2Colors.blue700}
                />
              </Animated.View>
            )}

            {!inSearch && !loading && (
              <>
                <Text style={styles.headerText}>Categorias</Text>
                <Animated.FlatList
                  exiting={SlideOutUp}
                  // entering={SlideInUp.duration(500)}
                  // style={{ position: "absolute" }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={categories}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    return (
                      <Chip
                        elevation={1}
                        textStyle={
                          {
                            // color: colors.white,
                          }
                        }
                        style={{
                          margin: 2,
                          backgroundColor: colors.white,
                          // paddingHorizontal: 2,
                          //  marginVertical: 5,
                          marginHorizontal: 3,
                          // marginBottom: 10,
                          borderRadius: 12,
                          height: 32,
                        }}
                        // background={{ color: colors.description }}
                        // icon="information"
                        // onPress={() => console.log("Pressed")}
                        onPress={() => {}}
                      >
                        {item.label}
                      </Chip>
                    );
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 5,
                  }}
                >
                  <Text style={styles.headerText}>Vistos recentementes</Text>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={{
                      // padding: 10,
                      right: 10,
                      // alignSelf: "flex-end",
                      position: "absolute",
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.primary,
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      limpar
                    </Text>
                  </TouchableOpacity>
                </View>
                <Animated.FlatList
                  // entering={index == 0 ?SlideInRight:SlideInLeft}
                  // exiting={SlideOutLeft}
                  data={recommendedEvents.slice().reverse()}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  // ListHeaderComponent={<View style={{ marginTop: 10 }} />}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                          shadowOffset: { width: 0.5, height: 0.5 },
                          shadowOpacity: 0.3,
                          shadowRadius: 1,
                          elevation: 2,
                          padding: 10,
                        }}
                        // onPress={() => navigation.navigate("event", item)}
                      >
                        <SmallCard {...item} />
                      </TouchableOpacity>
                    );
                  }}
                  ListFooterComponent={<View style={{ marginBottom: 50 }} />}
                />
              </>
            )}

            {inSearch && !loading && (
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
                titleStyle={(active) => ({
                  color: active ? colors.primary : colors.darkGrey,
                  fontSize: active ? 16 : 14,
                  fontWeight: "500",
                })}
              >
                <Tab.Item>Artistas</Tab.Item>
                <Tab.Item>{"Eventos"}</Tab.Item>
                <Tab.Item>{"Lugares"}</Tab.Item>
              </Tab>
            )}
            {inSearch && !loading && index == 0 && (
              <Animated.FlatList
                // entering={index == 0 ?SlideInRight:SlideInLeft}
                // exiting={SlideOutLeft}
                data={recommendedEvents.slice(1, 3).reverse()}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={<View style={{ marginTop: 5 }} />}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        shadowOffset: { width: 0.5, height: 0.5 },
                        shadowOpacity: 0.3,
                        shadowRadius: 1,
                        elevation: 2,
                        padding: 10,
                      }}
                      // onPress={() => navigation.navigate("event", item)}
                    >
                      <SmallCard {...item} />
                    </TouchableOpacity>
                  );
                }}
                ListFooterComponent={<View style={{ marginBottom: 50 }} />}
              />
            )}
            {inSearch && !loading && index == 1 && (
              <>
                <Animated.FlatList
                  //  entering={index == 0 ? SlideInRight : SlideInLeft}
                  // exiting={index == 0? SlideOutRight : SlideOutLeft}
                  entering={FadeIn.duration(250)}
                  data={newEvents}
                  showsVerticalScrollIndicator={false}
                  numColumns={2}
                  keyExtractor={(item) => item.id}
                  ListHeaderComponent={<View style={{ marginTop: 5 }} />}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                          shadowOffset: { width: 1, height: 1 },
                          shadowOpacity: 1,
                          shadowRadius: 1,
                          elevation: 3,
                          // marginVertical: 5,

                          // alignSelf: "center",
                        }}
                        // onPress={() => navigation.navigate("event", item)}
                      >
                        <MediumCard {...item} />
                      </TouchableOpacity>
                    );
                  }}
                  ListFooterComponent={<View style={{ marginBottom: 50 }} />}
                />
              </>
            )}
            {inSearch && !loading && index == 2 && (
              <Animated.FlatList
                // entering={SlideInRight}
                // exiting={SlideOutRight}
                data={recommendedEvents.slice(2, 3).reverse()}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={<View style={{ marginTop: 5 }} />}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        shadowOffset: { width: 0.5, height: 0.5 },
                        shadowOpacity: 0.3,
                        shadowRadius: 1,
                        elevation: 2,
                        padding: 10,
                      }}
                      // onPress={() => navigation.navigate("event", item)}
                    >
                      <SmallCard {...item} />
                    </TouchableOpacity>
                  );
                }}
                ListFooterComponent={<View style={{ marginBottom: 50 }} />}
              />
            )}
          </>
        }
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  search: {
    height: 37,
    width: "90%",
    backgroundColor: colors.light2,
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
});
