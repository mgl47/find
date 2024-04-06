import { Modal, StyleSheet, Text, TouchableOpacity, View,FlatList } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cocktails } from "../../../../components/Data/cocktails";

import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import { Camera, FlashMode } from "expo-camera";
import axios from "axios";
import LottieView from "lottie-react-native";
import { ActivityIndicator, Chip } from "react-native-paper";
import Checkbox from "expo-checkbox";

import { useData } from "../../../../components/hooks/useData";
import { useAuth } from "../../../../components/hooks/useAuth";
import colors from "../../../../components/colors";
import { useDesign } from "../../../../components/hooks/useDesign";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
  AntDesign,
  Fontisto,
  Feather,
  Foundation,
  Ionicons,
} from "@expo/vector-icons";
import { Image } from "react-native";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native";
export default function StoreScreen({
  navigation,
  navigation: { goBack },
  route,
}) {
  const event = route.params;
  const { apiUrl, formatNumber } = useData();
  const { user, headerToken, getUpdatedUser } = useAuth();
  const { height, width } = useDesign();
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [orders, setOrders] = useState([]);
  const [pend, setPend] = useState(false);
  const [prep, setPrep] = useState(false);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState("");
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validBuyer, setValidBuyer] = useState(2);
  const [validating, setValidating] = useState(false);
  const animation = useRef(null);
  const orderSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["55%", "75%"], []);
  let sheetOrder;
  const toggleFlashMode = () => {
    setFlashMode(
      flashMode == FlashMode.torch ? FlashMode.off : FlashMode.torch
    );
  };
  const handleOrderSheet = useCallback((item) => {
    console.log(item?.orderId);
    setSelectedOrder(item);

    orderSheetRef.current?.present();
  }, []);
  sheetOrder = orders?.filter(
    (order) => order?.orderId == selectedOrder?.orderId
  )?.[0];
  useEffect(() => {
    const q = query(
      collection(db, "transactions"),

      where("eventId", "==", event._id),
      orderBy("time", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newOrders = [];
      querySnapshot.forEach((doc) => {
        newOrders.push({ id: doc?.id, ...doc?.data() }); // Add unique identifier to each order
      });

      setOrders(newOrders);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const total = sheetOrder?.products?.reduce(
    (acc, val) => acc + val?.price * val?.amount,
    0
  );

  const statusColor = (item) => {
    if (item?.status == "preparando") {
      return colors.primary;
    } else if (item?.status == "pronto") {
      return "green";
    } else if (item?.status == "concluído") {
      return colors.grey;
    } else if (item?.status == "cancelado") {
      return colors.darkRed;
    } else {
      return colors.darkSeparator;
    }
  };
  const color = statusColor(sheetOrder?.status);
  const updateOrder = async () => {
    if (sheetOrder?.status == "pronto") {
      setValidating(true);
      return;
    }

    try {
      //   const response = await axios.patch(
      //     `${apiUrl}/user/current/${user?._id}`,
      //     {
      //       operation: { type: "accountBalance", task: "charge" },
      //       amount: Number(state?.total),
      //     },
      //     { headers: { Authorization: headerToken } }
      //   );

      //   if (response.status === 200) {
      const status = sheetOrder?.status;
      const docRef = doc(db, "transactions", sheetOrder?.orderId);

      await updateDoc(docRef, {
        status:
          status == "pendente"
            ? "preparando"
            : status == "preparando"
            ? "pronto"
            : "sem estado",
        staff: {
          userId: user?._id,
          displayName: user?.displayName,
        },
      });

      //   }
    } catch (error) {
      console.log(error);
    }
    // setLoading(false);
  };

  //   const sortOrders = (item) => {
  //     let temp = sort;
  //     if (sort?.includes(item)) {
  //       temp = sort?.filter((sortItem) => sortItem != item);
  //       setSort(temp);
  //       return;
  //     }
  //     temp.push(item);
  //     setSort(temp);
  //   };

  //   const sort = [1, 4];
  let filters = [];
  //   let filteredOrders = orders?.filter((order) => {
  //     if (pend) {
  //       return order?.status != "pendente";
  //     }
  //     if (prep) {
  //       return order?.status != "preparando";
  //     }
  //     if (ready) {
  //       return order?.status != "pronto";
  //     }
  //     if (done) {
  //       return order?.status != "concluído";
  //     }
  //   });
  let filteredOrders = orders?.filter((order) => {
    if (!pend && !prep && !ready && !done) {
      return order?.status != "concluído";
    }
    return (
      (pend && order?.status === "pendente") ||
      (prep && order?.status === "preparando") ||
      (ready && order?.status === "pronto") ||
      (done && order?.status === "concluído")
    );
  });

  const validatePurchase = async (item) => {
    if (scanned || sheetOrder?.status == "concluído" || loading) return;
    setScanned(true);
    setLoading(true);

    if (sheetOrder?.ticketQrs?.includes(item?.data)) {
      const docRef = doc(db, "transactions", sheetOrder?.orderId);

      await updateDoc(docRef, {
        status: "concluído",
        staff: {
          userId: user?._id,
          displayName: user?.displayName,
        },
      });

      setValidBuyer(1);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setValidBuyer(2);
      orderSheetRef.current.close();
      setScanned(false);
      setLoading(false);
      setValidating(false);
      return;
    }
    setValidBuyer(0);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setValidBuyer(2);
    // setValidating(false);

    setScanned(false);
    setLoading(false);
  };
  return (
    <>
   
      <FlatList
      bounces={false}
        ListHeaderComponent={
          <>
             <View
        style={{
          position: "absolute",
          width: "100%",

          height: 130,
          backgroundColor: colors.primary2,
          zIndex: 0,
        }}
      />
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  color: colors.white,
                  top: 5,
                  // marginLeft: 30,
                  // marginTop: 10,
                  //   marginBottom: 10,

                  // left: 10,
                }}
              >
                Produtos
              </Text>
              {/* <TouchableOpacity
                onPress={() => setProductsModal(true)}
                style={{
                  alignItems: "center",
                  // justifyContent: "center",
                  flexDirection: "row",
                  top: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: colors.white,
                    //   top: 5,
                    // marginLeft: 30,
                    // marginTop: 10,
                    //   marginBottom: 10,

                    // left: 10,
                  }}
                >
                  Ver Todos
                </Text>
                <MaterialCommunityIcons
                  // style={{ position: "absolute", bottom: 10, right: 10 }}
                  name="arrow-right"
                  size={20}
                  color={colors.white}
                />
              </TouchableOpacity> */}
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ marginTop: 60 }}
              data={event?.store}
              keyExtractor={(item) => item?.id}
              // ListHeaderComponent={<View style={{ padding: 10 }}></View>}
              renderItem={({ item }) => {
                return (
                  <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut.duration(10)}
                    style={{
                      margin: 5,
                      // marginBottom: 50,

                      alignItems: "center",
                      backgroundColor: colors.white,
                      //   width: width * 0.45,
                      //   height: height * 0.2,
                      width: width * 0.42,
                      height: 120,
                      shadowOffset: { width: 0.5, height: 0.5 },
                      shadowOpacity: 0.2,
                      shadowRadius: 1,
                      elevation: 0.5,
                      paddingHorizontal: 10,
                      padding: 10,
                      //   marginTop: 50,
                      borderRadius: 10,
                    }}
                    // onPress={() => navigation.navigate("addEvent", item)}
                  >
                    <View
                      style={{
                        // height: height * 0.15,
                        // width: width * 0.3,
                        height: 120,
                        width: 130,
                        borderRadius: 10,
                        // bottom: 40,
                        zIndex: 1,
                        // overflow: "hidden",

                        // marginLeft: 20,
                        bottom: 50,
                        position: "absolute",
                        shadowOffset: { width: 1, height: 1 },
                        shadowOpacity: 1,
                        shadowRadius: 3,
                        elevation: 2,
                        shadowColor: colors.primary,
                        backgroundColor: colors.background,

                      }}
                    >
                      <View
                        style={{
                          height: 20,
                          // width: 50,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: colors.primary,
                          position: "absolute",
                          // right: width * 0.12,
                          right: 0,

                          // top: 100,
                          // transform: [{ rotate: "45deg" }],
                          // borderRadius: 10,

                          borderTopLeftRadius: 10,
                          borderBottomRightRadius:10,

                          bottom: 0,
                          // borderWidth: 1,
                          // borderColor: colors.grey,
                          // borderStyle: "dashed",
                          zIndex: 3,
                        }}
                      >
                        <Text
                          style={{
                            color: colors.white,
                            fontWeight: "500",
                            padding: 2,
                            paddingHorizontal: 5,
                          }}
                        >
                          cve {formatNumber(item?.price)}
                        </Text>
                      </View>
                      <Image
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: 10,

                          //   borderRadius: 5,
                        }}
                        source={{ uri: item?.photo }}
                      />
                    </View>
                    <View
                      style={{
                        position: "absolute",
                        bottom: 10,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          zIndex: 3,
                          bottom: 10,
                          fontSize: 14,
                          fontWeight: "500",
                          color: colors.primary2,
                        }}
                      >
                        {item?.displayName}
                      </Text>
                    </View>
                  </Animated.View>
                );
              }}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                color: colors.primary2,
                top: 5,
                marginLeft: 30,
                // marginTop: 10,
                marginBottom: 15,

                // left: 10,
              }}
            >
              {"Pedidos" + " (" + filteredOrders?.length + ")"}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                // backgroundColor: colors.darkGrey,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setPend(!pend)}
                style={styles.section}
              >
                <Checkbox
                  style={styles.checkbox}
                  value={pend}
                  onValueChange={setPend}
                  color={pend ? colors.primary2 : undefined}
                />
                <Text style={styles.paragraph}>pendente</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setPrep(!prep)}
                style={styles.section}
              >
                <Checkbox
                  style={styles.checkbox}
                  value={prep}
                  onValueChange={setPrep}
                  color={prep ? colors.primary : undefined}
                />
                <Text style={styles.paragraph}>preparando</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setReady(!ready)}
                style={styles.section}
              >
                <Checkbox
                  style={styles.checkbox}
                  value={ready}
                  onValueChange={setReady}
                  color={ready ? "green" : undefined}
                />
                <Text style={styles.paragraph}>pronto</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setDone(!done)}
                style={styles.section}
              >
                <Checkbox
                  style={styles.checkbox}
                  value={done}
                  onValueChange={setDone}
                  color={done ? colors.grey : undefined}
                />
                <Text style={styles.paragraph}>concluiído</Text>
              </TouchableOpacity>
            </ScrollView>

           
          </>
        }
        data={filteredOrders}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item?.orderId}
        renderItem={({ item }) => {
          const color = statusColor(item);
          const total = item?.products?.reduce(
            (acc, val) => acc + val?.price * val?.amount,
            0
          );
          const products = item?.products?.reduce(
            (acc, val) => acc + val?.amount,
            0
          );
          return (
            filteredOrders?.length > 0 && (
              <Animated.View entering={FadeIn.duration(180)}>
                <TouchableOpacity
                  onPress={() => handleOrderSheet(item)}
                  activeOpacity={0.5}
                  style={{
                    shadowOffset: { width: 0.5, height: 0.5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 1,
                    elevation: 2,
                    width: "100%",
                    // marginTop: 10,
                  }}
                  // onPress={() => navigation.navigate("event", item)}
                >
                  <Animated.View
                    style={styles.userCard}
                    // entering={FadeIn}
                    // exiting={FadeOut}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ marginRight: 60 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 5,
                          }}
                        >
                          <Text numberOfLines={2} style={[styles.userName]}>
                            número:
                          </Text>
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.displayName,
                              { position: "absolute", left: 80 },
                            ]}
                          >
                            {item?.orderNum}
                          </Text>
                        </View>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text numberOfLines={2} style={[styles.userName]}>
                            Produtos:
                          </Text>
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.displayName,
                              { position: "absolute", left: 80 },
                            ]}
                          >
                            {products}
                          </Text>
                        </View>
                      </View>

                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 5,
                          }}
                        >
                          <Text numberOfLines={2} style={[styles.userName]}>
                            estado:
                          </Text>
                          <Text
                            numberOfLines={2}
                            style={[styles.displayName, { color }]}
                          >
                            {item?.status}
                          </Text>
                        </View>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text numberOfLines={2} style={[styles.userName]}>
                            total:
                          </Text>
                          <Text numberOfLines={2} style={[styles.displayName]}>
                            cve {total}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {item?.staff && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 5,
                          marginTop: 10,
                          alignSelf: "flex-end",
                          //   marginLeft: 20,
                          right: 10,
                        }}
                      >
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: 16,
                            alignSelf: "flex-start",
                            color: colors.description,
                            fontWeight: "500",

                            top: 2,
                          }}
                        >
                          staff:
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={{
                            alignSelf: "flex-start",
                            fontSize: 16,
                            fontWeight: "600",
                            color: colors.primary,
                            left: 5,
                            top: 2.5,
                          }}
                        >
                          {item?.staff?.displayName}
                        </Text>
                      </View>
                    )}
                  </Animated.View>
                </TouchableOpacity>
              </Animated.View>
            )
          );
        }}
      />
      <BottomSheetModalProvider>
        <BottomSheetModal
          //   backgroundStyle={{backgroundColor:colors.white_shade}}

          // style={{backgroundColor:}}
          ref={orderSheetRef}
          // index={keyboardVisible ? 1 : 0}
          index={1}
          snapPoints={snapPoints}
          //   onChange={handleOrderSheet}
          enablePanDownToClose
          onDismiss={() => {
            setValidating(false);
          }}
          // backgroundComponent={}
          handleStyle={
            {
              //   shadowOffset: { width: 0.5, height: 0.5 },
              //   shadowOpacity: 0.2,
              //   shadowRadius: 1,
              //   elevation: 0.7,
            }
          }
        >
          <BottomSheetView style={styles.contentContainer}>
            <BottomSheetFlatList
              style={{ padding: 10 }}
              data={sheetOrder?.products}
              keyExtractor={(item) => item?.id}
              ListHeaderComponent={
                <View style={{ padding: 10 }}>
                  {validating && (
                    <Animated.View
                      style={{ borderRadius: 15, zIndex: 5 }}
                      entering={FadeIn}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          //   marginVertical: 10,
                          position: "absolute",
                          height: 200,
                          zIndex: 4,
                          backgroundColor: colors.primary2,

                          //   marginBottom: 10,
                        }}
                      />
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
                          name={
                            flashMode == FlashMode.off
                              ? "flashlight"
                              : "flashlight-off"
                          }
                          size={30}
                          color={
                            flashMode == FlashMode.off
                              ? colors.white
                              : colors.white
                          }
                        />
                      </TouchableOpacity>
                      <Camera
                        //  flashMode={flashMode}
                        style={{
                          height: 250,
                          width: "100%",
                          opacity: loading ? 0.7 : 1,

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
                        onBarCodeScanned={validatePurchase}
                        type={"back"}
                        autoFocus={true}

                        // barCodeScannerSettings={{
                        //   barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                        // }}
                      />
                      {loading && !(validBuyer == 1 || validBuyer == 0) && (
                        <ActivityIndicator
                          size={"large"}
                          style={{
                            position: "absolute",
                            alignSelf: "center",
                            top: "45%",
                          }}
                          color={colors.white}
                        />
                      )}
                      {validBuyer == 1 && (
                        <LottieView
                          autoPlay
                          ref={animation}
                          style={{
                            width: 200,
                            height: 200,
                            position: "absolute",
                            alignSelf: "center",
                            top: 30,
                            //   bottom: -25, // backgroundColor: "#eee",
                          }}
                          // Find more Lottie files at https://lottiefiles.com/featured
                          source={require("../../../../components/animations/check.json")}
                        />
                      )}

                      {validBuyer == 0 && (
                        <LottieView
                          autoPlay
                          ref={animation}
                          style={{
                            width: 160,
                            height: 160,
                            position: "absolute",
                            alignSelf: "center",
                            top: 50,
                          }}
                          // Find more Lottie files at https://lottiefiles.com/featured
                          source={require("../../../../components/animations/invalid.json")}
                        />
                      )}
                    </Animated.View>
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 2,
                    }}
                  >
                    <Text
                      numberOfLines={2}
                      style={{ marginRight: 5, fontSize: 17 }}
                    >
                      Número:
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{
                        alignSelf: "flex-start",
                        fontSize: 17,
                        fontWeight: "400",
                        color: colors.primary2,
                        marginVertical: 3,
                      }}
                    >
                      {sheetOrder?.orderNum}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        position: "absolute",
                        right: 0,
                      }}
                    >
                      {/* {sheetOrder?.status == "pendente" && (
                        <TouchableOpacity
                          style={{
                            padding: 5,
                            marginRight: 20,
                            backgroundColor: colors.darkRed,
                            borderRadius: 10,
                          }}
                        >
                          <Text style={{ color: colors.white }}>Cancelar</Text>
                        </TouchableOpacity>
                      )} */}
                      <TouchableOpacity
                        disabled={
                          sheetOrder?.status == "concluído" || validating
                        }
                        onPress={updateOrder}
                        style={{
                          padding: 5,
                          //   position: "absolute",
                          right: 0,
                          backgroundColor:
                            sheetOrder?.status == "pendente"
                              ? colors.primary2
                              : sheetOrder?.status == "preparando"
                              ? "green"
                              : sheetOrder?.status == "pronto"
                              ? colors.primary
                              : "",
                          borderRadius: 10,
                        }}
                      >
                        <Text style={{ color: colors.white }}>
                          {sheetOrder?.status == "pendente"
                            ? "preparar"
                            : sheetOrder?.status == "preparando"
                            ? "pronto"
                            : sheetOrder?.status == "pronto"
                            ? "entregar"
                            : "entregar"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.separator} />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 2,
                    }}
                  >
                    <Text
                      numberOfLines={2}
                      style={{ marginRight: 5, fontSize: 17 }}
                    >
                      estado:
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{
                        alignSelf: "flex-start",
                        fontSize: 17,
                        fontWeight: "400",
                        color: color,
                        marginVertical: 3,
                      }}
                    >
                      {sheetOrder?.status}
                    </Text>
                  </View>
                  <View style={styles.separator} />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 2,
                    }}
                  >
                    <Text
                      numberOfLines={2}
                      style={{ marginRight: 5, fontSize: 17 }}
                    >
                      Hora:
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{
                        alignSelf: "flex-start",
                        fontSize: 16,
                        fontWeight: "500",
                        color: colors.primary2,
                        marginVertical: 3,
                      }}
                    >
                      {sheetOrder?.hour}
                    </Text>
                  </View>
                  <View style={styles.separator} />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "500",
                      color: colors.primary,
                      // marginLeft: 10,
                      marginTop: 15,
                      // marginBottom: 5,

                      // left: 10,
                    }}
                  >
                    Produtos selecionados
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                return (
                  <Animated.View
                    //   entering={FadeIn}
                    //   exiting={FadeOut}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "500",
                        color: colors.primary,
                        // left: 10,
                      }}
                    >
                      {item?.amount}x
                    </Text>

                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                        color: colors.dark,
                        top: 2,
                        position: "absolute",
                        left: 25,
                      }}
                    >
                      {item?.displayName}
                    </Text>
                  </Animated.View>
                );
              }}
              ItemSeparatorComponent={
                <View
                  style={{
                    alignSelf: "center",
                    width: "95%",
                    backgroundColor: colors.grey,
                    height: 1,
                    marginVertical: 10,
                  }}
                />
              }
              ListFooterComponent={
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 20,
                    marginLeft: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.black2,
                      fontWeight: "600",
                      marginLeft: 5,
                    }}
                  >
                    Total:
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      color: colors.primary,
                      fontWeight: "600",
                      position: "absolute",
                      left: 50,
                    }}
                  >
                    cve {formatNumber(total)}
                  </Text>
                </View>
              }
            />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
}

const styles = StyleSheet.create({
  userCard: {
    // flexDirection: "row",
    marginBottom: 10,
    padding: 10,
    alignItems: "center",
    // height: 10,
    // justifyContent:""

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
  userName: {
    fontSize: 16,
    alignSelf: "flex-start",
    color: colors.description,
    fontWeight: "500",
    marginRight: 5,
    top: 2,

    // marginBottom: 5,
  },

  displayName: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginRight: 20,
    top: 2.5,
  },
  sheetContainer: {
    flex: 1,
    // padding: 24,
    // justifyContent: "center",
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
    // padding: 10,
    // alignItems: "center",
    backgroundColor: colors.background,
  },
  separator: {
    width: "95%",
    height: 1,
    backgroundColor: colors.grey,
    marginBottom: 2,
    alignSelf: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});
