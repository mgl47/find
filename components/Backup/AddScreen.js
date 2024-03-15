import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
  } from "react";
  
  import {
    Switch,
    View,
    StyleSheet,
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
  import uuid from "react-native-uuid";
  
  import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
  import colors from "../../components/colors";
  import ImageImputList from "../../components/ImageInputs/ImageImputList";
  import { TextInput } from "react-native-paper";
  import { TicketsSheet } from "../../components/screensComponents/CompAddingScreen";
  
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
    const [ticketsSheetup, setTicketsSheetup] = useState(false);
    const ticketsSheetRef = useRef(null);
    const [tickets, setTickets] = useState([]);
    const handleTicketSheet = useCallback(() => {
      setTicketsSheetup(true);
  
      ticketsSheetRef.current?.present();
    }, []);
  
    const deleteTicket = (ticket) => {
      const updatedTickets = tickets?.filter((item) => item.id != ticket.id);
      setTickets(updatedTickets);
    };
  
    const [marker, setMarker] = useState(null);
  
    const Profile = route.params;
  
    const Operadoras = [
      { label: "Nenhuma", value: "Nenhuma" },
      { label: "play", value: "play" },
      { label: "swag", value: "swag" },
    ];
    //---------error messages
    const [phoneError1, setPhoneError1] = useState(false);
    const [phoneError2, setPhoneError2] = useState(false);
    const [category, setCategory] = useState("");
  
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
  
    const [showZone, setShowZone] = useState(false);
  
    const [addPhone, setAddPhone] = useState(false);
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
      console.log(uris?.length);
  
      if (imageUris.length + uris.length <= 7) {
        setImageUris([...imageUris, ...uris]); // Update to handle array of URIs
      } else {
        console.log("Cannot add more than 7 images");
        // showMessage({
        //   message: "Cannot add more than 7 images",
        //   type: "warning",
        //   floating: true,
        //   animationDuration: 400,
        //   backgroundColor: colors.secondary,
        // });
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
        // style={{ flex: 1 }}
        enableOnAndroid={true}
        contentContainerStyle={[
          styles.container,
  
          // { backgroundColor: colors.light },
        ]}
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
  
        {/* <TextInput
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
        /> */}
        <TextInput
          error={!title}
          style={{ marginBottom: 5 }}
          // autoFocus
          underlineStyle={{ backgroundColor: colors.primary }}
          contentStyle={{ backgroundColor: colors.background, fontWeight: "500" }}
          label="título"
          activeUnderlineColor={colors.primary}
          value={title}
          cursorColor={colors.primary}
          // onChangeText={(text) => setPerson({ ...person, email: text })}
          onChangeText={setTitle}
        />
  
        <TextInput
          error={!title}
          style={{ marginBottom: 20, backgroundColor: colors.background }}
          // autoFocus
          underlineStyle={{ backgroundColor: colors.primary }}
          contentStyle={{ backgroundColor: colors.background, fontWeight: "500" }}
          label="descrição"
          activeUnderlineColor={colors.primary}
          value={description}
          multiline
          cursorColor={colors.primary}
          // onChangeText={(text) => setPerson({ ...person, email: text })}
          onChangeText={setDescription}
        />
  
        <View style={[styles.switchContainer]}>
          <Text style={[styles.switchText, { color: colors.darkSeparator }]}>
            Evento Gratuito
          </Text>
          <Switch
            trackColor={{
              true: colors.primary,
            }}
            thumbColor={colors.white}
            style={styles.switch}
            value={showZone}
            onValueChange={(newValue) => setShowZone(newValue)}
          />
        </View>
        {tickets?.length > 0 && (
          <Text
            style={{
              fontSize: 19,
              color: colors.darkSeparator,
              fontWeight: "500",
              marginLeft: 20,
              // marginRight: 10,
              marginBottom: 10,
            }}
          >
            Bilhetes
          </Text>
        )}
        {tickets?.map((item) => {
          return (
            <>
              <View
                activeOpacity={0.5}
                style={{
                  shadowOffset: { width: 0.5, height: 0.5 },
                  shadowOpacity: 0.3,
                  shadowRadius: 1,
                  elevation: 2,
                  width: "100%",
                }}
                // onPress={() => navigation.navigate("event", item)}
              >
                <View style={styles.card}>
                  <View
                    style={{
                      width: "70%",
                      // backgroundColor: colors.light2,
                      padding: 10,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text numberOfLines={2} style={[styles.price]}>
                        cve {item?.price}
                      </Text>
                      <Text numberOfLines={2} style={[styles.priceType]}>
                        {item?.type}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          // position: "absolute",
                          // right: 5,
                          marginLeft: 20,
                        }}
                      >
                        <Text
                          numberOfLines={2}
                          style={{ fontSize: 15, color: colors.black2,marginRight:5 }}
                        >
                          Qtd:
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={{ fontSize: 15, color: colors.darkSeparator }}
                        >
                          {item?.amount}
                        </Text>
                      </View>
                    </View>
  
                    <Text style={styles.description}>{item?.description}</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: "flex-end",
                  paddingRight: 15,
                  marginBottom: 5,
                }}
              >
                <TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 15,
                      color: colors.primary,
                      fontWeight: "500",
                      marginRight: 10,
                    }}
                  >
                    Editar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTicket(item)}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: colors.primary,
                      fontWeight: "500",
                    }}
                  >
                    Apagar
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          );
        })}
        <View style={[styles.switchContainer]}>
          <Text style={[styles.switchText, { color: colors.darkSeparator }]}>
            Adicionar Bilhetes
          </Text>
          <TouchableOpacity style={styles.switch} onPress={handleTicketSheet}>
            <Ionicons
              name={"add-circle-outline"}
              size={40}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
  
        {/* <View>
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
        </View> */}
        {/* 
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
        </View> */}
  
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
  
        <TicketsSheet
          setTicketsSheetup={setTicketsSheetup}
          ticketsSheetRef={ticketsSheetRef}
          tickets={tickets}
          setTickets={setTickets}
        />
      </KeyboardAwareScrollView>
    );
  }
  
  export default EventAddingScreen;
  
  const styles = StyleSheet.create({
    container: {
      // backgroundColor: colors.light,
      padding: 10,
      flex: 1,
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
    switchContainer: {
      flexDirection: "row",
      marginBottom: 10,
      height: 40,
      width: "100%",
      // backgroundColor: colors.light2,
      alignItems: "center",
      // paddingHorizontal: 20,
  
      //padding: 10,
    },
    switch: {
      position: "absolute",
  
      right: 20,
    },
    switchText: {
      fontSize: 17,
      fontWeight: "500",
      alignSelf: "center",
      left: 10,
    },
    card: {
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
  
    price: {
      alignSelf: "flex-start",
      fontSize: 21,
      fontWeight: "600",
      color: colors.primary,
      lineHeight: 30,
      // width: "65%",
      // marginBottom: 5,
    },
    priceType: {
      alignSelf: "flex-start",
      fontSize: 15,
      fontWeight: "600",
      color: colors.description2,
      lineHeight: 30,
      // width: "65%",
      marginLeft: 20,
    },
  });
  