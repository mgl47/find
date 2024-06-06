import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  MaterialCommunityIcons,
  FontAwesome5,
  Entypo,
} from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import colors from "../../../components/colors";

import { recommendedEvents } from "../../../components/Data/stockEvents";
import Screen from "../../../components/Screen";
import FavArtists from "./FavArtists";
import FavVenues from "./FavVenues";
import FavEvents from "./FavEvents";

// import FavVenues from "../VenuesScreens/FavVenues";
const Tab = createMaterialTopTabNavigator();

const FavoriteScreens = ({
  navigation,
  navigation: { goBack, canGoBack },
  route,
}) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.headerText}>Favoritos</Text>,
    });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Tab.Navigator

      initialRouteName="Eventos"
        screenOptions={({ active }) => ({
          tabBarActiveTintColor: colors.t2,

          tabBarInactiveTintColor: colors.t5,
          tabBarIndicatorContainerStyle: {
            backgroundColor: colors.background,
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.white,
          },
          tabBarLabelStyle: {
            fontWeight: active ? "500" : "600",
          },
        })}
      >
        <Tab.Screen name="Artistas" component={FavArtists}   options={(active) => ({
                lazy: true,
              })} />

        <Tab.Screen name="Eventos" component={FavEvents} />
        <Tab.Screen name="Lugares" component={FavVenues}   options={(active) => ({
                lazy: true,
              })}/>
      </Tab.Navigator>
    </TouchableWithoutFeedback>
  );
};

export default FavoriteScreens;

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    backgroundColor: colors.white,

    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 40,
    borderBottomWidth: 0.2,
    borderColor: colors.grey,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.3,
    // shadowRadius: -3,
    // elevation: 2
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
  },
  search: {
    height: 37,
    width: "90%",
    backgroundColor: colors.background2,
    borderRadius: 30,
    paddingLeft: 35,
    paddingRight: 30,
    color: colors.t4,
  },
  headerText: {
    fontSize: 19,
    fontWeight: "500",
    color: colors.t2,
    // padding: 5,
    zIndex: 2,
    // left: 20,
    marginVertical: 10,
  },
});
