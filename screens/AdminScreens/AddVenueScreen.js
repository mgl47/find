import {
  Button,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PixelRatio,
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
import MapView, { Marker, Polygon } from "react-native-maps";
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
import { captureRef } from "react-native-view-shot";

const { height, width } = Dimensions.get("window");

const AddVenueScreen = ({ navigation: { goBack } }) => {
  const [loading, setLoading] = useState(false);
  const { apiUrl } = useData();
  const { headerToken, userLocation } = useAuth();
  const [newMarker, setNewMarker] = useState(0);
  const uuidKey = uuid.v4();

  const [newVenue, setNewVenue] = useState({ uuid: uuid.v4() });
  const [imageUris, setImageUris] = useState([]);

  const mapViewRef = useRef(null);
  const [mapLocation, setMapLocation] = useState({});
  const [region, setRegion] = useState({
    latitude: 14.905696,
    longitude: -23.519001,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [print, setPrint] = useState(null);
  const mapPrintRef = useRef(null);
  const takePrint = async () => {
    // const targetWidth = 1920; // Full HD width
    // const targetHeight = 1080; // Full HD height
    const targetWidth = 5200; // Full HD width
    const targetHeight = 4100; // Full HD height
    const pixelRatio = PixelRatio.get(); // The pixel ratio of the device

    // Calculate the target width and height based on the device's pixel ratio
    const width = targetWidth / pixelRatio;
    const height = targetHeight / pixelRatio;

    const result = await captureRef(mapViewRef, {
      result: "tmpfile",
      width: width,
      height: height,
      quality: 1,
      format: "jpg",
    });
    setPrint(result);
  };
  // setRegion(userLocation);
  useEffect(() => {
    takePrint();
  }, [region]);
  const getLocation = async () => {
    const location = await Location.reverseGeocodeAsync(region);
    const country = location?.[0]?.country;
    setMapLocation(location);
    setNewVenue({
      ...newVenue,
      address: { ...newVenue?.address, city: location?.[0]?.city },
    });
    setNewVenue({
      ...newVenue,
      address: { ...newVenue?.address, country: location?.[0]?.country },
    });
  };
  useEffect(() => {
    getLocation();
  }, [region]);

  let venue = newVenue;

  let photos = [];
  let videos = [];
  let resized1 = "";
  let resized2 = "";
  let resized3 = "";
  let resized4 = "";

  const updatePhotos = async () => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      for (let i = 0; i < imageUris.length; i++) {
        const fileName = imageUris[i].split("/").pop();
        const resized1Name = `${fileName.split(".")[0]}_800x800.${
          fileName.split(".")[1]
        }`;
        const resized2Name = `${fileName.split(".")[0]}_500x500.${
          fileName.split(".")[1]
        }`;
        const resized3Name = `${fileName.split(".")[0]}_300x300.${
          fileName.split(".")[1]
        }`;
        const resized4Name = `${fileName.split(".")[0]}_100x100.${
          fileName.split(".")[1]
        }`;

        const resized1Storage = ref(
          storage,
          `venues/${uuidKey}/photos/${resized1Name}`
        );
        const resized2Storage = ref(
          storage,
          `venues/${uuidKey}/photos/${resized2Name}`
        );
        const resized3Storage = ref(
          storage,
          `venues/${uuidKey}/photos/${resized3Name}`
        );
        const resized4Storage = ref(
          storage,
          `venues/${uuidKey}/photos/${resized4Name}`
        );

        let resized1Url;
        let resized2Url;
        let resized3Url;
        let resized4Url;
        try {
          resized1Url = await getDownloadURL(resized1Storage);
          resized2Url = await getDownloadURL(resized2Storage);
          resized3Url = await getDownloadURL(resized3Storage);
          resized4Url = await getDownloadURL(resized4Storage);
        } catch (error) {
          console.log(`Error retrieving URLs for image ${i}: ${error.message}`);
          // Use the resized image URL as a fallback
        }

        // resized1 = {
        //   id: uuid.v4(),
        //   uri: resized1Url,
        // };
        // resized2 = {
        //   id: uuid.v4(),
        //   uri: resized2Url,
        // };
        // resized3 = {
        //   id: uuid.v4(),
        //   uri: resized3Url,
        // };
        // resized4 = {
        //   id: uuid.v4(),
        //   uri: resized4Url,
        // };
        resized1 = [
          ...resized1,
          {
            id: 1 + i,
            uri: resized1Url,
          },
        ];
        resized2 = [
          ...resized2,
          {
            id: 1 + i,
            uri: resized2Url,
          },
        ];
        resized3 = [
          ...resized3,
          {
            id: 1 + i,
            uri: resized3Url,
          },
        ];
        resized4 = [
          ...resized4,
          {
            id: 1 + i,
            uri: resized4Url,
          },
        ];
      }
      photos = [resized1, resized2, resized3, resized4];

      console.log(photos);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadPhotos = async () => {
    try {
      for (let i = 0; i < imageUris.length; i++) {
        const fileName = imageUris[i].split("/").pop();
        const storageRef = ref(storage, `venues/${uuidKey}/photos/${fileName}`);

        const blob = await fetch(imageUris[i]).then((response) =>
          response.blob()
        );

        const uploadTask = uploadBytesResumable(storageRef, blob);
      }
      const storageMapRef = ref(
        storage,
        `venues/${uuidKey}/mapSnap/${uuid.v4()}`
      );

      const mapBlob = await fetch(print).then((response) => response.blob());
      const uploadTask = uploadBytesResumable(storageMapRef, mapBlob);
      const resizedUrl = await getDownloadURL(storageMapRef);
      return resizedUrl;
    } catch (error) {
      console.log(error);
      console.log("erro ao processarr");
    }
  };
  const handleAdd = (uris) => {
    if (imageUris.length < 10) {
      setImageUris([...imageUris, uris]); // Update to handle array of URIs
    } else {
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

  const addVenue = async () => {
    setLoading(true);
    try {
      const mapSnap =  await uploadPhotos();
      await new Promise((resolve) => setTimeout(resolve, 8000));
   await  updatePhotos();
      let venue = {
        ...newVenue,
        uuid: uuidKey,
        photos,
        mapSnap,
        location: {
          type: "Point",
          coordinates: [newMarker?.longitude, newMarker?.latitude],
        },
        // address: {
        //   ...newVenue.address,

        // },
      };

      const result = await axios.post(
        `${apiUrl}/user/venue/`,

        venue,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${headerToken}`,
          },
        }
      );
      if (result.status == 200) {
        console.log(uuidKey);
        // goBack();
      }
    } catch (error) {
      console.log(error?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAwareScrollView
        style={{ backgroundColor: colors.background, flex: 1 }}
      >
        {/* <Text
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
        </Text> */}

        <ImageImputList
          // handleImageScroll={handleImageScroll}
          imageUris={imageUris}
          onAddImage={handleAdd}
          onRemoveImage={handleRemove}
        />
        {/* <Text
          style={{
            fontSize: 19,
            fontWeight: "600",
            // padding: 5,
            left: 20,
            color: colors.primary,
            marginVertical: 10,
          }}
        >
          Mapa
        </Text> */}
        <View style={{ padding: 10 }}>
          <Image
            // resizeMode="contain"
            source={{ uri: print }}
            style={{
              width: "100%",
              // borderRadius: 5,
              height: height * 0.35,
              marginTop: 90,
            }}
          />
          <TouchableOpacity
            style={{
              // left: 8,
              alignSelf: "flex-end",
              position: "absolute",
              backgroundColor: colors.white,
              padding: 7,
              borderRadius: 5,
              top: 60,
              right: 15,
              zIndex: 2,
              shadowOffset: { width: 0.5, height: 0.5 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              elevation: 2,
            }}
            onPress={async () => {
              const newRegion = {
                ...userLocation,
                latitude: userLocation.latitude + 0.004,
                latitudeDelta: 0.01,
                longitudeDelta: 0.011,
              };

              if (Platform.OS === "ios") {
                mapViewRef.current.animateToRegion(newRegion, 200);
                // setRegion(newRegion);
              } else {
                setRegion(newRegion);
              }
            }}
          >
            <MaterialIcons
              name="my-location"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
          <MapView
            // onPress={() => setVenueDetails(false)}
            onPress={(e) => setNewMarker(e.nativeEvent.coordinate)}
            ref={mapViewRef}
            // region={region}
            // showsUserLocation={true}
            //   followsUserLocation={true}
            // onRegionChange={setRegion}

            onRegionChangeComplete={setRegion}
            initialRegion={region}
            //   provider="google"
            mapType="terrain"
            style={[styles.map, {}]}
          >
            {/* <Polygon
          coordinates={[
            
            
          ]}
            /> */}
            {newMarker != 0 && (
              <Marker
                coordinate={{
                  latitude: newMarker?.latitude,
                  longitude: newMarker?.longitude,
                }}
              />
            )}
          </MapView>
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
            value={newVenue?.displayName}
            cursorColor={colors.primary}
            onChangeText={(text) =>
              setNewVenue({ ...newVenue, displayName: text })
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
            multiline
            activeUnderlineColor={colors.primary}
            value={newVenue?.description}
            cursorColor={colors.primary}
            onChangeText={(text) =>
              setNewVenue({ ...newVenue, description: text })
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
            label="Telefone"
            keyboardType="number-pad"
            activeUnderlineColor={colors.primary}
            value={newVenue?.phone}
            cursorColor={colors.primary}
            onChangeText={(text) =>
              setNewVenue({ ...newVenue, phone: Number(text) })
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
            label="Cidade"
            activeUnderlineColor={colors.primary}
            value={newVenue?.address?.city}
            cursorColor={colors.primary}
            onChangeText={(text) =>
              setNewVenue({
                ...newVenue,
                address: { ...newVenue?.address, city: text },
              })
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
            label="Zona"
            activeUnderlineColor={colors.primary}
            value={newVenue?.address?.zone}
            cursorColor={colors.primary}
            // onSubmitEditing={getResults}
            onChangeText={(text) =>
              setNewVenue({
                ...newVenue,
                address: { ...newVenue?.address, zone: text },
              })
            }
          />
          <TouchableOpacity
            onPress={addVenue}
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

export default AddVenueScreen;

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
