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
import { useDesign } from "../../../components/hooks/useDesign";

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
  const { calDays, apiUrl, events } = useData();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [loading, setLoading] = useState(false);

  let calObj = {};

  events.forEach((event) =>
    event.dates.forEach((date) => {
      calObj[date.calendarDate] = calObj[date.calendarDate] + 1 || 1;
    })
  );

  let markedDatesData = {};

  for (let key in calObj) {
    if (calObj[key] >= 1) {
      markedDatesData[key] = {
        marked: true,
        selected: selectedDay == key,
        dotColor: colors.primary,
        selectedColor: colors.primary,
      };
    }
  }

  // console.log(markedDatesData);

  //Tip: You can use the reduce method to flatten the array of objects into a single object
  // const markedDatesData = filteredDays?.reduce((acc, curr) => {
  //   return { ...acc, ...curr };
  // }, {});

  const getCalendarEvents = async (day) => {
    if (
      day?.dateString == selectedDay ||
      markedDatesData[day.dateString] == undefined
    )
      return;
    try {
      setLoading(true);
      setSelectedDay(day.dateString);

      const result = await axios.get(
        `${apiUrl}/events/?date=${day.dateString}`
      );

      setCalendarEvents(result?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.FlatList
      entering={FadeIn.duration(200)}
      exiting={SlideOutDown}
      style={{ flex: 1, backgroundColor: colors.background }}
      data={calendarEvents}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item._id}
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
            // style={{ backgroundColor: colors.background2 }}
            theme={{
              textSectionTitleColor: colors.t2,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: "#ffffff",
              textMonthFontWeight: "500",
              textDayFontWeight: "500",
              todayTextColor: colors.t1,
              todayBackgroundColor: colors.background,
              arrowColor: colors.t3,
              textDayHeaderFontWeight: "500",
              monthTextColor: colors.t2,
              dayTextColor: colors.t4,

              // backgroundColor: colors.background,
              calendarBackground: colors.background2,
              // contentStyle: { backgroundColor: colors.background },
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
          // <TouchableOpacity
          //   onPress={() => navigation.navigate("event", item)}
          //   activeOpacity={0.8}
          //   style={{
          //     // shadowOffset: { width: 0.5, height: 0.5 },
          //     // shadowOpacity: 0.3,
          //     // shadowRadius: 1,
          //     // elevation: 2,
          //     shadowOffset: { width: 0.5, height: 0.5 },
          //     shadowOpacity: 0.1,
          //     shadowRadius: 1,
          //     elevation: 2,

          //     padding: 7,
          //   }}
          //   // onPress={() => navigation.navigate("event", item)}
          // >
          <SmallCard {...item} selectedDay={selectedDay} />
        ) : // </TouchableOpacity>
        null;
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
