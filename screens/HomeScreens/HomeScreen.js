import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  recommendedEvents,
  trendingEvents,
} from "../../components/Data/stockEvents";
import MediumCard from "../../components/cards/MediumCard";
import BigCard from "../../components/cards/BigCard";
import SmallCard from "../../components/cards/SmallCard";

import colors from "../../components/colors";

import {
  MaterialCommunityIcons,
  Entypo,
  FontAwesome5,
} from "@expo/vector-icons";

import { useAuth } from "../../components/hooks/useAuth";
import AuthBottomSheet from "../../components/screensComponents/AuthBottomSheet";
import axios from "axios";
import { useData } from "../../components/hooks/useData";
import BigCard2 from "../../components/cards/BigCards2";
import Carousel from "react-native-snap-carousel";
import { ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native";
const { width, height } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  // const{authSheetRef}=useAuth()

  const { setAuthModalUp, authSheetRef } = useAuth();
  const bottomSheetModalRef = useRef(null);
  const { events, getEvents } = useData();
  // const handleAuthSheet = useCallback(() => {
  //   setAuthModalUp(true);
  //   authSheetRef.current?.present();
  // }, []);
  const [refreshing, setRefreshing] = useState(false);
  const carouselRef = useRef(null);
 
  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity activeOpacity={0.95} onPress={()=>navigation.navigate("event",item)}>
        <BigCard {...item} />
      </TouchableOpacity >
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
      
        contentContainerStyle={{ backgroundColor: colors.background }}
        onRefresh={getEvents}
        bounces={false}
        
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>

            <View
              style={{
                backgroundColor: colors.primary2,
                position: "absolute",
                width: "100%",
                height: 250,
              }}
            />
            <Carousel

              inactiveSlideOpacity={1}
              ref={carouselRef}
              data={events}
              renderItem={_renderItem}
              // sliderWidth={300}
              sliderWidth={width}
              itemWidth={width * 0.8}
            
            />
         
            {/* <Text style={styles.headerText}>Bu próximo evento</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation?.navigate("event", trendingEvents[1])}
              style={{
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 1,
                shadowRadius: 1,
                elevation: 3,
                marginVertical: 10,
              }}
            >
              <BigCard2
                title={trendingEvents[1]?.title}
                date={trendingEvents[1]?.date}
                venue={{
                  displayName: trendingEvents[1]?.venue?.displayName,
                  city: trendingEvents[1]?.venue?.city,
                }}
                image={{
                  uri: trendingEvents[1]?.photos[0]?.[0]?.uri,
                }}
              />
          
            </TouchableOpacity> */}
            <Text style={styles.headerText}>Pa bó</Text>
            <FlatList
              data={recommendedEvents}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      // shadowOffset: { width: 0.5, height: 0.5 },
                      // shadowOpacity: 0.3,
                      // shadowRadius: 1,
                      // elevation: 2,
                      shadowOffset: { width: 0.5, height: 0.5 },
                      shadowOpacity: 0.1,
                      shadowRadius: 1,
                      elevation: 0.5,
                      paddingHorizontal: 10,
                      marginTop: 10,
                    }}
                    onPress={() => navigation.navigate("addEvent", item)}
                  >
                    <SmallCard {...item} />
                  </TouchableOpacity>
                );
              }}
              ListFooterComponent={<View style={{ marginBottom: 50 }} />}
            />
          </>
        }
      />
      <AuthBottomSheet
        authSheetRef={authSheetRef}
        setAuthModalUp={setAuthModalUp}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red",
    backgroundColor: colors.primary,
  },
  headerContainer: {
    // backgroundColor: colors.white,

    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 42,
  },
  headerText: {
    fontSize: 19,
    fontWeight: "600",
    // padding: 5,
    left: 20,
    color: colors.primary,
    marginTop: 10,
  },
  search: {
    height: 40,
    width: "100%",
    backgroundColor: colors.light2,
    borderRadius: 30,
    paddingLeft: 40,
  },
  venue: {
    fontSize: 14.5,
    alignSelf: "flex-start",
    fontWeight: "600",
    color: colors.white,
  },
  title: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
    lineHeight: 30,
    width: "70%",
  },

  date: {
    fontSize: 15,
    alignSelf: "flex-start",
    fontWeight: "600",
    color: colors.white,

    marginTop: 3,
  },
});
