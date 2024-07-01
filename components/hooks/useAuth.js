import {
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigation, DrawerActions } from "@react-navigation/native";

import colors from "../colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [closeSheet, setCloseSheet] = useState(false);
  const [userData, setUserData] = useState({
    myEvents: [],
    myTickets: [],
    favEvents: [],
    favVenues: [],
    favArtists: [],
  });

  const [authLoading, setAuthLoading] = useState(false);
  const authSheetRef = useRef(null);
  // const authSheetRef2 = useRef(null);

  const [userLocation, setUserLocation] = useState({
    latitude: 14.905696 - 0.004,
    longitude: -23.519001,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [headerToken, setHeaderToken] = useState("");

  const [cacheChecked, setCacheChecked] = useState(false);
  const getUser = async () => {
    try {
      const tokenValue = await AsyncStorage.getItem("headerToken");
      const userValue = await AsyncStorage.getItem("user");
      if (tokenValue !== null) {
        setUser(JSON.parse(userValue));
        setHeaderToken(tokenValue);
      }

      setCacheChecked(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // do something when permission is denied
        return;
      }
      const lastLocation = await AsyncStorage.getItem("lastLocation");
      if (lastLocation !== null) {
        setUserLocation(JSON.parse(lastLocation));
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (!cacheChecked) {
      getUser();
    }
    if (cacheChecked && user) {
      getUpdatedUser({ field: "all" });
    }
  }, [cacheChecked]);

  const getUpdatedUser = async ({ token, field }) => {
    try {
      const response = await axios.get(
        `${apiUrl}/user/current/?field=${field}`,
        {
          headers: {
            Authorization: token ?? headerToken,
          },
        }
      );
      const { myEvents, tickets, favEvents, favVenues, favArtists, user } =
        response.data;
      const updatedData = { ...userData };

      if (!field || field === "all" || field === "myEvents") {
        updatedData.myEvents = myEvents;
      }
      if (!field || field === "all" || field === "myTickets") {
        updatedData.myTickets = tickets;
      }
      if (!field || field === "all" || field === "favEvents") {
        updatedData.favEvents = favEvents;
      }
      if (!field || field === "all" || field === "favVenues") {
        updatedData.favVenues = favVenues;
      }
      if (!field || field === "all" || field === "favArtists") {
        updatedData.favArtists = favArtists;
      }
      if (
        !field ||
        field === "all" ||
        field === "user" ||
        field === "favVenues" ||
        field === "favArtists" ||
        field === "favEvents" ||
        field === "myTickets"
      ) {
        setUser(user);

        const jsonValue = JSON.stringify(user);
        await AsyncStorage.setItem("user", jsonValue);
      }
      setUserData(updatedData);
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
  };

  const followVenue2 = async (venue) => {
    let updateFollowedVenue = [];

    updateFollowedVenue = user?.followedVenues || [];

    const index = updateFollowedVenue.indexOf(venue?._id);
    if (user?.followedVenues?.includes(venue?._id) && index !== -1) {
      updateFollowedVenue.splice(index, 1);
    } else {
      updateFollowedVenue.push(venue?._id);
    }

    try {
      const response = await axios.patch(
        `${apiUrl}/user/current/${user?._id}`,
        {
          operation: {
            type: "follow",
            task: "venue",
            target: venue?._id,
          },
          updates: {
            followedVenues: updateFollowedVenue,
          },
        },
        { headers: { Authorization: headerToken } }
      );
      await getUpdatedUser({ field: "user" });
    } catch (error) {
      console.log(error?.response?.data?.msg);
    } finally {
    }
  };

  const [AuthModalUp, setAuthModalUp] = useState(false);
  const logOut = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("headerToken");
    setCloseSheet(false);
    setCacheChecked(false);
    setHeaderToken(null);

    setUserData({
      myEvents: [],
      myTickets: [],
      favEvents: [],
      favVenues: [],
      favArtists: [],
    });
    setUser(null);

    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const getLocation = async () => {
    // if (!cacheChecked) {
    //   const lastLocation = await AsyncStorage.getItem("lastLocation");

    //   if (lastLocation !== null) {
    //     setUserLocation(lastLocation);
    //   }
    // } else {
    // permissions check
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // do something when permission is denied
        return;
      }
      const location = await Location.getCurrentPositionAsync();

      setUserLocation({
        latitude: location.coords.latitude - 0.004,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      const jsonValue = JSON.stringify({
        latitude: location.coords.latitude - 0.004,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      await AsyncStorage.setItem("lastLocation", jsonValue);
    } catch (error) {
      console.log(error);
    }
    // }
  };

  useLayoutEffect(() => {
    getLocation();
  }, []);

  const memoedValue = useMemo(
    () => ({
      user,
      userData,
      closeSheet,
      headerToken,
      AuthModalUp,
      authSheetRef,
      userLocation,
      // authSheetRef2,
      logOut,
      setUser,
      getLocation,
      followVenue2,
      setCloseSheet,
      getUpdatedUser,
      setAuthModalUp,
      setHeaderToken,
    }),
    [
      headerToken,
      user,
      userData,
      AuthModalUp,
      closeSheet,
      authSheetRef,
      userLocation,
    ]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

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
});
