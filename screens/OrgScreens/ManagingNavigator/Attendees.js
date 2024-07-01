import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "../../../components/hooks/useAuth";
import { ActivityIndicator, TextInput } from "react-native-paper";
import colors from "../../../components/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import Checkbox from "expo-checkbox";
import { ScrollView } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import AttendeeLotterySheet from "../../../components/screensComponents/eventComponents/AttendeeLotterySheet";
import { useData } from "../../../components/hooks/useData";
import axios from "axios";
const Attendees = ({ navigation, navigation: { goBack }, route }) => {
  const { routeAttendees, routeEvent } = route.params;
  const { user, headerToken } = useAuth();
  const { apiUrl } = useData();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [attendees, setAttendees] = useState(routeAttendees);
  const [pend, setPend] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [lottery, setLottery] = useState(false);
  const [selectedCat, setSelectedCat] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState([]);
  const attendeeSheetRef = useRef(null);
  const AttendeeLotterySheetRef = useRef(null);
  const handleAttendeeSheet = useCallback((selected) => {
    setSelectedAttendee(selected);
    attendeeSheetRef.current?.present();
  }, []);
  const handleLotterySheet = useCallback(() => {
    AttendeeLotterySheetRef.current?.present();
  }, []);

  const snapPoints = useMemo(() => ["55%", "75%"], []);

  // const getAttendees = async () => {
  //   try {
  //     const response = await axios.get(
  //       // `${apiUrl}/user/event/${routeEvent?._id}`,
  //       `${apiUrl}/purchase/attendees/?eventId=${routeEvent?._id}`,

  //       {
  //         headers: { Authorization: headerToken },
  //       }
  //     );
  //     await new Promise((resolve, reject) => setTimeout(resolve, 2000));

  //     if (response.status == 200) {
  //       console.log("res " + response.data?.length);
  //       setAttendees(response.data);
  //     }
  //   } catch (error) {
  //     console.log(error?.response?.data?.msg);
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getAttendees();
  // }, []);
  const separatedTickets = routeAttendees?.reduce((acc, purchase) => {
    if (purchase?.tickets) {
      acc.push(...purchase.tickets); // Use the spread operator to flatten the array
    }
    return acc;
  }, []);

 


  const filteredUsers = separatedTickets?.filter(
    (user) =>
      user.username?.toLowerCase().includes(search?.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(search?.toLowerCase())
  );

  let totalTickets = [];
  separatedTickets?.forEach((ticket) => {
    if (ticket?.username == selectedAttendee?.username) {
      totalTickets.push(ticket);
      return ticket;
    }
  });
  const categories = routeEvent?.tickets?.map((ticket) => ticket?.category);
  let coupons = [];
  routeEvent?.tickets?.forEach((ticket) => {
    if (ticket?.coupon?.label) {
      coupons.push(ticket?.coupon?.label);
    }
  });

  const lotteryAttendee = separatedTickets?.filter(
    (attendee) => attendee?.lottery
  );

  const addToSelectedCat = (cat) => {
    if (selectedCat.includes(cat)) {
      setSelectedCat(selectedCat.filter((c) => c !== cat));
    } else {
      setSelectedCat([...selectedCat, cat]);
    }
  };
  const addToSelectedCoupon = (coupon) => {
    if (selectedCoupon.includes(coupon)) {
      setSelectedCoupon(selectedCoupon.filter((c) => c !== coupon));
    } else {
      setSelectedCoupon([...selectedCoupon, coupon]);
    }
  };

  let sortedUsers = filteredUsers?.filter(
    (ticket) =>
      (!checkedIn || ticket?.checkedIn) &&
      (!selectedCat.length || selectedCat.includes(ticket?.category)) &&
      (!selectedCoupon.length ||
        selectedCoupon.includes(ticket?.coupon?.label)) &&
      (!lottery || lotteryAttendee.includes(ticket))
  );
  const ticketColor = (category) => {
    if (category?.startsWith("Promo")) {
      return colors.t4;
    } else if (category?.startsWith("Normal")) {
      return colors.t4;
    } else if (category?.startsWith("V")) {
      return colors.darkGold;
    } else {
      return colors.t4;
    }
  };
  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />,
    []
  );
  return (
    <Animated.View
      style={{ flex: 1, backgroundColor: colors.background }}
      entering={FadeIn.duration(200)}
    >
      <FlatList
        data={sortedUsers}
        keyExtractor={(item) => item?.uuid}
        ListHeaderComponent={
          <View style={{ padding: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <TextInput
                //   error={!amount}
                style={{
                  //
                  backgroundColor: colors.background,
                  width: "80%",
                  height: 40,
                }}
                // autoFocus
                // underlineStyle={{ backgroundColor: colors.background2 }}

                contentStyle={{}}
                outlineColor={colors.background2}
                mode="outlined"
                activeOutlineColor={colors.primary2}
                label="Pesquise por um usuário"
                // activeUnderlineColor={colors.primary2}
                value={search}
                cursorColor={colors.primary}
                onChangeText={setSearch}
              />

              <TouchableOpacity
                onPress={handleLotterySheet}
                style={{ alignItems: "center", marginLeft: 15 }}
              >
                <Ionicons name="dice" size={24} color={colors.t4} />
                <Text style={{ color: colors.t4 }}>Sortear</Text>
              </TouchableOpacity>
            </View>

            <View
              // horizontal
              // showsHorizontalScrollIndicator={false}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
                flexWrap: "wrap",
                // backgroundColor: colors.darkGrey,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setCheckedIn(!checkedIn)}
                style={styles.section}
              >
                <Checkbox
                  style={styles.checkbox}
                  value={checkedIn}
                  onValueChange={setCheckedIn}
                  color={checkedIn ? "green" : undefined}
                />
                <Text style={styles.paragraph}>checked In</Text>
              </TouchableOpacity>

              {categories?.length > 1 &&
                categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    activeOpacity={0.6}
                    onPress={() => addToSelectedCat(category)}
                    style={styles.section}
                  >
                    <Checkbox
                      style={styles.checkbox}
                      value={selectedCat?.includes(category)}
                      onValueChange={() => addToSelectedCat(category)}
                      color={
                        selectedCat?.includes(category)
                          ? ticketColor(category)
                          : undefined
                      }
                    />
                    <Text style={styles.paragraph}>{category}</Text>
                  </TouchableOpacity>
                ))}
              {coupons?.length > 1 &&
                coupons.map((coupon) => (
                  <TouchableOpacity
                    key={coupon}
                    activeOpacity={0.6}
                    onPress={() => addToSelectedCoupon(coupon)}
                    style={styles.section}
                  >
                    <Checkbox
                      style={styles.checkbox}
                      value={selectedCoupon?.includes(coupon)}
                      onValueChange={() => addToSelectedCoupon(coupon)}
                      color={undefined}
                    />
                    <Text style={styles.paragraph}>coupon '{coupon}'</Text>
                  </TouchableOpacity>
                ))}
              {lotteryAttendee.length > 0 && (
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setLottery(!lottery)}
                  style={styles.section}
                >
                  <Checkbox
                    style={styles.checkbox}
                    value={lottery}
                    onValueChange={setLottery}
                    color={lottery ? colors.darkGold : undefined}
                  />
                  <Text style={styles.paragraph}>Sorteados</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text
              style={[
                styles.paragraph,
                { marginLeft: 10, color: colors.t4, top: 10 },
              ]}
            >
              resultados: {sortedUsers?.length}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          return (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  shadowOffset: { width: 0.5, height: 0.5 },
                  shadowOpacity: 0.1,
                  shadowRadius: 1,
                  elevation: 0.5,
                  paddingHorizontal: 10,
                  marginTop: 5,
                }}
                // onPress={() => navigation.navigate("addEvent", item)}
                // onPress={() => navigation.navigate("manageEvent", item)}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleAttendeeSheet(item)}
                  style={[styles.card, {}]}
                >
                  <View style={{ alignItems: "center" }}>
                    <Ionicons
                      name="ticket"
                      size={24}
                      color={ticketColor(item?.category)}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        // marginLeft: 5,
                        marginTop: 5,
                        color: ticketColor(item?.category),
                      }}
                    >
                      {item?.category}
                    </Text>
                  </View>
                  <View style={{ marginLeft: 10 }}>
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
                          fontWeight: "500",
                          color: colors.t3,
                          left: 4,
                        }}
                      >
                        {item?.displayName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "500",
                          marginLeft: 5,
                          top: 1,
                          color: colors.t4,
                          left: 4,
                        }}
                      >
                        @{item?.username}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        // marginBottom: 5,
                        left: 5,
                      }}
                    >
                      <MaterialIcons
                        name={
                          item?.checkedIn
                            ? "check-circle"
                            : "check-circle-outline"
                        }
                        size={20}
                        color={item?.checkedIn ? "green" : colors.description}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          marginLeft: 5,
                          color: item?.checkedIn ? "green" : colors.description,
                        }}
                      >
                        {"CHECK IN"}
                      </Text>
                      {item?.checkedAt && (
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "500",
                            marginLeft: 8,
                            color: colors.t4,
                          }}
                        >
                          {item?.checkedAt}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
        ListFooterComponent={<View style={{ marginBottom: 50 }} />}
      />

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={attendeeSheetRef}
          index={1}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          handleStyle={{
            backgroundColor: colors.background,
          }}
          handleIndicatorStyle={{ backgroundColor: colors.t5 }}
        >
          <BottomSheetFlatList
            style={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            data={totalTickets}
            // data={totalTickets?.filter(
            //   (ticket) => ticket?.uuid != selectedAttendee?.uuid
            // )}
            keyExtractor={(item) => item?.uuid}
            ListHeaderComponent={
              <View style={{ padding: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      // alignSelf: "center",
                      // left: 10,
                      color: colors.t3,
                    }}
                  >
                    Attendee Details
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 2,
                  }}
                >
                  <Text numberOfLines={2} style={styles.label}>
                    Nome:
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      alignSelf: "flex-start",
                      fontSize: 17,
                      fontWeight: "400",
                      color: colors.t4,
                      marginVertical: 3,
                    }}
                  >
                    {selectedAttendee?.displayName}
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
                  <Text numberOfLines={2} style={styles.label}>
                    username:
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      alignSelf: "flex-start",
                      fontSize: 17,
                      fontWeight: "400",
                      color: colors.t4,
                      marginVertical: 3,
                    }}
                  >
                    @{selectedAttendee?.username}
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
                  <Text numberOfLines={2} style={styles.label}>
                    Bilhete:
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      alignSelf: "flex-start",
                      fontSize: 17,
                      color: colors.t4,
                      marginVertical: 3,
                    }}
                  >
                    {selectedAttendee?.category}
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
                  <Text numberOfLines={2} style={styles.label}>
                    checked In:
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      alignSelf: "flex-start",
                      fontSize: 17,
                      fontWeight: "400",
                      color: colors.t4,
                      marginVertical: 3,
                    }}
                  >
                    {selectedAttendee?.checkedIn
                      ? selectedAttendee?.checkedAt
                      : "Não"}
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
                  <Text numberOfLines={2} style={styles.label}>
                    Data da Compra:
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      alignSelf: "flex-start",
                      fontSize: 17,
                      fontWeight: "400",
                      color: colors.t4,
                      marginVertical: 3,
                    }}
                  >
                    {selectedAttendee?.purchaseDate?.displayDate +
                      " às " +
                      selectedAttendee?.purchaseDate?.hour}
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
                  <Text numberOfLines={2} style={styles.label}>
                    id da Compra:
                  </Text>
                  <Text
                    selectable
                    numberOfLines={1}
                    style={{
                      alignSelf: "flex-start",
                      fontSize: 16,
                      fontWeight: "400",
                      color: colors.t4,
                      marginVertical: 3,
                      width: "70%",
                    }}
                  >
                    {selectedAttendee?.purchaseId}
                  </Text>
                </View>
                {selectedAttendee?.coupon && (
                  <>
                    <View style={styles.separator} />

                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        // alignSelf: "center",
                        // left: 10,
                        color: colors.t3,
                        marginTop: 10,
                        marginBottom: 5,
                      }}
                    >
                      Detalhes do coupon
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: 2,
                      }}
                    >
                      <Text numberOfLines={2} style={styles.label}>
                        Coupon usado:
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={{
                          alignSelf: "flex-start",
                          fontSize: 17,
                          fontWeight: "400",
                          color: colors.t4,
                          marginVertical: 3,
                        }}
                      >
                        {selectedAttendee?.coupon?.label}
                      </Text>
                    </View>
                  </>
                )}
                {selectedAttendee?.lottery && (
                  <>
                    <View style={styles.separator} />

                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        // alignSelf: "center",
                        // left: 10,
                        color: colors.t3,
                        marginTop: 10,
                        marginBottom: 5,
                      }}
                    >
                      Detalhes do sorteio
                    </Text>
                    <View style={styles.separator} />
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: 2,
                      }}
                    >
                      <Text numberOfLines={2} style={styles.label}>
                        Prémio Sorteado:
                      </Text>
                      <Text
                        selectable
                        // numberOfLines={1}
                        style={{
                          alignSelf: "flex-start",
                          fontSize: 16,
                          fontWeight: "400",
                          color: colors.t4,
                          marginVertical: 3,
                          width: "65%",
                        }}
                      >
                        {selectedAttendee?.lottery?.prize} da dsa sa fsa das d
                        sa
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
                      <Text numberOfLines={2} style={styles.label}>
                        Sorteado por:
                      </Text>
                      <Text
                        selectable
                        // numberOfLines={1}
                        style={{
                          alignSelf: "flex-start",
                          fontSize: 16,
                          fontWeight: "400",
                          color: colors.t4,
                          marginVertical: 3,
                          width: "65%",
                        }}
                      >
                        {selectedAttendee?.lottery?.staff?.username}
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
                      <Text numberOfLines={2} style={styles.label}>
                        data do sorteio:
                      </Text>
                      <Text
                        selectable
                        // numberOfLines={1}
                        style={{
                          alignSelf: "flex-start",
                          fontSize: 16,
                          fontWeight: "400",
                          color: colors.t4,
                          marginVertical: 3,
                          width: "65%",
                        }}
                      >
                        {selectedAttendee?.lottery?.displayDate}
                      </Text>
                    </View>
                  </>
                )}
                {totalTickets?.length > 1 && (
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "500",
                      // alignSelf: "center",
                      // left: 10,
                      color: colors.t3,
                      marginTop: 20,
                      marginBottom: 5,
                    }}
                  >
                    Outros Bilhetes
                  </Text>
                )}
              </View>
            }
            ItemSeparatorComponent={<View style={styles.separator} />}
            renderItem={({ item }) => {
              return (
                totalTickets?.length > 1 && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleAttendeeSheet(item)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginVertical: 2,
                      backgroundColor:
                        selectedAttendee?.uuid == item?.uuid
                          ? colors.background2
                          : colors.background,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        numberOfLines={2}
                        style={[styles.label, { marginLeft: 10 }]}
                      >
                        Tipo:
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={{
                          alignSelf: "flex-start",
                          fontSize: 17,
                          // fontWeight: "500",
                          color: colors.t4,
                          marginVertical: 3,
                        }}
                      >
                        {item?.category}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginRight: 80,
                      }}
                    >
                      <Text
                        numberOfLines={2}
                        style={{
                          marginHorizontal: 5,
                          fontSize: 17,
                          color: colors.description,
                          fontWeight: "500",

                          // left: 10,
                        }}
                      >
                        checked In:
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={{
                          // alignSelf: "flex-start",
                          fontSize: 17,
                          // fontWeight: "500",
                          color: colors.t4,
                          marginVertical: 3,
                          position: "absolute",
                          right: -30,
                          // textAlign: "justify",
                          // alignSelf:"flex-start"
                        }}
                      >
                        {item?.checkedIn ? "Sim" : "Não"}
                      </Text>
                    </View>

                    {/* {selectedAttendee?.uuid == item?.uuid && (
                    <AntDesign
                      name="checkcircle"
                      size={18}
                      color={colors.primary2}
                    />
                  )} */}
                  </TouchableOpacity>
                )
              );
            }}
            ListFooterComponent={<View style={{ marginBottom: 30 }} />}
          />
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <AttendeeLotterySheet
        event={routeEvent}
        attendees={separatedTickets}
        sheetRef={AttendeeLotterySheetRef}
      />
    </Animated.View>
  );
};

