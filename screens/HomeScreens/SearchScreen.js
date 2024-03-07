import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/navigation/Header";
import Screen from "../../components/Screen";
import Svg, { Path, Defs, ClipPath, Image as SvgImage } from "react-native-svg";
import { RNHoleView } from "react-native-hole-view";
import BigTicket from "../../components/tickets/BigTicket";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../components/colors";
import { Camera, CameraType } from "expo-camera";
import { SimpleLineIcons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';import { Chip } from "react-native-paper";
const SearchScreen = ({ navigation, navigation: { goBack }, route }) => {
  const { height, width } = useWindowDimensions();
  const [selected, setSelected] = useState("");
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  const scanQr = async (item) => {
    if (scanned) return;
    console.log(item?.data);
    // navigation.goBack();
    setScanned(true);
  };

  return (
    <Screen>
      <Header />
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={{ alignSelf: "center" }}
      >
        <QRCode
          // value="https://dtudo.net"

          value="duhd12yd3dvs79erw234"
          //   logo={{        uri: "https://d1mnxluw9mpf9w.cloudfront.net/media/13277/Rolling-loud-logo.jpg",
          // }}
          size={200}
          enableLinearGradient
          quietZone={10}
          //   logoSize={30}
          //   logoBackgroundColor='transparent'
        />
      </TouchableOpacity>
      <BottomSheetModalProvider 
      
      >
     <View style={styles.sheetContainer}>
       <Button
         onPress={handlePresentModalPress}
         title="Present Modal"
         color="black"
       />
       <BottomSheetModal
       
         ref={bottomSheetModalRef}
         index={1}
         snapPoints={snapPoints}
         onChange={handleSheetChanges}
       >
         <BottomSheetView style={styles.contentContainer}>
           <Text>Awesome 🎉</Text>
         </BottomSheetView>
       </BottomSheetModal>
     </View>
   </BottomSheetModalProvider>
      <Modal animationType="slide" visible={showModal}>
        <Screen style={{ backgroundColor: colors.background }}>
          <View
            style={{
              flexDirection: "row",
              // backgroundColor: "red",
              height: 40,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              //  backgroundColor: "red"
            }}
          >
            <Text
              style={{
                // position: "absolute",
                alignSelf: "center",
                fontSize: 22,
                // left:1,
                color: colors.primary,

                fontWeight: "500",
              }}
            >
              Validar
            </Text>
            {/* <FontAwesome5 name="user-circle" size={40} color={colors.black2} /> */}
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={{ padding: 10, right: 5, position: "absolute" }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
          <Camera
            style={{
              height: 450,
              width: "100%",
              // marginTop: 50,
              alignItems: "center",
              justifyContent: "center",
              // shadowOffset: { width: 0.5, height: 0.5 },
              // shadowOpacity: 0.3,
              // shadowRadius: 1,
              // elevation: 2,
            }}
            onBarCodeScanned={scanQr}
            type={"back"}
            autoFocus
            // barCodeScannerSettings={{
            //   barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            // }}
          >
            {/* <View style={styles.buttonContainer}> */}
            <SimpleLineIcons
              style={{ alignSelf: "center" }}
              name="frame"
              size={280}
              color={colors.primary}
            />
            {/* </View> */}
          </Camera>
          <View  style={{
              backgroundColor: colors.white,
              // height: "95%",
              marginTop:20,
              width: "95%",
              alignSelf: "center",
              borderRadius:10,
              alignItems:"center",justifyContent:"center"
            }}>
          <View
            style={{
              backgroundColor: colors.white,
              height: 200,
              width: "95%",
              alignSelf: "center",
              borderRadius:10
            }}
          ></View></View>
        </Screen>
      </Modal>
    </Screen>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});

// import {
//   StyleSheet,
//   Text,
//   View,
//   useWindowDimensions,
//   Image,
//   ImageBackground,
// } from "react-native";
// import React from "react";
// import Header from "../../components/navigation/Header";
// import Screen from "../../components/Screen";
// import Svg, { Path, Defs, ClipPath, Image as SvgImage } from "react-native-svg";
// import { RNHoleView } from "react-native-hole-view";
// import BigTicket from "../../components/tickets/BigTicket";
// import { LinearGradient } from "expo-linear-gradient";

// const SearchScreen = ({ navigation: { goBack }, route }) => {
//   const { height, width } = useWindowDimensions();

//   return (
//     <Screen>
//       <Header />
//       <View
//         style={{
//           height,
//           width,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <View
//           style={{
//             borderRadius: 20,
//             overflow: "hidden",
//             backgroundColor: "red",
//           }}
//         >
//           <Image
//             style={{
//               height: 195,
//               width: 200,
//               borderRadius: 20,

//               // marginBottom: 50,
//               zIndex: 2,
//               top: 150,
//             }}
//             source={{
//               uri: "https://d1mnxluw9mpf9w.cloudfront.net/media/13277/Rolling-loud-logo.jpg",
//             }}
//           />
//           <LinearGradient
//             // Button Linear Gradient
//             colors={["transparent", "#3b5998", "#192f6a"]}
//             style={{ height: 150, width: 200, zIndex: 2 }}
//           ></LinearGradient>
//         </View>
//       </View>
//       {/* <BigTicket /> */}
//     </Screen>
//   );
// };

// export default SearchScreen;

// const styles = StyleSheet.create({});
