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
import { storage } from "../../firebase";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
  FontAwesome5,
  Feather,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";

import { ActivityIndicator, Checkbox, Chip } from "react-native-paper";
import * as Location from "expo-location";

import uuid from "react-native-uuid";

import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInput } from "react-native-paper";

import colors from "../../components/colors";
import ImageImputList from "../../components/ImageInputs/ImageImputList";
import axios from "axios";
import { useData } from "../../components/hooks/useData";
import { useAuth } from "../../components/hooks/useAuth";
import photoInput from "../../components/ImageInputs/photoInput";
const { height, width } = Dimensions.get("window");

const AddArtistScreen = ({ navigation: { goBack } }) => {
  const [loading, setLoading] = useState(false);
  const { apiUrl } = useData();
  const { headerToken } = useAuth();
  const [userId, setUserId] = useState(uuid.v4());
  const [avatarUri, setAvatarUri] = useState(null);
  const [coverUri, setCoverUri] = useState(null);

  const [newArtist, setNewArtist] = useState({
    displayName: "",
    userDescription: "",
    password: "pKJtRwQxES47UkMFfq6mvh",

    photos: {
      avatar: [],
      cover: [],
    },
    uuid: uuidKey,
    status: {
      label: "artist",
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
  const uuidKey = uuid.v4();
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
        `users/${userId}/photos/${type}/${resized1Name}`
      );
      const resized2Storage = ref(
        storage,
        `users/${userId}/photos/${type}/${resized2Name}`
      );
      const resized3Storage = ref(
        storage,
        `users/${userId}/photos/${type}/${resized3Name}`
      );
      const resized4Storage = ref(
        storage,
        `users/${userId}/photos/${type}/${resized4Name}`
      );

      const resized1Url = await getDownloadURL(resized1Storage);
      const resized2Url = await getDownloadURL(resized2Storage);
      const resized3Url = await getDownloadURL(resized3Storage);
      const resized4Url =
        type === "avatar" ? await getDownloadURL(resized4Storage) : null;

      resized1 = { id: uuid?.v4(), uri: resized1Url };
      resized2 = { id: uuid?.v4(), uri: resized2Url };
      resized3 = { id: uuid?.v4(), uri: resized3Url };
      if (type === "avatar") {
        resized4 = { id: uuid?.v4(), uri: resized4Url };
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
        `users/${userId}/photos/${type}/${fileName}`
      );
      const blob = await fetch(uri).then((response) => response.blob());
      await uploadBytesResumable(storageRef, blob);
    } catch (error) {
      console.log(`Error uploading ${type} photo: ${error.message}`);
      throw error;
    }
  };

  const addArtist = async () => {
    try {
      setLoading(true);
      const date = new Date();
      const fileName = `${
        newArtist?.username
      }_${date?.getDate()}_${date?.getMonth()}_${date?.getFullYear()}`;
      let updates = { ...newArtist };

      if (avatarUri) {
        await uploadPhoto(fileName, "avatar", avatarUri);
      }
      if (coverUri) {
        await uploadPhoto(fileName, "cover", coverUri);
      }

      // Add any necessary delay or wait for the upload to complete
      await new Promise((resolve) => setTimeout(resolve, 8000));

      let resizedAvatar, resizedCover;
      if (avatarUri) {
        resizedAvatar = await updatePhotos(fileName, "avatar");
        updates.photos.avatar = resizedAvatar;
      }
      if (coverUri) {
        resizedCover = await updatePhotos(fileName, "cover");
        updates.photos.cover = resizedCover;
      }

      const response = await axios.post(
        `${apiUrl}/user/current/`,
        {
          updates,
        },
        { headers: { Authorization: headerToken } }
      );
      console.log("hghfcs");

      if (response.status === 200) {
        goBack();
      }
    } catch (error) {
      console.log(error);
      console.log(error?.response?.data?.msg);
    }
    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAwareScrollView
        style={{ backgroundColor: colors.background, flex: 1 }}
      >
        <Text
          style={{
            fontSize: 19,
            fontWeight: "600",
            // padding: 5,
            left: 20,
            color: colors.primary,
            marginVertical: 10,
          }}
        >
          Fotos
        </Text>
        <View>
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
                uri: coverUri,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            underlayColor={colors.light2}
            onPress={() => photoInput(setAvatarUri)}
            style={{
              position: "absolute",
              backgroundColor: colors.black,
              borderRadius: 100,
              bottom: -40,
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
              source={{ uri: avatarUri }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ padding: 10, paddingTop: 50 }}>
          <TextInput
            //   error={!amount}
            style={{
              marginBottom: 5,
              backgroundColor: colors.background,
            }}
            // autoFocus
            underlineStyle={{ backgroundColor: colors.primary }}
            contentStyle={{}}
            outlineColor={colors.primary}
            mode="outlined"
            activeOutlineColor={colors.primary}
            label="nome de usuário"
            activeUnderlineColor={colors.primary}
            value={newArtist?.username}
            cursorColor={colors.primary}
            onChangeText={(text) =>
              setNewArtist({ ...newArtist, username: text })
            }
          />
          <TextInput
            //   error={!amount}
            style={{
              marginBottom: 5,
              backgroundColor: colors.background,
            }}
            // autoFocus
            underlineStyle={{ backgroundColor: colors.primary }}
            contentStyle={{}}
            outlineColor={colors.primary}
            mode="outlined"
            activeOutlineColor={colors.primary}
            label="Nome"
            activeUnderlineColor={colors.primary}
            value={newArtist?.displayName}
            cursorColor={colors.primary}
            onChangeText={(text) =>
              setNewArtist({ ...newArtist, displayName: text })
            }
          />
          <TextInput
            //   error={!amount}
            style={{ marginBottom: 5 }}
            // autoFocus
            underlineStyle={{ backgroundColor: colors.primary }}
            contentStyle={{}}
            outlineColor={colors.primary}
            mode="outlined"
            activeOutlineColor={colors.primary}
            label="Descrição"
            activeUnderlineColor={colors.primary}
            value={newArtist?.description}
            cursorColor={colors.primary}
            onChangeText={(text) =>
              setNewArtist({ ...newArtist, description: text })
            }
          />
          {/* <TextInput
            //   error={!amount}
            style={{
              marginBottom: 5,
              backgroundColor: colors.background,
            }}
            // autoFocus
            underlineStyle={{ backgroundColor: colors.primary }}
            contentStyle={{}}
            outlineColor={colors.primary}
            mode="outlined"
            activeOutlineColor={colors.primary}
            label="Telefone"
            keyboardType="number-pad"
            activeUnderlineColor={colors.primary}
            value={newArtist?.phone}
            cursorColor={colors.primary}
            onChangeText={(text) =>
              setNewArtist({ ...newArtist, phone: Number(text) })
            }
          /> */}
          {/* <TextInput
            //   error={!amount}
            style={{ marginBottom: 5 }}
            // autoFocus
            underlineStyle={{ backgroundColor: colors.primary }}
            contentStyle={{}}
            outlineColor={colors.primary}
            mode="outlined"
            activeOutlineColor={colors.primary}
            label="Cidade"
            activeUnderlineColor={colors.primary}
            value={newArtist?.address?.city}
            cursorColor={colors.primary}
            onChangeText={(text) =>
              setNewArtist({
                ...newArtist,
                address: { ...newArtist?.address, city: text },
              })
            }
          /> */}

          <TouchableOpacity
            onPress={addArtist}
            style={{
              alignSelf: "center",
              flexDirection: "row",
              height: 50,
              width: "90%",
              backgroundColor: colors.primary,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              shadowOffset: { width: 0.5, height: 0.5 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              elevation: 2,
              marginBottom: 15,
              marginTop: 10,
            }}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text
                style={{
                  color: colors.white,
                  marginLeft: 5,
                  fontSize: 17,
                  fontWeight: "500",
                }}
              >
                Adicionar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default AddArtistScreen;

const styles = StyleSheet.create({
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
});
