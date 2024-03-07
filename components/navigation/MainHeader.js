import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import colors from "../colors";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SignInScreen from "../../screens/authScreens/SignInScreen";
import SignUpScreen from "../../screens/authScreens/SignUpScreen";
import Screen from "../Screen";

const Tab = createMaterialTopTabNavigator();
const MainHeader = ({
  title,
  navigation,
  mainScreen,
  onPressSearch,
  onPressCalendar,
  user,
}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => (user ? navigation.openDrawer() : setShowModal(true))}
        style={{ position: "absolute", left: 20, bottom: 3 }}
      >
        {!user ? (
          <Image
            source={{
              uri: "https://i0.wp.com/techweez.com/wp-content/uploads/2022/03/vivo-lowlight-selfie-1-scaled.jpg?fit=2560%2C1920&ssl=1",
            }}
            style={{
              width: 38,
              height: 38,
              borderRadius: 50,
              // marginLeft: 20,
              // position: "absolute",
            }}

            // resizeMode="contain"
          />
        ) : (
          <FontAwesome5 name="user-circle" size={38} color={colors.black} />
        )}
      </TouchableOpacity>
      {title ? (
        <Text style={styles.title}>{title}</Text>
      ) : (
        <Image
          source={require("../../assets/logos/logo1.png")}
          style={{ width: 100, flex: 1, marginBottom: 5 }}
          resizeMode="contain"
        />
      )}
      {mainScreen && (
        <View style={{ position: "absolute", right: 10, flexDirection: "row" }}>
          <TouchableOpacity
            onPress={onPressCalendar}
            style={{
              borderRadius: 50,
              padding: 5,
              marginRight: 10,
            }}
          >
            <MaterialCommunityIcons
              name="calendar-month"
              size={26}
              color={colors.black}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderRadius: 50,
              padding: 5,
              // backgroundColor: colors.grey,
            }}
            onPress={onPressSearch}
          >
            <MaterialCommunityIcons
              name="magnify"
              size={26}
              color={colors.black}
            />
          </TouchableOpacity>
        </View>
      )}
      <Modal
        // style={{ backgroundColor: colors.background }}
        animationType="slide"
        visible={showModal}
      >
        <Screen
          style={{
            backgroundColor: colors.white,
            flex: 0,
         
          }}
        ></Screen>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.white,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",

            height: 50,

            // padding: 5,
            // marginBottom: 10,
          }}
        >
          {/* <Text
              style={{
                // position: "absolute",
                alignSelf: "center",
                fontSize: 22,
                // left:1,
                color:colors.primary,

                fontWeight: "500",
              }}
            >
              Conta
            </Text> */}
          <FontAwesome5 name="user-circle" size={40} color={colors.black2} />
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            style={{ padding: 10, right: 5, position: "absolute" }}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.darkGrey,
            tabBarIndicatorContainerStyle: {
              backgroundColor: colors.background,
            },
            tabBarLabelStyle: {
              fontWeight: "600",
              fontSize: 14,
              color: colors.black2,
            },
            tabBarIndicatorStyle: {
              width: "40%",
              left: "5%",
            },
          }}
        >
          <Tab.Screen name="Entrar" component={SignInScreen} />
          <Tab.Screen name="Criar Conta" component={SignUpScreen} />
        </Tab.Navigator>
      </Modal>
    </View>
  );
};

export default MainHeader;

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
