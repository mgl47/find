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

export default EditTicketsSheet = ({
  tickets,
  setTickets,
  editTicketSheeRef,
  dates,
  setSelectedTicket,
  selectedTicket,
}) => {
  const snapPoints = useMemo(() => ["70%", "90%"], []);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  //   const [selectedTicket, setSelectedTicket] = useState(edit);
  // const [tickets, setTickets] = useState([]);
  const [ticketDates, setTicketDates] = useState([]);

  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    // if (selectedTicket!=undefined) {
    setAvailable(String(selectedTicket?.ticket?.amount));
    setPrice(String(selectedTicket?.ticket?.price));
    setCategory(selectedTicket?.ticket?.category);
    setTicketDates(selectedTicket?.ticket?.dates);
    setDescription(selectedTicket?.ticket?.description);
    // }
  }, [selectedTicket]);
  // const clear = () => {
  //   setDescription("");
  //   setType("");
  //   setAmount("");
  //   setPrice("");
  //   setTicketDates([]);
  // };
  const addDate = (date) => {
    let dates = [...ticketDates];

    // console.log(dates);
    if (dates?.includes(date)) {
      setTicketDates(dates?.filter((item) => item != date));
      return null;
    }

    dates.push(date);

    setTicketDates(dates);
    // return date?.displayDate;
    // console.log(ticketDates);
  };
  console.log(ticketDates);
  const editTicket = () => {
    // Check if selectedTicket is defined and has a valid index
    if (selectedTicket && selectedTicket.index !== undefined) {
      // Create a copy of the tickets array
      const updatedTickets = [...tickets];

      // Update the price of the specific ticket at the given index
      if (updatedTickets[selectedTicket?.index]) {
        updatedTickets[selectedTicket?.index] = {
          ...updatedTickets[selectedTicket?.index], // Copy the existing ticket object
          price: Number(price),
          description: description,
          available: Number(available),
          amount: 0,
          id: setSelectedTicket?.ticket?.id,
          category: category,
          dates: ticketDates,
        };
      }

      setTickets(updatedTickets);
      // clear();
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
        // onDismiss={clear}
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
            error={!category}
            style={{ marginBottom: 5 }}
            // autoFocus
            underlineStyle={{ backgroundColor: colors.primary }}
            // contentStyle={{
            //   backgroundColor: colors.background,
            //   fontWeight: "500",
            // }}
            placeholder="Promo, Normal, VIP, 2 dias,..."
            // placeholderTextColor={'blue'}
            label="categoria"
            mode="outlined"
            defaultValue={
              selectedTicket?.ticket?.category
                ? selectedTicket?.ticket?.category
                : ""
            }
            activeOutlineColor={colors.primary}
            underlineColor={colors.primary}
            outlineColor={colors.primary}
            activeUnderlineColor={colors.primary}
            value={category}
            cursorColor={colors.primary}
            // onChangeText={(text) => setPerson({ ...person, email: text })}
            onChangeText={setCategory}
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
            error={!available}
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
            value={available}
            defaultValue={String(selectedTicket?.ticket?.amount)}
            cursorColor={colors.primary}
            // onChangeText={(text) => setPerson({ ...person, email: text })}
            onChangeText={setAvailable}
          />
          {dates?.map((date) => (
            <View
              key={date.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                // marginHorizontal: 10,
                marginVertical: 2,
              }}
            >
              <Text
                style={{
                  color: colors.darkSeparator,
                  fontSize: 15,
                  left: 10,
                  // padding: 3,
                  fontWeight: "600",
                }}
              >
                {date?.displayDate + " às " + date?.hour}
              </Text>
              <TouchableOpacity onPress={() => addDate(date)}>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 14,
                    // right: 10,
                    padding: 3,
                    fontWeight: "600",
                  }}
                >
                  {ticketDates?.includes(date) ? "Remover" : "Selecionar"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
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
              Guardar
            </Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
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
