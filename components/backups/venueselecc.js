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
  
  import { markers } from "../../Data/markers";
  
  import uuid from "react-native-uuid";
  import colors from "../../colors";
  import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
  } from "react-native-reanimated";
  import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
  import { TextInput } from "react-native-paper";
  
  const { height, width } = Dimensions.get("window");
  
  export default VenueSelectorSheet = ({
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
    //   const [venue, setVenue] = useState("");
    const [onAddNewVenue, setOnAddNewVenue] = useState(false);
    const [newMarker, setNewMarker] = useState(0);
  
    const [newVenue, setNewVenue] = useState("");
  
    const [addedNewVenue, setAddedNewVenue] = useState("");
  
    const getResults = async () => {
      // setVenueDetails(null)
      setLoading(true);
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 700);
      });
      setSearchResult(markers?.reverse());
  
      setLoading(false);
    };
    console.log(newVenue);
  
    const addVenue = () => {
      let venue = newVenue;
      venue.id = uuid.v4();
      venue.address.lat = newMarker?.latitude;
      venue.address.long = newMarker?.longitude;
      (venue.photos = [
        {
          id: 1,
          uri: "https://scontent.fopo3-2.fna.fbcdn.net/v/t31.18172-8/13220730_1347686511913909_1118731680861521309_o.jpg?_nc_cat=102&ccb=1-7&_nc_sid=4dc865&_nc_eui2=AeHynjX1ye85plORdI-EY4s7-9foNdj7fU371-g12Pt9TWRIT-0ZBtFlguV4yzjJISh8S4V0Axsi1rxa25KNSVPM&_nc_ohc=vi-qKdNEL0EAX9tox6R&_nc_ht=scontent.fopo3-2.fna&oh=00_AfCQUJ24zOBjvG7fCHW1FcHxapBhxQ7GeTLNdU4aqBy2oQ&oe=660CA567",
        },
        {
          id: 2,
          uri: "https://lh5.googleusercontent.com/p/AF1QipNUHVeb6i6i0_73l32v7lM3cC1AX63xiZz4vnbd=s1600",
        },
        {
          id: 3,
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSfESMUWnwWeRqQ3LL4bVbdLlOgjF_dCNdtpU5yEWCUw&s",
        },
      ]),
        (venue.phone = []);
  
      console.log(venue);
      // setSelectedVenue(venue);
      setAddedNewVenue(venue);
      setNewVenue("");
      setOnAddNewVenue(false);
    };
    return (
      <Modal animationType="slide" visible={venueModal} style={{ flex: 1 }}>
        {/* <Screen /> */}
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              //   backgroundColor:colors.white,
              marginHorizontal: 20,
              marginTop: 40,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: colors.darkSeparator,
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              Selecionar Local
            </Text>
            <TouchableOpacity
              style={{
                // left: 8,
                alignSelf: "flex-end",
                // padding: 10,
              }}
              onPress={() => setVenueModal(false)}
            >
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
  
          <FlatList
            style={{ backgroundColor: colors.background }}
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
                  {/* <Button title="close" onPress={() => setVenueModal(false)} /> */}
  
                  <MapView
                    // onPress={() => setVenueDetails(false)}
                    onPress={(e) =>
                      onAddNewVenue
                        ? setNewMarker(e.nativeEvent.coordinate)
                        : null
                    }
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
                    {newMarker != 0 && onAddNewVenue && (
                      <Marker
                        coordinate={{
                          latitude: newMarker?.latitude,
                          longitude: newMarker?.longitude,
                        }}
                      />
                    )}
                    {!onAddNewVenue &&
                      markers?.map((item) => {
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
                                mapViewRef.current.animateToRegion(
                                  newRegion,
                                  200
                                );
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
                <View style={{ padding: 10 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginHorizontal: 10,
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          newMarker != 0 ? colors.darkSeparator : colors.darkRed,
                        fontSize: 15,
                        fontWeight: "500",
                        opacity: onAddNewVenue ? 1 : 0,
                      }}
                    >
                      Adicione um ponto no mapa
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        onAddNewVenue
                          ? (setNewVenue(""), setOnAddNewVenue(false))
                          : setOnAddNewVenue(true)
                      }
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
                        {onAddNewVenue ? "Cancelar" : "Adicionar novo local"}
                      </Text>
                    </TouchableOpacity>
                  </View>
  
                  {!onAddNewVenue && (
                    <TextInput
                      //   error={!amount}
                      style={{ marginBottom: 5 }}
                      // autoFocus
                      underlineStyle={{ backgroundColor: colors.primary }}
                      //   contentStyle={{ borderRadius: 20 }}
                      outlineColor={colors.primary}
                      mode="outlined"
                      outlineStyle={{ borderRadius: 10 }}
                      activeOutlineColor={colors.primary}
                      label="pesquisar"
                      activeUnderlineColor={colors.primary}
                      value={search}
                      cursorColor={colors.primary}
                      onSubmitEditing={getResults}
                      onChangeText={setSearch}
                    />
                  )}
                  {onAddNewVenue && (
                    <>
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
                        onSubmitEditing={getResults}
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
                        activeUnderlineColor={colors.primary}
                        value={newVenue?.description}
                        cursorColor={colors.primary}
                        onSubmitEditing={getResults}
                        onChangeText={(text) =>
                          setNewVenue({ ...newVenue, description: text })
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
                        onSubmitEditing={getResults}
                        onChangeText={(text) =>
                          setNewVenue({
                            ...newVenue,
                            address: { ...newVenue.address, city: text },
                          })
                        }
                        // setNewVenue(prevState => ({
                        //     ...prevState,
                        //     address: {
                        //       ...prevState.address,
                        //       city: text
                        //     }
                        //   }));
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
                        onSubmitEditing={getResults}
                        onChangeText={(text) =>
                          setNewVenue({
                            ...newVenue,
                            address: { ...newVenue.address, zone: text },
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
                    </>
                  )}
  
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
                      <ActivityIndicator
                        animating={true}
                        color={colors.primary}
                      />
                    </Animated.View>
                  )}
                  {addedNewVenue && (
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
                          padding: 5,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            {
                              setVenue(addedNewVenue), setVenueModal(false);
                            }
                          }}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: 10,
                            alignItems: "center",
                            padding: 2,
                            // marginBottom: addedNewVenue?.description ? 5 : 0,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              padding: 5,
                            }}
                          >
                            {addedNewVenue?.uri && (
                              <Image
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 50,
                                  borderWidth: 0.1,
                                }}
                                source={{
                                  uri: addedNewVenue?.uri,
                                }}
                              />
                            )}
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: "500",
                                marginLeft: 10,
                              }}
                            >
                              {addedNewVenue?.displayName}
                            </Text>
                          </View>
  
                          <Text
                            style={{
                              color: colors.primary,
                              fontSize: 14,
                              right: 10,
                              padding: 3,
                              fontWeight: "600",
                              paddingHorizontal:
                                (venue?.id == addedNewVenue?.id) == 1 ? 5 : 0,
                              borderRadius:
                                (venue?.id == addedNewVenue?.id) == 1 ? 5 : 0,
                              borderWidth:
                                (venue?.id == addedNewVenue?.id) == 1 ? 1 : 0,
                              borderColor: colors.primary,
                            }}
                          >
                            {venue?.id == addedNewVenue?.id
                              ? "Selecionado"
                              : "Selecionar"}
                          </Text>
                        </TouchableOpacity>
                        {addedNewVenue?.description && (
                          <View style={styles.separator} />
                        )}
                        {addedNewVenue?.description && (
                          <View style={{ padding: 10 }}>
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: "500",
                                color: colors.darkGrey,
                              }}
                            >
                              {addedNewVenue?.description}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              </>
            }
            renderItem={({ item }) => {
              return !loading && !onAddNewVenue ? (
                <View
                  style={{
                    padding: 10,
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
                      onPress={() => {
                        {
                          setVenue(item), setVenueModal(false);
                        }
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 10,
                        alignItems: "center",
                        padding: 2,
                        //   marginBottom: item?.description ? 5 : 0,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 5,
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
                          right: 10,
                          padding: 3,
                          fontWeight: "600",
                          paddingHorizontal: (venue?.id == item?.id) == 1 ? 5 : 0,
                          borderRadius: (venue?.id == item?.id) == 1 ? 5 : 0,
                          borderWidth: (venue?.id == item?.id) == 1 ? 1 : 0,
                          borderColor: colors.primary,
                        }}
                      >
                        {venue?.id == item?.id ? "Selecionado" : "Selecionar"}
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
        </KeyboardAwareScrollView>
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
    userCard: {
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
    userName: {
      fontSize: 14,
      alignSelf: "flex-start",
      color: colors.description,
      fontWeight: "600",
    },
    userSearch: {
      height: 40,
      width: "90%",
      alignSelf: "center",
      backgroundColor: colors.white,
      padding: 10,
      marginTop: 10,
      marginBottom: 20,
      borderRadius: 15,
      // paddingLeft: 40,
    },
    displayName: {
      alignSelf: "flex-start",
      fontSize: 19,
      fontWeight: "600",
      color: colors.primary,
      marginTop: 10,
      marginVertical: 5,
    },
  });
  