import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import uuid from "react-native-uuid";
import { useAuth } from "../../../components/hooks/useAuth";
import { useDesign } from "../../../components/hooks/useDesign";
import { ActivityIndicator } from "react-native-paper";
import colors from "../../../components/colors";
import CountDown from "react-native-countdown-component";
import { Image } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../../../components/hooks/useData";
const Overview = ({ navigation, navigation: { goBack }, route }) => {
  const uuidKey = uuid.v4();
  const routeEvent = route.params;
  const [index, setIndex] = useState(1);
  const { height, width } = useDesign();
  const { formatNumber } = useData();

  const { user, myEvents } = useAuth();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);

  const getSelectedEvent = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setEvent(myEvents?.filter((myEvent) => myEvent?._id == routeEvent?._id)[0]);
    setLoading(false);
  };

  useEffect(() => {
    getSelectedEvent();
  }, []);

  if (loading || event === null) {
    return (
      <View style={{ top: 20 }}>
        <ActivityIndicator animating={true} color={colors.primary} />
      </View>
    );
  }

  const currentDate = new Date();
  // Target date
  const targetDate = new Date(event?.dates[0]?.date);
  // Calculate the difference in milliseconds between the two dates
  const differenceInMilliseconds = targetDate.getTime() - currentDate.getTime();
  // Convert milliseconds to seconds
  const differenceInSeconds = differenceInMilliseconds / 1000;

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

  return (
    <Animated.ScrollView
    showsVerticalScrollIndicator={false}
      style={{ padding: 10 ,backgroundColor:colors.background }}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <View
        entering={FadeIn}
        exiting={FadeOut}
        style={{
          backgroundColor: colors.white,
          shadowOffset: { width: 0.5, height: 0.5 },
          shadowOpacity: 0.2,
          shadowRadius: 1,
          elevation: 0.5,
          paddingHorizontal: 10,
          padding: 10,
          marginTop: 50,
          borderRadius: 10,
        }}
        // onPress={() => navigation.navigate("addEvent", item)}
      >
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              height: 250,
              width: 180,
              borderRadius: 5,
              marginLeft: 20,
              bottom: 50,
              shadowOffset: { width: 0.5, height: 0.5 },
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
              source={{ uri: event?.photos?.[0]?.[0]?.uri }}
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
            <Text style={{    color: colors.black2,
    fontSize: 17,
    fontWeight: "500",
    marginTop: 3,
    marginBottom: 15,}}>
              {event?.venue?.displayName +
                ", " +
                event?.venue?.address?.zone +
                ", " +
                event?.venue?.address?.city}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <View
              style={{
                marginLeft: 20,
                top: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.section2}>Bilhetes:</Text>
              <Text style={styles.sectionText2}>{totalTickets}</Text>
            </View>
            <View
              style={{
                marginLeft: 20,
                top: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.section2}>Vendidos:</Text>
              <Text style={[styles.sectionText2, { color: colors.primary }]}>
                {event?.attendees?.length}
              </Text>
            </View>
            <View
              style={{
                marginLeft: 20,
                top: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.section2}>check in:</Text>
              <Text style={[styles.sectionText2, { color: "green" }]}>
                {totalCheckin}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: colors.white,
          shadowOffset: { width: 0.5, height: 0.5 },
          shadowOpacity: 0.2,
          shadowRadius: 1,
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
              color: colors.darkSeparator,
              color: colors.black2,
              fontSize: 17,
              fontWeight: "500",
              marginTop: 3,
              marginBottom: 15,
            },
          ]}
        >
          Tipos de Bilhete:
        </Text>
        <FlatList
          scrollEnabled={false}
          data={event?.tickets}
          keyExtractor={(item) => item?.id}
          ItemSeparatorComponent={
            <View
              style={{
                height: 1,
                backgroundColor: colors.grey,
                width: "95%",
                marginVertical: 3,
                alignSelf: "center",
              }}
            />
          }
          renderItem={({ item }) => {
            return (
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
                      color: colors.black2,
                      marginLeft: 10,
                      fontSize: 15,
                      fontWeight: "500",
                    }}
                  >
                    {item?.category}
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.black2,
                    marginLeft: 10,
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  cve{" " + formatNumber(item?.price)}
                </Text>
              </View>
            );
          }}
        />
      </View>
    </Animated.ScrollView>
  );
};

export default Overview;

const styles = StyleSheet.create({
  section: {
    color: colors.darkGrey,
    fontSize: 17,
    fontWeight: "400",
  },
  sectionText: {
    maxWidth:"99.75%",
    color: colors.black2,
    fontSize: 17,
    fontWeight: "500",
    marginTop: 3,
    marginBottom: 15,
  },

  section2: {
    color: colors.darkGrey,
    fontSize: 17,
    fontWeight: "400",
  },
  sectionText2: {
    color: colors.black2,
    fontSize: 17,
    fontWeight: "500",
    top: 5,
  },
});

