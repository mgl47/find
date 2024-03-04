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

  return (
    <Screen>
      <MainHeader
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
            top: 5,
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
              onSubmitEditing={() => navigation.navigate("search", searchText)}
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
              backgroundColor: "white",
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
                    textStyle={
                      {
                        // color: colors.white,
                      }
                    }
                    style={{
                      backgroundColor: colors.light2,
                      paddingHorizontal: 2,
                      marginHorizontal: 3,
                      borderRadius: 20,
                    }}
                    // background={{ color: colors.description }}
                    // icon="information"
                    // onPress={() => console.log("Pressed")}
                    onPress={() => setShowSearch(!showSearch)}
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
                    onPress={() => navigation.navigate("event", item)}
                  >
                    <MediumCard {...item} />
                  </TouchableOpacity>
                );
              }}
            />
            <Text style={styles.headerText}>Upcoming Event</Text>
            <TouchableOpacity
            // onPress={() => navigation.navigate("event")}
            >
              <BigCard
                title="Photography Workshop"
                date=" Sun, 29 May - 3:00 pm
Wroclaw"
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
                    onPress={() => navigation.navigate("event", item)}
                  >
                    <SmallCard {...item} />
                  </TouchableOpacity>
                );
              }}
            />
          </>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    padding: 5,
    marginVertical: 5,
  },
  search: {
    height: 40,
    width: "100%",
    backgroundColor: colors.light2,
    borderRadius: 30,
    paddingLeft: 40,
  },
});