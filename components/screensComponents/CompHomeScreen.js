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
import { recommendedEvents, trendingEvents } from "../Data/events";
import SmallCard from "../cards/SmallCard";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Screen from "../Screen2";
import colors from "../colors";
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
import { markers } from "../Data/markers";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
} from "react-native-reanimated";
import { Chip } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import ModalScreen from "../ModalScreen";

const { height, width } = Dimensions.get("window");
export function CalendarModal({
  calendarModalVisible,
  setCalendarModalVisible,
}) {
  const navigation = useNavigation();

  //   const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  return (
    <Modal animationType="slide" visible={calendarModalVisible}>
      <ModalScreen style={{ backgroundColor: colors.background }}>
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
      </ModalScreen>
    </Modal>
  );
}
export function VenuesModal({ venueModalVisible, setVenueModalVisible }) {
  const navigation = useNavigation();

  const mapViewRef = useRef(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [venueDetails, setVenueDetails] = useState("");
  const [favVenues, setFavVenues] = useState(markers);

  const [region, setRegion] = useState({
    latitude: 14.905696,
    longitude: -23.519001,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const getResults = async (item) => {
    setLoading(true);
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 500);
    });
    setVenueDetails(item);
    // console.log(item);

    setLoading(false);
  };
  return (
    <Modal animationType="slide" visible={venueModalVisible}>
      <ModalScreen style={{ backgroundColor: colors.white }}>
        <View
          style={{
            flexDirection: "row",
            // backgroundColor: "white",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            // marginBottom: 10,
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
            Lugares
          </Text>

          <TouchableOpacity
            onPress={() => {
              setVenueModalVisible(false), setTabIndex(0);
            }}
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
        <Tab
          // titleStyle={{ color: colors.primary }}
          // style={{backgroundColor:colors.background}}
          indicatorStyle={{
            backgroundColor: colors.primary,
            height: 2,
            width: "50%",
          }}
          style={{
            // shadowOffset: { width: 0.5, height: 0.5 },
            // shadowOpacity: 0.3,
            // shadowRadius: 1,
            // elevation: 2,
            backgroundColor: "white",
          }}
          value={tabIndex}
          onChange={setTabIndex}
          // dense
          titleStyle={(active) => ({
            color: active ? colors.primary : colors.darkGrey,
            fontSize: active ? 16 : 14,
            fontWeight: "500",
          })}
        >
          <Tab.Item>{"Explorar"}</Tab.Item>
          <Tab.Item>{"Favoritos"}</Tab.Item>
        </Tab>

        <FlatList
          style={{ backgroundColor: colors.background }}
          data={
            tabIndex == 1
              ? favVenues
              : venueDetails
              ? recommendedEvents.slice(1, 3).reverse()
              : markers
          }
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              <View
                style={{
                  shadowOffset: { width: 0.5, height: 0.5 },
                  shadowOpacity: 0.3,
                  shadowRadius: 1,
                  elevation: 2,
                  padding: 10,

                  // position: "absolute",
                  width: tabIndex == 1 ? 0 : "100%",
                  // borderRadius: 5,
                  height: tabIndex == 1 ? 0 : height * 0.35,
                  // top: 70,
                  marginBottom: tabIndex == 0 ? 10 : -20,
                }}
              >
                <MapView
                  onPress={() => setVenueDetails(false)}
                  ref={mapViewRef}
                  region={region}
                  initialRegion={{
                    latitude: 14.921763,
                    longitude: -23.51377,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.011,
                  }}
                  //   provider="google"
                  mapType="standard"
                  style={[styles.map, {}]}
                  showsUserLocation={true}
                >
                  {markers?.map((item) => {
                    return (
                      <Marker
                        key={item.id}
                        // onPress={handleMarkerPress}
                        onPress={async () => {
                          const newRegion = {
                            latitude: item?.lat,
                            longitude: item?.long,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.011,
                          };
                          if (Platform.OS === "ios") {
                            mapViewRef.current.animateToRegion(newRegion, 200);
                          } else {
                            setRegion(newRegion);
                          }
                          getResults(item);
                        }}
                        coordinate={{
                          latitude: item?.lat,
                          longitude: item?.long,
                        }}
                      >
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: item?.lat == region?.latitude ? 2 : 1,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: colors.white,
                              borderWidth: 0.2,
                              borderColor: colors.darkGrey,
                              padding: 5,
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 10,
                            }}
                          >
                            <Text style={{ fontSize: 11, fontWeight: "500" }}>
                              {item?.displayName}
                            </Text>
                          </View>
                          <Image
                            resizeMode="contain"
                            style={{
                              height: item?.lat == region?.latitude ? 80 : 50,
                              width: item?.lat == region?.latitude ? 80 : 50,
                              borderRadius: 10,
                              borderWidth: 0.2,
                              borderColor: colors.darkGrey,
                            }}
                            source={{ uri: item?.uri }}
                          />
                        </View>
                      </Marker>
                    );
                  })}
                </MapView>
              </View>

              {venueDetails && tabIndex == 0 && (
                <View
                  style={{
                    backgroundColor: colors.white,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    shadowOffset: { width: 0.5, height: 0.5 },
                    shadowOpacity: 0.3,
                    shadowRadius: 1,
                    elevation: 2,
                    width: "95%",
                    alignSelf: "center",
                    // bottom: 6,
                    zIndex: 0,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setVenueModalVisible(false), navigation.navigate("venue");
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",

                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 10,
                      }}
                    >
                      <Image
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 50,
                          marginRight: 10,
                          borderWidth: 0.1,
                        }}
                        source={{
                          uri: venueDetails?.uri,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                          // color: colors.white,
                        }}
                      >
                        {venueDetails?.displayName}
                      </Text>
                    </View>
                    <Entypo
                      name="chevron-right"
                      size={24}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                  {venueDetails?.description && (
                    <View style={styles.separator} />
                  )}
                  {venueDetails?.description && (
                    <View style={{ padding: 5 }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "500",
                          color: colors.darkGrey,
                          zIndex: 2,
                        }}
                      >
                        {venueDetails?.description}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </>
          }
          renderItem={({ item }) => {
            return !venueDetails || tabIndex == 1 ? (
              <View
                style={{
                  padding: 10,
                  borderBottomRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  shadowOffset: { width: 0.5, height: 0.5 },
                  shadowOpacity: 0.3,
                  shadowRadius: 1,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.white,
                    borderRadius: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setVenueModalVisible(false), navigation.navigate("venue");
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 10,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 50,
                          marginRight: 10,
                          borderWidth: 0.1,
                        }}
                        source={{
                          uri: item?.uri,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                        }}
                      >
                        {item?.displayName}
                      </Text>
                    </View>

                    <Entypo
                      name="chevron-right"
                      size={24}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                  {item?.description && <View style={styles.separator} />}
                  {item?.description && (
                    <View style={{ padding: 10 }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "500",
                          color: colors.darkGrey,
                        }}
                      >
                        {item?.description}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  shadowOffset: { width: 0.5, height: 0.5 },
                  shadowOpacity: 0.3,
                  shadowRadius: 1,
                  elevation: 2,
                  padding: 10,
                  //   marginTop:120

                  // marginBottom: 200
                }}
                // onPress={() => navigation.navigate("event", item)}
              >
                <SmallCard {...item} />
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={<View style={{ marginBottom: 10 }} />}
        />
      </ModalScreen>
    </Modal>
  );
}

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
