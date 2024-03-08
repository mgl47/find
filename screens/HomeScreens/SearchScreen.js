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
  useMemo,
  useRef,
  useState,
} from "react";
import Header from "../../components/navigation/Header";
import Screen from "../../components/Screen";
import Svg, { Path, Defs, ClipPath, Image as SvgImage } from "react-native-svg";
import { RNHoleView } from "react-native-hole-view";
import BigTicket from "../../components/tickets/BigTicket";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import colors from "../../components/colors";
import { Camera, CameraType } from "expo-camera";
import { SimpleLineIcons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
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
} from "react-native-reanimated";
import { categories } from "../../components/Data/categories";
import { newEvents, recommendedEvents } from "../../components/Data/events";
import SmallCard from "../../components/cards/SmallCard";
import MediumCard from "../../components/cards/MediumCard";
const SearchScreen = ({ navigation, navigation: { goBack }, route }) => {
  const [searchText, setSearchText] = useState("");
  const [inSearch, setInSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hide, setHide] = useState(false);
  const [index, setIndex] = useState(1);
  const [value, setValue] = useState("");

  const getResults = async () => {
    setLoading(true);
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 1500);
    });

    setInSearch(true);
    setLoading(false);
  };
  return (
    <>
      <Screen style={{ flex: 0, zIndex: 2 }}></Screen>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          zIndex: 2,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 20 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Animated.View
          entering={SlideInRight.duration(500)}
          exiting={SlideOutRight.duration(250)}
          style={{
            width: "100%",

            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",

            zIndex: 1,
            padding: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "85%",
            }}
          >
            <MaterialCommunityIcons
              style={{ position: "absolute", zIndex: 1, left: 10, top: 10 }}
              name="magnify"
              size={20}
              color={colors.description}
            />

            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              // onSubmitEditing={() => navigation.navigate("search", searchText)}
              onSubmitEditing={getResults}
              placeholder="encontre artistas, eventos ou lugares"
              placeholderTextColor={colors.description}
              returnKeyType="search"
              autoFocus
              style={[styles.search, { width: inSearch ? "93%" : "100%" }]}
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
                    top: 10,
                  }}
                  name="circle-with-cross"
                  size={20}
                  color={colors.grey}
                />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        <View
          style={{
            width: "100%",
            zIndex: 2,
            bottom: -0.4,
            position: "absolute",
            height: 1,
            backgroundColor: colors.white,
            shadowOffset: { width: 0.5, height: 0.5 },
            shadowOpacity: 0.3,
            shadowRadius: 1,
            elevation: 2,
          }}
        />
        {inSearch && (
          <Animated.View
            
            style={{ zIndex: 2, position: "absolute", right: 10 }}
            entering={SlideInRight}
            exiting={SlideOutRight}
          >
            <TouchableOpacity
              onPress={() => {
                setInSearch(false), setSearchText(""), Keyboard.dismiss();
              }}
            >
              <Entypo name="cross" size={24} color="black" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      <View
        style={{
          backgroundColor: colors.background,
          flex: 1,
          zIndex: 1,
          width: "100%",
        }}
      >
        <FlatList
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
                            borderRadius: 20,
                            height: 32,
                          }}
                          // background={{ color: colors.description }}
                          // icon="information"
                          // onPress={() => console.log("Pressed")}
                          onPress={{}}
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

                  indicatorStyle={{ backgroundColor: colors.primary }}
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
    </>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  search: {
    height: 40,
    width: "90%",
    backgroundColor: colors.light2,
    borderRadius: 30,
    paddingLeft: 35,
    paddingRight: 35,
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
