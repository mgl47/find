import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../components/hooks/useAuth";
import { ActivityIndicator } from "react-native-paper";
import colors from "../../../components/colors";
import { MaterialIcons } from "@expo/vector-icons";
const Attendees = ({ navigation, navigation: { goBack }, route }) => {
  const routeEvent = route.params;

  const { user, myEvents } = useAuth();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);

  const getSelectedEvent = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setEvent(myEvents?.filter((myEvent) => myEvent?._id == routeEvent?._id)[0]);
    setLoading(false);
  };

  useEffect(() => {
    getSelectedEvent();
  }, []);

  if (loading || event === null) {
    return (
      <View style={{ top: 20 }}>
        <ActivityIndicator animating={true} color={colors.primary} />
      </View>
    );
  }


  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={event?.attendees}
        keyExtractor={(item) => item?.uuid}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                shadowOffset: { width: 0.5, height: 0.5 },
                shadowOpacity: 0.1,
                shadowRadius: 1,
                elevation: 0.5,
                paddingHorizontal: 10,
                marginTop: 10,
              }}
              // onPress={() => navigation.navigate("addEvent", item)}
              // onPress={() => navigation.navigate("manageEvent", item)}
            >
              <View style={[styles.card, {}]}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                    left: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: colors.primary,
                      left: 4,
                    }}
                  >
                    {item?.displayName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      marginLeft: 5,
                      top: 1,
                      color: colors.darkGrey,
                      left: 4,
                    }}
                  >
                    @{item?.username}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                    left: 2,
                  }}
                >
                  <MaterialIcons
                    name={
                      item?.checkedIn ? "check-circle" : "check-circle-outline"
                    }
                    size={24}
                    color={item?.checkedIn ? "green" : colors.darkGrey}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      marginLeft: 5,
                      color: item?.checkedIn ? "green" : colors.darkSeparator,
                    }}
                  >
                    {"CHECK IN"}
                  </Text>
                  {item?.checkedAt && (
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        marginLeft: 8,
                        color: colors.darkGrey,
                      }}
                    >
                      {item?.checkedAt}
                    </Text>
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "600",
                    marginLeft: 5,
                    color: colors.black2,
                  }}
                >
                  {item?.category}
                </Text>
                {/* <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    marginLeft: 5,
                    color: colors.black2,
                  }}
                >
                  {item?.uuid}
                </Text> */}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Attendees;
const styles = StyleSheet.create({
  card: {
    // flexDirection: "row",
    // alignItems:"center",
    height: 95,
    borderRadius: 10,
    backgroundColor: colors.white,
    overflow: "hidden",
    width: "100%",
    alignSelf: "center",
    // alignItems: "center",
    // borderRadius: 10,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 1,
    // shadowRadius: 1,
    elevation: 0.5,
    marginTop: 5,
    padding: 10,
  },

  image: {
    width: 110,
    height: "100%",
    borderRadius: 10,
  },
  venue: {
    fontSize: 14.5,
    alignSelf: "flex-start",
    fontWeight: "600",
    // marginLeft: 3,
  },
  title: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
    lineHeight: 30,
    width: "70%",
    marginVertical: 5,
  },

  date: {
    fontSize: 15,
    alignSelf: "flex-start",
    fontWeight: "600",

    // marginTop: 3,
  },

  interest: {
    fontSize: 13,
    alignSelf: "flex-start",
    color: colors.description,
    lineHeight: 25,
    bottom: 95,
    left: 185,
  },
});
