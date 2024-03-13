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
} from "react-native-reanimated";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";

import { categories } from "../../../components/Data/categories";
import { newEvents, recommendedEvents } from "../../../components/Data/events";
import SmallCard from "../../../components/cards/SmallCard";
import MediumCard from "../../../components/cards/MediumCard";
const SearchScreen = ({
  navigation,
  navigation: { goBack, canGoBack },
  route,
}) => {
  const [searchText, setSearchText] = useState("");
  const [firstMount, setFirstMount] = useState(true);
  const [inSearch, setInSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState(recommendedEvents.slice().reverse());

  useEffect(() => {
    setFirstMount(false);
  }, []);

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
          entering={SlideInRight.duration(580)}
        >
          <TouchableOpacity
            style={{ left: inSearch ? 5 : 0 }}
            onPress={() => {
              navigation.navigate("home"), Keyboard.dismiss();
            }}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              sair
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
                onSubmitEditing={() => {
                  Keyboard.dismiss(),
                    navigation.navigate("search2", { text: searchText });
                }}
                // placeholder="encontre artistas, eventos ou lugares"
                placeholder=" artistas, eventos ou lugares"
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
  }, [searchText]);
  return (
    ///////////////
    ///////////////
    //Tutorials
    ///////////////
    ///////////////
    <Animated.FlatList
      style={{ backgroundColor: colors.background }}
      // contentContainerStyle={{ alignItems: "center" }}
      entering={firstMount && SlideInDown}
      ListFooterComponent={
        <>
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
                      onPress={() =>
                        navigation.navigate("search2", {
                          category: item?.label,
                        })
                      }
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
                {recent?.length > 0 && (
                  <>
                    <Animated.Text
                      style={styles.headerText}
                      exiting={SlideOutLeft.duration(500)}
                    >
                      Vistos recentementes
                    </Animated.Text>
                    <Animated.View
                      style={{
                        // padding: 10,
                        right: 10,
                        // alignSelf: "flex-end",
                        position: "absolute",
                        marginBottom: 10,
                      }}
                      exiting={SlideOutLeft.duration(500)}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setRecent("");
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
                    </Animated.View>
                  </>
                )}
              </View>
              <Animated.FlatList
                exiting={SlideOutLeft.duration(500)}
                // entering={index == 0 ?SlideInRight:SlideInLeft}
                // exiting={SlideOutLeft}
                // data={recommendedEvents.slice().reverse()}
                data={recent}
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
        </>
      }
    />
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
