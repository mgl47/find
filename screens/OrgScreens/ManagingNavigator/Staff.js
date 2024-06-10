import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "../../../components/hooks/useAuth";
import { ActivityIndicator } from "react-native-paper";
import colors from "../../../components/colors";

import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
  FontAwesome5,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import { useData } from "../../../components/hooks/useData";
import UserSelectorSheet from "../../../components/screensComponents/EventAddingComponents/UserSelectorSheet";

const Staff = ({ navigation, navigation: { goBack }, route }) => {
  const event = route.params;

  const { user, headerToken, getUpdatedUser } = useAuth();
  const { apiUrl } = useData();
  const [loading, setLoading] = useState(false);
  // const [event, setEvent] = useState(routeEvent);
  const [members, setMembers] = useState(event);
  const currentMember = members?.staff?.filter(
    (member) => member?._id == user?._id
  )[0];
  const isOrganizer = event?.organizers?.find((org) => org?._id == user?._id);

  const notAllowed = (item) => {
    return (
      !item?.role ||
      item?._id == user?._id ||
      (item?.role == "Administração" && !isOrganizer) ||
      currentMember?.role == item?.role
    );
  };
  // !item?.role ||
  //   item?.role == "Organizador" ||
  //   (currentMember?.role != "Administração" && !isOrganizer) ||
  //   item?._id == user?._id ||
  //   (currentMember?.role == "Administração" && item?.role == "Administração");

  const [selectedMember, setSelectedMember] = useState(null);
  const [position, setPosition] = useState(selectedMember?.role);

  useEffect(() => {
    setPosition({ value: selectedMember?.role, label: selectedMember?.role });
  }, [selectedMember]);

  const membersSheetRef = useRef(null);
  const manageMembersSheetRef = useRef(null);

  const handleMembersSheet = useCallback(() => {
    membersSheetRef.current?.present();
  }, []);

  const handleManageMembers = useCallback((member) => {
    setSelectedMember(member);
    manageMembersSheetRef.current?.present();
  }, []);
  const snapPoints = useMemo(() => ["55%", "75%"], []);

  const removeMember = async () => {
    try {
      const response = await axios.patch(
        `${apiUrl}/user/event/${event?._id}`,
        {
          operation: {
            type: "eventStatus",
            task: "removeStaff",
            eventId: event?._id,
          },
          updates: { oldStaff: selectedMember },
        },
        { headers: { Authorization: headerToken } }
      );
      if (response?.status == 200) {
        getUpdatedUser({field:"myEvents"}), 

        setMembers(response.data)
      
        manageMembersSheetRef.current?.close();
      }
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
  };

  const updateMember = async () => {
    if (position?.value == selectedMember?.role) {
      manageMembersSheetRef.current?.close();
      return;
    }
    try {
      const response = await axios.patch(
        `${apiUrl}/user/event/${event?._id}`,
        {
          operation: {
            type: "eventStatus",
            task: "updateStaff",
            eventId: event?._id,
          },
          updates: { role: position?.value, uuid: selectedMember?.uuid },
        },
        { headers: { Authorization: headerToken } }
      );
      if (response?.status == 200) {
        getUpdatedUser({field:"myEvents"}), 

        setMembers(response.data)        
        manageMembersSheetRef.current?.close();
      }
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
  };
  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />,
    []
  );
  // disabled={
  //   !item?.role ||
  //   item?.role == "Organizador" ||
  //   (currentMember?.role != "Administração" && !isOrganizer) ||
  //   item?._id == user?._id ||
  //   (currentMember?.role == "Administração" &&
  //     item?.role == "Administração")
  // }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={members?.organizers?.concat(members?.staff)}
        keyExtractor={(item) => item?._id}
        ListHeaderComponent={
          <>
            <View style={[styles.switchContainer]}>
              <Text style={[styles.switchText, { color: colors.t4 }]}>
                Membros{" "}
              </Text>
              {(currentMember?.role == "Administração" || isOrganizer) && (
                <TouchableOpacity
                  style={styles.switch}
                  onPress={handleMembersSheet}
                >
                  <Text
                    style={{
                      color: colors.t2,
                      fontSize: 14,
                      left: 20,
                      padding: 3,
                      fontWeight: "600",
                    }}
                  >
                    Adicionar
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        }
        renderItem={({ item }) => {
          const disabled = notAllowed(item);

          return (
            <TouchableOpacity
              // disabled={
              //   !item?.role ||
              //   item?.role == "Organizador" ||
              //   (currentMember?.role != "Administração" && !isOrganizer) ||
              //   item?._id == user?._id ||
              //   (currentMember?.role == "Administração" &&
              //     item?.role == "Administração")
              // }
              disabled={disabled}
              onPress={() => handleManageMembers(item)}
              activeOpacity={0.5}
              style={{
                shadowOffset: { width: 0.5, height: 0.5 },
                shadowOpacity: 0.2,
                shadowRadius: 1,
                elevation: 0.5,
                width: "100%",
                marginHorizontal: 0.1,
              }}
              // onPress={() => navigation.navigate("event", {item})}
            >
              <Animated.View
                style={styles.userCard}
                entering={FadeIn}
                exiting={FadeOut}
              >
                <Image
                  source={{
                    uri: item?.photos?.avatar?.[2]?.uri,
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
                  <Text
                    numberOfLines={2}
                    style={{
                      alignItems: "center",
                      fontSize: 16,
                      color: colors.t4,
                      fontWeight: "500",
                    }}
                  >
                    {item?.role || "Organizador"}
                  </Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={manageMembersSheetRef}
          index={1}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          handleStyle={{
            backgroundColor: colors.background,
          }}
          handleIndicatorStyle={{ backgroundColor: colors.t5 }}
          enableOverDrag={false}
        >
          <BottomSheetView style={styles.contentContainer}>
            <View style={{ padding: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "500",
                    // alignSelf: "center",
                    left: 10,
                    color: colors.t4,
                  }}
                >
                  Gerenciar Membro
                </Text>
                <TouchableOpacity onPress={updateMember}>
                  <Text
                    style={{
                      color: colors.t2,
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    Guardar
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 2,
                }}
              >
                <Text
                  numberOfLines={2}
                  style={{ marginRight: 5, fontSize: 16, color: colors.t4 }}
                >
                  Nome:
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    alignSelf: "flex-start",
                    fontSize: 17,
                    fontWeight: "400",
                    color: colors.t3,
                    marginVertical: 3,
                  }}
                >
                  {selectedMember?.displayName}
                </Text>
              </View>
              <View style={styles.separator} />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 2,
                }}
              >
                <Text
                  numberOfLines={2}
                  style={{ marginRight: 5, fontSize: 16, color: colors.t4 }}
                >
                  username:
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    alignSelf: "flex-start",
                    fontSize: 17,
                    fontWeight: "400",
                    color: colors.t3,
                    marginVertical: 3,
                  }}
                >
                  @{selectedMember?.username}
                </Text>
              </View>
              <View style={styles.separator} />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 2,
                }}
              >
                <Text
                  numberOfLines={2}
                  style={{ marginRight: 5, fontSize: 16, color: colors.t4 }}
                >
                  Adicionado por:
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    alignSelf: "flex-start",
                    fontSize: 17,
                    fontWeight: "400",
                    color: colors.t3,
                    marginVertical: 3,
                  }}
                >
                  {selectedMember?.addedBy}
                </Text>
              </View>
              <View style={styles.separator} />
            </View>
            <RNPickerSelect
              style={{ left: 40 }}
              // placeholder={{ label: getMemberPosition(selectedMember) }}
              placeholder={{}}
              value={position?.value}
              onValueChange={(value, label) => setPosition({ value, label })}
              items={[
                { label: "Colaborador", value: "Colaborador" },
                { label: "Administração", value: "Administração" },
                { label: "Gerenciador", value: "Gerenciador" },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 2,
                  marginLeft: 10,
                }}
              >
                <Text
                  numberOfLines={2}
                  style={{ marginRight: 5, fontSize: 16, color: colors.t4 }}
                >
                  Posição:
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    alignSelf: "flex-start",
                    fontSize: 17,
                    fontWeight: "400",
                    color: colors.t3,
                    marginVertical: 3,
                  }}
                >
                  {position?.value}
                </Text>
                <MaterialCommunityIcons
                  style={{ alignSelf: "flex-end" }}
                  name="unfold-more-horizontal"
                  size={26}
                  color={colors.primary2}
                />
              </View>
            </RNPickerSelect>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Remover Staff!",
                  "Tem certeza que deseja remover este membro?",
                  [
                    {
                      text: "Não",
                      onPress: () => {
                        return false;
                      },
                      style: "cancel",
                    },
                    {
                      text: "Sim",
                      onPress: () => removeMember(),
                      style: "destructive",
                    },
                  ]
                )
              }
              style={{ padding: 10, marginTop: 5 }}
            >
              <Text style={{ color: "red", fontWeight: "500", fontSize: 17 }}>
                Remover
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <UserSelectorSheet
        type={"members"}
        users={members?.staff}
        // setUserModalUp={setUserModalUp}
        setUsers={setMembers}
        userSheetModalRef={membersSheetRef}
        eventId={event?._id}
      />
    </View>
  );
};

