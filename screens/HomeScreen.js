import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityBase,
  View,
} from "react-native";
import React from "react";
import Screen from "../components/Screen";
import { recommendedEvents, trendingEvents } from "../components/Data/events";
import MediumCard from "../components/cards/MediumCard";
import BigCard from "../components/cards/BigCard";
import SmallCard from "../components/cards/SmallCard";

export default function HomeScreen() {
  return (
    <Screen>
      <FlatList
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            <Text style={styles.headerText}>Trending in your area</Text>

            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={trendingEvents}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                  //   onPress={() => navigation.navigate(event.onPress)}
                  >
                    <MediumCard
                      title={item.title}
                      date={item.date}
                      city={item.city}
                      uri={item.uri}
                      Category={item.Category}
                    />
                  </TouchableOpacity>
                );
              }}
            />
            <Text style={styles.headerText}>Upcoming Event</Text>
            <TouchableOpacity
            // onPress={() => navigation.navigate("Photo")}
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
                  //   onPress={() => navigation.navigate(event.onPress)}
                  >
                    <SmallCard
                      title={item.title}
                      date={item.date}
                      city={item.city}
                      uri={item.uri}
                      Category={item.Category}
                      interest={item.interest}
                    />
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
});
