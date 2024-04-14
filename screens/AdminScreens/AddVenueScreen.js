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
import MapView, { Marker, Polygon } from "react-native-maps";
//   import {
//     MaterialCommunityIcons,
//     MaterialIcons,
//     Entypo,
//     FontAwesome5,
//     Feather,
//     Ionicons,
//     AntDesign,
//   } from "@expo/vector-icons";

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
const { height, width } = Dimensions.get("window");

const AddVenueScreen = ({ navigation: { goBack } }) => {
  const [loading, setLoading] = useState(false);
  const { apiUrl } = useData();
  const { headerToken } = useAuth();
  const [region, setRegion] = useState({
    latitude: 14.905696,
    longitude: -23.519001,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [userLocation, setUserLocation] = useState(null);

  const getLocation = async () => {
    // permissions check
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      // do something when permission is denied
      return;
    }

    const location = await Location.getCurrentPositionAsync();

    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };
  useEffect(() => {
    getLocation();
  }, []);

  function adjustCoordinates() {
    // Extract original coordinates and deltas
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

    // Calculate the ratio between the desired and original deltas
    const latRatio = latitudeDelta;
    const longRatio = longitudeDelta;

    // Adjust latitude and longitude values
    const adjustedLatitude = latitude + (latitudeDelta * latRatio) / 2;
    const adjustedLongitude = longitude + (longitudeDelta * longRatio) / 2;

    // Return adjusted coordinates with desired deltas
    return {
      latitude: adjustedLatitude,
      // latitudeDelta: desiredLatitudeDelta,
      longitude: adjustedLongitude,
      // longitudeDelta: desiredLongitudeDelta
    };
  }

  // Example usage:
  const originalCoordinates = {
    latitude: region.latitude,
    longitude: region.longitude,
  };

  const desiredLatitudeDelta = 0.0922;
  const desiredLongitudeDelta = 0.0421;

  // useEffect(() => {
  //   const sad = async () => {
  //     const island = adjustCoordinates();

  //     // console.log(region);

  //     const cityName = await Location.reverseGeocodeAsync(region);
  //     setUserLocation(cityName);
  //     // console.log(cityName?.[0]);

  //     // console.log(cityName?.[0]?.name);
  //   };
  //   sad();
  // }, [region]);

  function isPointInsidePolygon(point, polygon) {
    let inside = false;
    const [x, y] = point;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0],
        yi = polygon[i][1];
      const xj = polygon[j][0],
        yj = polygon[j][1];

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersect) inside = !inside;
    }

    return inside;
  }

  const islands = [
    {
      label: "Santiago",

      code: "st",

      coord: [
        [15.335325, -23.906599],
        [15.373932, -23.414524],
        [14.887208, -23.389862],
        [14.858075, -23.880366],
      ],
    },
    {
      label: "Fogo",
      code: "fg",

      coord: [
        [15.068971, -24.546793],
        [15.078312, -24.251275],
        [14.799444, -24.239883],
        [14.789142, -24.538828],
      ],
    },
    {
      label: "Brava",
      code: "b",

      coord: [
        [14.912453, -24.77822],
        [14.920581, -24.653388],
        [14.793573, -24.648494],
        [14.794527, -24.771866],
      ],
    },
    {
      label: "Maio",
      code: "m",

      coord: [
        [15.350471, -23.291103],
        [15.365836, -23.056888],
        [15.099833, -23.050231],
        [15.104522, -23.29165],
      ],
    },
    {
      label: "Boa Vista",
      code: "bv",

      coord: [
        [16.286075, -23.012087],
        [16.315193, -22.6272],
        [15.928413, -22.622871],
        [15.915565, -23.034866],
      ],
    },
    {
      label: "Sal",
      code: "s",

      coord: [
        [16.860699, -23.077491],
        [16.877457, -22.836549],
        [16.566173, -22.824829],
        [16.560389, -23.050031],
      ],
    },
    {
      label: "São Nicolau",
      code: "sv",

      coord: [
        [16.70191, -24.455292],
        [16.703959, -23.969864],
        [16.434735, -23.967408],
        [16.44736, -24.461661],
      ],
    },
    {
      label: "São Vicente",
      code: "sv",

      coord: [
        [16.95194, -25.094532],
        [16.952165, -24.829182],
        [16.739114, -24.830783],
        [16.739144, -25.138558],
      ],
    },
    {
      label: "Santo Antão",
      code: "sa",

      coord: [
        [17.241995, -25.419333],
        [17.277087, -24.922825],
        [16.979204, -24.912664],
        [16.898801, -25.435666],
      ],
    },
  ];

  const point = [region?.latitude, region.longitude];

  let activeIsland = null;

  islands.forEach((item) => {
    if (isPointInsidePolygon(point, item.coord)) {
      activeIsland = { label: item.label, code: item.code };
    }
  });

  const [newMarker, setNewMarker] = useState(0);

  const [newVenue, setNewVenue] = useState({ uuid: uuid.v4() });
  const [imageUris, setImageUris] = useState([]);

  const mapViewRef = useRef(null);

  let venue = newVenue;

  let photos = [];
  let videos = [];
  let resized1 = "";
  let resized2 = "";
  let resized3 = "";
  let resized4 = "";

  const uuidKey = uuid.v4();

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
      await uploadPhotos();
      await new Promise((resolve) => setTimeout(resolve, 8000));
      await updatePhotos();
      let venue = {
        ...newVenue,
        uuid: uuidKey,
        photos,
        location: {
          type: "Point",
          coordinates: [newMarker?.longitude, newMarker?.latitude],
        },
        address: {
          ...newVenue.address,
          lat: newMarker?.latitude,
          long: newMarker?.longitude,
          island: activeIsland,
          islandLabel: activeIsland?.label,
          islandCode: activeIsland?.code,
        },
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
        goBack();
      }
    } catch (error) {
      console.log(error.data.msg);
    } finally {
      setLoading(false);
    }
  };
  // const [currentPosition, setCurrentPosition] = useState(null);
  // const [isWithinRange, setIsWithinRange] = useState(false);
  // const calculateDistance = (lat1, lon1, lat2, lon2) => {
  //   const R = 6371; // Earth's radius in kilometers
  //   const dLat = (lat2 - lat1) * Math.PI / 180;
  //   const dLon = (lon2 - lon1) * Math.PI / 180;
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  //     Math.sin(dLon / 2) * Math.sin(dLon / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   const distance = R * c;
  //   return distance;
  // };

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

        <ImageImputList
          // handleImageScroll={handleImageScroll}
          imageUris={imageUris}
          onAddImage={handleAdd}
          onRemoveImage={handleRemove}
        />
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
          Mapa
        </Text>
        <View style={{ padding: 10 }}>
          <MapView
            // onPress={() => setVenueDetails(false)}
            onPress={(e) => setNewMarker(e.nativeEvent.coordinate)}
            ref={mapViewRef}
            // region={region}
            showsUserLocation={true}
            //   followsUserLocation={true}
            // onRegionChange={setRegion}

            onRegionChangeComplete={(w) =>
              setRegion({ ...w, latitudeDelta: 0.0922, longitudeDelta: 0.0421 })
            }
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
