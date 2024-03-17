import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome6,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import Screen from "../Screen";
import { Alert } from "react-native";
import colors from "../colors";
// import { showMessage } from "react-native-flash-message";
import VideoPlayer from "expo-video-player";

const { width, height } = Dimensions.get("window");

function VideoImput({ videoUri, onChangeVideo, ...otherprops }) {
  // useEffect(() => {
  //     requestPermission();
  //   }, []);

  // const requestPermission = async () => {
  //     const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (!granted) alert("Você precisa ativar a permissão para acessar a galeria de fotos!");
  //   };
  const [isMute, setIsMute] = useState(true);
  const videoRef = React.useRef(null);

  const handlePress = () => {
    if (!videoUri) selectVideo();
    else
      Alert.alert("Excluir", "Tens certeza que deseja excluir esta imagem?", [
        { text: "Sim", onPress: () => onChangeVideo(null) },
        { text: "Não" },
      ]);
  };
  const selectVideo = async () => {
    try {
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        // Handle the case where the permission is not granted

        Alert.alert(
          "Ativar permissão!",
          "Você precisa ativar a permissão para acessar a galeria de fotos!"
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        // mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        aspect: [4, 3],
        quality: 0.2,

        // allowsMultipleSelection: true,
      });

      //   if (!result.canceled) {
      //     console.log(result.assets.map((item) => item.uri));
      //     // onChangeImage(result.assets[0].uri);
      //  onChangeImage(result.assets.map((item) => item.uri.toString()));
      //   }
      if (!result.canceled) {
        const selectedUris = result.assets.map((asset) => asset.uri);
        onChangeVideo(selectedUris[0]);
      }
    } catch (error) {
      console.log(error);
      // showMessage({
      //   message: "Erro ao carregar a foto!",
      //   type: "warning",
      //   floating: true,
      //   animationDuration: 400,
      //   backgroundColor: colors.secondary,
      // });
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          height: height * 0.35,

          width: width,

          backgroundColor: colors.light2,
          borderColor: colors.description,
        },
        { ...otherprops },
      ]}
    >
      {!videoUri && (
        <TouchableOpacity onPress={handlePress}>
          <Ionicons
            name={"add-circle-outline"}
            size={40}
            color={colors.primary}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
      {
        videoUri && (
          <>
            <TouchableOpacity
              style={{
                position: "absolute",
                zIndex: 1,
                top: 10,
                right: 10,
                shadowOffset: { width: 0.5, height: 0.5 },
                shadowOpacity: 0.3,
                shadowRadius: 1,
                elevation: 2,
                backgroundColor: colors.black,
                borderRadius: 50,
                padding: 10,
              }}
              onPress={handlePress}
            >
              <FontAwesome6 name="trash-can" size={18} color={colors.white} />
            </TouchableOpacity>
            <VideoPlayer
              mute={{
                visible: true,
                enterMute: () => setIsMute(true),
                exitMute: () => setIsMute(false),
                isMute: isMute,
              }}
              style={{
                videoBackgroundColor: "black",
                height: height * 0.35,
                width: width,
              }}
              videoProps={{
                ref: videoRef,
                source: {
                  uri: videoUri,
                },

                // source: require("../assets/rolling.mp4"),
                resizeMode: "cover",
                // useNativeControls
                isMuted: isMute,
                shouldPlay: true,
                isLooping: true,
              }}
            />
          </>
        )

        // <Image style={styles.photos} source={{ uri: videoUri }} />
      }
    </View>
  );
}

export default VideoImput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light2,
    // borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    // margin: 10,
    overflow: "hidden",
    // borderWidth: 0.3,
  },
  photos: {
    // alignSelf: "center",
    width: "100%",
    height: "100%",

    //  borderRadius: 20,
  },
});
