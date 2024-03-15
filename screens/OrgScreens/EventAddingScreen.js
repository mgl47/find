import React, { useState, useEffect, useRef } from "react";

import {
  Switch,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
  TouchableWithoutFeedback,
  Platform,
  FlatList,
  Modal,
} from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome,
  AntDesign,
  Entypo,
  Ionicons,
  Feather,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { v4 as uuidv4 } from "uuid";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colors from "../../components/colors";
import ImageImputList from "../../components/ImageInputs/ImageImputList";

// import ImageImputList from "../../components/ImagesInput/ImageImputList";

// import { useAuth } from "../../hooks/useAuth";
// import { db, storage } from "../../firebase";
// import {
//   serverTimestamp,
//   setDoc,
//   doc,
//   updateDoc,
//   collection,
//   getDoc,
// } from "firebase/firestore";
// import {
//   getStorage,
//   uploadBytesResumable,
//   getDownloadURL,
//   uploadString,
//   uploadBytes,
//   ref,
//   deleteObject,
//   listAll,
// } from "firebase/storage";

// import * as Notifications from "expo-notifications";

// import axios from "axios";

function EventAddingScreen({ navigation, route, navigation: { goBack } }) {
  //   const { user, token } = useAuth();

  // const url = "http://192.168.1.10:8000";

  const [marker, setMarker] = useState(null);

  const Profile = route.params;

  const Operadoras = [
    { label: "Nenhuma", value: "Nenhuma" },
    { label: "play", value: "play" },
    { label: "swag", value: "swag" },
  ];
  const Condition = ["Novo", "Usado"];
  //---------error messages
  const [phoneError1, setPhoneError1] = useState(false);
  const [phoneError2, setPhoneError2] = useState(false);

  const [category, setCategory] = useState("");
  const [sub, setSub] = useState("");
  const [subType, setSubType] = useState("");
  const [subType2, setSubType2] = useState("");
  const [subType3, setSubType3] = useState("");
  const [subType4, setSubType4] = useState("");
  const [subType5, setSubType5] = useState("");
  const [subType6, setSubType6] = useState("");
  const [subType7, setSubType7] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [titleError, setTitleError] = useState(true);
  const [descriptionError, setDescriptionError] = useState(true);
  const [isValid, setIsValid] = useState(true);

  const [phone1, setPhone1] = useState(0);
  const [phone2, setPhone2] = useState([]);
  const [imageUris, setImageUris] = useState([]);

  const [price, setPrice] = useState(0);
  const [priceError, setPriceError] = useState(true);
  const [showPrice, setShowPrice] = useState(false);
  const [negociable, setNegociable] = useState(false);
  const [island, setIsland] = useState("");

  const [city, setCity] = useState("");
  const [showZone, setShowZone] = useState(false);

  const [zone, setZone] = useState("");

  const [addPhone, setAddPhone] = useState(false);
  const [addEmail, setAddEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  useEffect(() => {
    if (loading) {
      setBlockModal(true);
    } else {
      setBlockModal(false);
    }
  }, [loading]);

  const inputRef1 = useRef(null);

  const handleAdd = (uris) => {
    if (imageUris.length + uris.length <= 7) {
      setImageUris([...imageUris, ...uris]); // Update to handle array of URIs
    } else {
      showMessage({
        message: "Cannot add more than 7 images",
        type: "warning",
        floating: true,
        animationDuration: 400,
        backgroundColor: colors.secondary,
      });
    }
  };
  const handleRemove = (uri) => {
    setImageUris(imageUris.filter((imageUri) => imageUri !== uri));
  };

  // let banner = []; // Initialize as an empty array
  let photos = []; // Initialize as an empty array
  let resizedPhotos = [];
  let resizedThumb = [];
  let resizedChatThumb = [];
  let resizedSavingThumb = [];
  let resized1Photo = [];
  let resizedBannerURL = [];
  let resizedPhotosArray = [];

  const updatePhotos = async () => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      for (let i = 0; i < imageUris.length; i++) {
        const fileName = imageUris[i].split("/").pop();
        const resizedFileName = `${fileName.split(".")[0]}_1000x1000.${
          fileName.split(".")[1]
        }`;
        const resizedThumbFileName = `${fileName.split(".")[0]}_600x600.${
          fileName.split(".")[1]
        }`;
        const resizedChatThumbFileName = `${fileName.split(".")[0]}_100x100.${
          fileName.split(".")[1]
        }`;
        const resizedSavingThumbFileName = `${fileName.split(".")[0]}_300x300.${
          fileName.split(".")[1]
        }`;

        const resizedStorageRef = ref(
          storage,
          `marketStorage/${uuidKey}/${resizedFileName}`
        );
        const resizedThumbStorageRef = ref(
          storage,
          `marketStorage/${uuidKey}/${resizedThumbFileName}`
        );
        const resizedchatThumbStorageRef = ref(
          storage,
          `marketStorage/${uuidKey}/${resizedChatThumbFileName}`
        );
        const resizedSavingThumbStorageRef = ref(
          storage,
          `marketStorage/${uuidKey}/${resizedSavingThumbFileName}`
        );

        let resizedDownloadURL;
        let resizedThumbDownloadURL;
        let resizedChatThumbDownloadURL;
        let resizedSavingThumbURL;
        try {
          resizedDownloadURL = await getDownloadURL(resizedStorageRef);
          resizedThumbDownloadURL = await getDownloadURL(
            resizedThumbStorageRef
          );
          resizedChatThumbDownloadURL = await getDownloadURL(
            resizedchatThumbStorageRef
          );
          resizedSavingThumbURL = await getDownloadURL(
            resizedSavingThumbStorageRef
          );
        } catch (error) {
          console.log(`Error retrieving URLs for image ${i}: ${error.message}`);
          // Use the resized image URL as a fallback
        }

        resizedPhotos = [
          ...resizedPhotos,
          {
            id: 1 + i,
            uri: resizedDownloadURL,
          },
        ];
        resizedThumb = [
          ...resizedThumb,
          {
            id: 1 + i,
            uri: resizedThumbDownloadURL,
          },
        ];
        resizedChatThumb = [
          ...resizedChatThumb,
          {
            id: 1 + i,
            uri: resizedChatThumbDownloadURL,
          },
        ];
        resizedSavingThumb = [
          ...resizedSavingThumb,
          {
            id: 1 + i,
            uri: resizedSavingThumbURL,
          },
        ];

        // const listingDocRef = doc(db, "Market", uuidKey);
        // const newData = {
        //   photos: resizedPhotos, // Add the resized photos to the document data
        //   // userId: user.uid,
        // };
        // await updateDoc(listingDocRef, newData);
        // console.log("Resized photos updated successfully");
      }
    } catch (error) {
      console.log(error);
      //   showMessage({
      //     message: "Houve um erro ao processar o seu anúncio!",
      //     type: "info",
      //     floating: "true",
      //     animationDuration: 400,
      //     backgroundColor: colors.secondary,
      //   });
    }
  };

  const uploadPhotos = async () => {
    try {
      for (let i = 0; i < imageUris.length; i++) {
        const fileName = imageUris[i].split("/").pop();
        const storageRef = ref(storage, `marketStorage/${uuidKey}/${fileName}`);
        console.log("photo filename");
        //   await new Promise((resolve) => setTimeout(resolve, 1500));
        const blob = await fetch(imageUris[i]).then((response) =>
          response.blob()
        );
        console.log("photo blob");
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        const uploadTask = uploadBytesResumable(storageRef, blob);
        console.log("photo uploaded");
        const downloadURL = await new Promise((resolve, reject) => {
          uploadTask.on("state_changed", null, reject, () => {
            getDownloadURL(storageRef).then(resolve).catch(reject);
          });
          console.log("photo typeUrl");
        });

        photos = [...photos, { id: 1 + i, uri: downloadURL }];
        console.log(`${i + 1} done`);
      }
      console.log("upload succ"); // You can use the downloadURL here if needed
    } catch (error) {
      console.log(error);
      showMessage({
        message: "Houve um erro ao processar o seu anúncio!",
        type: "info",
        floating: "true",
        animationDuration: 400,
        backgroundColor: colors.secondary,
      });
    }
  };
  // console.log(imageUris.length);
  function validateEmail(text) {
    // Regular expression to match email format
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(regex.test(text));
    setEmail(text);
  }

  const handleTitle = (inputValue) => {
    if (inputValue.length < 5) {
      setTitleError(true);
    } else {
      setTitleError("");
    }
    setTitle(inputValue);
  };
  const handleDescription = (inputValue) => {
    if (inputValue.length < 10) {
      setDescriptionError(true);
    } else {
      setDescriptionError("");
    }
    setDescription(inputValue);
  };

  const handlePhoneNumberChange1 = (inputValue) => {
    if (
      (inputValue.length > 0 &&
        (!/^[0-9]+$/.test(inputValue) ||
          (inputValue[0] !== "2" &&
            inputValue[0] !== "9" &&
            inputValue[0] !== "5"))) ||
      (inputValue.length > 0 && inputValue.length != 7)
    ) {
      setPhoneError1(true);
    } else {
      setPhoneError1(false);
    }
    setPhone1(inputValue);
  };

  const handlePhoneNumberChange2 = (inputValue) => {
    if (
      (inputValue.length > 0 &&
        (!/^[0-9]+$/.test(inputValue) ||
          (inputValue[0] !== "2" &&
            inputValue[0] !== "9" &&
            inputValue[0] !== "5"))) ||
      (inputValue.length > 0 && inputValue.length !== 7)
    ) {
      setPhoneError2(true);
    } else {
      setPhoneError2(false);
    }
    setPhone2(inputValue);
  };

  const handlePriceChange = (inputValue) => {
    if (
      (inputValue.length > 0 && !/^[0-9]+$/.test(inputValue)) ||
      inputValue[0] == 0 ||
      inputValue <= 0
    ) {
      setPriceError(true);
    } else {
      setPriceError(false);
    }
    setPrice(inputValue);
  };

  if (typeof number === "number") {
    const stringNumber = number.toString();
    if (stringNumber.includes(",") || stringNumber.includes(".")) {
      // Use the number as-is if it contains a comma or period
      result = stringNumber;
    } else {
      // Format the number with commas
      const parts = stringNumber.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (parts[1]) {
        result = parts.join(".");
      } else {
        result = parts[0];
      }
    }
  } else {
    result = "Invalid number";
  }

  // const getIp = () => {
  //   publicIP()
  //     .then((ip) => {
  //       console.log(ip);
  //       // '47.122.71.234'
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       //
  //     });
  // };
  // getIp();
  //         "http://213.22.163.212/post",
  //         "${HEROKU_URL}/Market/newMarket",

  const phoneWifi = "172.20.10.8";

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      enableOnAndroid={true}
      // contentContainerStyle={[
      //   styles.container,
      //   { backgroundColor: colors.light },
      // ]}
      extraScrollHeight={100}
      keyboardShouldPersistTaps={"handled"}
    >
      <ImageImputList
        imageUris={imageUris}
        onAddImage={handleAdd}
        onRemoveImage={handleRemove}
      />

      {imageUris.length < 1 ? (
        <Text style={styles.errorMessage}>Escolha de 1 a 7 fotos!</Text>
      ) : null}

      <TextInput
        textColor={colors.black}
        placeholderTextColor={colors.description}
        backgroundColor={colors.light2}
        placeholder={"Título"}
        onChangeText={handleTitle}
        returnKeyType="done"
        width={"90%"}
        padding={15}
        maxLength={100}
        onSubmitEditing={() => inputRef1.current.focus()}
      />

      <TextInput
        style={[styles.imput, { color: colors.black }]}
        placeholderTextColor={colors.description}
        backgroundColor={colors.light2}
        placeholder={"Descrição"}
        numberOfLines={5}
        maxLength={2000}
        multiline
        width={"90%"}
        ref={inputRef1}
        onChangeText={handleDescription}
      />

      <View>
        <TextInput
          textColor={colors.black}
          placeholderTextColor={colors.description}
          backgroundColor={colors.light2}
          placeholder={"Preço"}
          keyboardType={"number-pad"}
          returnKeyType="done"
          onChangeText={handlePriceChange}
          maxLength={11}
          width={"60%"}
          padding={15}
        />
        {/* )} */}
        {priceError ? (
          <Text
            style={{
              color: "red",
              fontSize: 12,
              alignSelf: "center",
              bottom: -5,
              position: "absolute",
            }}
          >
            Insira um preço válido
          </Text>
        ) : null}
      </View>

      <View style={[styles.home, { backgroundColor: colors.light2 }]}>
        <FontAwesome
          name={"phone"}
          size={22}
          color={colors.secondary}
          style={[styles.icon, { left: 6 }]}
        />
        <Text
          style={[
            styles.hometext,
            {
              left: 18,
              color: colors.primary,
            },
          ]}
        >
          Adicionar número de telefone
        </Text>
        <Switch
          trackColor={{
            true: colors.primary,
          }}
          thumbColor={colors.white}
          style={styles.switchPhone}
          value={addPhone}
          onValueChange={(newValue) => setAddPhone(newValue)}
        />
      </View>

      {addPhone && (
        <>
          <View style={styles.phones}>
            <TextInput
              textColor={colors.black}
              placeholderTextColor={colors.description}
              backgroundColor={colors.light2}
              placeholder={"Número de telefone"}
              keyboardType={"phone-pad"}
              returnKeyType="done"
              onChangeText={handlePhoneNumberChange1}
              value={String(phone1)}
              maxLength={7}
              width={"60%"}
              padding={15}
            />
            <Dropdown
              style={styles.dropdown}
              containerStyle={[
                styles.dropdownContainer,
                {
                  borderColor: colors.grey,
                  backgroundColor: colors.light2,
                },
              ]}
              placeholderStyle={[
                styles.placeholderStyle,
                {
                  color: colors.darkGrey,
                },
              ]}
              selectedTextStyle={[
                styles.selectedTextStyle,
                { color: colors.darkGrey },
              ]}
              itemTextStyle={[
                styles.itemTextStyle,
                {
                  color: colors.black,
                },
              ]}
              activeColor={colors.grey}
              data={Operadoras}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Operadora"
              value={operadora1}
              onChange={(item) => {
                setOperadora1(item.value);
              }}
            />
          </View>
          {phoneError1 && (
            <Text style={styles.errorMessage}>
              Insira um número de telefone válido
            </Text>
          )}
          <View style={styles.phones}>
            <TextInput
              textColor={colors.black}
              placeholderTextColor={colors.description}
              backgroundColor={colors.light2}
              placeholder={"2° número de telefone"}
              keyboardType={"phone-pad"}
              returnKeyType="done"
              onChangeText={handlePhoneNumberChange2}
              // value={phone2}
              maxLength={7}
              width={"60%"}
              padding={15}
            />

            <Dropdown
              style={styles.dropdown}
              containerStyle={[
                styles.dropdownContainer,
                {
                  borderColor: colors.grey,
                  backgroundColor: colors.light2,
                },
              ]}
              placeholderStyle={[
                styles.placeholderStyle,
                {
                  color: colors.darkGrey,
                },
              ]}
              selectedTextStyle={[
                styles.selectedTextStyle,
                { color: colors.darkGrey },
              ]}
              itemTextStyle={[
                styles.itemTextStyle,
                {
                  color: colors.black,
                },
              ]}
              data={Operadoras}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Operadora"
              value={operadora2}
              onChange={(item) => {
                setOperadora2(item.value);
              }}
            />
          </View>
          {phoneError2 && (
            <Text style={styles.errorMessage}>
              {" "}
              Insira um número de telefone válido
            </Text>
          )}
        </>
      )}

      <View>
        {loading && (
          <View
            style={{
              flex: 1,
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              backgroundColor: "transparent",
              zIndex: 1,
              top: 10,
            }}
          >
            <ActivityIndicator color={colors.secondary} />
          </View>
        )}
        {/* <AppButton
                  alignSelf={"center"}
                  marginTop={50}
                  marginBottom={100}
                  style={[
                    styles.button1,
                    {
                      backgroundColor:  colors.white,
                      borderColor:  colors.primary,
                    },
                  ]}
                  color={ colors.primary}
                  title={"submeter"}
                  // onPress={() => {
                  //   ValidatePost();
                  // }}
                  disabled={loading}
                  onPress={ValidatePost}

                  // onPress={() => addToMongo(reloadMarket)}
                /> */}
      </View>

      <Modal
        visible={blockModal}
        animationType="slide"
        // presentationStyle="formSheet"
        transparent
      ></Modal>
    </KeyboardAwareScrollView>
  );
}

export default EventAddingScreen;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: colors.light,
  },

  imput: {
    backgroundColor: colors.light2,
    borderRadius: 15,
    alignSelf: "center",
    // width: 0,
    padding: 15,
    marginVertical: 10,
    height: 150,
    fontSize: 15,
    textAlignVertical: "top",
  },

  photos: {
    alignSelf: "center",
    width: 200,
    height: 150,
    borderRadius: 20,
  },
});
