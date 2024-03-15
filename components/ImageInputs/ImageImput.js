import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
// import { manipulateAsync } from "expo-image-manipulator";

import Screen from "../Screen";
import { Alert } from "react-native";
// import { showMessage } from "react-native-flash-message";
import colors from "../colors";

function ImageImput({ imageUri, onChangeImage, ...otherprops }) {
  // const { dd, height, darkMode } = useDesign();
  // useEffect(() => {
  //     requestPermission();
  //   }, []);

  // const requestPermission = async () => {
  //     const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (!granted) alert("Você precisa ativar a permissão para acessar a galeria de fotos!");
  //   };

  const handlePress = () => {
    if (!imageUri) selectImage();
    else
      Alert.alert("Excluir", "Tens certeza que deseja excluir esta imagem?", [
        { text: "Sim", onPress: () => onChangeImage(null) },
        { text: "Não" },
      ]);
  };
  const selectImage = async () => {
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        onChangeImage(selectedUris[0]);
      }
    } catch (error) {
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
    <TouchableWithoutFeedback onPress={handlePress}>
      <View
        style={[
          styles.container,
          {
            // height: height * 0.24,

            // width: width * 0.88,
          
            backgroundColor: colors.light2,
            borderColor: colors.description,
          },
          { ...otherprops },
        ]}
      >
        {!imageUri && (
          <Ionicons
            name={"add-circle-outline"}
            size={40}
            color={colors.secondary}
            style={styles.icon}
          />
        )}
        {imageUri && <Image style={styles.photos} source={{ uri: imageUri }} />}
      </View>
    </TouchableWithoutFeedback>
  );
}

export default ImageImput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light2,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 15,
    overflow: "hidden",
    borderWidth: 0.3,
  },
  photos: {
    // alignSelf: "center",
    dd: "100%",
    height: "100%",

    //  borderRadius: 20,
  },
});