export default Attendees;
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    // height: 95,
    borderRadius: 10,
    backgroundColor: colors.background2,
    overflow: "hidden",
    width: "100%",
    alignSelf: "center",
    // alignItems: "center",
    // borderRadius: 10,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 1,
    // shadowRadius: 1,
    elevation: 0.5,
    marginTop: 5,
    padding: 10,
  },

  image: {
    width: 110,
    height: "100%",
    borderRadius: 10,
  },
  venue: {
    fontSize: 14.5,
    alignSelf: "flex-start",
    fontWeight: "600",
    // marginLeft: 3,
  },
  title: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
    lineHeight: 30,
    width: "70%",
    marginVertical: 5,
  },

  date: {
    fontSize: 15,
    alignSelf: "flex-start",
    fontWeight: "600",

    // marginTop: 3,
  },

  interest: {
    fontSize: 13,
    alignSelf: "flex-start",
    color: colors.description,
    lineHeight: 25,
    bottom: 95,
    left: 185,
  },
  separator: {
    width: "95%",
    height: 1,
    right: 10,
    backgroundColor: colors.separator,
    marginVertical: 5,
    alignSelf: "center",
  },
  label: {
    marginRight: 5,
    fontSize: 16,
    fontWeight: "400",
    color: colors.t5,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
    color: colors.t5,
  },
  checkbox: {
    margin: 8,
    borderColor: colors.t4,
  },
});
