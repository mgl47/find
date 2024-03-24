import React, { useEffect } from "react";
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
const { width, height } = Dimensions.get("window");

async function photoInput( setUri ) {
  try {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      // Handle the case where the permission is not granted

      Alert.alert(
        "Ativar permissão!",
        "Você precisa ativar a permissão para acessar a galeria de fotos!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 0.2,
      allowsEditing:true
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map((asset) => asset.uri);
      setUri(selectedUris[0]);
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
}

export default photoInput;

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
