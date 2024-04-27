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
import RNPickerSelect from "react-native-picker-select";

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

import { ActivityIndicator, Checkbox, Chip } from "react-native-paper";

import { markers } from "../../../components/Data/markers";

import uuid from "react-native-uuid";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInput } from "react-native-paper";
import colors from "../../colors";

const { height, width } = Dimensions.get("window");
export default AddTicketsSheet = ({
  tickets,
  setTickets,
  ticketsSheetRef,

  dates,
}) => {
  const snapPoints = useMemo(() => ["70%", "90%"], []);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  //   const [selectedTicket, setSelectedTicket] = useState(edit);
  // const [tickets, setTickets] = useState([]);

  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState({ label: "Promo", value: "Promo" });
  const [ticketDates, setTicketDates] = useState([]);

  // console.log(selectedTicket);

  const clear = () => {
    setDescription("");
    setCategory({ label: "Promo", value: "Promo" });
    setAvailable("");
    setPrice("");
    setTicketDates([]);
  };

  const addDate = (date) => {
    let dates = [...ticketDates];

    if (dates?.includes(date)) {
      setTicketDates(dates?.filter((item) => item != date));
      return null;
    }

    dates.push(date);

    setTicketDates(dates);
  };
  const addTicket = async () => {
    if (!price || !available || !description) return;

    // let tempTickets = [...tickets];
    let tempTickets = [...tickets];

    tempTickets.push({
      price: Number(price),
      available: Number(available),
      // quantity: Number(available),
      amount: 0,

      description,
      category: category?.value,
      id: uuid.v4(),
      dates: ticketDates,
    });

    setTickets(tempTickets);
    tempTickets = null;
    ticketsSheetRef.current.close();

    clear();
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
        ref={ticketsSheetRef}
        // index={keyboardVisible ? 1 : 0}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onDismiss={clear}
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
              Adicionar Bilhete
            </Text>
            <TouchableOpacity onPress={() => ticketsSheetRef.current.close()}>
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Sair
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={[
              styles.switchText,
              {
                color: colors.primary,
                marginVertical: 10,
                marginRight: 10,
                alignSelf: "flex-end",
                fontWeight: "500",
              },
            ]}
          >
            {`${tickets?.length} ${
              tickets?.length > 1 ? "adicionados" : "adicionado"
            }`}
          </Text>
          <TextInput
            error={!price}
            style={{ marginBottom: 5, backgroundColor: colors.background }}
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
            keyboardType="number-pad"
            value={price}
            cursorColor={colors.primary}
            // onChangeText={(text) => setPerson({ ...person, email: text })}
            onChangeText={setPrice}
          />
          {/* <TextInput
            error={!category}
            style={{ marginBottom: 5, backgroundColor: colors.background }}
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
            activeOutlineColor={colors.primary}
            underlineColor={colors.primary}
            outlineColor={colors.primary}
            activeUnderlineColor={colors.primary}
            value={category}
            cursorColor={colors.primary}
            // onChangeText={(text) => setPerson({ ...person, email: text })}
            onChangeText={setCategory}
          /> */}
          <RNPickerSelect
            style={{ left: 40 }}
            // placeholder={{ label: getMemberPosition(selectedMember) }}
            placeholder={{}}
            value={category?.value}
            // onValueChange={(value) => setTicketsLimit({ value })}
            onValueChange={(value, label) => setCategory({ value, label })}
            items={[
              { label: "Promo", value: "Promo" },
              { label: "Normal", value: "Normal" },
              { label: "VIP", value: "VIP" },
              { label: "1 Dia", value: "1 Dia" },
              { label: "2 Dias", value: "2 Dias" },
              { label: "3 Dias", value: "3 Dias" },
              { label: "Promo 1", value: "Promo 1" },
              { label: "Promo 2", value: "Promo 2" },
              { label: "Promo 3", value: "Promo 3" },
              { label: "Normal 1", value: "Normal 1" },
              { label: "Normal 2", value: "Normal 2" },
              { label: "Normal 3", value: "Normal 3" },
              { label: "VIP 1", value: "VIP 1" },
              { label: "VIP 2", value: "VIP 2" },
              { label: "VIP 3", value: "VIP 3" },
              { label: "1° Dia", value: "1° Dia" },
              { label: "2° Dia", value: "2° Dia" },
              { label: "3° Dia", value: "3° Dia" },
              { label: "1 Dia - 1", value: "1 Dia - 1" },
              { label: "1 Dia - 2", value: "1 Dia - 2" },
              { label: "1 Dia - 3", value: "1 Dia - 3" },
              { label: "2 Dias - 1", value: "2 Dias - 1" },
              { label: "2 Dias - 2", value: "2 Dias - 2" },
              { label: "2 Dias - 3", value: "2 Dias - 3" },
              { label: "3 Dias - 1", value: "3 Dias - 1" },
              { label: "3 Dias - 2", value: "3 Dias - 2" },
              { label: "3 Dias - 3", value: "3 Dias - 3" },
            ]}
          >
            <View style={[styles.switchContainer, {}]}>
              <Text
                style={[styles.switchText, { color: colors.darkSeparator }]}
              >
                Categoria
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  numberOfLines={2}
                  style={{
                    alignSelf: "flex-start",
                    fontSize: 17,
                    fontWeight: "400",
                    color: colors.primary2,
                    marginVertical: 3,
                    marginLeft: 30,
                  }}
                >
                  {category?.value}
                </Text>

                <MaterialCommunityIcons
                  style={{ position: "absolute", right: -30 }}
                  name="unfold-more-horizontal"
                  size={26}
                  color={colors.primary}
                />
              </View>
              {/* <Text
                numberOfLines={2}
                style={{
                  // alignSelf: "flex-start",
                  fontSize: 15,
                  fontWeight: "400",
                  color: colors.darkGrey,
                  marginVertical: 3,
                  marginLeft: 10,
                  position: "absolute",
                  right: 0,
                }}
              >
                sem limite: 0{" "}
              </Text> */}
            </View>
          </RNPickerSelect>
          <TextInput
            error={!description}
            style={{ marginBottom: 5, backgroundColor: colors.background }}
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
            error={!available}
            style={{ marginBottom: 5, backgroundColor: colors.background }}
            // autoFocus
            underlineStyle={{ backgroundColor: colors.primary }}
            // contentStyle={{
            //   backgroundColor: colors.background,
            //   fontWeight: "500",
            // }}
            keyboardType="number-pad"
            mode="outlined"
            activeOutlineColor={colors.primary}
            label="Quantidade"
            activeUnderlineColor={colors.primary}
            value={available}
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
  switchContainer: {
    flexDirection: "row",
    marginVertical: 15,
    // height: 40,
    width: "100%",
    // backgroundColor: colors.light2,
    alignItems: "center",
    // paddingHorizontal: 20,

    //padding: 10,
  },
  switch: {
    position: "absolute",

    right: 20,
  },
  switchText: {
    fontSize: 15,
    fontWeight: "500",
    alignSelf: "center",
    left: 10,
  },
});
