import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import colors from "../../../components/colors";
import { useAuth } from "../../../components/hooks/useAuth";
import Animated, { FadeIn } from "react-native-reanimated";

export default function FavArtists({ navigation }) {
  const { userData } = useAuth();

  return (
    <Animated.FlatList
    entering={FadeIn.duration(200)}
      data={userData?.favArtists}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={<View style={{ marginTop: 20 }} />}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate("artist", {item})}
            activeOpacity={0.5}
            style={{
              shadowOffset: { width: 0.5, height: 0.5 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              elevation: 2,
              width: "100%",
              // marginTop: 5,
            }}
          >
            <View style={styles.userCard}>
              <Image
                source={{
                  uri: item?.photos?.avatar?.[0]?.uri,
                }}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 50,

                  // marginLeft: 20,
                  // position: "absolute",
                }}

                // resizeMode="contain"
              />
              <View style={{ alignItems: "center", marginLeft: 10 }}>
                <Text numberOfLines={2} style={[styles.displayName]}>
                  {item?.displayName}
                </Text>
                <Text numberOfLines={2} style={[styles.userName]}>
                  @{item?.username}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
      ListFooterComponent={<View style={{ marginBottom: 50 }} />}
    />
  );
}

const styles = StyleSheet.create({
  userCard: {
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,

    backgroundColor: colors.background2,
    overflow: "hidden",
    width: "95%",
    alignSelf: "center",

    borderRadius: 10,
  },
  userName: {
    fontSize: 14,
    alignSelf: "flex-start",
    color: colors.t4,
    fontWeight: "600",
  },

  displayName: {
    alignSelf: "flex-start",
    fontSize: 19,
    fontWeight: "600",
    color: colors.t2,
    marginTop: 10,
    marginBottom: 3,
  },
});
