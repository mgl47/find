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
import Animated, {
  SlideInDown,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";
import VenuesExplorer from "./VenuesExplorer";
import SearchScreen from "./SearchScreen";
import CalendarScreen from "./CalendarScreen";
import { recommendedEvents } from "../../../components/Data/stockEvents";

// import FavVenues from "../VenuesScreens/FavVenues";
const Tab = createMaterialTopTabNavigator();

const ExploreScreens = ({
  navigation,
  navigation: { goBack, canGoBack },
  route,
}) => {
  const fromHome = route.params;
  const [animation, setAnimation] = useState(fromHome);
  const [searchText, setSearchText] = useState("");
  const [firstMount, setFirstMount] = useState(true);
  const [inSearch, setInSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState(recommendedEvents.slice().reverse());
  useEffect(() => {
    setFirstMount(false);
    setAnimation(false);
  }, []);

  const inputRef = useRef(null);
  useEffect(() => {
    const open = () => {
      inputRef.current?.focus();
    };
    open();
  }, [firstMount]);
  // console.log(autoFocus && firstMount);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerRight: () => (
        <Animated.View
          style={{
            padding: 10,
            right: 10,
            position: "absolute",
            zIndex: 2,
          }}
          entering={firstMount ? SlideInRight.duration(580) : null}
        >
          <TouchableOpacity
            style={{ left: inSearch ? 5 : 0 }}
            onPress={() => {
              navigation.navigate("home"), Keyboard.dismiss();
            }}
          >
            <Text
              style={{
                color: colors.white,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              sair
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ),

      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            zIndex: 2,
          }}
        >
          <Animated.View
            entering={firstMount ? SlideInRight.duration(500) : null}
            exiting={firstMount ? SlideOutRight.duration(250) : null}
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              zIndex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "85%",
              }}
            >
              <Entypo
                style={{ position: "absolute", zIndex: 1, left: 10, top: 10 }}
                name="magnifying-glass"
                size={19}
                color={colors.description}
              />
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={() => {
                  Keyboard.dismiss(),
                    navigation.navigate("search2", { text: searchText });
                }}
                placeholder=" artistas, eventos ou lugares"
                placeholderTextColor={colors.description}
                returnKeyType="search"
                ref={inputRef}
                style={[styles.search, { width: "100%" }]}
              />
              {searchText && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchText("");
                  }}
                >
                  <Entypo
                    style={{
                      position: "absolute",
                      zIndex: 1,
                      right: 10,
                      top: 8,
                    }}
                    name="circle-with-cross"
                    size={20}
                    color={colors.grey}
                  />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      ),
    });
  }, [navigation, firstMount, inSearch, searchText, inputRef]); // Add inputRef as dependency if used

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Animated.View style={{ flex: 1 }} entering={firstMount && SlideInDown}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: colors.primary,

            tabBarInactiveTintColor: colors.darkGrey,
            tabBarIndicatorContainerStyle: {
              backgroundColor: colors.primary2,
            },
            tabBarIndicatorStyle: {
              backgroundColor: colors.white,
              // bottom: 2,
              height:4,
            },
            tabBarLabelStyle: (active) => ({
              color: active ? colors.white : colors.lightGrey,
            }),

            // tabBarIndicatorStyle: {
            //   width: "40%",
            //   left: "5%",
            //   backgroundColor: colors.primary,
            // },
          }}
        >
          <Tab.Screen
            options={{
              tabBarLabelStyle: {
                fontWeight: "600",
                fontSize: 13,
                color: colors.white,
              },
            }}
            name="Explorar"
            component={SearchScreen}
          />

          <Tab.Screen
            options={{
              tabBarLabelStyle: {
                fontWeight: "600",
                fontSize: 13,
                color: colors.white,
              },
            }}
            name="Lugares"
            component={VenuesExplorer}
          />
          <Tab.Screen
            options={{
              tabBarLabelStyle: {
                fontWeight: "600",
                fontSize: 13,
                color: colors.white,
              },
            }}
            name="Calendário"
            component={CalendarScreen}
          />
        </Tab.Navigator>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default ExploreScreens;

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
    backgroundColor: colors.background,
    borderRadius: 30,
    paddingLeft: 35,
    paddingRight: 30,
  },
  headerText: {
    fontSize: 19,
    fontWeight: "500",
    // padding: 5,
    zIndex: 2,
    left: 20,
    marginVertical: 10,
  },
});
