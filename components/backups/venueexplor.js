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
  import { recommendedEvents } from "../../../components/Data/stockEvents";
  import { markers } from "../../../components/Data/markers";
  import SmallCard from "../../../components/cards/SmallCard";
  import colors from "../../../components/colors";
  import { Button } from "react-native";
  import { TouchableWithoutFeedback } from "react-native";
  import { useData } from "../../../components/hooks/useData";
  import { useAuth } from "../../../components/hooks/useAuth";
  import axios from "axios";
  const { height, width } = Dimensions.get("window");
  
  const VenuesExplorer = () => {
    const navigation = useNavigation();
    const { events, apiUrl } = useData();
  
    const { followVenue2, user } = useAuth();
  
    const mapViewRef = useRef(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [venueDetails, setVenueDetails] = useState("");
    const [favVenues, setFavVenues] = useState(markers);
  
    const [venues, setVenues] = useState([]);
    const [currentIsland, setCurrentIsland] = useState("");
    const [region, setRegion] = useState({
      latitude: 14.905696 - 0.004,
      longitude: -23.519001,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  
    function isPointInsidePolygon(point, polygon) {
      let inside = false;
      const [x, y] = point;
  
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0],
          yi = polygon[i][1];
        const xj = polygon[j][0],
          yj = polygon[j][1];
  
        const intersect =
          yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
  
        if (intersect) inside = !inside;
      }
  
      return inside;
    }
    const point = [region?.latitude, region.longitude];
  
    let activeIsland = null;
  
    islands.forEach((item) => {
      if (isPointInsidePolygon(point, item.coord)) {
        activeIsland = { label: item.label, code: item.code };
      }
    });
  
    const getVenues = async (code) => {
      try {
        const result = await axios.get(`${apiUrl}/venues/?island=${code}`);
        console.log("rrefef");
        setVenues(result?.data);
      } catch (error) {
        console.log(error?.response?.data?.msg);
      }
    };
    useEffect(() => {
      if (activeIsland?.code && activeIsland?.code != currentIsland) {
        getVenues(activeIsland?.code);
        console.log("currentIsland");
  
        setCurrentIsland(activeIsland?.code);
      }
    }, [region]);
  
    const getResults = async (item) => {
      // setVenueDetails(null)
      setLoading(true);
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 700);
      });
      setVenueDetails(item);
      console.log(item);
  
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
              onPress={() => {
                navigation.navigate("venue", {item});
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
                    uri: item?.photos[3]?.[0]?.uri,
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
                <TouchableOpacity
                  onPress={() => followVenue2(item)}
                  style={{
                    padding: 2,
                    paddingHorizontal: tabIndex == 1 ? 5 : 0,
                    left: 10,
                    borderRadius: tabIndex == 1 ? 5 : 0,
                    borderWidth: tabIndex == 1 ? 1 : 0,
                    borderColor: colors.primary,
                    // alignSelf: "flex-end",
                    // position: "absolute",
                    // marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: 14,
                      fontWeight: "600",
                    }}
                  >
                    {user?.followedVenues?.includes(item?._id)
                      ? "Seguindo"
                      : "Seguir"}
                  </Text>
                </TouchableOpacity>
              </View>
  
              <Entypo name="chevron-right" size={24} color={colors.primary} />
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
      );
    }
  
    const memoizedFlatlist = useMemo(() => {
      return (
        <BottomSheetFlatList
          ListHeaderComponent={
            <>
              {venueDetails && !loading && (
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
                    onPress={() => {
                      navigation.navigate("venue",{item});
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
                          uri: venueDetails?.photos[3]?.[0]?.uri,
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
                      <TouchableOpacity
                        onPress={() => followVenue2(venueDetails)}
                        style={{
                          // padding: 10,
                          left: 10,
                          // alignSelf: "flex-end",
                          // position: "absolute",
                          // marginBottom: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: colors.primary,
                            fontSize: 14,
                            fontWeight: "600",
                          }}
                        >
                          {user?.followedVenues?.includes(venueDetails?._id)
                            ? "Seguindo"
                            : "Seguir"}
                        </Text>
                      </TouchableOpacity>
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
              {venueDetails && !loading && (
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
                      marginTop: 5,
  
                      // marginBottom: 5,
                    }}
                  >
                    {recommendedEvents?.length > 1
                      ? recommendedEvents?.length + " Eventos"
                      : recommendedEvents?.length > 0
                      ? recommendedEvents?.length + " Evento"
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
          data={tabIndex == 1 ? favVenues : venueDetails ? events : venues}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            console.log("rrefef");
  
            return !loading && !venueDetails ? (
              <VenuesList {...item} />
            ) : (
              !loading && (
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
                  // onPress={() => navigation.navigate("event", {item})}
                >
                  <SmallCard {...item} />
                </TouchableOpacity>
              )
            );
          }}
          ListFooterComponent={<View style={{ marginBottom: 10 }} />}
        />
      );
    }, [venues]);
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
            <MapView
              onPress={() => setVenueDetails(false)}
              ref={mapViewRef}
              region={region}
              //   provider="google"
              mapType="standard"
              style={[styles.map, {}]}
              showsUserLocation={true}
              onRegionChangeComplete={setRegion}
            >
              {venues?.map((item) => {
                return (
                  <Marker
                    key={item._id}
                    // onPress={handleMarkerPress}
                    onPress={async () => {
                      const newRegion = {
                        latitude: item?.address?.lat - 0.008,
  
                        longitude: item?.address?.long + 0.00001,
                        // latitudeDelta: 0.01,
                        // longitudeDelta: 0.011,
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
                      latitude: item?.address?.lat,
                      longitude: item?.address?.long,
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
                          padding: 3,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 5,
                          bottom: 2,
                          // backgroundColor: colors.white,
                          // borderWidth: 0.2,
                          // borderColor: colors.darkGrey,
                          // padding: 5,
                          // alignItems: "center",
                          // justifyContent: "center",
                          // borderRadius: 10,
                        }}
                      >
                        <Text style={{ fontSize: 11, fontWeight: "500" }}>
                          {item?.displayName}
                        </Text>
                      </View>
                      <Image
                        // resizeMode="contain"
                        style={{
                          height: item?.lat == region?.latitude ? 80 : 50,
                          width: item?.lat == region?.latitude ? 80 : 50,
                          // borderRadius: 10,
                          borderRadius: 50,
  
                          borderWidth: 0.2,
                          borderColor: colors.darkGrey,
                          backgroundColor: colors.grey,
                        }}
                        source={{ uri: item?.photos?.[3]?.[0]?.uri }}
                      />
                    </View>
                  </Marker>
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
                {memoizedFlatlist}
              </BottomSheetModal>
            </View>
          </BottomSheetModalProvider>
          <></>
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
  