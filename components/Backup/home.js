import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableOpacityBase,
  View,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
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
import {
  MaterialCommunityIcons,
  Entypo,
  FontAwesome5,
} from "@expo/vector-icons";
import AppTextInput from "../../components/AppTextInput";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useAuth } from "../../components/hooks/useAuth";

export default function HomeScreen({ navigation }) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");

  const [user, setUser] = useState(false);
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
  const { test, AuthBottomSheet } = useAuth();
  const [AuthModalUp, setAuthModalUp] = useState(false);

  const bottomSheetModalRef = useRef(null);

  const handleAuthSheet = useCallback(() => {
    setAuthModalUp(true);

    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <Screen>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => (!user ? navigation.openDrawer() : setShowModal(true))}
          // onPress={handleAuthSheet}
          style={{ position: "absolute", left: 20, bottom: 3 }}
        >
          {!user ? (
            <Image
              source={{
                uri: "https://i0.wp.com/techweez.com/wp-content/uploads/2022/03/vivo-lowlight-selfie-1-scaled.jpg?fit=2560%2C1920&ssl=1",
              }}
              style={{
                width: 38,
                height: 38,
                borderRadius: 50,
                // marginLeft: 20,
                // position: "absolute",
              }}

              // resizeMode="contain"
            />
          ) : (
            <FontAwesome5 name="user-circle" size={38} color={colors.black} />
          )}
        </TouchableOpacity>

        <Image
          source={require("../../assets/logos/logo1.png")}
          style={{ width: 100, flex: 1, marginBottom: 5 }}
          resizeMode="contain"
        />

        <View style={{ position: "absolute", right: 10, flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => setCalendarModalVisible(true)}
            style={{
              borderRadius: 50,
              padding: 5,
              marginRight: 5,
            }}
          >
            <Entypo name="location" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCalendarModalVisible(true)}
            style={{
              borderRadius: 50,
              padding: 5,
              marginRight: 5,
            }}
          >
            <MaterialCommunityIcons
              name="calendar-month"
              size={26}
              color={colors.black}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderRadius: 50,
              padding: 5,
              // backgroundColor: colors.grey,
            }}
            onPress={() => navigation.navigate("search")}
          >
            {/* <MaterialCommunityIcons
              name="magnify"
              size={26}
              color={colors.black}
            /> */}
            <Entypo name="magnifying-glass" size={25} color={colors.black} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: colors.white,
            shadowOffset: { width: 0.5, height: 0.5 },
            shadowOpacity: 0.3,
            shadowRadius: 1,
            elevation: 2,
            marginBottom: 5,
          }}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <>
              {/* <FlatList
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
                        marginVertical: 10,
                        marginHorizontal: 3,
                        marginBottom: 10,
                        borderRadius: 20,
                      }}
                      // background={{ color: colors.description }}
                      // icon="information"
                      // onPress={() => console.log("Pressed")}
                      onPress={handleAuthSheet}
                    >
                      {item.label}
                    </Chip>
                  );
                }}
              /> */}

              <Text style={styles.headerText}>Em alta</Text>

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
                        marginVertical: 5,
                      }}
                      onPress={() =>
                        item.valid ? navigation.navigate("event", item) : null
                      }
                    >
                      <MediumCard {...item} />
                    </TouchableOpacity>
                  );
                }}
              />
              <Text style={styles.headerText}>Bu próximo evento</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                // onPress={() => navigation.navigate("event")}
                style={{
                  shadowOffset: { width: 1, height: 1 },
                  shadowOpacity: 1,
                  shadowRadius: 1,
                  elevation: 3,
                  marginVertical: 10,
                }}
              >
                <BigCard
                  title="Workshop de fotografia"
                  date="Domingo, 29 Mai - 14h00"
                  venue={{
                    displayName: "Praça Alexandre Albuquerque",
                    city: "Praia",
                  }}
                  image={{
                    uri: "https://images.unsplash.com/photo-1553249067-9571db365b57?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
                  }}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>Pa bó</Text>
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
      <Modal animationType="slide" visible={calendarModalVisible}>
        <Screen style={{ backgroundColor: colors.background }}>
          <View
            style={{
              flexDirection: "row",
              // backgroundColor: "red",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                // position: "absolute",
                alignSelf: "center",
                fontSize: 22,
                // left:1,
                color: colors.black2,

                fontWeight: "500",
              }}
            >
              Calendário
            </Text>
            {/* <FontAwesome5 name="user-circle" size={40} color={colors.black2} /> */}

            <TouchableOpacity
              onPress={() => setCalendarModalVisible(false)}
              style={{
                padding: 10,
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
                  fontWeight: "600",
                }}
              >
                Voltar
              </Text>
            </TouchableOpacity>
          </View>
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
          <FlatList
            data={recommendedEvents.slice(1, 3).reverse()}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={<View style={{ marginTop: 10 }} />}
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
        </Screen>
      </Modal>
      <AuthBottomSheet
        bottomSheetModalRef={bottomSheetModalRef}
        setAuthModalUp={setAuthModalUp}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red",
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: colors.white,

    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 42,
  },
  headerText: {
    fontSize: 19,
    fontWeight: "500",
    // padding: 5,
    left: 20,
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
