import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";

import { Calendar, LocaleConfig } from "react-native-calendars";

import MapView, { Marker } from "react-native-maps";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
  FontAwesome5,
  Feather,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";
import { Tab } from "@rneui/base";

import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutDown,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
} from "react-native-reanimated";
import { Chip } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { recommendedEvents } from "../../components/Data/events";
import colors from "../../components/colors";
import { markers } from "../../components/Data/markers";
import SmallCard from "../../components/cards/SmallCard";
import Screen from "../../components/Screen";
const { height, width } = Dimensions.get("window");

const CalendarScreen = () => {
  const navigation = useNavigation();

  const [selectedDay, setSelectedDay] = useState("");

  const [loading, setLoading] = useState(false);

  // const getResults = async (item) => {
  //   setLoading(true);
  //   await new Promise((resolve, reject) => {
  //     setTimeout(resolve, 500);
  //   });
  //   setVenueDetails(item);
  //   console.log(item);

  //   setLoading(false);
  // };
  return (
    <Animated.View
      style={{ flex: 1, backgroundColor: colors.background, marginTop: 5 }}
      entering={SlideInDown}
      exiting={SlideOutDown}
    >
      <FlatList
        data={recommendedEvents.slice(1, 3).reverse()}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View
            style={{
              shadowOffset: { width: 0.5, height: 0.5 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              elevation: 2,
            }}
          >
            <Calendar
              onDayPress={(day) => {
                setSelectedDay(day.dateString);
              }}
              theme={{
                textSectionTitleColor: "#b6c1cd",
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: "#ffffff",
                textMonthFontWeight: "500",
                textDayFontWeight: "500",
                todayTextColor: colors.primary,
                //  textDayHeaderFontWeight:"500",
                // textDayHeaderFontSize:14,

                // textDisabledColor: "#d9e",
              }}
              markedDates={{
                [selectedDay]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedDotColor: "orange",
                },
              }}
            />
          </View>
        }
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
        ListFooterComponent={<View style={{ marginBottom: 200 }} />}
      />
    </Animated.View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  map: {
    width: "100%",
    // borderRadius: 5,
    height: height * 0.35,
    backgroundColor: colors.grey,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // overflow:"hidden",

    // borderRadius: 10,
  },
  separator: {
    width: "95%",
    height: 1,
    backgroundColor: colors.grey,
    marginBottom: 2,
    alignSelf: "center",
  },
});
