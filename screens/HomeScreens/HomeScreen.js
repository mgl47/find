import {
  FlatList,
  StyleSheet,
  Text,
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
  

  return (
    <>
      <View style={styles.container}>
        <FlatList
          onRefresh={getEvents}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <>
              {/* <Text style={[styles.headerText, { marginTop: 5 }]}>Em alta</Text> */}

              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                // data={trendingEvents}
                data={events}
                keyExtractor={(item) => item.uuid}
                // keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        // shadowOffset: { width: 1, height: 1 },
                        // shadowOpacity: 1,
                        // shadowRadius: 1,
                        // elevation: 3,
                        shadowOffset: { width: 0.5, height: 0.5 },
                        shadowOpacity: 0.1,
                        shadowRadius: 1,
                        elevation: 0.5,
                        marginVertical: 5,
                      }}
                      // onPress={() =>
                      //   item.valid ? navigation.navigate("event", item) : null
                      // }
                      onPress={() => navigation.navigate("event", item)}
                    >
                      <MediumCard {...item} />
                    </TouchableOpacity>
                  );
                }}
              />
              <Text style={styles.headerText}>Bu próximo evento</Text>
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
                <BigCard
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
                {/* <BigCard
                  title="Workshop de fotografia"
                  date="Domingo, 29 Mai - 14h00"
                  venue={{
                    displayName: "Praça Alexandre Albuquerque",
                    city: "Praia",
                  }}
                  image={{
                    uri: "https://images.unsplash.com/photo-1553249067-9571db365b57?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
                  }}
                /> */}
              </TouchableOpacity>
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
      </View>
      <AuthBottomSheet
        authSheetRef={authSheetRef}
        setAuthModalUp={setAuthModalUp}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red",
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: colors.white,

    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 42,
  },
  headerText: {
    fontSize: 19,
    fontWeight: "500",
    // padding: 5,
    left: 20,
    // marginVertical: 5,
  },
  search: {
    height: 40,
    width: "100%",
    backgroundColor: colors.light2,
    borderRadius: 30,
    paddingLeft: 40,
  },
});
