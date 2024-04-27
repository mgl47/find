import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Calendar, LocaleConfig } from "react-native-calendars";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
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
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
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
import { islands } from "../../../components/Data/islands";
// import { recommendedEvents } from "../../../components/Data/stockrecommendedEvents";
import { markers } from "../../../components/Data/markers";
import SmallCard from "../../../components/cards/SmallCard";
import colors from "../../../components/colors";
import { Button } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { useData } from "../../../components/hooks/useData";
import { useAuth } from "../../../components/hooks/useAuth";
import axios from "axios";
import * as Location from "expo-location";

const { height, width } = Dimensions.get("window");

const VenuesExplorer = () => {
  const navigation = useNavigation();
  const { apiUrl } = useData();

  const { followVenue2, user, userLocation, getLocation } = useAuth();

  const mapViewRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [venueDetails, setVenueDetails] = useState("");

  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [region, setRegion] = useState({
    latitude: 14.905696 - 0.004,
    longitude: -23.519001,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    // latitudeDelta: 0.003,
    // longitudeDelta: 0.003,
  });
  const prevRegionRef = useRef();
  const regionChangeThreshold = 0.3;

  const calculateDistance = (point1, point2) => {
    return Math.sqrt(
      Math.pow(point2.latitude - point1.latitude, 2) +
        Math.pow(point2.longitude - point1.longitude, 2)
    );
  };

  const getVenues = async () => {
    try {
      const result = await axios.get(
        `${apiUrl}/venues/near/?long=${region?.longitude}&&lat=${region.latitude}&&all=${showAll}`
      );
      console.log("rrefef");
      if (result?.data != venues) setVenues(result?.data);
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
  };

  const currentLocation = async () => {
    if (prevRegionRef.current) {
      const distance = calculateDistance(region, prevRegionRef.current);

      if (distance > regionChangeThreshold) {
        const cityName = await Location.reverseGeocodeAsync(region);
        const country = cityName?.[0]?.country;
        if (country != null) {
          getVenues();
          console.log("refetch");

          prevRegionRef.current = region;
        }
      }
    }
  };
  useEffect(() => {
    // Check if the previous region is set
    currentLocation();

    // Update the previous region ref with the current region
  }, [region]);
  useEffect(() => {
    getVenues();
    prevRegionRef.current = region;
  }, [showAll]);
  const getResults = async (item) => {
    if (item?.uuid == venueDetails?.uuid) return;
    setLoading(true);

    try {
      const result = await axios.get(`${apiUrl}/events/?venue=${item?.uuid}`);
      // console.log(result?.data);
      setEvents(result?.data);
      console.log(item);
    } catch (error) {
      console.log(error);
    }
    setVenueDetails(null);
    // await new Promise((resolve, reject) => {
    //   setTimeout(resolve, 700);
    // });
    setVenueDetails(item);

    setLoading(false);
  };

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["20%", "40%", "60%", "85%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const [onMarkerSize, onSetMarkerSize] = useState(20);
  let markerSize = 30;

  const setMarkerSize = (a) => {
    const scaleFactor = 0.3;
    markerSize = ((3 / a.latitudeDelta) * scaleFactor).toFixed();

    onSetMarkerSize(Math.min(60, Math.max(25, markerSize)));
  };

  const handleSheetChanges = useCallback((index) => {
    // consol
  });
  function VenuesList(item) {
    return (
      <View
        style={{
          paddingHorizontal: Platform?.OS === "ios" ? 10 : 0,
          marginTop: 10,
          borderRadius: 10,
          paddingVertical: Platform?.OS === "ios" ? 1 : 0,
          // shadowOffset: { width: 0.5, height: 0.5 },
          // shadowOpacity: 0.3,
          // shadowRadius: 1,
          // elevation: 2,
          shadowOffset: { width: 0.5, height: 0.5 },
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 0.5,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 10,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate("venue", item);
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
                  uri: item?.photos[3]?.[item?.photos[3]?.length - 1]?.uri,
                }}
              />
              <View>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                  }}
                >
                  {item?.displayName}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "500",
                    color: colors.darkGrey,
                    left: 1,
                  }}
                >
                  {item?.address?.zone + ", " + item?.address?.city}
                </Text>
              </View>
            </View>

            <Entypo name="chevron-right" size={24} color={colors.primary} />
          </TouchableOpacity>

          {item?.description && <View style={styles.separator} />}
          {item?.description && (
            <View style={{ padding: 10 }}>
              <Text
                numberOfLines={2}
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
    );
  }

  const memoizedFlatlist = useMemo(() => {
    return (
      <BottomSheetFlatList
        ListHeaderComponent={
          <>
            {venueDetails && (
              <View
                style={{
                  backgroundColor: colors.white,
                  // borderBottomLeftRadius: 10,
                  // borderBottomRightRadius: 10,
                  marginTop: 3,
                  // shadowOffset: { width: 0.5, height: 0.5 },
                  // shadowOpacity: 0.3,
                  // shadowRadius: 1,
                  // elevation: 2,

                  shadowOffset: { width: 0.5, height: 0.5 },
                  shadowOpacity: 0.1,
                  shadowRadius: 1,
                  elevation: 1,

                  alignSelf: "center",
                  zIndex: 1,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    navigation.navigate("venue", venueDetails);
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
                        uri: venueDetails?.photos[3]?.[
                          venueDetails?.photos[3]?.length - 1
                        ]?.uri,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                          // color: colors.white,
                        }}
                      >
                        {venueDetails?.displayName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "500",
                          color: colors.darkGrey,
                          left: 1,
                        }}
                      >
                        {venueDetails?.address?.zone +
                          ", " +
                          venueDetails?.address?.city}
                      </Text>
                    </View>
                  </View>

                  <Entypo
                    style={{ right: 10 }}
                    name="chevron-right"
                    size={24}
                    color={colors.primary}
                  />
                </TouchableOpacity>

                {venueDetails?.description && (
                  <>
                    <View
                      style={{
                        height: 1,
                        width: width * 0.9,
                        backgroundColor: colors.light2,
                        marginBottom: 2,
                        alignSelf: "center",
                        zIndex: 2,
                      }}
                    />
                    <View style={{ paddingHorizontal: 10 }}>
                      <Text
                        numberOfLines={5}
                        style={{
                          fontSize: 13,
                          fontWeight: "500",
                          color: colors.darkGrey,
                          zIndex: 2,
                          padding: 5,
                        }}
                      >
                        {venueDetails?.description}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            )}

            {venueDetails && (
              <>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    // width: "80%",
                    color: colors.primary,
                    marginLeft: Platform?.OS === "ios" ? 20 : 10,
                    marginTop: Platform?.OS === "ios" ? 10 : 0,
                    // marginBottom: 5,
                  }}
                >
                  Próximos Eventos
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    // width: "80%",
                    color: colors.black2,
                    marginLeft: Platform?.OS === "ios" ? 20 : 10,
                    // marginTop: 5,

                    // marginBottom: 5,
                  }}
                >
                  {events?.length > 1
                    ? events?.length + " Eventos"
                    : events?.length > 0
                    ? events?.length + " Evento"
                    : ""}
                </Text>
              </>
            )}
          </>
        }
        style={{
          backgroundColor: colors.background,
          padding: Platform?.OS === "ios" ? 0 : 10,
          overflow: "hidden",
        }}
        // data={tabIndex == 1 ? favVenues : venueDetails ? events : venues}

        data={venueDetails ? events : venues}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          // console.log("rrefef");

          return !venueDetails ? (
            <VenuesList {...item} />
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                shadowOffset: { width: 0.5, height: 0.5 },
                shadowOpacity: 0.1,
                shadowRadius: 1,
                elevation: 1,
                // padding: 10,
                marginTop: 10,
                paddingHorizontal: Platform?.OS === "ios" ? 10 : 0,
              }}
              onPress={() => navigation.navigate("event", item)}
            >
              <SmallCard {...item} />
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={<View style={{ marginBottom: 10 }} />}
      />
    );
  }, [venues, venueDetails, user]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Animated.View
        style={{ flex: 1 }}
        entering={SlideInDown}
        exiting={SlideOutDown}
      >
        <View
          style={{
            // shadowOffset: { width: 0.5, height: 0.5 },
            // shadowOpacity: 0.3,
            // shadowRadius: 1,
            // elevation: 2,

            width: "100%",
            height: "80%",
          }}
        >
          <TouchableOpacity
            style={{
              // left: 8,
              alignSelf: "flex-end",
              position: "absolute",
              backgroundColor: colors.white,
              padding: 7,
              borderRadius: 5,
              top: 60,
              right: 5,
              zIndex: 2,
              shadowOffset: { width: 0.5, height: 0.5 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              elevation: 2,
            }}
            onPress={async () => {
              const newRegion = {
                ...userLocation,
                latitude: userLocation.latitude - 0.002,
                latitudeDelta: 0.01,
                longitudeDelta: 0.011,
              };

              if (Platform.OS === "ios") {
                mapViewRef.current.animateToRegion(newRegion, 200);
                // setRegion(newRegion);
              } else {
                setRegion(newRegion);
              }
            }}
          >
            <MaterialIcons
              name="my-location"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              // left: 8,
              alignSelf: "flex-end",
              position: "absolute",
              backgroundColor: colors.white,
              padding: 7,
              borderRadius: 5,
              top: 110,
              right: 5,
              zIndex: 2,
              shadowOffset: { width: 0.5, height: 0.5 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              elevation: 2,
              // padding: 10,
            }}
            onPress={() => setShowAll(!showAll)}
          >
            <MaterialIcons name="event" size={24} color={colors.primary} />
          </TouchableOpacity>
          <MapView
            onPress={() => setVenueDetails(null)}
            ref={mapViewRef}
            region={region}
            mapType="standard"
            style={[styles.map, {}]}
            showsUserLocation={true}
            onRegionChangeComplete={setRegion}
            onRegionChange={(a) => {
              setMarkerSize(a);
            }}
            maxDelta={0.5}
            // customMapStyle={mapCustomStyle}
            // provider={PROVIDER_GOOGLE}
          >
            {venues?.map((item) => {
              console.log(item?.mapSnap);
              return (
                item?.location?.coordinates && (
                  <Animated.View
                    key={item._id}
                    entering={FadeIn}
                    exiting={FadeOut}
                  >
                    <Marker
                      style={{
                        shadowOffset: { width: 0.5, height: 0.5 },
                        shadowOpacity: 0.5,
                        shadowRadius: 3,
                        elevation: 0.5,
                      }}
                      onPress={async () => {
                        getResults(item);

                        const newRegion = {
                          latitude: item?.location?.coordinates?.[1] - 0.0075,

                          // latitude: item?.location?.coordinates?.[1] - 0.006,

                          longitude: item?.location?.coordinates?.[0] + 0.00001,

                          latitudeDelta: 0.01,
                          longitudeDelta: 0.011,
                        };
                        if (Platform.OS === "ios") {
                          mapViewRef.current.animateToRegion(newRegion, 200);
                        } else {
                          setRegion(newRegion);
                        }
                      }}
                      coordinate={{
                        latitude: item?.location?.coordinates?.[1],
                        longitude: item?.location?.coordinates?.[0],
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          zIndex: item?.lat == region?.latitude ? 2 : 1,
                        }}
                      >
                        {onMarkerSize / 4 - 4 > 5.73 && (
                          <Animated.View
                            // entering={FadeIn}
                            // exiting={FadeOut}
                            style={{
                              position: "absolute",
                              top: -25,
                              backgroundColor: colors.white,
                              borderWidth: 0.2,
                              borderColor: colors.darkGrey,
                              height: 20,
                              alignItems: "center",
                              justifyContent: "center",

                              borderRadius: 5,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 11,
                                // fontSize: onMarkerSize / 4 - 3,

                                fontWeight: "500",
                                padding: 3,

                                // marginHorizontal: 10,

                                width: "100%",

                                color: colors.primary2,
                              }}
                            >
                              {item?.displayName}
                            </Text>
                          </Animated.View>
                        )}

                        <Image
                          // resizeMode="contain"
                          style={{
                            height:
                              item?.uuid == venueDetails?.uuid
                                ? onMarkerSize + 10
                                : onMarkerSize,
                            width:
                              item?.uuid == venueDetails?.uuid
                                ? onMarkerSize + 10
                                : onMarkerSize,
                            // borderRadius: 10,
                            borderRadius: 100,

                            borderWidth: 0.2,
                            borderColor: colors.darkGrey,
                            backgroundColor: colors.grey,
                          }}
                          source={{
                            uri: item?.photos?.[2]?.[
                              item?.photos?.[3]?.length - 1
                            ]?.uri,
                          }}
                        />
                      </View>
                    </Marker>
                  </Animated.View>
                )
              );
            })}
          </MapView>
        </View>
        <BottomSheetModalProvider>
          <View style={styles.sheetContainer}>
            <BottomSheetModal
              // enableDismissOnClose={false}
              enablePanDownToClose={false}
              ref={bottomSheetModalRef}
              index={venueDetails ? 2 : 1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
            >
              {loading ? (
                <Animated.View
                  style={{
                    // position: "absolute",
                    alignSelf: "center",
                    // top: 10,
                    // zIndex: 2,
                    marginVertical: 20,
                    backgroundColor: colors.background,
                    flex: 1,
                    width,
                  }}
                  // entering={SlideInUp.duration(300)}
                  // exiting={SlideOutUp.duration(300)}
                >
                  <ActivityIndicator
                    style={{ top: 10 }}
                    animating={true}
                    color={colors.primary}
                  />
                </Animated.View>
              ) : (
                memoizedFlatlist
              )}
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default VenuesExplorer;

const styles = StyleSheet.create({
  sheetContainer: {
    // flex: 1,
    // padding: 24,
    // justifyContent: "center",
    backgroundColor: colors.background,
  },
  contentContainer: {
    // flex: 1,

    // alignItems: "center",
    backgroundColor: colors.background,
  },
  map: {
    width: "100%",
    // borderRadius: 5,
    height,
    backgroundColor: colors.grey,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // overflow:"hidden",

    // borderRadius: 10,
  },
  separator: {
    width: "95%",
    height: 1,
    backgroundColor: colors.light2,
    marginBottom: 2,
    alignSelf: "center",
  },
});