export default Staff;
const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    // padding: 24,
    // justifyContent: "center",
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,

    // alignItems: "center",
    backgroundColor: colors.background,
  },
  switchContainer: {
    flexDirection: "row",
    marginVertical: 15,
    // height: 40,
    width: "100%",
    // backgroundColor: colors.light2,
    alignItems: "center",
    // paddingHorizontal: 20,

    //padding: 10,
  },
  switch: {
    position: "absolute",

    right: 30,
  },
  switchText: {
    fontSize: 18,
    fontWeight: "500",
    alignSelf: "center",
    left: 30,
  },

  userCard: {
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,

    // height: 95,
    backgroundColor: colors.background2,
    overflow: "hidden",
    width: "95%",
    alignSelf: "center",

    borderRadius: 10,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 1,
    // shadowRadius: 1,
    // elevation: 3,
  },
  userName: {
    fontSize: 14,
    alignSelf: "flex-start",
    color: colors.t5,
    fontWeight: "600",
    marginBottom: 5,
  },
  userSearch: {
    height: 40,
    width: "90%",
    alignSelf: "center",
    backgroundColor: colors.white,
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 15,
    // paddingLeft: 40,
  },
  displayName: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "500",
    color: colors.t2,
    // marginTop: 10,
    marginVertical: 3,
  },
  separator: {
    width: "95%",
    height: 1,
    right: 10,
    backgroundColor: colors.separator,
    marginVertical: 5,
    alignSelf: "center",
  },
});
