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
import React, { useEffect, useRef, useState } from "react";

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
import { ActivityIndicator, Chip } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { recommendedEvents } from "../../../components/Data/stockEvents";
import colors from "../../../components/colors";
import { markers } from "../../../components/Data/markers";
import SmallCard from "../../../components/cards/SmallCard";
import Screen from "../../../components/Screen";
import axios from "axios";
import { useAuth } from "../../../components/hooks/useAuth";
import { useData } from "../../../components/hooks/useData";
const { height, width } = Dimensions.get("window");

const CalendarScreen = () => {
  const url = process.env.EXPO_PUBLIC_API_URL;

  LocaleConfig.locales["pt"] = {
    monthNames: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
    monthNames: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
    monthNamesShort: [
      "Jan.",
      "Fev.",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul.",
      "Ago",
      "Set.",
      "Out.",
      "Nov.",
      "Dez.",
    ],
    dayNames: [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ],
    dayNamesShort: ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sab."],
    today: "hoje",
  };
  LocaleConfig.defaultLocale = "pt";
  const navigation = useNavigation();
  const { events } = useData();

  const [selectedDay, setSelectedDay] = useState("");
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  let calDays = [];
  let a = events?.map((item) =>
    item?.dates?.forEach((item) => calDays.push(item?.calendarDate))
  );

  const filteredDays = calDays?.map((item) => {
    return {
      [item]: {
        marked: true,
        selected: selectedDay == item,
        dotColor: colors.primary,
        selectedColor: colors.primary,
      },
    };
  });
  const markedDatesData = filteredDays?.reduce((acc, curr) => {
    return { ...acc, ...curr };
  }, {});

  const getCalendarEvents = async (day) => {
    setLoading(true);
    setSelectedDay(day.dateString);
    let arr = [];
    events?.filter((item) =>
      item?.dates.forEach((item2) => {
        if (item2?.calendarDate == day?.dateString) arr.push(item);
      })
    );
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 500);
    });
    setCalendarEvents(arr);
    setLoading(false);
  };
  return (
    <Animated.FlatList
      entering={SlideInDown}
      exiting={SlideOutDown}
      style={{ flex: 1, backgroundColor: colors.background }}
      data={calendarEvents}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View
          style={{
            shadowOffset: { width: 0.5, height: 0.5 },
            shadowOpacity: 0.3,
            shadowRadius: 1,
            elevation: 2,
            marginTop: 5,
          }}
        >
          <Calendar
            // onDayPress={(day) => {
            //   setSelectedDay(day.dateString);
            // }}
            onDayPress={getCalendarEvents}
            theme={{
              textSectionTitleColor: "#b6c1cd",
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: "#ffffff",
              textMonthFontWeight: "500",
              textDayFontWeight: "500",
              todayTextColor: colors.primary,
              arrowColor: colors.primary,
              //  textDayHeaderFontWeight:"500",
              // textDayHeaderFontSize:14,

              // textDisabledColor: "#d9e",
            }}
            // markedDates={{
            //   [selectedDay]: {
            //     selected: true,
            //     disableTouchEvent: true,
            //     selectedDotColor: "orange",
            //   },
            // }}
            markedDates={{
              [selectedDay]: {
                selected: true,
                disableTouchEvent: true,
                // selectedDotColor: "orange",s
              },
              ...markedDatesData,

              // "2024-03-21": {
              //   disabled: false,
              //   marked: true,
              //   selected: selectedDay == "2024-03-21",

              //   dotColor: colors.primary,
              //   selectedColor: colors.primary,
              // },
              // "2024-03-22": { marked: true, dotColor: colors.primary },
              // "2024-03-23": {
              //   marked: true,
              //   dotColor: colors.primary,
              // },
            }}
          />
          {loading && (
            <Animated.View
              style={{
                // position: "absolute",
                alignSelf: "center",
                // top: 10,
                // zIndex: 2,
                marginVertical: 20,
              }}
              // entering={SlideInUp.duration(300)}
              // exiting={SlideOutUp.duration(300)}
            >
              <ActivityIndicator animating={true} color={colors.primary} />
            </Animated.View>
          )}
        </View>
      }
      renderItem={({ item }) => {
        return !loading ? (
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
              elevation: 2,
              
              padding: 7,
            }}
            // onPress={() => navigation.navigate("event", item)}
          >
            <SmallCard {...item} />
          </TouchableOpacity>
        ) : null;
      }}
      ListFooterComponent={<View style={{ marginBottom: 200 }} />}
    />
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
