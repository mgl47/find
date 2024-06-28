import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";

import colors from "../components/colors";
import { useDesign } from "../components/hooks/useDesign";
import { useAuth } from "../components/hooks/useAuth";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
const ChatsScreen = ({ navigation }) => {
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
          Chats
        </Text>
      </View>
    </View>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
