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
import { ActivityIndicator, Chip } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { recommendedEvents } from "../../components/Data/events";
import colors from "../../components/colors";
import { markers } from "../../components/Data/markers";
import SmallCard from "../../components/cards/SmallCard";
import Screen from "../../components/Screen";
const { height, width } = Dimensions.get("window");

const VenueExploreScreen = () => {
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
    // setVenueDetails(null)
    setLoading(true);
    await new Promise((resolve, reject) => {
      setTimeout(resolve,700);
    });
    setVenueDetails(item);
    console.log(item);

    setLoading(false);
  };
  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={SlideInDown}
      exiting={SlideOutDown}
    >
      <Tab
        indicatorStyle={{
          backgroundColor: colors.primary,
          height: 2,
          width: "50%",
        }}
        style={{
          backgroundColor: colors.background,
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
        <Tab.Item>{"Seguindo"}</Tab.Item>
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

            {venueDetails && tabIndex == 0 && !loading && (
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
                    navigation.navigate("venue");
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
                    <TouchableOpacity
                      onPress={() => {
                        // navigation.goBack();
                      }}
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
                        {tabIndex == 1 ? "Seguindo" : "Seguir"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Entypo
                    name="chevron-right"
                    size={24}
                    color={colors.primary}
                  />
                </TouchableOpacity>
                {venueDetails?.description && <View style={styles.separator} />}
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
          return !loading &&!venueDetails || tabIndex == 1? (
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
                    navigation.navigate("venue");
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
                    <TouchableOpacity
                      onPress={() => {
                        // navigation.goBack();
                      }}
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
                        {tabIndex == 1 ? "Seguindo" : "Seguir"}
                      </Text>
                    </TouchableOpacity>
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
          ) :
          !loading && (
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
    </Animated.View>
  );
};

export default VenueExploreScreen;

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
