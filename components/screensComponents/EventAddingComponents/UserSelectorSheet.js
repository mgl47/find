import {
  Button,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { ActivityIndicator, Checkbox, Chip } from "react-native-paper";

import colors from "../../colors";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from "react-native-reanimated";
import { TextInput } from "react-native-paper";

import axios from "axios";
import { useData } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";

const { height, width } = Dimensions.get("window");

export default UserSelectorSheet = ({
  userSheetModalRef,
  type,
  users,
  setUsers,
  filter,
  eventId,
}) => {
  // const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["55%", "75%"], []);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { apiUrl } = useData();
  const { user, headerToken, getUpdatedUser } = useAuth();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  const handleSheetChanges = useCallback((index) => {}, []);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [search, setSearch] = useState("");
  const [searchedUser, setSearchedUSer] = useState(null);
  const [usersList, setusersList] = useState(users);
  const clear = () => {
    setSearched(false);
    setSearchedUSer(null);
    setSearch("");
    setusersList([]);
  };

  const findUser = async () => {
    setLoading(true);
    setSearched(false);
    setSearchedUSer(null);
    try {
      const response = await axios.get(
        `${apiUrl}/users/?filter=${filter}&search=${search?.toLowerCase()}`
      );
      if (response.status === 200) {
        setSearchedUSer(response?.data);
      }
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
    setSearched(true);
    setLoading(false);
  };

  const addUser = () => {
    // Create a new array with the existing usersList
    let users = [...usersList];
    const usersId = users?.map((user) => user?._id);

    // Check if searchedUser is not already in the list
    if (!usersId?.includes(searchedUser?._id)) {
      const newStaff = {
        ...searchedUser,
        level: "Colaborador",
        addedBy: user?.displayName,
      };
      users.push(newStaff);
    }

    // Update the state with the new array
    setusersList(users);
  };
  const removeUser = (selectedUser) => {
    let users = [...usersList];
    const newUsers = users?.filter((user) => user?._id != selectedUser?._id);
    setusersList(newUsers);
  };

  const save = async () => {
    if (type == "members") {
      saveMembers();
    }
    // setUsers(usersList);
  };

  const saveMembers = async () => {
    const newStaffId = usersList?.map((item) => item?._id);
    try {
      const response = await axios.patch(
        `${apiUrl}/user/event/${eventId}`,
        {
          operation: {
            type: "eventStatus",
            task: "staff",
            eventId: eventId,
          },
          updates: { newStaffId, newStaff: usersList },
        },
        { headers: { Authorization: headerToken } }
      );
      if (response?.status == 200) {
        getUpdatedUser(), userSheetModalRef.current?.close();
      }
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
  };
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        // style={{backgroundColor:}}
        ref={userSheetModalRef}
        // index={keyboardVisible ? 1 : 0}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onDismiss={clear}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={{ padding: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "500",
                  // alignSelf: "center",
                  left: 10,
                }}
              >
                {type == "artist"
                  ? "Adicionar Artista"
                  : type == "members"
                  ? "Adiconar Membro"
                  : "Adicionar Organizador"}
              </Text>
              <TouchableOpacity onPress={save}>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TextInput
                // error={!searchText}
                style={{ marginBottom: 10, backgroundColor: colors.background }}
                // autoFocus
                underlineStyle={{ backgroundColor: colors.primary }}
                // contentStyle={{
                //   backgroundColor: colors.background,
                //   fontWeight: "500",
                // }}

                outlineColor={colors.primary}
                mode="outlined"
                placeholder="Pesquise por um usuário"
                activeOutlineColor={colors.primary}
                label="Nome"
                activeUnderlineColor={colors.primary}
                returnKeyType="search"
                value={search}
                cursorColor={colors.primary}
                // onChangeText={(text) => setPerson({ ...person, email: text })}
                onChangeText={setSearch}
                onSubmitEditing={findUser}
              />
              {searched && !searchedUser && !loading && (
                <Text
                  style={{
                    color: colors.darkGrey,
                    alignSelf: "center",
                    bottom: -10,
                    position: "absolute",
                  }}
                >
                  {" Este usuário não existe!"}
                </Text>
              )}

              {loading && (
                <Animated.View
                  style={{
                    // position: "absolute",
                    alignSelf: "center",
                    // top: 10,
                    // zIndex: 4,
                    bottom: -35,
                    position: "absolute",
                  }}
                  // entering={SlideInUp.duration(300)}
                  // exiting={SlideOutUp.duration(300)}
                >
                  <ActivityIndicator animating={true} color={colors.primary} />
                </Animated.View>
              )}
            </View>
            {!loading && searchedUser && (
              <TouchableOpacity
                onPress={addUser}
                activeOpacity={0.5}
                style={{
                  shadowOffset: { width: 0.5, height: 0.5 },
                  shadowOpacity: 0.3,
                  shadowRadius: 1,
                  elevation: 2,
                  width: "100%",
                  marginTop: 10,
                }}
                // onPress={() => navigation.navigate("event", item)}
              >
                <Animated.View
                  style={styles.userCard}
                  entering={FadeIn}
                  exiting={FadeOut}
                >
                  <Image
                    source={{
                      uri: searchedUser?.photos?.avatar?.[0]?.uri,
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
                      {searchedUser?.displayName}
                    </Text>
                    <Text numberOfLines={2} style={[styles.userName]}>
                      @{searchedUser?.username}
                    </Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            )}

            <View>
              <FlatList
                style={{ top: loading && 110 }}
                // numColumns={5}

                horizontal
                showsHorizontalScrollIndicator={false}
                data={usersList}
                keyExtractor={(item) => item?._id}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      style={{
                        padding: 5,
                        alignItems: "center",
                        // justifyContent: "center",
                      }}
                      onPress={() => removeUser(item)}
                    >
                      <Image
                        style={{
                          height: 60,
                          width: 60,
                          borderRadius: 50,
                          marginBottom: 2,
                          borderWidth: 0.009,
                        }}
                        source={{
                          uri: item?.photos?.avatar?.[0]?.uri,
                        }}
                      />
                      <Text
                        style={{
                          width: item?.displayName?.length > 15 ? 100 : null,
                          textAlign: "center",
                        }}
                      >
                        {item?.displayName}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
            {/* <Text
                style={[
                  styles.switchText,
                  {
                    color: colors.primary,
                    marginVertical: 10,
                    alignSelf: "flex-end",
                    fontWeight: "500",
                  },
                ]}
              >
                {`${users?.length} ${
                  users?.length > 1 ? "adicionados" : "adicionado"
                }`}
              </Text> */}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

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
  title: {
    fontSize: 18,
    fontWeight: "500",
  },
  map: {
    width: "100%",
    // borderRadius: 5,
    height: height * 0.35,
    backgroundColor: colors.grey,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // overflow:"hidden",

    // borderRadius: 10,
  },
  separator: {
    width: "95%",
    height: 1,
    backgroundColor: colors.grey,
    marginBottom: 2,
    alignSelf: "center",
  },
  userCard: {
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,

    // height: 95,
    backgroundColor: colors.white,
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
    color: colors.description,
    fontWeight: "600",
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
    fontSize: 19,
    fontWeight: "600",
    color: colors.primary,
    marginTop: 10,
    marginVertical: 5,
  },
});
