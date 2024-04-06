import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { TextInput } from "react-native-paper";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import { useData } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";
import { useDesign } from "../../hooks/useDesign";
import { cocktails } from "../../Data/cocktails";
import { ActivityIndicator } from "react-native-paper";

import colors from "../../colors";
import uuid from "react-native-uuid";

import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome6,
} from "@expo/vector-icons";
import ImageImput from "../../ImageInputs/ImageImput";
import photoInput from "../../ImageInputs/photoInput";
import { storage } from "../../../firebase";

const AddEventStore = ({
  storeModal,
  setStoreModal,
  products,
  setProducts,
  eventUuid,
}) => {
  const { apiUrl, formatNumber } = useData();
  const { user, headerToken, getUpdatedUser } = useAuth();
  const { height, width } = useDesign();
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [item, setItem] = useState({
    id: uuid.v4(),
    displayName: "",
    available: 0,
    photo: "",
    price: 0,
    amount:0
  });

  const flatList = useRef(null);
  const productSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["70%", "90%"], []);
  const clean = () => [
    setItem({
      id: uuid.v4(),
      displayName: "",
      available: 0,
      photo: "",
      price: 0,
    }),
    setImageUri(null),
  ];
  const removeItem = (item) => {
    Alert.alert("Remover item!", "Tem certeza que deseja remover este item?", [
      {
        text: "Não",
        onPress: () => null,
      },
      {
        text: "Sim",
        onPress: () =>
          setProducts(products?.filter((prod) => prod?.id != item?.id)),
        style: "destructive",
      },
    ]);
  };
  const fileName = `${item?.displayName + uuid.v4()}`;
  const updatePhotos = async () => {
    try {
      let resizedPhotos = [];
      let resized1, resized2;
      let resized1Name, resized2Name;

      resized1Name = `${fileName}_100x100`;
      resized2Name = `${fileName}_200x200`;

      const resized1Storage = ref(
        storage,
        `events/${eventUuid}/store/${resized1Name}`
      );
      const resized2Storage = ref(
        storage,
        `events/${eventUuid}/store/${resized2Name}`
      );

      const resized1Url = await getDownloadURL(resized1Storage);
      const resized2Url = await getDownloadURL(resized2Storage);

      // resized1 = { id: uuidKey, uri: resized1Url };
      // resized2 = { id: uuidKey, uri: resized2Url };

      // resizedPhotos.push(resized1, resized2);

      // return resizedPhotos;
      return resized2Url;
    } catch (error) {
      console.log(`Error updating photos: ${error.message}`);
      throw error; // Rethrow the error for higher-level error handling
    }
  };

  const uploadPhoto = async () => {
    try {
      const storageRef = ref(storage, `events/${eventUuid}/store/${fileName}`);
      const blob = await fetch(imageUri).then((response) => response.blob());
      await uploadBytesResumable(storageRef, blob);
    } catch (error) {
      console.log(`Error uploading photo: ${error.message}`);
      throw error;
    }
  };
  const addItem = async () => {
    if (!item?.displayName || Number(item?.price) == 0 || !imageUri) return;
    setLoading(true);

    try {
      await uploadPhoto();
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 4000);
      });
      const resizedImage = await updatePhotos();
      setProducts([...products, { ...item, photo: resizedImage }]);
      clean();
      productSheetRef.current.close();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      visible={storeModal}
      presentationStyle="pageSheet"
      animationType="slide"
      // onRequestClose={() => setStoreModal(false)}
    >
      <TouchableOpacity
        onPress={() => {
          setStoreModal(false);
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          padding: 10,
          // marginRight: 10,
          marginLeft: 20,
        }}
      >
        <Text
          style={{
            color: colors.primary,
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          Voltar
        </Text>
      </TouchableOpacity>

      <FlatList
        numColumns={2}
        ref={flatList}
        onContentSizeChange={() => flatList.current.scrollToEnd()}
        contentContainerStyle={{ marginTop: 30 }}
        data={products}
        keyExtractor={(item) => item?.id}
        ListHeaderComponent={<View style={{ padding: 10 }}></View>}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => removeItem(item)}
              activeOpacity={0.6}
              style={{ flex: 1 }}
            >
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut.duration(10)}
                style={{
                  margin: 10,
                  marginBottom: 50,

                  alignItems: "center",
                  backgroundColor: colors.white,
                  //   width: width * 0.45,
                  //   height: height * 0.2,
                  width: width * 0.45,
                  height: 150,
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
                    bottom: 70,
                    position: "absolute",
                    shadowOffset: { width: 1, height: 1 },
                    shadowOpacity: 1,
                    shadowRadius: 3,
                    elevation: 2,
                    shadowColor: colors.grey,
                    backgroundColor: colors.background,
                  }}
                >
                  <View
                    style={{
                      height: 20,

                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: colors.primary,
                      position: "absolute",

                      right: 0,

                      borderTopLeftRadius: 10,
                      borderBottomRightRadius: 10,

                      bottom: 0,

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
                  <View style={styles.counterView}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        color: colors.dark2,
                      }}
                    >
                      Quantidade:{" " + item?.available}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          <TouchableOpacity
            style={{
              backgroundColor: colors.white,
              alignSelf: "center",
              width: 100,
              height: 100,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              shadowOffset: { width: 0.5, height: 0.5 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              marginBottom: 50,
              bottom: 30,
            }}
            onPress={() => productSheetRef.current.present()}
          >
            <Ionicons
              name={"add-circle-outline"}
              size={40}
              color={colors.primary}
              // style={{ alignSelf: "center", marginBottom: 50 }}
            />
          </TouchableOpacity>
        }
      />
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={productSheetRef}
          // index={keyboardVisible ? 1 : 0}
          index={1}
          snapPoints={snapPoints}
          onDismiss={clean}
        >
          <BottomSheetScrollView
            contentContainerStyle={{
              flex: 1,
              padding: 10,
              backgroundColor: colors.background,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "500",
                  // alignSelf: "center",
                  left: 10,
                }}
              >
                Adicionar Produto
              </Text>
              <TouchableOpacity onPress={() => productSheetRef.current.close()}>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Voltar
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", width }}>
              <TouchableOpacity
                onPress={() => photoInput(setImageUri)}
                style={{
                  backgroundColor: colors.black,
                  width: "40%",
                  height: 180,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                }}
                activeOpacity={0.9}
              >
                <MaterialCommunityIcons
                  style={{ position: "absolute", zIndex: 2 }}
                  name="camera-plus-outline"
                  size={24}
                  color={colors.white}
                />
                <Image
                  style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: colors.darkGrey,
                    borderRadius: 10,
                  }}
                  source={{
                    uri: imageUri,
                  }}
                />
              </TouchableOpacity>
              <View style={{ width, marginLeft: 10 }}>
                <TextInput
                  error={!item?.displayName}
                  style={{
                    marginBottom: 5,
                    backgroundColor: colors.background,
                    width: "50%",
                  }}
                  // autoFocus
                  underlineStyle={{ backgroundColor: colors.primary }}
                  // contentStyle={{
                  //   backgroundColor: colors.background,
                  //   fontWeight: "500",
                  // }}
                  placeholder="cerveja, caipirinha, vodka..."
                  // placeholderTextColor={'blue'}
                  label="Nome"
                  mode="outlined"
                  activeOutlineColor={colors.primary}
                  underlineColor={colors.primary}
                  outlineColor={colors.primary}
                  activeUnderlineColor={colors.primary}
                  value={item?.displayName}
                  cursorColor={colors.primary}
                  // onChangeText={(text) => setPerson({ ...person, email: text })}
                  onChangeText={(text) =>
                    setItem({ ...item, displayName: text })
                  }
                />
                <TextInput
                  error={!item?.price}
                  style={{
                    marginBottom: 5,
                    backgroundColor: colors.background,
                    width: "50%",
                  }}
                  // autoFocus
                  underlineStyle={{ backgroundColor: colors.primary }}
                  // contentStyle={{
                  //   backgroundColor: colors.background,
                  //   fontWeight: "500",
                  // }}
                  label="preço"
                  placeholder="200, 500, 1000"
                  mode="outlined"
                  keyboardType="number-pad"
                  activeOutlineColor={colors.primary}
                  underlineColor={colors.primary}
                  outlineColor={colors.primary}
                  activeUnderlineColor={colors.primary}
                  value={item?.price}
                  cursorColor={colors.primary}
                  // onChangeText={(text) => setPerson({ ...person, email: text })}
                  onChangeText={(text) =>
                    setItem({ ...item, price: Number(text) })
                  }
                />

                <TextInput
                  error={!item?.available}
                  style={{
                    marginBottom: 5,
                    backgroundColor: colors.background,
                    width: "50%",
                  }}
                  // autoFocus
                  underlineStyle={{ backgroundColor: colors.primary }}
                  // contentStyle={{
                  //   backgroundColor: colors.background,
                  //   fontWeight: "500",
                  // }}
                  keyboardType="number-pad"
                  mode="outlined"
                  activeOutlineColor={colors.primary}
                  placeholder="sem limite: 0"
                  label="Quantidade"
                  activeUnderlineColor={colors.primary}
                  value={item?.available}
                  cursorColor={colors.primary}
                  // onChangeText={(text) => setPerson({ ...person, email: text })}
                  onChangeText={(text) =>
                    setItem({ ...item, available: Number(text) })
                  }
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={addItem}
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
                marginTop: 10,
                marginBottom: 15,
              }}
            >
              {loading ? (
                <ActivityIndicator animating={true} color={colors.white} />
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
          </BottomSheetScrollView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </Modal>
  );
};

export default AddEventStore;

const styles = StyleSheet.create({});
