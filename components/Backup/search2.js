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
    TextInput,
    FlatList,
    Keyboard,
  } from "react-native";
  import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
  } from "react";
  
  import colors from "../../components/colors";
  
  import { Tab, Text as Text2, TabView } from "@rneui/themed";
  
  import {
    ActivityIndicator,
    Chip,
    MD2Colors,
    SegmentedButtons,
  } from "react-native-paper";
  import Animated, {
    SlideInLeft,
    SlideInRight,
    SlideInUp,
    SlideOutLeft,
    FadeIn,
    SlideOutRight,
    SlideOutUp,
    SlideInDown,
  } from "react-native-reanimated";
  import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
  
  import { categories } from "../../components/Data/categories";
  import { newEvents, recommendedEvents } from "../../components/Data/events";
  import { artist } from "../../components/Data/artist";
  
  import SmallCard from "../../components/cards/SmallCard";
  import MediumCard from "../../components/cards/MediumCard";
  import { markers } from "../../components/Data/markers";
  const SearchScreen2 = ({
    navigation,
    navigation: { goBack, canGoBack },
    route,
  }) => {
    const { text, category } = route.params;
    const [searchText, setSearchText] = useState(text);
    const [firstMount, setFirstMount] = useState(true);
    const [inSearch, setInSearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [index, setIndex] = useState(1);
  
    useEffect(() => {
      setFirstMount(false);
      getResults();
    }, []);
  
    const getResults = async () => {
      setLoading(true);
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 1500);
      });
  
      setInSearch(true);
      setLoading(false);
    };
  
    useEffect(() => {
      navigation.setOptions({
        headerLeft: () => null,
        headerRight: () => (
          <Animated.View
            style={{
              padding: 10,
              right: 10,
              // alignSelf: "flex-end",
              position: "absolute",
              // marginBottom: 10,
              zIndex: 2,
            }}
            //   entering={SlideInRight.duration(570)}
          >
            <TouchableOpacity
              style={{ left: 8 }}
              onPress={() => {
                //   setcategory(false),
                //     setSearchText(""),
                Keyboard.dismiss(), navigation.goBack();
              }}
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
          </Animated.View>
        ),
  
        headerTitle: () =>
          category ? (
            <Text style={{ fontSize: 17, fontWeight: "600" }}>{category}</Text>
          ) : (
            <View
              style={{
                // marginTop: 40,
                flexDirection: "row",
                alignItems: "center",
                // backgroundColor: colors.white,
                zIndex: 2,
              }}
            >
              {/* {navigation.canGoBack("calendar") && (
                <TouchableOpacity
                  style={{ position: "absolute", zIndex: 3, left: 4 }}
                  onPress={() =>
                    navigation.canGoBack("calendar")
                      ? navigation.goBack()
                      : navigation.navigate("calendar")
                  }
                >
                  <Entypo name="chevron-left" size={30} color={colors.primary} />
                </TouchableOpacity>
              )} */}
              <Animated.View
                // entering={SlideInRight.duration(500)}
                // exiting={SlideOutRight.duration(250)}
                style={{
                  width: "100%",
  
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
  
                  zIndex: 1,
                  // padding: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    width: "85%",
                    // left: 10,
                    // width: "75%",
                    // left: 40,
                  }}
                >
                  <Entypo
                    style={{ position: "absolute", zIndex: 1, left: 10, top: 10 }}
                    name="magnifying-glass"
                    size={19}
                    color={colors.description}
                  />
  
                  <TextInput
                    value={searchText}
                    onChangeText={setSearchText}
                    // onSubmitEditing={() => navigation.navigate("search", searchText)}
                    onSubmitEditing={getResults}
                    // placeholder="encontre artistas, eventos ou lugares"
                    placeholder=" artistas, eventos ou lugares"
                    placeholderTextColor={colors.description}
                    returnKeyType="search"
                    //   autoFocus
                    style={[styles.search, { width: "100%" }]}
                  />
                  {searchText && (
                    <TouchableOpacity
                      onPress={() => {
                        setSearchText("");
                      }}
                    >
                      <Entypo
                        style={{
                          position: "absolute",
                          zIndex: 1,
                          right: 10,
                          top: 8,
                        }}
                        name="circle-with-cross"
                        size={20}
                        color={colors.grey}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            </View>
          ),
      });
    }, [searchText]);
  
    return (
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        {loading && (
          <Animated.View
            style={{
              position: "absolute",
              alignSelf: "center",
              top: 10,
              zIndex: 0,
            }}
            entering={SlideInUp.duration(300)}
            // exiting={SlideOutUp.duration(300)}
          >
            <ActivityIndicator animating={loading} color={colors.primary} />
          </Animated.View>
        )}
  
        {!category && !loading && (
          <Tab
            // titleStyle={{ color: colors.primary }}
  
            indicatorStyle={{
              backgroundColor: colors.primary,
              height: 2,
              width: "33%",
            }}
            value={index}
            onChange={setIndex}
            // dense
            disableIndicator
            titleStyle={(active) => ({
              color: active ? colors.primary : colors.darkGrey,
              fontSize: active ? 16 : 14,
              fontWeight: "500",
            })}
          >
            <Tab.Item>Artistas</Tab.Item>
            <Tab.Item>{"Eventos"}</Tab.Item>
            <Tab.Item>{"Lugares"}</Tab.Item>
          </Tab>
        )}
        {category && !loading && (
          <Animated.FlatList
            //  entering={index == 0 ? SlideInRight : SlideInLeft}
            // exiting={index == 0? SlideOutRight : SlideOutLeft}
            contentContainerStyle={{ alignItems: "center" }}
            entering={FadeIn.duration(250)}
            data={newEvents?.slice().reverse()}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={<View style={{ marginTop: 5 }} />}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    shadowOffset: { width: 1, height: 1 },
                    shadowOpacity: 1,
                    shadowRadius: 1,
                    elevation: 3,
                    // marginVertical: 5,
  
                    // alignSelf: "center",
                  }}
                  onPress={() => navigation.navigate("event", item)}
                >
                  <MediumCard {...item} />
                </TouchableOpacity>
              );
            }}
            ListFooterComponent={<View style={{ marginBottom: 50 }} />}
          />
        )}
        {!category && !loading && index == 0 && (
          <Animated.FlatList
            // entering={index == 0 ?SlideInRight:SlideInLeft}
            // exiting={SlideOutLeft}
            data={artist}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={<View style={{ marginTop: 5 }} />}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    shadowOffset: { width: 0.5, height: 0.5 },
                    shadowOpacity: 0.3,
                    shadowRadius: 1,
                    elevation: 2,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate("artist")}
                    style={[
                      styles.card,
                      {
                        shadowOffset: { width: 1, height: 1 },
                        shadowOpacity: 1,
                        shadowRadius: 1,
                        elevation: 3,
                      },
                    ]}
                  >
                    <Image
                      source={{
                        uri: item?.avatar,
                      }}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 50,
  
                        // marginLeft: 20,
                        // position: "absolute",
                      }}
  
                      // resizeMode="contain"
                    />
                    <View
                      style={{ alignItems: "center", marginLeft: 10, bottom: 5 }}
                    >
                      <Text numberOfLines={2} style={[styles.displayName]}>
                        {item?.displayName}
                      </Text>
                      <Text numberOfLines={2} style={[styles.userName]}>
                        @{item?.username}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        // navigation.goBack();
                      }}
                      style={{
                        padding: 2,
                        left: 10,
                        borderColor: colors.primary,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.primary,
                          fontSize: 14,
                          fontWeight: "600",
                          bottom: 11,
                        }}
                      >
                        Seguir
                      </Text>
                    </TouchableOpacity>
  
                    <Entypo
                      style={{ position: "absolute", right: 10 }}
                      name="chevron-right"
                      size={25}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
            ListFooterComponent={<View style={{ marginBottom: 50 }} />}
          />
        )}
        {!category && !loading && index == 1 && (
          <>
            <Animated.FlatList
              //  entering={index == 0 ? SlideInRight : SlideInLeft}
              // exiting={index == 0? SlideOutRight : SlideOutLeft}
              contentContainerStyle={{ alignItems: "center" }}
              entering={FadeIn.duration(250)}
              data={newEvents}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={<View style={{ marginTop: 5 }} />}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      shadowOffset: { width: 1, height: 1 },
                      shadowOpacity: 1,
                      shadowRadius: 1,
                      elevation: 3,
                      // marginVertical: 5,
  
                      // alignSelf: "center",
                    }}
                    onPress={() => navigation.navigate("event", item)}
                  >
                    <MediumCard {...item} />
                  </TouchableOpacity>
                );
              }}
              ListFooterComponent={<View style={{ marginBottom: 50 }} />}
            />
          </>
        )}
        {!category && !loading && index == 2 && (
          <Animated.FlatList
            // entering={SlideInRight}
            // exiting={SlideOutRight}
            //   style={{ zIndex: 0 }}
            data={markers}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={<View style={{ marginTop: 5 }} />}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    padding: 10,
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    shadowOffset: { width: 0.5, height: 0.5 },
                    shadowOpacity: 0.3,
                    shadowRadius: 1,
                    elevation: 2,
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
                        navigation.navigate("venue");
                      }}
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
                        <TouchableOpacity
                          onPress={() => {
                            // navigation.goBack();
                          }}
                          style={{
                            padding: 2,
                            paddingHorizontal: 5,
                            left: 10,
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: colors.primary,
                            // alignSelf: "flex-end",
                            // position: "absolute",
                            // marginBottom: 10,
                          }}
                        >
                          <Text
                            style={{
                              color: colors.primary,
                              fontSize: 14,
                              fontWeight: "600",
                            }}
                          >
                            Seguir
                          </Text>
                        </TouchableOpacity>
                      </View>
  
                      <Entypo
                        name="chevron-right"
                        size={24}
                        color={colors.primary}
                      />
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
              );
            }}
            ListFooterComponent={<View style={{ marginBottom: 50 }} />}
          />
        )}
      </View>
    );
  };
  
  export default SearchScreen2;
  
  const styles = StyleSheet.create({
    search: {
      height: 37,
      width: "90%",
      backgroundColor: colors.light2,
      borderRadius: 30,
      paddingLeft: 35,
      paddingRight: 30,
    },
    headerText: {
      fontSize: 19,
      fontWeight: "500",
      // padding: 5,
      zIndex: 2,
      left: 20,
      marginVertical: 10,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
  
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
    displayName: {
      alignSelf: "flex-start",
      fontSize: 17,
      fontWeight: "600",
      color: colors.black2,
  
      // marginVertical: 5,
    },
    userName: {
      fontSize: 13,
      alignSelf: "flex-start",
      color: colors.darkGrey,
      fontWeight: "600",
      top:2
    },
  });
  