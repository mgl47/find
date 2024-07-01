import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

import { useDesign } from "../../components/hooks/useDesign";
import { Constants } from "expo-camera/legacy";
import { FlatList } from "react-native";
import { useAuth } from "../../components/hooks/useAuth";
import { TouchableOpacity } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import colors from "../../components/colors";
import SwipeRow from "@nghinv/react-native-swipe-row";
import axios from "axios";
import { useData } from "../../components/hooks/useData";
import toast from "../../components/toast";
import AuthBottomSheet from "../../components/screensComponents/AuthComponents/AuthBottomSheet";
import { useIsFocused } from "@react-navigation/native";

const NotificationScreen = ({ navigation }) => {
  const { isIPhoneWithNotch } = useDesign();
  const { user, headerToken } = useAuth();
  const { apiUrl } = useData();
  const [myNotifications, setNotifications] = useState(user?.notifications);  const deleteNotification = async (id) => {
    const newNotifications = myNotifications.filter((noti) => noti.id !== id);

    try {
      const response = await axios.patch(
        `${apiUrl}/user/current/${user?._id}`,
        {
          operation: {
            type: "notification",
            task: "delete",
          },
          updates: {
            notifications: newNotifications,
          },
        },
        { headers: { Authorization: headerToken } }
      );
      if (response.status === 200) {
        setNotifications(newNotifications);
      }

      // await getUpdatedUser({ field: "favEvents" });
    } catch (error) {
      toast({
        msg: "Erro ao apagar notificação",
        textcolor: colors.t3,
        color: "tomato",
      });
      console.log(error?.response?.data?.msg);
      console.log(error);
    }
  };

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
          data={user ? myNotifications : []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SwipeRow
              // left={[
              //   { title: 'Delete', backgroundColor: 'tomato' },
              //   { title: 'Edit', icon: { name: 'delete' } },
              // ]}
              right={[
                // {
                //   title: 'Edit',
                //   titleColor: 'blue',
                //   backgroundColor: '#b388ff',
                //   icon: { name: 'edit' },
                // },
                {
                  title: "Apagar",
                  backgroundColor: "tomato",
                  icon: () => (
                    <FontAwesome name="trash-o" size={24} color="black" />
                  ),
                  onPress: () =>
                    Alert.alert(
                      "Apagar Notificação!",
                      "Tem certeza que eseja apagar esta notificação?",
                      [
                        {
                          text: "Cancelar",
                          style: "cancel",
                        },
                        {
                          text: "Apagar",
                          onPress: () => deleteNotification(item.id),
                          style: "destructive",
                        },
                      ]
                    ),
                },
              ]}
              style={{ marginTop: 10 }}
              autoClose={false}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("noti", item)}
                activeOpacity={0.8}
                style={[styles.card, {}]}
              >
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
            </SwipeRow>
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

    padding: 10,
  },
});
