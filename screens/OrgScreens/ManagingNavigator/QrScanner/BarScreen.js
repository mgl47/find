import {
    Keyboard,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
  } from "react-native";
  import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
  } from "react";
  
  import {
    MaterialCommunityIcons,
    FontAwesome5,
    MaterialIcons,
    Entypo,
    SimpleLineIcons,
  } from "@expo/vector-icons";
  import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
  import colors from "../../../../components/colors";
  import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideInRight,
    SlideOutRight,
  } from "react-native-reanimated";
  import { Tab as Tab2, Text as Text2, TabView } from "@rneui/themed";
  
  import { Camera, FlashMode } from  'expo-camera/legacy';
  import axios from "axios";
  import { useData } from "../../../../components/hooks/useData";
  import { Button } from "react-native";
  import { ActivityIndicator } from "react-native-paper";
  import LottieView from "lottie-react-native";
  import { useAuth } from "../../../../components/hooks/useAuth";
  
  import { useDesign } from "../../../../components/hooks/useDesign";
  
  const Tab = createMaterialTopTabNavigator();
  
  export default function BarScreen({
    navigation,
    navigation: { goBack, canGoBack },
    route,
  }) {
    const selectedEvent = route.params;
    const [hasPermission, setHasPermission] = useState(false);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [flashMode, setFlashMode] = useState(FlashMode.off);
    const [loading, setLoading] = useState(false);
    const animation = useRef(null);
  
    const [index, setIndex] = useState(0);
  
    const [showScanModal, setShowScanModal] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [statusCode, setStatusCode] = useState(0);
    const [scannedTicket, setScannedTicket] = useState("");
  
    const { getUpdatedUser, myEvents, headerToken, user } = useAuth();
    const { apiUrl } = useData();
    const { isIPhoneWithNotch } = useDesign();
  
    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      })();
    }, []);
  
    const clean = () => {
      setFlashMode(FlashMode.off);
      setLoading(false);
      setStatusCode(0);
      setScannedTicket("");
      setScanned(false);
    };
  
    const scanQr = async (item) => {
      if (scanned) return;
      setLoading(true);
      setScanned(true);
      // const ticketUser = await selectedEvent?.attendees?.filter(
      //   (attendee) => attendee?.uuid == item?.data
      // )[0];
  
      // console.log(ticketUser);
      try {
        const result = await axios.patch(
          `${apiUrl}/purchase/checkin/${selectedEvent?._id}`,
          { uuid: item?.data },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: headerToken,
            },
          }
        );
        console.log(result);
  
        if (result.status == 200 || result.status == 201) {
          setLoading(false);
          setStatusCode(result?.status);
          setScannedTicket(result?.data);
          // console.log(res);
  
          const time = setTimeout(() => {
            setStatusCode(0);
  
            setScannedTicket("");
          }, 3000);
  
          await new Promise((resolve) => setTimeout(resolve, 1500));
  
          setScanned(false);
  
          return () => clearTimeout(time);
        }
      } catch (error) {
        setLoading(false);
  
        // setScannedTicket(error?.response?.status);
        setStatusCode(error?.response?.status);
  
        const time = setTimeout(() => {
          setStatusCode(0);
  
          setScannedTicket("");
        }, 3000);
  
        await new Promise((resolve) => setTimeout(resolve, 1500));
  
        setScanned(false);
  
        return () => clearTimeout(time);
        // console.log(error?.response?.status);
      }
  
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setScanned(false);
      // navigation.goBack();
    };
    console.log(statusCode);
    //   useLayoutEffect(() => {
    //     navigation.setOptions({
    //       headerRight: () => (
    //         <TouchableOpacity
    //           style={{ right: 20 }}
    //           onPress={() => setShowScanModal(true)}
    //         >
    //           <MaterialCommunityIcons
    //             name="qrcode-scan"
    //             size={24}
    //             color={colors.white}
    //           />
    //         </TouchableOpacity>
    //       ),
    //     });
    //   }, [navigation]);
  
    useEffect(() => {
      getUpdatedUser();
    }, []);
    const toggleFlashMode = () => {
      setFlashMode(
        flashMode == FlashMode.torch ? FlashMode.off : FlashMode.torch
      );
    };
    // if (!permission) {
    //   return (
    //     <View style={styles.container}>
    //       <Button
    //         title="Permitir acceso a la cámara"
    //         onPress={requestPermission}
    //       />
    //     </View>
    //   );
    // }
    return (
      <View
        style={{
          backgroundColor: colors.background,
          flex: 1,
          paddingTop: isIPhoneWithNotch ? 44 : 0,
        }}
      >
      
   
        <View style={{ flexDirection: "row", alignItems: "center" ,marginVertical:5}}>
          <TouchableOpacity
            onPress={() => setIndex(0)}
            style={{
              backgroundColor: index == 0 ? colors.primary : colors.grey,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
              width: 100,
              marginHorizontal: 10,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: index == 0 ? colors.white : colors.black2,
                fontSize: 15,
                fontWeight: "500",
              }}
            >
              Validar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIndex(1)}
            style={{
              backgroundColor: index == 1 ? colors.primary : colors.grey,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
              width: 100,
              // marginHorizontal: 10,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: index == 1 ? colors.white : colors.black2,
                fontSize: 15,
                fontWeight: "500",
              }}
            >
              Bar
            </Text>
          </TouchableOpacity>
        </View>
  
        <View style={{ padding: 10, borderRadius: 15, zIndex: 5, zIndex: 5 }}>
          <TouchableOpacity
            onPress={toggleFlashMode}
            style={{
              position: "absolute",
              bottom: 20,
              right: 15,
              zIndex: 5,
  
              backgroundColor: "transparent",
              zIndex: 2,
            }}
          >
            <MaterialCommunityIcons
              name={flashMode == FlashMode.off ? "flashlight" : "flashlight-off"}
              size={30}
              color={flashMode == FlashMode.off ? colors.white : colors.white}
            />
          </TouchableOpacity>
          <Camera
            //  flashMode={flashMode}
            style={{
              height: 400,
              width: "100%",
              // marginTop: 50,
              alignItems: "center",
              justifyContent: "center",
              // shadowOffset: { width: 0.5, height: 0.5 },
              // shadowOpacity: 0.3,
              // shadowRadius: 1,
              // elevation: 2,
              overflow: "hidden",
              borderRadius: 15,
            }}
            // flashMode={Camera.Constants.FlashMode.torch}
            // flashMode={flashMode}
  
            flashMode={flashMode}
            onBarCodeScanned={scanQr}
            type={"back"}
            autoFocus={true}
  
            // barCodeScannerSettings={{
            //   barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            // }}
          />
          {statusCode == 200 && (
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: 200,
                height: 200,
                position: "absolute",
                alignSelf: "center",
                bottom: -85, // backgroundColor: "#eee",
              }}
              // Find more Lottie files at https://lottiefiles.com/featured
              source={require("../../../../components/animations/check.json")}
            />
          )}
          {statusCode == 201 && (
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: 200,
                height: 200,
                position: "absolute",
                alignSelf: "center",
                bottom: -85, // backgroundColor: "#eee",
              }}
              // Find more Lottie files at https://lottiefiles.com/featured
              source={require("../../../../components/animations/attention.json")}
            />
          )}
          {statusCode == 404 && (
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: 160,
                height: 160,
                position: "absolute",
                alignSelf: "center",
                bottom: -65, // backgroundColor: "#eee",
              }}
              // Find more Lottie files at https://lottiefiles.com/featured
              source={require("../../../../components/animations/invalid.json")}
            />
          )}
        </View>
  
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            shadowOffset: { width: 0.5, height: 0.5 },
            shadowOpacity: 0.1,
            shadowRadius: 1,
            elevation: 0.5,
            paddingHorizontal: 10,
            marginTop: 40,
            zIndex: 2,
          }}
          // onPress={() => navigation.navigate("addEvent", item)}
          // onPress={() => navigation.navigate("manageEvent", item)}
        >
          <Animated.View
            style={[styles.card, {}]}
            entering={FadeIn}
            exiting={FadeOut}
          >
            {loading ? (
              <Animated.View
                style={{
                  // position: "absolute",
                  alignSelf: "center",
                  // top: 10,
                  // zIndex: 2,
                  marginVertical: 20,
                }}
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
              >
                <ActivityIndicator animating={true} color={colors.primary} />
              </Animated.View>
            ) : scannedTicket && statusCode != 404 ? (
              <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                    left: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: colors.primary,
                      left: 4,
                    }}
                  >
                    {scannedTicket?.displayName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      marginLeft: 5,
                      top: 1,
                      color: colors.darkGrey,
                      left: 4,
                    }}
                  >
                    @{scannedTicket?.username}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // marginBottom: 5,
                    left: 2,
                  }}
                >
                  <MaterialIcons
                    name={
                      statusCode == 201 ? "check-circle" : "check-circle-outline"
                    }
                    size={24}
                    color={statusCode == 201 ? "#ff8000" : "green"}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      marginLeft: 5,
                      color: statusCode == 201 ? "#ff8000" : "green",
                    }}
                  >
                    {statusCode == 201
                      ? "Este bilhete já foi escaneado às:"
                      : "CHECK IN"}
                  </Text>
                  {scannedTicket?.checkedAt && (
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        marginLeft: 8,
                        color: colors.darkGrey,
                      }}
                    >
                      {scannedTicket?.checkedAt}
                    </Text>
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "600",
                    marginLeft: 5,
                    color: colors.black2,
                  }}
                >
                  {scannedTicket?.category}
                </Text>
              </Animated.View>
            ) : (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                    left: 2,
                  }}
                >
                  <View
                    style={{
                      height: 20,
                      width: 150,
                      backgroundColor: colors.grey,
                      borderRadius: 20,
                      left: 4,
                    }}
                  />
                  {/* <View
                  style={{
                    height: 15,
                    width: 60,
                    backgroundColor: colors.grey,
                    borderRadius: 20,
                    left: 10,
                    top: 2,
                  }}
                /> */}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // marginBottom: 5,
                    left: 2,
                  }}
                >
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      backgroundColor: colors.grey,
                      borderRadius: 20,
                      left: 4,
                    }}
                  />
                  <View
                    style={{
                      height: 20,
                      width: 100,
                      backgroundColor: colors.grey,
                      borderRadius: 20,
                      left: 10,
                    }}
                  />
                  {scannedTicket?.checkedAt && (
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        marginLeft: 8,
                        color: colors.darkGrey,
                      }}
                    >
                      {scannedTicket?.checkedAt}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    height: 18,
                    width: 100,
                    backgroundColor: colors.grey,
                    borderRadius: 20,
                    left: 4,
                    top: 4,
                  }}
                />
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
  
  const styles = StyleSheet.create({});
  