// import { View, Text, StyleSheet } from "react-native";
// import React, { useEffect, useState } from "react";
// import uuid from "react-native-uuid";
// import { useAuth } from "../../../components/hooks/useAuth";
// import { useDesign } from "../../../components/hooks/useDesign";
// import { ActivityIndicator } from "react-native-paper";
// import colors from "../../../components/colors";
// import CountDown from "react-native-countdown-component";
// import { Image } from "react-native";

// const Overview = ({ navigation, navigation: { goBack }, route }) => {
//   const uuidKey = uuid.v4();
//   const routeEvent = route.params;
//   const [index, setIndex] = useState(1);
//   const { height, width } = useDesign();
//   const { user, myEvents } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [event, setEvent] = useState(null);

//   const getSelectedEvent = async () => {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     setEvent(myEvents?.filter((myEvent) => myEvent?._id == routeEvent?._id)[0]);
//     setLoading(false);
//   };

//   useEffect(() => {
//     getSelectedEvent();
//   }, []);

//   if (loading || event === null) {
//     return (
//       <View style={{ top: 20 }}>
//         <ActivityIndicator animating={true} color={colors.primary} />
//       </View>
//     );
//   }

//   const currentDate = new Date();
//   // Target date
//   const targetDate = new Date(event?.dates[0]?.date);
//   // Calculate the difference in milliseconds between the two dates
//   const differenceInMilliseconds = targetDate.getTime() - currentDate.getTime();
//   // Convert milliseconds to seconds
//   const differenceInSeconds = differenceInMilliseconds / 1000;

//   return (
//     <View style={{ padding: 10 }}>
//       <View
//         style={{
//           backgroundColor: colors.white,
//           shadowOffset: { width: 0.5, height: 0.5 },
//           shadowOpacity: 0.3,
//           shadowRadius: 1,
//           elevation: 0.5,
//           paddingHorizontal: 10,
//           padding: 10,
//           marginTop: 50,
//           borderRadius: 10,
//         }}
//         // onPress={() => navigation.navigate("addEvent", item)}
//       >
//         <View style={{ flexDirection: "row" }}>
//           <View
//             style={{
//               height: 250,
//               width: 180,
//               borderRadius: 5,
//               marginLeft: 20,
//               bottom: 50,
//               shadowOffset: { width: 0.5, height: 0.5 },
//               shadowOpacity: 1,
//               shadowRadius: 3,
//               elevation: 3,
//               backgroundColor: colors.background,
//             }}
//           >
//             <Image
//               style={{
//                 height: 250,
//                 width: 180,
//                 borderRadius: 5,
//               }}
//               source={{ uri: event?.photos?.[0]?.[0]?.uri }}
//             />
//           </View>
//           <View style={{ padding: 10 }}>
//             <Text style={styles.section}>Data:</Text>
//             <Text style={styles.sectionText}>
//               {event?.dates?.[event?.dates?.length - 1]?.fullDisplayDate}
//             </Text>
//             <Text style={styles.section}>Hora:</Text>
//             <Text style={styles.sectionText}>{event?.dates?.[0]?.hour}</Text>
//             <Text style={styles.section}>
//               {event?.tickets?.length > 1 ? "Preços:" : "Preço:"}
//             </Text>
//             <Text style={styles.sectionText}>
//               cve{" "}
//               {event?.tickets?.length > 1
//                 ? event?.tickets?.[0]?.price +
//                   " - " +
//                   event?.tickets?.[event?.tickets?.length - 1]?.price
//                 : event?.tickets?.[0]?.price}
//             </Text>
//           </View>
//         </View>
//         <View style={{ bottom: 50 }}>
//           <View style={{ marginLeft: 20, marginTop: 20 }}>
//             <Text style={styles.section}>Local</Text>
//             <Text style={styles.sectionText}>
//               {event?.venue?.displayName +
//                 ", " +
//                 event?.venue?.address?.zone +
//                 ", " +
//                 event?.venue?.address?.city}
//             </Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default Overview;

// const styles = StyleSheet.create({
//   section: {
//     color: colors.description,
//     fontSize: 17,
//     fontWeight: "500",
//   },
//   sectionText: {
//     color: colors.black2,
//     fontSize: 17,
//     fontWeight: "600",
//     marginTop: 3,
//     marginBottom: 15,
//   },

//   section2: {
//     color: colors.description,
//     fontSize: 17,
//     fontWeight: "500",
//   },
//   sectionText2: {
//     color: colors.black2,
//     fontSize: 17,
//     fontWeight: "600",
//     marginTop: 3,
//   },
// });
