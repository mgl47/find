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

function ImageImput({ imageUri, onChangeImage, ...otherprops }) {
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
    <TouchableOpacity
    activeOpacity={0.7}
      onPress={handlePress}
      style={[
        styles.container,
        {
          height: height * 0.3,

          width: width,

          backgroundColor: colors.background2,
          borderColor: colors.description,
        },
        { ...otherprops },
      ]}
    >
      {!imageUri && (
        <View>
          <Ionicons
            name={"add-circle-outline"}
            size={40}
            color={colors.t4}
            style={styles.icon}
          />
        </View>
      )}
      {imageUri && (
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

          <Image style={styles.photos} source={{ uri: imageUri }} />
        </>
      )}
    </TouchableOpacity>
  );
}

export default ImageImput;

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
