import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import uuid from "react-native-uuid";
import { useAuth } from "../../../components/hooks/useAuth";
import { useDesign } from "../../../components/hooks/useDesign";
import { ActivityIndicator } from "react-native-paper";
import colors from "../../../components/colors";
import CountDown from "react-native-countdown-component";
import { Image } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { useData } from "../../../components/hooks/useData";
import { Switch } from "react-native";
import axios from "axios";
import { set } from "firebase/database";
import TicketPurchaseSheet from "../../../components/screensComponents/eventComponents/TicketPurchaseSheet";
const Overview = ({ navigation, navigation: { goBack }, route }) => {
  const uuidKey = uuid.v4();
  const routeEvent = route.params;
  const [index, setIndex] = useState(1);
  const { height, width } = useDesign();
  const { formatNumber, apiUrl } = useData();

  const { user, myEvents, headerToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(routeEvent);
  const [firstRender, setFirstRender] = useState(true);
  const [suspendTickets, setSuspendTickets] = useState(routeEvent?.haltedSales);
  const bottomSheetModalRef = useRef(null);
  const handlePurchaseSheet = useCallback(() => {
    // setPurchaseModalUp(true);

    bottomSheetModalRef.current?.present();
  }, []);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
    }
  }, []);

  let totalCheckin = 0;
  event?.attendees?.forEach((attendee) => {
    if (attendee?.checkedIn) {
      totalCheckin += 1;
    }
  });
  let totalTickets = 0;
  event?.tickets?.forEach((ticket) => {
    totalTickets = totalTickets + ticket?.quantity;
  });

  const ticketColor = (category) => {
    if (category?.startsWith("Promo")) {
      return colors.darkGrey;
    } else if (category?.startsWith("Normal")) {
      return colors.primary;
    } else if (category?.startsWith("V")) {
      return colors.darkGold;
    } else {
      return colors.darkGrey;
    }
  };
  const fee = 0.07;

  const { totalTicketsSold, doorTicketSales } = event?.attendees?.reduce(
    (acc, item) => {
      if (item.doorTicket) {
        acc.doorTicketSales += item.price;
      } else {
        acc.totalTicketsSold += item.price;
      }
      return acc;
    },
    { totalTicketsSold: 0, doorTicketSales: 0 }
  );

  const doorTaxes = (doorTicketSales * fee).toFixed();

  const taxedTotal = totalTicketsSold * fee;

  const haltSales = async () => {
    setSuspendTickets(!suspendTickets);
    setLoading(true);
    try {
      const result = await axios.patch(
        `${apiUrl}/user/event/${event?._id}`,
        {
          operation: {
            type: "ticketStatus",
            task: "halt",
            // eventId: event?._id,
          },
        },
        { headers: { Authorization: headerToken } }
      );

      if (result.status === 200) {
        setEvent(result.data);
        // console.log(result.data);
        console.log(result.data?.haltedSales);
        // setSuspendTickets(result.data?.haltedSales);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // console.log(doorTicketSales);
  return (
    <>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={{ padding: 10, backgroundColor: colors.background }}
        entering={FadeIn}
        exiting={FadeOut}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ position: "absolute", right: 10, top: 20 }}
        >
          {/* <MaterialCommunityIcons
          name="square-edit-outline"
          size={30}
          color={colors.primary2}
        /> */}
          <Text
            style={{
              color: colors.t4,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Editar
          </Text>
        </TouchableOpacity>
        <View
          // entering={FadeIn}
          // exiting={FadeOut}
          style={{
            backgroundColor: colors.background2,
            shadowOffset: { width: 0.5, height: 0.5 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 1,
            paddingHorizontal: 10,
            padding: 10,
            // margin:0.2,
            marginTop: 50,
            borderRadius: 10,
          }}
          // onPress={() => navigation.navigate("addEvent", item)}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                // height: 230,
                width: 180,
                borderRadius: 5,
                marginLeft: 20,
                bottom: 50,
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 1,
                shadowRadius: 3,
                elevation: 3,
                backgroundColor: colors.background,
              }}
            >
              <Image
                style={{
                  height: 250,
                  width: 180,
                  borderRadius: 5,
                }}
                source={{ uri: event?.photos?.[1]?.[0]?.uri }}
              />
            </View>
            <View style={{ padding: 10 }}>
              <Text style={styles.section}>Data:</Text>
              <Text style={styles.sectionText}>
                {event?.dates?.[event?.dates?.length - 1]?.fullDisplayDate}
              </Text>
              <Text style={styles.section}>Hora:</Text>
              <Text style={styles.sectionText}>{event?.dates?.[0]?.hour}</Text>
              <Text style={styles.section}>
                {event?.tickets?.length > 1 ? "Preços:" : "Preço:"}
              </Text>
              <Text style={styles.sectionText}>
                cve{" "}
                {event?.tickets?.length > 1
                  ? event?.tickets?.[0]?.price +
                    " - " +
                    event?.tickets?.[event?.tickets?.length - 1]?.price
                  : event?.tickets?.[0]?.price}
              </Text>
            </View>
          </View>
          <View style={{ bottom: 50 }}>
            <View style={{ marginLeft: 20, top: 20 }}>
              <Text style={styles.section}>Local:</Text>
              <Text
                style={{
                  color: colors.t4,
                  fontSize: 15,
                  fontWeight: "400",
                  marginTop: 3,
                  // marginBottom: 15,
                }}
              >
                {event?.venue?.displayName +
                  ", " +
                  event?.venue?.address?.zone +
                  ", " +
                  event?.venue?.address?.city}
              </Text>
            </View>
            <Text style={styles.eventTitle}>{event?.title}</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
                marginTop: 10,
              }}
            >
              <View style={styles.section3}>
                <Text style={styles.section2}>Bilhetes</Text>
                <Text style={styles.sectionText2}>{totalTickets}</Text>
              </View>
              <View style={styles.section3}>
                <Text style={styles.section2}>Vendidos</Text>
                <Text style={[styles.sectionText2, { color: colors.primary }]}>
                  {event?.attendees?.length}
                </Text>
              </View>
              <View style={styles.section3}>
                <Text style={styles.section2}>check in:</Text>
                <Text style={[styles.sectionText2, { color: "green" }]}>
                  {totalCheckin}
                </Text>
              </View>
            </View>
          </View>
          {/* <Text style={styles.eventTitle}>{event?.title}</Text> */}
        </View>
        <View
          style={{
            backgroundColor: colors.background2,
            shadowOffset: { width: 0.5, height: 0.5 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 0.5,
            paddingHorizontal: 10,
            padding: 10,
            marginTop: 20,
            borderRadius: 10,
          }}
          // onPress={() => navigation.navigate("addEvent", item)}
        >
          <Text
            style={[
              {
                textAlign: "center",
                fontWeight: "500",
                // color: colors.darkSeparator,
                color: colors.t3,
                fontSize: 17,
                fontWeight: "500",
                marginTop: 3,
                marginBottom: 15,
              },
            ]}
          >
            Bilhetes
          </Text>

          <FlatList
            scrollEnabled={false}
            data={event?.tickets}
            keyExtractor={(item) => item?.id}
            ItemSeparatorComponent={<View style={styles.separator} />}
            renderItem={({ item }) => {
              return (
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginVertical: 5,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons
                        name="ticket"
                        size={24}
                        color={ticketColor(item?.category)}
                      />
                      <Text
                        style={{
                          color: colors.t4,
                          marginLeft: 10,
                          fontSize: 15,
                          fontWeight: "500",
                        }}
                      >
                        {item?.category}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          color: colors.t3,
                          marginLeft: 10,
                          fontSize: 15,
                          fontWeight: "500",
                        }}
                      >
                        cve{" " + formatNumber(item?.price)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginVertical: 5,
                      width: "100%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        // position: "absolute",
                        // left: 100,
                        // marginVertical: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.t4,
                          // marginLeft: 10,
                          fontSize: 15,
                          fontWeight: "500",
                          textAlign: "left",
                          // marginLeft: 10,
                        }}
                      >
                        Qtd:
                      </Text>
                      <Text
                        style={{
                          color: colors.t3,
                          marginLeft: 5,
                          fontSize: 15,
                          fontWeight: "500",
                        }}
                      >
                        {item?.quantity}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        // position: "absolute",

                        // position: "absolute",
                        // left: 80,
                        // marginVertical: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.t4,
                          marginLeft: 10,
                          fontSize: 15,
                          fontWeight: "600",
                          textAlign: "left",
                        }}
                      >
                        Vendidos:
                      </Text>
                      <Text
                        style={{
                          color: colors.t3,
                          marginLeft: 5,
                          fontSize: 15,
                          fontWeight: "600",
                        }}
                      >
                        {/* {item?.quantity - item?.available} */}

                        {
                          event?.attendees?.filter(
                            (ticket) =>
                              ticket?.category === item?.category &&
                              !ticket?.doorTicket
                          )?.length
                        }
                      </Text>
                      <Text
                        style={{
                          color: colors.t4,
                          marginLeft: 10,
                          fontSize: 15,
                          fontWeight: "600",
                          textAlign: "left",
                        }}
                      >
                        P:
                      </Text>
                      <Text
                        style={{
                          color: colors.t3,
                          marginLeft: 5,
                          fontSize: 15,
                          fontWeight: "600",
                        }}
                      >
                        {/* {item?.quantity - item?.available} */}

                        {
                          event?.attendees?.filter(
                            (ticket) =>
                              ticket?.category === item?.category &&
                              ticket?.doorTicket
                          )?.length
                        }
                      </Text>
                    </View>
                    {/* <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      // position: "absolute",
                      alignSelf: "flex-end",
                      // right: 0,

                      // position: "absolute",
                      // left: 210,
                      // position: "absolute",
                      // left: 100,
                      // marginVertical: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.black2,
                        // marginLeft: 10,
                        fontSize: 15,
                        fontWeight: "600",
                        textAlign: "left",
                      }}
                    >
                      Total:
                    </Text>
                    <Text
                      style={{
                        color: colors.black2,
                        marginLeft: 5,
                        fontSize: 15,
                        fontWeight: "600",
                      }}
                    >
                      {`cve ${sales}`}
                    </Text>
                  </View> */}
                  </View>
                </View>
              );
            }}
            ListFooterComponent={
              <>
                <View
                  style={[styles.separator, { marginTop: 5, marginBottom: 10 }]}
                />
                <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
                  <View style={{ marginRight: 10 }}>
                    <Text style={styles.description}>Valor bruto:</Text>
                    <View
                      style={[
                        {
                          flexDirection: "row",
                          alignItems: "center",
                          // backgroundColor: "red",
                          alignSelf: "flex-end",
                          // left: 25,
                        },
                      ]}
                    >
                      <Text style={styles.description}>- Taxa:</Text>

                      {/* <Text
                        style={[
                          styles.description,
                          { color: colors.primary, alignSelf: "flex-start" },
                        ]}
                      >
                        cve
                      </Text> */}
                    </View>
                    {doorTicketSales > 0 && (
                      <Text style={styles.description}>- Taxa Porta:</Text>
                    )}
                    <Text style={[styles.description, { marginTop: 5 }]}>
                      Total:
                    </Text>
                  </View>

                  <View style={{ marginRight: 2 }}>
                    <Text
                      style={[
                        styles.description,
                        { color: colors.t5, alignSelf: "flex-start" },
                      ]}
                    >
                      cve
                    </Text>
                    <Text
                      style={[
                        styles.description,
                        { color: colors.t5, alignSelf: "flex-start" },
                      ]}
                    >
                      cve
                    </Text>
                    {doorTicketSales > 0 && (
                      <Text
                        style={[
                          styles.description,
                          { color: colors.t5, alignSelf: "flex-start" },
                        ]}
                      >
                        cve
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.description,
                        {
                          color: colors.t5,
                          alignSelf: "flex-start",
                          marginTop: 5,
                        },
                      ]}
                    >
                      cve
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={[styles.amount, { alignSelf: "flex-end" }]}
                    >{`${formatNumber(totalTicketsSold)}`}</Text>
                    <Text
                      style={[
                        styles.amount,
                        {
                          color: colors.t5,
                          fontWeight: "500",
                          alignSelf: "flex-end",
                        },
                      ]}
                    >{`${formatNumber(
                      (totalTicketsSold * fee).toFixed()
                    )}`}</Text>
                    {doorTicketSales > 0 && (
                      <Text
                        style={[
                          styles.amount,
                          {
                            color: colors.t4,
                            alignSelf: "flex-end",
                            fontWeight: "500",
                          },
                        ]}
                      >
                        {`${formatNumber(doorTaxes)}`}
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.amount,
                        {
                          color: colors.t4,
                          alignSelf: "flex-end",
                          marginTop: 5,
                        },
                      ]}
                    >
                      {`${formatNumber(
                        totalTicketsSold - taxedTotal - doorTaxes
                      )}`}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.separator,
                    { width: 200, position: "absolute", bottom: 25, right: 0 },
                  ]}
                />
              </>
            }
          />
        </View>

        <View
          style={{
            backgroundColor: colors.background2,
            shadowOffset: { width: 0.5, height: 0.5 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 0.5,
            // paddingHorizontal: 10,
            padding: 10,
            marginTop: 20,
            borderRadius: 10,
          }}
          // onPress={() => navigation.navigate("addEvent", item)}
        >
          <Text
            style={[
              {
                textAlign: "center",
                fontWeight: "500",
                color: colors.t3,

                fontSize: 17,
                fontWeight: "500",
                marginTop: 3,
                marginBottom: 15,
              },
            ]}
          >
            Ações Rápidas
          </Text>
          {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary2,
              padding: 10,
              borderRadius: 5,
              width: "48%",
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.white }}>Check-in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary2,
              padding: 10,
              borderRadius: 5,
              width: "48%",
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.white }}>Editar</Text>
          </TouchableOpacity>
        </View> */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: 10,
              marginBottom: 15,
              // width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                color: colors.t4,
              }}
            >
              Vender Bilhete
            </Text>

            <TouchableOpacity
              onPress={handlePurchaseSheet}
              style={{ right: 10 }}
            >
              <FontAwesome
                name={"plus-circle"}
                size={30}
                color={colors.t4}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: 10,
              // width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                color: colors.t4,
              }}
            >
              Suspender venda de bilhetes
            </Text>

            <Switch
              disabled={loading}
              value={suspendTickets}
              onChange={() => {
                suspendTickets
                  ? (setSuspendTickets(false), haltSales())
                  : Alert.alert(
                      "Suspender venda de bilhetes!",
                      "Tem certeza que deseja suspender a venda de bilhetes?",
                      [
                        {
                          text: "Não",
                          onPress: () => null,
                          style: "cancel",
                        },
                        { text: "Sim", onPress: () => haltSales() },
                      ]
                    );
              }}
              thumbColor={colors.white}
              trackColor={{ true: colors.primary }}
            />
          </View>
        </View>
        <View style={{ marginBottom: 50 }} />
      </Animated.ScrollView>
      <TicketPurchaseSheet
        purchaseSheetRef={bottomSheetModalRef}
        // setPurchaseModalUp={setPurchaseModalUp}
        // purchaseModalUp={purchaseModalUp}
        doorTicket={true}
        Event={event}
      />
    </>
  );
};

export default Overview;

const styles = StyleSheet.create({
  section: {
    color: colors.t2,
    fontSize: 16,
    fontWeight: "400",
  },
  sectionText: {
    maxWidth: "99.75%",
    color: colors.t4,
    fontSize: 17,
    fontWeight: "400",
    marginTop: 3,
    marginBottom: 15,
  },

  section2: {
    color: colors.t2,
    fontSize: 16,
    fontWeight: "400",
  },
  sectionText2: {
    color: colors.t4,
    fontSize: 15,
    fontWeight: "500",
    top: 5,
  },
  section3: {
    top: 25,
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  eventTitle: {
    color: colors.t2,
    fontSize: 21,
    fontWeight: "600",
    textAlign: "center",
    top: 15,
    marginTop: 20,
    // marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: colors.separator,
    width: "95%",
    marginVertical: 3,
    alignSelf: "center",
  },
  description: {
    color: colors.t4,
    fontSize: 15.5,
    fontWeight: "600",
    textAlign: "right",
    marginBottom: 5,
  },
  amount: {
    color: colors.t3,
    marginLeft: 5,
    fontSize: 15.5,
    fontWeight: "500",
    textAlign: "left",
    marginBottom: 5,
    alignSelf: "flex-start",
  },
});
