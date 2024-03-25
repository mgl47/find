import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import uuid from "react-native-uuid";
import { useAuth } from "../../../components/hooks/useAuth";
import { useDesign } from "../../../components/hooks/useDesign";
import { ActivityIndicator } from "react-native-paper";
import colors from "../../../components/colors";
import CountDown from "react-native-countdown-component";

const Overview = ({ navigation, navigation: { goBack }, route }) => {
  const uuidKey = uuid.v4();
  const routeEvent = route.params;
  const [index, setIndex] = useState(1);
  const { height, width } = useDesign();
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

  return (
    <View>
      <View style={{ padding: 10 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            color: colors.primary,
            alignSelf: "center",
            // marginVertical: 10,
          }}
        >
          {event?.title}
        </Text>
      </View>
      <CountDown
        size={20}
        until={differenceInSeconds}
        // onFinish={() => alert('Finished')}
        digitStyle={{ backgroundColor: colors.primary }}
        digitTxtStyle={{ color: colors.white }}
        timeLabelStyle={{ color: colors.primary, fontWeight: "bold" }}
        separatorStyle={{ color: colors.primary }}
        timeToShow={[differenceInSeconds > 86000 ? "D" : "", "H", "M", "S"]}
        timeLabels={{ d: "dias", h: "horas", m: "minutos", s: "segundos" }}
        showSeparator
      />
    </View>
  );
};

export default Overview;
