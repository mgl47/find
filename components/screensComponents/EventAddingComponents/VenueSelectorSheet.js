import {
  Button,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetFlatList,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
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

import { ActivityIndicator, Checkbox, Chip } from "react-native-paper";
import * as Location from "expo-location";

import { markers } from "../../Data/markers";

import uuid from "react-native-uuid";
import colors from "../../colors";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInput } from "react-native-paper";
import { useData } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";
import { islands } from "../../../components/Data/islands";

import axios from "axios";
import { count } from "firebase/firestore";
const { height, width } = Dimensions.get("window");

export default VenueSelectorSheet = ({
  venueModal,
  setVenueModal,
  venue,
  setVenue,
}) => {
  const mapViewRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const { apiUrl } = useData();
  const { user, headerToken } = useAuth();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [venues, setVenues] = useState([]);
  const [currentIsland, setCurrentIsland] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [region, setRegion] = useState({
    latitude: 14.905696,
    longitude: -23.519001,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "50%", "80%"], []);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, [region]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const getResults = async (item) => {
    // console.log(item);
    if (item?.uuid != selectedVenue?.uuid) {
      setSelectedVenue(item);
    }
    // setVenueDetails(null)
    setLoading(true);

    await new Promise((resolve, reject) => {
      setTimeout(resolve, 700);
    });
    setSearchResult(markers?.reverse());
    // setSelectedVenue(item);

    setLoading(false);
  };

  const prevRegionRef = useRef(); // Create a ref to store the previous region
  const regionChangeThreshold = 0.3; // Adjust this value as needed

  const calculateDistance = (point1, point2) => {
    return Math.sqrt(
      Math.pow(point2.latitude - point1.latitude, 2) +
        Math.pow(point2.longitude - point1.longitude, 2)
    );
  };

  const getVenues = async () => {
    try {
      const result = await axios.get(
        `${apiUrl}/venues/near/?long=${region?.longitude}&&lat=${region.latitude}`
      );
      console.log("rrefef");
      setVenues(result?.data);
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
  };

  // const currentLocation = async () => {

  //   if (prevRegionRef.current) {
  //     const cityName = await Location.reverseGeocodeAsync(region);

  //     const distance = calculateDistance(region, prevRegionRef.current);
  //     const country=cityName?.[0]?.country

  //     if (distance > regionChangeThreshold && country != null) {
  //       getVenues();
  //       console.log("refetch");

  //       prevRegionRef.current = region;
  //     }
  //   }

  // };

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
  }, []);

  return (
    <Modal animationType="slide" visible={venueModal} style={{}}>
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          //   backgroundColor:colors.white,
          marginHorizontal: 20,
          marginTop: 40,
          marginBottom: 10,
          backgroundColor: colors.background,
          position: "absolute",
          zIndex: 3,
        }}
      >
        <Text
          style={{
            color: colors.darkSeparator,
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          Selecionar Local
        </Text>
      
      </View> */}

      <TouchableOpacity
        style={{
          // left: 8,
          alignSelf: "flex-end",
          position: "absolute",
          backgroundColor: colors.white,
          padding: 3,
          borderRadius: 5,
          top: 50,
          right: 20,
          zIndex: 2,
          // padding: 10,
        }}
        onPress={() => setVenueModal(false)}
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
      <TouchableOpacity
        style={{
          // left: 8,
          alignSelf: "flex-end",
          position: "absolute",
          backgroundColor: colors.white,
          padding: 3,
          borderRadius: 5,
          top: 100,
          right: 20,
          zIndex: 2,
          // padding: 10,
        }}
        onPress={async () => {
          let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            enableHighAccuracy: true,
            timeInterval: 5,
          });
          console.log(location);
          const newRegion = {
            latitude: location?.coords?.latitude-0.004,
            longitude: location?.coords?.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.011,
          };
          // setRegion({
          //   latitude: location?.coords?.latitude-0.03,
          //   longitude: location?.coords?.longitude,
          //   latitudeDelta: 0.0922,
          //   longitudeDelta: 0.0421,
          // });
          if (Platform.OS === "ios") {
            mapViewRef.current.animateToRegion(newRegion, 200);
          } else {
            setRegion(newRegion);
          }
        }}
      >
        <MaterialIcons name="my-location" size={24} color="black" />
      </TouchableOpacity>
      <View
        style={{
          shadowOffset: { width: 0.5, height: 0.5 },
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 2,
          // padding: 10,

          // position: "absolute",
          width: "100%",
          // borderRadius: 5,
          height: height * 0.35,
          // top: 70,
          // marginBottom: 10,
        }}
      >
        <MapView
          onPress={() => Keyboard.dismiss()}
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
          onRegionChangeComplete={setRegion}
          maxDelta={0.2}
        >
          {venues?.map((item) => {
            return (
              <Marker
                key={item.uuid}
                onPress={async () => {
                  const newRegion = {
                    latitude: item?.address?.lat,
                    longitude: item?.address?.long,
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
                    zIndex: item?.address?.lat == region?.latitude ? 2 : 1,
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
                      height: item?.uuid == selectedVenue?.uuid ? 60 : 50,
                      width: item?.uuid == selectedVenue?.uuid ? 60 : 50,
                      // borderRadius: 10,
                      borderRadius: 50,

                      borderWidth: 0.2,
                      borderColor: colors.darkGrey,
                      backgroundColor: colors.grey,
                    }}
                    source={{ uri: item?.photos?.[2]?.[0]?.uri }}
                    // source={{ uri: item?.uri }}
                  />
                </View>
              </Marker>
            );
          })}
        </MapView>
      </View>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={keyboardVisible ? 2 : 1}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
        >
          <BottomSheetFlatList
            style={{ backgroundColor: colors.background }}
            contentContainerStyle={{
              backgroundColor: colors.background,
              flex: 1,
            }}
            // data={searchResult ? searchResult : markers}
            data={venues?.filter((sel) => sel?.uuid != selectedVenue?.uuid)}
            // data={venueDetails ? recommendedEvents.slice(1, 3).reverse() : markers}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.uuid}
            ListHeaderComponent={
              <>
                <View style={{ padding: 10 }}>
                  <TextInput
                    //   error={!amount}
                    style={{
                      // marginBottom: 5,
                      backgroundColor: colors.background,
                    }}
                    // autoFocus
                    underlineStyle={{ backgroundColor: colors.primary }}
                    contentStyle={{}}
                    outlineColor={colors.primary}
                    mode="outlined"
                    activeOutlineColor={colors.primary}
                    label="Pesquise por um local"
                    activeUnderlineColor={colors.primary}
                    value={search}
                    cursorColor={colors.primary}
                    onChangeText={setSearch}
                  />
                  {selectedVenue && (
                    <View
                      style={{
                        // padding: 10,

                        shadowOffset: { width: 0.5, height: 0.5 },
                        shadowOpacity: 0.1,
                        shadowRadius: 1,
                        elevation: 2,
                        // marginVertical: 7,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: colors.white,
                          borderBottomRightRadius: 10,
                          borderBottomLeftRadius: 10,
                          // borderRadius: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            {
                              setVenue(selectedVenue), setVenueModal(false);
                            }
                          }}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: 10,
                            alignItems: "center",
                            padding: 2,
                            //   marginBottom: item?.description ? 5 : 0,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              padding: 5,
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
                                // uri: item?.uri,

                                uri: selectedVenue?.photos?.[2]?.[0]?.uri,
                              }}
                            />
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: "500",
                              }}
                            >
                              {selectedVenue?.displayName}
                            </Text>
                          </View>

                          {/* <Entypo
                      name="chevron-right"
                      size={24}
                      color={colors.primary}
                    /> */}
                          <Text
                            style={{
                              color: colors.primary,
                              fontSize: 14,
                              right: 10,
                              padding: 3,
                              fontWeight: "600",
                              paddingHorizontal:
                                (venue?.uuid == selectedVenue?.uuid) == 1
                                  ? 5
                                  : 0,
                              borderRadius:
                                (venue?.uuid == selectedVenue?.uuid) == 1
                                  ? 5
                                  : 0,
                              borderWidth:
                                (venue?.uuid == selectedVenue?.uuid) == 1
                                  ? 1
                                  : 0,
                              borderColor: colors.primary,
                            }}
                          >
                            {venue?.uuid == selectedVenue?.uuid
                              ? "Selecionado"
                              : "Selecionar"}
                          </Text>
                        </TouchableOpacity>
                        {selectedVenue?.description && (
                          <View style={styles.separator} />
                        )}
                        {selectedVenue?.description && (
                          <View style={{ padding: 10 }}>
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: "500",
                                color: colors.darkGrey,
                              }}
                            >
                              {selectedVenue?.description}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              </>
            }
            renderItem={({ item }) => {
              return !loading ? (
                <View
                  style={{
                    padding: 10,
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    shadowOffset: { width: 0.5, height: 0.5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 1,
                    elevation: 2,
                    // marginVertical: 7,
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
                        {
                          setVenue(item), setVenueModal(false);
                        }
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 10,
                        alignItems: "center",
                        padding: 2,
                        //   marginBottom: item?.description ? 5 : 0,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 5,
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
                            // uri: item?.uri,

                            uri: item?.photos?.[2]?.[0]?.uri,
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

                      <Text
                        style={{
                          color: colors.primary,
                          fontSize: 14,
                          right: 10,
                          padding: 3,
                          fontWeight: "600",
                          paddingHorizontal:
                            (venue?.uuid == item?.uuid) == 1 ? 5 : 0,
                          borderRadius:
                            (venue?.uuid == item?.uuid) == 1 ? 5 : 0,
                          borderWidth: (venue?.uuid == item?.uuid) == 1 ? 1 : 0,
                          borderColor: colors.primary,
                        }}
                      >
                        {venue?.uuid == item?.uuid
                          ? "Selecionado"
                          : "Selecionar"}
                      </Text>
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
              ) : // <View style={{ flex: 1, backgroundColor: colors.background }} />
              null;
            }}
            ListFooterComponent={<View style={{ marginBottom: 10 }} />}
          />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    // padding: 24,
    // justifyContent: "center",
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,

    // alignItems: "center",
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
  },
  map: {
    width: "100%",
    // borderRadius: 5,
    height: height,
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
