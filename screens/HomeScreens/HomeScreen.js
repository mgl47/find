import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableOpacityBase,
  View,
} from "react-native";
import React, { useState } from "react";
import Screen from "../../components/Screen";
import {
  recommendedEvents,
  trendingEvents,
} from "../../components/Data/events";
import MediumCard from "../../components/cards/MediumCard";
import BigCard from "../../components/cards/BigCard";
import SmallCard from "../../components/cards/SmallCard";
import MainHeader from "../../components/navigation/MainHeader";
import { Chip } from "react-native-paper";
import { categories } from "../../components/Data/categories";
import colors from "../../components/colors";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
} from "react-native-reanimated";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import AppTextInput from "../../components/AppTextInput";

export default function HomeScreen({ navigation }) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState(false);

  return (


      <Screen >
        <MainHeader
          user={user}
          navigation={navigation}
          mainScreen
          onPressSearch={() => setShowSearch(true)}
        />

        {showSearch && (
          <Animated.View
            entering={SlideInRight.duration(250)}
            exiting={SlideOutRight.duration(250)}
            style={{
              width: "100%",
              position: "absolute",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",

              zIndex: 1,
              padding: 5,
              top: -8,
              height: 50,
            }}
          >
            <View style={{ flexDirection: "row", width: "90%" }}>
              <MaterialCommunityIcons
                style={{ position: "absolute", zIndex: 1, left: 10, top: 8 }}
                name="magnify"
                size={25}
                color="black"
              />

              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={() =>
                  navigation.navigate("search", searchText)
                }
                returnKeyType="search"
                autoFocus
                style={styles.search}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowSearch(false), setSearchText("");
              }}
              style={{
                right: 5,
                height: 40,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.white,
                borderRadius: 50,
              }}
              activeOpacity={1}
            >
              <Entypo name="cross" size={27} color={colors.black2} />
              {/* <MaterialCommunityIcons
              name="close"
              size={27}
              color={colors.primary}
            /> */}
            </TouchableOpacity>
          </Animated.View>
        )}
        <View style={styles.container}>
          <FlatList
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <>
                <FlatList
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
                          marginVertical: 5,
                          marginHorizontal: 3,
                          marginBottom:10,
                          borderRadius: 20,
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

                <Text style={styles.headerText}>Trending in your area</Text>

                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  data={trendingEvents}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                      activeOpacity={0.8}
                        style={{
                          shadowOffset: { width: 1, height: 1 },
                          shadowOpacity: 1,
                          shadowRadius: 1,
                          elevation: 3,
                          marginVertical:10
                        }}
                        onPress={() =>item.valid? navigation.navigate("event", item):null}
                      >
                        <MediumCard {...item} />
                      </TouchableOpacity>
                    );
                  }}
                />
                <Text style={styles.headerText}>Upcoming Event</Text>
                <TouchableOpacity
                                      activeOpacity={0.8}

                // onPress={() => navigation.navigate("event")}
                style={{
                  shadowOffset: { width: 1, height: 1 },
                  shadowOpacity: 1,
                  shadowRadius: 1,
                  elevation: 3,
                  marginVertical:10
                }}
                >
                  <BigCard
                    title="Workshop de fotografia"
                    date="Domingo, 29 Mai - 14h00"
                    venue={{
                      displayName: "Praça Alexandre Abluquerque",
                      city: "Praia",
                    }}

                    image={{
                      uri: "https://images.unsplash.com/photo-1553249067-9571db365b57?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
                    }}
                  />
                </TouchableOpacity>
                <Text style={styles.headerText}>Recommended for you</Text>
                <FlatList
                  data={recommendedEvents}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
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
            }
          />
        </View>
      </Screen>

  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red",
    backgroundColor: colors.background,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    // padding: 5,
    left:20
    // marginVertical: 5,
  },
  search: {
    height: 40,
    width: "100%",
    backgroundColor: colors.light2,
    borderRadius: 30,
    paddingLeft: 40,
  },
});
