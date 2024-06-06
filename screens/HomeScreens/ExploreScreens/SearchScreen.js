import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Button,
  TextInput,
  FlatList,
  Keyboard,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import colors from "../../../components/colors";

import { Tab, Text as Text2, TabView } from "@rneui/themed";

import {
  ActivityIndicator,
  Chip,
  MD2Colors,
  SegmentedButtons,
} from "react-native-paper";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutLeft,
  FadeIn,
  SlideOutRight,
  SlideOutUp,
  SlideInDown,
} from "react-native-reanimated";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";

import { categories } from "../../../components/Data/categories";
import {
  newEvents,
  recommendedEvents,
} from "../../../components/Data/stockEvents";
import SmallCard from "../../../components/cards/SmallCard";
import MediumCard from "../../../components/cards/MediumCard";
import { useData } from "../../../components/hooks/useData";
const SearchScreen = ({
  navigation,
  navigation: { goBack, canGoBack },
  route,
}) => {

  const [inSearch, setInSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [recent, setRecent] = useState(recommendedEvents.slice().reverse());
  const { recent, addToRecent } = useData();



  
  return (
    <Animated.FlatList
      style={{ backgroundColor: colors.background }}
      // contentContainerStyle={{ alignItems: "center" }}
      // entering={firstMount && SlideInDown.duration(300)}
      ListFooterComponent={
        <>
          {!inSearch && !loading && (
            <>
              <Text style={styles.headerText}>Categorias</Text>
              <Animated.FlatList
                exiting={SlideOutUp}
                // entering={SlideInUp.duration(500)}
                // style={{ position: "absolute" }}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categories}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => {
                  return (
                    <Chip
                      elevation={1}
                      elevated={false}
                      textStyle={{
                        color: colors.t3,
                      }}
                      style={{
                        margin: 2,
                        backgroundColor: colors.background2, // paddingHorizontal: 2,
                        // paddingHorizontal: 2,
                        //  marginVertical: 5,
                        marginHorizontal: 3,
                        // marginBottom: 10,
                        borderRadius: 12,
                        height: 32,
                      }}
                      // background={{ color: colors.description }}
                      // icon="information"
                      // onPress={() => console.log("Pressed")}
                      onPress={() =>
                        navigation.navigate("search2", {
                          code: item?.code,
                          category: item?.label,
                        })
                      }
                    >
                      {item.label}
                    </Chip>
                    // <TouchableOpacity
                    //   style={{
                    //     shadowOffset: { width: 0.5, height: 0.5 },
                    //     shadowOpacity: 0.4,
                    //     shadowRadius: 1,
                    //     elevation: 1,
                    //     backgroundColor: colors.white,
                    //     marginHorizontal: 5,
                    //     padding: 5,
                    //     borderRadius: 10,
                    //     marginVertical:5
                    //   }}
                    // >
                    //   <Text
                    //     style={{
                    //       color: colors.dark2,
                    //       fontSize: 15,
                    //       fontWeight: "500",
                    //     }}
                    //   >
                    //     {item?.label}
                    //   </Text>
                    // </TouchableOpacity>
                  );
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 5,
                }}
              >
                {recent?.length > 0 && (
                  <>
                    <Animated.Text
                      style={styles.headerText}
                      exiting={SlideOutLeft.duration(500)}
                    >
                      Vistos recentementes
                    </Animated.Text>
                    <Animated.View
                      style={{
                        // padding: 10,
                        right: 10,
                        // alignSelf: "flex-end",
                        position: "absolute",
                        marginBottom: 10,
                      }}
                      exiting={SlideOutLeft.duration(500)}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          addToRecent("", true);
                        }}
                      >
                        <Text
                          style={{
                            color: colors.t2,
                            fontSize: 16,
                            fontWeight: "600",
                          }}
                        >
                          limpar
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  </>
                )}
              </View>
              <Animated.FlatList
                exiting={SlideOutLeft.duration(500)}
                // entering={index == 0 ?SlideInRight:SlideInLeft}
                // exiting={SlideOutLeft}
                // data={recommendedEvents.slice().reverse()}
                data={recent}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                // ListHeaderComponent={<View style={{ marginTop: 10 }} />}
                renderItem={({ item }) => {
                  return <SmallCard {...item} />;
                }}
                ListFooterComponent={<View style={{ marginBottom: 50 }} />}
              />
            </>
          )}
        </>
      }
    />
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  search: {
    height: 37,
    width: "90%",
    backgroundColor: colors.light2,
    borderRadius: 30,
    paddingLeft: 35,
    paddingRight: 30,
  },
  headerText: {
    fontSize: 19,
    fontWeight: "500",
    color: colors.t3,
    // padding: 5,
    zIndex: 2,
    left: 20,
    marginVertical: 10,
  },
});
