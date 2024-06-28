import { Button, Image, StyleSheet, Text, View } from "react-native";
import React from "react";

import colors from "../components/colors";
import { useDesign } from "../components/hooks/useDesign";
import { Constants } from "expo-camera/legacy";
import { FlatList } from "react-native";
import { useAuth } from "../components/hooks/useAuth";
import { TouchableOpacity } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const NotificationScreen = ({ navigation }) => {
  const { isIPhoneWithNotch } = useDesign();
  const { user } = useAuth();
  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          // justifyContent: "space-between",
          marginBottom: 5,
          backgroundColor: "rgba(5, 19, 29,0.96)",
          position: "absolute",
          paddingTop: isIPhoneWithNotch ? 44 : Constants.statusBarHeight,

          top: 0,
          zIndex: 3,
          width: "100%",
          paddingBottom: 10,
          // backgroundColor:"transparent"
        }}
      >
        {user?.photos?.avatar[0]?.uri ? (
          <TouchableOpacity
            onPress={() =>
              user
                ? navigation.openDrawer()
                : (authSheetRef?.current?.present(), setAuthModalUp(true))
            }
            style={{ left: 20, top: 1.5 }}
          >
            <Image
              source={{
                uri: user?.photos?.avatar[0]?.uri,
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
              }}
            />
          </TouchableOpacity>
        ) : null}
        <Text
          style={{
            color: colors.t2,
            fontSize: 24,
            fontWeight: "600",
            marginTop: 5,
            marginLeft: 40,
          }}
        >
          Notificações
        </Text>
      </View>
      <FlatList
        contentContainerStyle={{ paddingTop: 100, padding: 10 }}
        data={user?.notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.8} style={[styles.card, {}]}>
            <Ionicons name="dice" size={40} color={colors.t4} />

            <View style={{ width: "85%", marginLeft: 10 }}>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: colors.t3,
                  left: 4,
                  marginBottom: 5,
                }}
              >
                {item?.title}
              </Text>

              <Text
                numberOfLines={3}
                style={{
                  fontSize: 15,
                  fontWeight: "400",
                  color: colors.t5,
                  left: 4,
                  marginBottom: 5,
                }}
              >
                {item?.message}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    // height: 95,
    borderRadius: 10,
    backgroundColor: colors.background2,
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
});
