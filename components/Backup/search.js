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
  } from "react-native";
  import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
  } from "react";
  import Header from "../../components/navigation/Header";
  import Screen from "../../components/Screen";
  import Svg, { Path, Defs, ClipPath, Image as SvgImage } from "react-native-svg";
  import { RNHoleView } from "react-native-hole-view";
  import BigTicket from "../../components/tickets/BigTicket";
  import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
  import colors from "../../components/colors";
  import { Camera, CameraType } from "expo-camera";
  import { SimpleLineIcons } from "@expo/vector-icons";
  import QRCode from "react-native-qrcode-svg";
  import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
  } from "@gorhom/bottom-sheet";
  import { Chip } from "react-native-paper";
  import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
  import { categories } from "../../components/Data/categories";
  const SearchScreen = ({ navigation, navigation: { goBack }, route }) => {
    const [searchText, setSearchText] = useState("");
  
    return (
      <>
        <Screen style={{ flex: 0 }}></Screen>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 20 }}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Animated.View
            entering={SlideInRight.duration(500)}
            exiting={SlideOutRight.duration(250)}
            style={{
              width: "100%",
  
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
  
              zIndex: 1,
              padding: 5,
            }}
          >
            <View style={{ flexDirection: "row", width: "85%" }}>
              <MaterialCommunityIcons
                style={{ position: "absolute", zIndex: 1, left: 10, top: 10 }}
                name="magnify"
                size={20}
                color={colors.description}
              />
  
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                // onSubmitEditing={() => navigation.navigate("search", searchText)}
                placeholder="encontre artistas, eventos ou lugares"
                placeholderTextColor={colors.description}
                returnKeyType="search"
                autoFocus
                style={styles.search}
              />
             {searchText&& <TouchableOpacity onPress={() => setSearchText("")}>
                <Entypo
                  style={{ position: "absolute", zIndex: 1, right: 10, top: 10 }}
                  name="circle-with-cross"
                  size={20}
                  color={colors.description2}
                />
              </TouchableOpacity>}
            </View>
          </Animated.View>
        </View>
        <View
          style={{
            width: "100%",
  
            shadowOffset: { width: 0.5, height: 0.5 },
            shadowOpacity: 0.3,
            shadowRadius: 1,
            elevation: 2,
          }}
        />
        <View style={{ backgroundColor: colors.background, flex: 1, zIndex: 1 }}>
          <Text style={styles.headerText}>Categorias</Text>
  
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <Chip
                  elevation={1}
                  textStyle={
                    {
                      // color: colors.white,
                    }
                  }
                  style={{
                    margin: 2,
                    backgroundColor: colors.white,
                    // paddingHorizontal: 2,
                    // marginVertical: 10,
                    marginHorizontal: 3,
                    marginBottom: 10,
                    borderRadius: 20,
                    height: 32,
                  }}
                  // background={{ color: colors.description }}
                  // icon="information"
                  // onPress={() => console.log("Pressed")}
                  onPress={{}}
                >
                  {item.label}
                </Chip>
              );
            }}
          />
        </View>
      </>
    );
  };
  
  export default SearchScreen;
  
  const styles = StyleSheet.create({
    search: {
      height: 40,
      width: "100%",
      backgroundColor: colors.light2,
      borderRadius: 30,
      paddingLeft: 35,
      paddingRight: 35,
  
    },
    headerText: {
      fontSize: 20,
      fontWeight: "600",
      // padding: 5,
      left: 20,
      marginVertical: 5,
    },
  });
  