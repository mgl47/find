import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

import Animated, { FadeIn, SlideOutUp } from "react-native-reanimated";
import React, { useEffect, useState } from "react";
import colors from "../../components/colors";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
  AntDesign,
  Fontisto,
  Feather,
  Foundation,
  Ionicons,
} from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";
import { TouchableWithoutFeedback } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import ViewMoreText from "react-native-view-more-text";
import MapView, { Marker } from "react-native-maps";
import { venues } from "../../components/Data/venue";
import { Chip } from "react-native-paper";
import { artist as arti } from "../../components/Data/artist";
import SmallCard from "../../components/cards/SmallCard";
import { useAuth } from "../../components/hooks/useAuth";
import axios from "axios";
import { useData } from "../../components/hooks/useData";
import BlockModal from "../../components/screensComponents/BlockModal";
import photoInput from "../../components/ImageInputs/photoInput";
import { storage } from "../../firebase";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import uuid from "react-native-uuid";
import ImageView from "react-native-image-viewing";

const ProfileScreen = ({ navigation, navigation: { goBack }, route }) => {
  const { width, height } = Dimensions.get("window");

  const { user, headerToken, getUpdatedUserInfo } = useAuth();
  const { apiUrl } = useData();

  const [artist, setArtist] = useState(arti[0]);
  const [loading, setLoading] = useState(false);

  const videoRef = React.useRef(null);
  const [muted, setMuted] = useState(true);
  const [initialWidth, setInitalWidth] = useState(width);
  const [scrolling, setScrolling] = useState(false);
  const [avatarVisible, setAvatarVisible] = useState(false);
  const [coverVisible, setCoverVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [avatarUri, setAvatarUri] = useState(null);
  const [coverUri, setCoverUri] = useState(null);
  const uuidKey = uuid.v4();
  const [userInitialInfo, setInitialUserInfo] = useState({});
  const [userInfo, setUserInfo] = useState({
    displayName: user?.displayName ?? "",
    userDescription: user?.userDescription ?? "",

    photos: {
      avatar: user?.photos?.avatar ?? "",
      cover: user?.photos?.cover ?? "",
    },
    socials: {
      face: "",
      insta: "",
      twitter: "",
      tiktok: "",
    },
    medias: {
      spotify: "",
      appleMusic: "",
      youtube: "",
    },
  });
  useEffect(() => {
    setUserInfo(user);
    setInitialUserInfo(user);
  }, [user, modalVisible]);

  // console.log(userInfo);
  const handleScroll = (event) => {
    setScrolling(event.nativeEvent.contentOffset.y > 120);
    console.log(event.nativeEvent.contentOffset.y);
  };

  const renderViewMore = (onPress) => {
    return (
      <TouchableOpacity style={styles.more} onPress={onPress}>
        {/* <Text style={[styles.more]}>Ver mais</Text> */}
        <MaterialCommunityIcons
          name="unfold-more-horizontal"
          size={26}
          color={colors.primary}
        />
        {/* <Entypo name="chevron-down" size={24} color={colors.primary} /> */}
      </TouchableOpacity>
    );
  };
  const renderViewLess = (onPress) => {
    return (
      <TouchableOpacity style={styles.more} onPress={onPress}>
        {/* <Text style={[styles.more]}>Ver menos</Text> */}
        <MaterialCommunityIcons
          name="unfold-more-horizontal"
          size={26}
          color={colors.primary}
        />
        {/* <Entypo name="chevron-up" size={24} color={colors.primary} /> */}
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            left: 20,
          }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color={scrolling ? colors.black : colors.white}
            style={{
              shadowOffset: { width: 0.5, height: 0.5 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              elevation: 2,
            }}
          />
        </TouchableOpacity>
      ),
      headerRight: () => null,

      headerTitle: () =>
        scrolling ? (
          <Text
            numberOfLines={1}
            style={{
              fontSize: 18,
              fontWeight: "500",
              top: 40,
              color: colors.black,
            }}
          >
            {artist?.displayName}
          </Text>
        ) : null,
    });
  }, [scrolling]);

  let resized1;
  let resized2;
  let resized3;
  let resized4;

  const updatePhotos = async (fileName, type) => {
    try {
      let resizedPhotos = [];
      let resized1, resized2, resized3, resized4;
      let resized1Name, resized2Name, resized3Name, resized4Name;

      if (type === "avatar") {
        resized1Name = `${fileName}_100x100`;
        resized2Name = `${fileName}_200x200`;
        resized3Name = `${fileName}_800x800`;
        resized4Name = `${fileName}_1000x1000`;
      } else {
        resized1Name = `${fileName}_200x200`;
        resized2Name = `${fileName}_300x300`;
        resized3Name = `${fileName}_1000x1000`;
        // resized4Name = `${fileName}_1200x1200`;
      }

      const resized1Storage = ref(
        storage,
        `users/${user?._id}/photos/${type}/${resized1Name}`
      );
      const resized2Storage = ref(
        storage,
        `users/${user?._id}/photos/${type}/${resized2Name}`
      );
      const resized3Storage = ref(
        storage,
        `users/${user?._id}/photos/${type}/${resized3Name}`
      );
      const resized4Storage = ref(
        storage,
        `users/${user?._id}/photos/${type}/${resized4Name}`
      );

      const resized1Url = await getDownloadURL(resized1Storage);
      const resized2Url = await getDownloadURL(resized2Storage);
      const resized3Url = await getDownloadURL(resized3Storage);
      const resized4Url =
        type === "avatar" ? await getDownloadURL(resized4Storage) : null;

      resized1 = { id: uuidKey, uri: resized1Url };
      resized2 = { id: uuidKey, uri: resized2Url };
      resized3 = { id: uuidKey, uri: resized3Url };
      if (type === "avatar") {
        resized4 = { id: uuidKey, uri: resized4Url };
        resizedPhotos.push(resized1, resized2, resized3, resized4);
      } else {
        resizedPhotos.push(resized1, resized2, resized3);
      }
      return resizedPhotos;
    } catch (error) {
      console.log(`Error updating photos: ${error.message}`);
      throw error; // Rethrow the error for higher-level error handling
    }
  };

  const uploadPhoto = async (fileName, type, uri) => {
    try {
      const storageRef = ref(
        storage,
        `users/${user?._id}/photos/${type}/${fileName}`
      );
      const blob = await fetch(uri).then((response) => response.blob());
      await uploadBytesResumable(storageRef, blob);
    } catch (error) {
      console.log(`Error uploading ${type} photo: ${error.message}`);
      throw error;
    }
  };

  const saveChanges = async () => {
    try {
      setLoading(true);
      const date = new Date();
      const fileName = `${
        user?.username
      }_${date?.getDate()}_${date?.getMonth()}_${date?.getFullYear()}`;
      let updates = { ...userInfo };

      if (avatarUri) {
        await uploadPhoto(fileName, "avatar", avatarUri);
      }
      if (coverUri) {
        await uploadPhoto(fileName, "cover", coverUri);
      }

      // Add any necessary delay or wait for the upload to complete

      let resizedAvatar, resizedCover;
      if (avatarUri) {
        resizedAvatar = await updatePhotos(fileName, "avatar");
        updates.photos.avatar = resizedAvatar;
      }
      if (coverUri) {
        resizedCover = await updatePhotos(fileName, "cover");
        updates.photos.cover = resizedCover;
      }

      const response = await axios.patch(
        `${apiUrl}/user/current/${user?._id}`,
        {
          operation: { type: "profileChange", task: "Editing" },
          updates,
        },
        { headers: { Authorization: headerToken } }
      );

      if (response.status === 200) {
        setModalVisible(false);
        getUpdatedUserInfo();
        setAvatarUri(null);
        setCoverUri(null);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
    setLoading(false);
  };
  let displayCover = [];
  const coverIndex = user?.photos?.cover[2];
  displayCover?.push(coverIndex);
  let displayAvatar = [];
  const avatarIndex = user?.photos?.avatar[2];
  displayAvatar?.push(avatarIndex);
  return (
    <>
      {scrolling && (
        <Animated.View
          entering={FadeIn.duration(200)}
          // exiting={FadeOutUp.duration(200)}
          exiting={SlideOutUp.duration(500)}
          style={{
            position: "absolute",
            height: 90,
            width: "100%",
            backgroundColor: colors.white,
            // zIndex: 2,
          }}
        />
      )}

      <FlatList
        scrollEventThrottle={16}
        onScroll={handleScroll}
        bounces={false}
        data={artist?.upcomingEvents}
        keyExtractor={(item) => item?.id}
        style={{ backgroundColor: colors.background }}
        ListHeaderComponent={
          <>
            <ImageView
              images={displayCover}
              imageIndex={0}
              onRequestClose={() => setCoverVisible(false)}
              visible={coverVisible}
            />
            <TouchableOpacity activeOpacity={0.9}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setCoverVisible(true)}
              >
                <Image
                  style={{
                    height: 150,
                    width: "100%",
                    backgroundColor: colors.darkGrey,
                  }}
                  source={{ uri: user?.photos?.cover[0]?.uri ?? " " }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={{ flexDirection: "row" }}>
              <ImageView
                images={displayAvatar}
                imageIndex={0}
                onRequestClose={() => setAvatarVisible(false)}
                visible={avatarVisible}
              />
              <TouchableHighlight
                underlayColor={colors.light2}
                onPress={() => setAvatarVisible(true)}
                style={{
                  backgroundColor: colors.black,
                  borderRadius: 100,
                  bottom: 50,
                  marginLeft: 10,
                }}
                // activeOpacity={0.7}
              >
                <Image
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 100,
                    backgroundColor: colors.darkSeparator,
                    //   marginTop: 100,
                  }}
                  source={{ uri: user?.photos?.avatar[0]?.uri }}
                />
              </TouchableHighlight>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 10,
                  marginLeft: 20,
                  height: 30,
                }}
              >
                <Chip
                  elevation={1}
                  icon={() => (
                    <MaterialIcons
                      name="ios-share"
                      size={20}
                      color={colors.black2}
                    />
                  )}
                  textStyle={
                    {
                      // color: colors.white,
                    }
                  }
                  style={{
                    backgroundColor: colors.white,
                    // paddingHorizontal: 2,
                    // marginHorizontal: 10,
                    borderRadius: 12,
                  }}
                  onPress={() => console.log("Pressed")}
                >
                  Partilhar
                </Chip>

                <Chip
                  elevation={1}
                  icon={() => (
                    <Foundation
                      name="pencil"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                  textStyle={
                    {
                      // color: colors.white,
                    }
                  }
                  style={{
                    backgroundColor: colors.white,
                    // paddingHorizontal: 2,
                    marginHorizontal: 10,
                    borderRadius: 12,
                  }}
                  onPress={() => setModalVisible(true)}
                >
                  Editar
                </Chip>
              </View>
            </View>
            {/* </View> */}
            <View style={styles.container}>
              <Text style={{ fontSize: 21, fontWeight: "600" }}>
                {user?.displayName}
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                @{user?.username}
              </Text>
              {user?.userDescription && (
                <ViewMoreText
                  style={{ marginTop: 15 }}
                  numberOfLines={6}
                  renderViewMore={renderViewMore}
                  renderViewLess={renderViewLess}
                  textStyle={{ textAlign: "left", fontSize: 15 }}
                >
                  {user?.userDescription}
                </ViewMoreText>
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                {user?.socials?.face && (
                  <TouchableOpacity style={{ marginRight: 15 }}>
                    <AntDesign
                      name="facebook-square"
                      size={26}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                )}

                {user?.socials?.insta && (
                  <TouchableOpacity style={{ marginRight: 15 }}>
                    <AntDesign
                      name="instagram"
                      size={26}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                )}
                {user?.socials?.twitter && (
                  <TouchableOpacity style={{ marginRight: 15 }}>
                    <AntDesign
                      name="twitter"
                      size={27}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                )}
                {user?.medias?.spotify && (
                  <TouchableOpacity style={{ marginRight: 15 }}>
                    <Entypo name="spotify" size={27} color={colors.primary} />
                  </TouchableOpacity>
                )}
                {user?.medias?.appleMusic && (
                  <TouchableOpacity style={{ marginRight: 15 }}>
                    <Fontisto
                      name="applemusic"
                      size={25}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                )}
                {user?.medias?.youtube && (
                  <TouchableOpacity style={{ marginRight: 15 }}>
                    <Fontisto
                      name="youtube-play"
                      size={24}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {/* <View style={styles.separator} /> */}
            </View>
          </>
        }
        renderItem={({ item }) => {
          // return (
          //   <TouchableOpacity
          //     style={{
          //       borderRadius: 10,
          //       padding: 10,
          //       marginBottom: 12,
          //       backgroundColor: colors.white,
          //       shadowOffset: { width: 1, height: 1 },
          //       shadowOpacity: 0.3,
          //       shadowRadius: 1,
          //       elevation: 1,
          //       bottom: 50,
          //       width: "95%",
          //       alignSelf: "center",
          //     }}
          //   >
          //     <Text
          //       style={{
          //         color: colors.black,
          //         marginBottom: 3,
          //         fontWeight: "500",
          //         fontSize: 15,
          //       }}
          //     >
          //       {item?.date}
          //     </Text>
          //     <Text
          //       style={{
          //         color: colors.primary,
          //         marginBottom: 3,
          //         fontWeight: "500",
          //         fontSize: 16,
          //       }}
          //     >
          //       {item?.title}
          //     </Text>
          //     <Text
          //       style={{
          //         color: colors.black2,
          //         marginBottom: 3,
          //         fontWeight: "500",
          //         fontSize: 15,
          //       }}
          //     >
          //       {item?.promoter}
          //     </Text>
          //   </TouchableOpacity>
          // );
        }}
      />
      <Modal
        onRequestClose={() => {
          setModalVisible(false), setAvatarUri(null);
          setCoverUri(null);
        }}
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{
              padding: 10,
              left: 10,
              // alignSelf: "flex-end",
              // position: "absolute",
              // marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Cancelar
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              // color: colors.primary,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Editar Perfil
          </Text>
          {/* {(userInitialInfo != userInfo || avatarUri || coverUri) && ( */}
          <TouchableOpacity
            disabled={!(userInitialInfo != userInfo || avatarUri || coverUri)}
            onPress={saveChanges}
            style={{
              padding: 10,
              right: 10,
              alignSelf: "flex-end",
              // position: "absolute",
              // marginBottom: 10,
              opacity:
                userInitialInfo != userInfo || avatarUri || coverUri ? 1 : 0,
            }}
          >
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
          {/* )} */}
        </View>
        <ScrollView
          contentContainerStyle={{ backgroundColor: colors.background }}
          style={{ backgroundColor: colors.background }}
        >
          <TouchableOpacity
            onPress={() => photoInput(setCoverUri)}
            style={{
              backgroundColor: colors.black,

              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={0.9}
          >
            <MaterialCommunityIcons
              style={{ position: "absolute", zIndex: 2 }}
              name="camera-plus-outline"
              size={24}
              color={colors.white}
            />
            <Image
              style={{
                height: 150,
                width: "100%",
                backgroundColor: colors.darkGrey,
              }}
              source={{
                uri: coverUri
                  ? coverUri
                  : user?.photos?.cover[0]?.uri
                  ? user?.photos?.cover[0]?.uri
                  : " ",
              }}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              underlayColor={colors.light2}
              onPress={() => photoInput(setAvatarUri)}
              style={{
                position: "absolute",
                backgroundColor: colors.black,
                borderRadius: 100,
                bottom: 0,
                marginLeft: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
              // activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                style={{ position: "absolute", zIndex: 2 }}
                name="camera-plus-outline"
                size={24}
                color={colors.white}
              />
              <Image
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 100,
                  backgroundColor: colors.darkSeparator,

                  //   marginTop: 100,
                }}
                source={{ uri: avatarUri ?? user?.photos?.avatar[0]?.uri }}
              />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
                marginLeft: 20,
                height: 30,
              }}
            ></View>
          </View>
          <View style={styles.modalContainer}>
            <TextInput
              // error={!firstAt}
              style={{ marginBottom: 5, backgroundColor: colors.background }}
              // autoFocus
              mode="outlined"
              activeOutlineColor={colors.primary}
              underlineStyle={{ backgroundColor: colors.primary }}
              outlineColor={colors.primary}
              // contentStyle={{  fontWeight: "500",borderColor:"red" }}
              label="Nome"
              defaultValue={user?.displayName}
              activeUnderlineColor={colors.primary}
              value={userInfo?.displayName}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, displayName: text })
              }
            />
            <TextInput
              // error={!firstAt}
              style={{ marginBottom: 5, backgroundColor: colors.background }}
              // autoFocus
              mode="outlined"
              activeOutlineColor={colors.primary}
              underlineStyle={{ backgroundColor: colors.primary }}
              outlineColor={colors.primary}
              // contentStyle={{  fontWeight: "500",borderColor:"red" }}
              multiline
              label="Descrição"
              activeUnderlineColor={colors.primary}
              value={userInfo?.userDescription}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, userDescription: text })
              }
            />
            <TextInput
              // error={!firstAt}
              style={{ marginBottom: 5, backgroundColor: colors.background }}
              // autoFocus
              mode="outlined"
              activeOutlineColor={colors.primary}
              underlineStyle={{ backgroundColor: colors.primary }}
              outlineColor={colors.primary}
              // contentStyle={{  fontWeight: "500",borderColor:"red" }}
              label="Telefone"
              // defaultValue={userInfo?.phone[0]?.number}
              activeUnderlineColor={colors.primary}
              // value={userInfo?.phone[0]?.number}
              onChangeText={(text) =>
                setUserInfo({
                  ...userInfo,
                  phone: [{ id: uuidKey, number: text }],
                })
              }
            />
            <Text
              style={{
                fontSize: 19,
                color: colors.primary,
                fontWeight: "500",
                marginLeft: 20,
                // marginRight: 10,
                marginVertical: 10,
              }}
            >
              Sociais
            </Text>
            <TextInput
              // error={!firstAt}
              style={{ marginBottom: 5, backgroundColor: colors.background }}
              // autoFocus
              mode="outlined"
              activeOutlineColor={colors.primary}
              underlineStyle={{ backgroundColor: colors.primary }}
              outlineColor={colors.primary}
              // contentStyle={{  fontWeight: "500",borderColor:"red" }}
              label="Facebook"
              activeUnderlineColor={colors.primary}
              value={userInfo?.socials?.face}
              onChangeText={(text) =>
                setUserInfo({
                  ...userInfo,
                  socials: { ...userInfo.socials, face: text },
                })
              }
            />
            <TextInput
              // error={!firstAt}
              style={{ marginBottom: 5, backgroundColor: colors.background }}
              // autoFocus
              mode="outlined"
              activeOutlineColor={colors.primary}
              underlineStyle={{ backgroundColor: colors.primary }}
              outlineColor={colors.primary}
              // contentStyle={{  fontWeight: "500",borderColor:"red" }}
              label="Instagram"
              activeUnderlineColor={colors.primary}
              value={userInfo?.socials?.insta}
              onChangeText={(text) =>
                setUserInfo({
                  ...userInfo,
                  socials: { ...userInfo.socials, insta: text },
                })
              }
            />
            <TextInput
              // error={!firstAt}
              style={{ marginBottom: 5, backgroundColor: colors.background }}
              // autoFocus
              mode="outlined"
              activeOutlineColor={colors.primary}
              underlineStyle={{ backgroundColor: colors.primary }}
              outlineColor={colors.primary}
              // contentStyle={{  fontWeight: "500",borderColor:"red" }}
              label="Twitter"
              activeUnderlineColor={colors.primary}
              value={userInfo?.socials?.twitter}
              onChangeText={(text) =>
                setUserInfo({
                  ...userInfo,
                  socials: { ...userInfo.socials, twitter: text },
                })
              }
            />
            <TextInput
              // error={!firstAt}
              style={{ marginBottom: 5, backgroundColor: colors.background }}
              // autoFocus
              mode="outlined"
              activeOutlineColor={colors.primary}
              underlineStyle={{ backgroundColor: colors.primary }}
              outlineColor={colors.primary}
              // contentStyle={{  fontWeight: "500",borderColor:"red" }}
              label="TikTok"
              activeUnderlineColor={colors.primary}
              value={userInfo?.socials?.tiktok}
              onChangeText={(text) =>
                setUserInfo({
                  ...userInfo,
                  socials: { ...userInfo.socials, tiktok: text },
                })
              }
            />
            <Text
              style={{
                fontSize: 19,
                color: colors.primary,
                fontWeight: "500",
                marginLeft: 20,
                // marginRight: 10,
                marginVertical: 10,
              }}
            >
              Mídias
            </Text>
            <TextInput
              // error={!firstAt}
              style={{ marginBottom: 5, backgroundColor: colors.background }}
              // autoFocus
              mode="outlined"
              activeOutlineColor={colors.primary}
              underlineStyle={{ backgroundColor: colors.primary }}
              outlineColor={colors.primary}
              // contentStyle={{  fontWeight: "500",borderColor:"red" }}
              label="Spotify"
              activeUnderlineColor={colors.primary}
              value={userInfo?.medias?.spotify}
              onChangeText={(text) =>
                setUserInfo({
                  ...userInfo,
                  medias: { ...userInfo.medias, spotify: text },
                })
              }
            />
            <TextInput
              // error={!firstAt}
              style={{ marginBottom: 5, backgroundColor: colors.background }}
              // autoFocus
              mode="outlined"
              activeOutlineColor={colors.primary}
              underlineStyle={{ backgroundColor: colors.primary }}
              outlineColor={colors.primary}
              // contentStyle={{  fontWeight: "500",borderColor:"red" }}
              label="Apple Music"
              activeUnderlineColor={colors.primary}
              value={userInfo?.medias?.appleMusic}
              onChangeText={(text) =>
                setUserInfo({
                  ...userInfo,
                  medias: { ...userInfo.medias, appleMusic: text },
                })
              }
            />
            <TextInput
              // error={!firstAt}
              style={{ marginBottom: 5, backgroundColor: colors.background }}
              // autoFocus
              mode="outlined"
              activeOutlineColor={colors.primary}
              underlineStyle={{ backgroundColor: colors.primary }}
              outlineColor={colors.primary}
              // contentStyle={{  fontWeight: "500",borderColor:"red" }}
              label="Youtube"
              activeUnderlineColor={colors.primary}
              value={userInfo?.medias?.youtube}
              onChangeText={(text) =>
                setUserInfo({
                  ...userInfo,
                  medias: { ...userInfo.medias, youtube: text },
                })
              }
            />
            <View style={{ marginBottom: 50 }} />
          </View>
        </ScrollView>
        <BlockModal active={loading} />
      </Modal>
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    bottom: 50,
    backgroundColor: colors.background,
  },
  headerContainer: {
    position: "absolute",
    zIndex: 1,
    height: 40,
    width: "100%",
    // backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: {
    marginLeft: 15,
    top: 40,
  },
  share_like: {
    flexDirection: "row",
    justifyContent: "space-around",
    top: 40,
    marginRight: 20,
  },
  share: {
    marginRight: 10,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: colors.grey,
    marginVertical: 5,
    alignSelf: "center",
  },
  more: {
    position: "absolute",

    backgroundColor: colors.background,
    color: colors.primary,
    alignSelf: "flex-end",
    fontWeight: "500",
    // marginBottom: 5,
    right: -7,
    bottom: -10,

    zIndex: 1,
  },

  modalContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.background,
    // bottom:10,
  },
});
