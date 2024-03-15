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
  import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
    BottomSheetScrollView,
  } from "@gorhom/bottom-sheet";
  import MapView, { Marker } from "react-native-maps";
  import {
    MaterialCommunityIcons,
    MaterialIcons,
    Entypo,
    FontAwesome5,
    Feather,
    Ionicons,
    AntDesign,
  } from "@expo/vector-icons";
  
  import { ActivityIndicator, Chip } from "react-native-paper";
  
  import { markers } from "../../components/Data/markers";
  
  import uuid from "react-native-uuid";
  import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
  import colors from "../colors";
  import Animated, { SlideInDown } from "react-native-reanimated";
  import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
  import { TextInput } from "react-native-paper";
  const { height, width } = Dimensions.get("window");
  
  const Tab = createMaterialTopTabNavigator();
  export const TicketsSheet = ({
    tickets,
    setTickets,
    ticketsSheetRef,
    setTicketsSheetup,
  }) => {
    const snapPoints = useMemo(() => ["60", "90%"], []);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    //   const [selectedTicket, setSelectedTicket] = useState(edit);
    // const [tickets, setTickets] = useState([]);
    const [price, setPrice] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
  
    //   const [price, setPrice] = useState("");
    //   const [amount, setAmount] = useState("");
    //   const [description, setDescription] = useState("");
    //   const [type, setType] = useState("");
  
    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => setKeyboardVisible(true)
      );
      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => setKeyboardVisible(false)
      );
  
      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []);
    const handleSheetChanges = useCallback((index) => {}, []);
  
    const addTicket = () => {
      let tempTickets = [...tickets];
      tempTickets.push({
        price: Number(price),
        amount: Number(amount),
        description,
        type,
        id: uuid.v4(),
      });
      setTicketsSheetup(false);
      setTickets(tempTickets);
      setDescription("");
      setType("");
      setAmount("");
      setPrice("");
      ticketsSheetRef.current.close();
    };
  
    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={ticketsSheetRef}
          index={keyboardVisible ? 1 : 0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          onDismiss={() => {
            setTicketsSheetup(false);
          }}
        >
          <BottomSheetScrollView contentContainerStyle={{ flex: 1, padding: 10 }}>
            <TextInput
              error={!price}
              style={{ marginBottom: 5 }}
              // autoFocus
              underlineStyle={{ backgroundColor: colors.primary }}
              // contentStyle={{
              //   backgroundColor: colors.background,
              //   fontWeight: "500",
              // }}
              mode="outlined"
              activeOutlineColor={colors.primary}
              label="preço"
              activeUnderlineColor={colors.primary}
              // defaultValue={String(selectedTicket?.ticket?.price)}
  
              value={price}
              cursorColor={colors.primary}
              // onChangeText={(text) => setPerson({ ...person, email: text })}
              onChangeText={setPrice}
            />
            <TextInput
              error={!type}
              style={{ marginBottom: 5 }}
              // autoFocus
              underlineStyle={{ backgroundColor: colors.primary }}
              // contentStyle={{
              //   backgroundColor: colors.background,
              //   fontWeight: "500",
              // }}
              placeholder="promo, normal, VIP, 2 dias,..."
              // placeholderTextColor={'blue'}
              label="tipo"
              mode="outlined"
              activeOutlineColor={colors.primary}
              underlineColor={colors.primary}
              outlineColor={colors.primary}
              activeUnderlineColor={colors.primary}
              value={type}
              cursorColor={colors.primary}
              // onChangeText={(text) => setPerson({ ...person, email: text })}
              onChangeText={setType}
            />
            <TextInput
              error={!description}
              style={{ marginBottom: 5 }}
              // autoFocus
              underlineStyle={{ backgroundColor: colors.primary }}
              // contentStyle={{
              //   backgroundColor: colors.background,
              //   fontWeight: "500",
              // }}
              label="descrição"
              mode="outlined"
              activeOutlineColor={colors.primary}
              underlineColor={colors.primary}
              outlineColor={colors.primary}
              activeUnderlineColor={colors.primary}
              value={description}
              cursorColor={colors.primary}
              // onChangeText={(text) => setPerson({ ...person, email: text })}
              onChangeText={setDescription}
            />
  
            <TextInput
              error={!amount}
              style={{ marginBottom: 5 }}
              // autoFocus
              underlineStyle={{ backgroundColor: colors.primary }}
              // contentStyle={{
              //   backgroundColor: colors.background,
              //   fontWeight: "500",
              // }}
              mode="outlined"
              activeOutlineColor={colors.primary}
              label="Quantidade"
              activeUnderlineColor={colors.primary}
              value={amount}
              cursorColor={colors.primary}
              // onChangeText={(text) => setPerson({ ...person, email: text })}
              onChangeText={setAmount}
            />
            <TouchableOpacity
              onPress={addTicket}
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
                marginTop: 5,
                marginBottom: 15,
              }}
            >
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
            </TouchableOpacity>
          </BottomSheetScrollView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  };
  
  export const EditTicketsSheet = ({
    tickets,
    setTickets,
    editTicketSheeRef,
    setEditTicketsSheetup,
    setSelectedTicket,
    selectedTicket,
  }) => {
    const snapPoints = useMemo(() => ["60", "90%"], []);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    //   const [selectedTicket, setSelectedTicket] = useState(edit);
    // const [tickets, setTickets] = useState([]);
    const [price, setPrice] = useState(selectedTicket?.ticket?.price);
    const [amount, setAmount] = useState(selectedTicket?.ticket?.amount);
    const [description, setDescription] = useState(
      selectedTicket?.ticket?.description
    );
    const [type, setType] = useState(selectedTicket?.ticket?.type);
  
    console.log(selectedTicket?.ticket?.amount);
  
    const editTicket = () => {
      // Check if selectedTicket is defined and has a valid index
      if (selectedTicket && selectedTicket.index !== undefined) {
        // Create a copy of the tickets array
        const updatedTickets = [...tickets];
  
        // Update the price of the specific ticket at the given index
        if (updatedTickets[selectedTicket?.index]) {
          updatedTickets[selectedTicket?.index] = {
            ...updatedTickets[selectedTicket?.index], // Copy the existing ticket object
            price: price,
            description: description,
            amount: amount,
            id: setSelectedTicket?.ticket?.id,
            type: type,
          };
        }
  
        // Use setTickets to update the state with the new array
        setTickets(updatedTickets);
        //   setDescription("");
        //   setType("");
        //   setAmount("");
        //   setPrice("");
        editTicketSheeRef.current.close();
      }
    };
  
    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => setKeyboardVisible(true)
      );
      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => setKeyboardVisible(false)
      );
  
      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []);
    const handleSheetChanges = useCallback((index) => {}, []);
  
    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={editTicketSheeRef}
          index={keyboardVisible ? 1 : 0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          onDismiss={() => {
            setEditTicketsSheetup(false);
          }}
        >
          <BottomSheetScrollView contentContainerStyle={{ flex: 1, padding: 10 }}>
            <TextInput
              error={!price}
              style={{ marginBottom: 5 }}
              // autoFocus
              underlineStyle={{ backgroundColor: colors.primary }}
              // contentStyle={{
              //   backgroundColor: colors.background,
              //   fontWeight: "500",
              // }}
              mode="outlined"
              activeOutlineColor={colors.primary}
              label="preço"
              activeUnderlineColor={colors.primary}
              // defaultValue={String(selectedTicket?.ticket?.price)}
              // defaultValue={String(selectedTicket?.ticket?.price)}
              defaultValue={String(selectedTicket?.ticket?.price)}
              value={price}
              cursorColor={colors.primary}
              // onChangeText={(text) => setPerson({ ...person, email: text })}
              onChangeText={setPrice}
            />
            <TextInput
              error={!type}
              style={{ marginBottom: 5 }}
              // autoFocus
              underlineStyle={{ backgroundColor: colors.primary }}
              // contentStyle={{
              //   backgroundColor: colors.background,
              //   fontWeight: "500",
              // }}
              placeholder="promo, normal, VIP, 2 dias,..."
              // placeholderTextColor={'blue'}
              label="tipo"
              mode="outlined"
              defaultValue={
                selectedTicket?.ticket?.type ? selectedTicket?.ticket?.type : ""
              }
              activeOutlineColor={colors.primary}
              underlineColor={colors.primary}
              outlineColor={colors.primary}
              activeUnderlineColor={colors.primary}
              value={type}
              cursorColor={colors.primary}
              // onChangeText={(text) => setPerson({ ...person, email: text })}
              onChangeText={setType}
            />
            <TextInput
              error={!description}
              style={{ marginBottom: 5 }}
              // autoFocus
              underlineStyle={{ backgroundColor: colors.primary }}
              // contentStyle={{
              //   backgroundColor: colors.background,
              //   fontWeight: "500",
              // }}
              label="descrição"
              mode="outlined"
              activeOutlineColor={colors.primary}
              underlineColor={colors.primary}
              outlineColor={colors.primary}
              activeUnderlineColor={colors.primary}
              value={description}
              defaultValue={selectedTicket?.ticket?.description}
              cursorColor={colors.primary}
              // onChangeText={(text) => setPerson({ ...person, email: text })}
              onChangeText={setDescription}
            />
  
            <TextInput
              error={!amount}
              style={{ marginBottom: 5 }}
              // autoFocus
              underlineStyle={{ backgroundColor: colors.primary }}
              // contentStyle={{
              //   backgroundColor: colors.background,
              //   fontWeight: "500",
              // }}
              mode="outlined"
              activeOutlineColor={colors.primary}
              label="Quantidade"
              activeUnderlineColor={colors.primary}
              value={amount}
              defaultValue={String(selectedTicket?.ticket?.amount)}
              cursorColor={colors.primary}
              // onChangeText={(text) => setPerson({ ...person, email: text })}
              onChangeText={setAmount}
            />
            <TouchableOpacity
              onPress={editTicket}
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
                marginTop: 5,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  marginLeft: 5,
                  fontSize: 17,
                  fontWeight: "500",
                }}
              >
                Gurdar
              </Text>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  };
  
  export const VenueSelector = ({
    venueModal,
    setVenueModal,
    venue,
    setVenue,
  }) => {
    const mapViewRef = useRef(null);
  
    const [loading, setLoading] = useState(false);
  
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState("");
    const [region, setRegion] = useState({
      latitude: 14.905696,
      longitude: -23.519001,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    const [newMarker, setNewMarker] = useState(0);
  
    const [newVenue, setNewVenue] = useState({
      id: uuid.v4(),
      displayName: "",
      photos: [],
      phone1: 0,
      address: { city: "", zone: "", lat: "", long: "" },
    });
  
    const getResults = async () => {
      // setVenueDetails(null)
      setLoading(true);
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 700);
      });
      setSearchResult(markers?.reverse());
  
      setLoading(false);
    };
    return (
      <Modal animationType="slide" visible={venueModal} style={{ flex: 1 }}>
        <Button title="close" onPress={() => setVenueModal(false)} />
        <FlatList
          style={{ backgroundColor: colors.background, padding: 10 }}
          data={searchResult ? searchResult : markers}
          // data={venueDetails ? recommendedEvents.slice(1, 3).reverse() : markers}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              <View
                style={{
                  shadowOffset: { width: 0.5, height: 0.5 },
                  shadowOpacity: 0.3,
                  shadowRadius: 1,
                  elevation: 2,
                  // padding: 10,
  
                  // position: "absolute",
                  width: "100%",
                  // borderRadius: 5,
                  height: height * 0.35,
                  // top: 70,
                  marginBottom: 10,
                }}
              >
                <MapView
                  // onPress={() => setVenueDetails(false)}
                  onPress={(e) => setNewMarker(e.nativeEvent.coordinate)}
                  ref={mapViewRef}
                  region={region}
                  initialRegion={{
                    latitude: 14.921763,
                    longitude: -23.51377,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.011,
                  }}
                  //   provider="google"
                  mapType="standard"
                  style={[styles.map, {}]}
                  showsUserLocation={true}
                >
                  {newMarker != 0 && (
                    <Marker
                      coordinate={{
                        latitude: newMarker?.latitude,
                        longitude: newMarker?.longitude,
                      }}
                    />
                  )}
                  {markers?.map((item) => {
                    return (
                      <Marker
                        key={item.id}
                        // onPress={handleMarkerPress}
                        onPress={async () => {
                          const newRegion = {
                            latitude: item?.lat,
                            longitude: item?.long,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.011,
                          };
                          if (Platform.OS === "ios") {
                            mapViewRef.current.animateToRegion(newRegion, 200);
                          } else {
                            setRegion(newRegion);
                          }
                          getResults(item);
                        }}
                        coordinate={{
                          latitude: item?.lat,
                          longitude: item?.long,
                        }}
                      >
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: item?.lat == region?.latitude ? 2 : 1,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: colors.white,
                              borderWidth: 0.2,
                              borderColor: colors.darkGrey,
                              padding: 5,
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 10,
                            }}
                          >
                            <Text style={{ fontSize: 11, fontWeight: "500" }}>
                              {item?.displayName}
                            </Text>
                          </View>
                          <Image
                            resizeMode="contain"
                            style={{
                              height: item?.lat == region?.latitude ? 80 : 50,
                              width: item?.lat == region?.latitude ? 80 : 50,
                              borderRadius: 10,
                              borderWidth: 0.2,
                              borderColor: colors.darkGrey,
                            }}
                            source={{ uri: item?.uri }}
                          />
                        </View>
                      </Marker>
                    );
                  })}
                </MapView>
              </View>
              <TouchableOpacity
                //   onPress={() => {
                //     navigation.navigate("venue");
                //   }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  // padding: 10,
                  alignItems: "center",
                  alignSelf: "flex-end",
                }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  Adicionar novo local
                </Text>
              </TouchableOpacity>
              <TextInput
                //   error={!amount}
                style={{ marginBottom: 5 }}
                // autoFocus
                underlineStyle={{ backgroundColor: colors.primary }}
                contentStyle={{}}
                mode="outlined"
                activeOutlineColor={colors.primary}
                label="pesquisar"
                activeUnderlineColor={colors.primary}
                value={search}
                cursorColor={colors.primary}
                onSubmitEditing={getResults}
                onChangeText={setSearch}
              />
  
              {loading && (
                <Animated.View
                  style={{
                    // position: "absolute",
                    alignSelf: "center",
                    // top: 10,
                    // zIndex: 2,
                    marginVertical: 20,
                  }}
                  // entering={SlideInUp.duration(300)}
                  // exiting={SlideOutUp.duration(300)}
                >
                  <ActivityIndicator animating={true} color={colors.primary} />
                </Animated.View>
              )}
            </>
          }
          renderItem={({ item }) => {
            return !loading ? (
              <View
                style={{
                  // padding: 10,
                  borderBottomRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  shadowOffset: { width: 0.5, height: 0.5 },
                  shadowOpacity: 0.3,
                  shadowRadius: 1,
                  elevation: 2,
                  marginVertical: 7,
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.white,
                    borderRadius: 10,
                  }}
                >
                  <TouchableOpacity
                    //   onPress={() => {
                    //     navigation.navigate("venue");
                    //   }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 10,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 50,
                          marginRight: 10,
                          borderWidth: 0.1,
                        }}
                        source={{
                          uri: item?.uri,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                        }}
                      >
                        {item?.displayName}
                      </Text>
                    </View>
  
                    {/* <Entypo
                      name="chevron-right"
                      size={24}
                      color={colors.primary}
                    /> */}
                    <Text
                      style={{
                        color: colors.primary,
                        fontSize: 14,
                        fontWeight: "600",
                      }}
                    >
                      Selecionar
                    </Text>
                  </TouchableOpacity>
                  {item?.description && <View style={styles.separator} />}
                  {item?.description && (
                    <View style={{ padding: 10 }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "500",
                          color: colors.darkGrey,
                        }}
                      >
                        {item?.description}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ) : null;
          }}
          ListFooterComponent={<View style={{ marginBottom: 10 }} />}
        />
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    sheetContainer: {
      flex: 1,
      // padding: 24,
      // justifyContent: "center",
      backgroundColor: colors.background,
    },
    contentContainer: {
      flex: 1,
  
      // alignItems: "center",
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 18,
      fontWeight: "500",
    },
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
  