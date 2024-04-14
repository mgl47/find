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
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
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
  const [authLoading, setAuthLoading] = useState(false);
  const authSheetRef = useRef(null);
  const [userLocation, setUserLocation] = useState({
    latitude: 14.905696 - 0.004,
    longitude: -23.519001,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [headerToken, setHeaderToken] = useState("");
  const [myEvents, setMyEvents] = useState([]);
  const [myTickets, setMyTickets] = useState([]);

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
      getUpdatedUser();
    }
  }, [cacheChecked]);

  const getUpdatedUser = async (id, token) => {
    try {
      // if (headerToken) {
      const response = await axios.get(
        `${apiUrl}/user/current/${id ?? user?._id}`,
        {
          headers: {
            Authorization: token ?? headerToken,
          },
        }
      );

      setMyEvents(response?.data?.events);
      setMyTickets(response?.data?.tickets);
      setUser(response?.data?.user);

      const jsonValue = JSON.stringify(response.data?.user);
      await AsyncStorage.setItem("user", jsonValue);
      // }
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
      // console.log(response?.data);
      await getUpdatedUser();
    } catch (error) {
      console.log(error?.response?.data?.msg);
    } finally {
    }
  };

  const [AuthModalUp, setAuthModalUp] = useState(false);
  const logOut = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("headerToken");
    setCacheChecked(false);

    setMyEvents([]);
    setMyTickets([]);
    setHeaderToken(null);
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
    // }
  };
  useLayoutEffect(() => {
    getLocation();
  }, []);

  const memoedValue = useMemo(
    () => ({
      headerToken,
      user,
      myEvents,
      myTickets,
      setUser,
      AuthModalUp,
      setAuthModalUp,
      authSheetRef,
      setHeaderToken,
      getUpdatedUser,
      logOut,
      followVenue2,
      getLocation,
      userLocation,
    }),
    [headerToken, user, AuthModalUp, authSheetRef, userLocation]
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
