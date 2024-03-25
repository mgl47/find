import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../components/hooks/useAuth";
import { ActivityIndicator } from "react-native-paper";
import colors from "../../../components/colors";

const Staff = ({ navigation, navigation: { goBack }, route }) => {
  const routeEvent = route.params;

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
  return (
    <View>
      <FlatList />
    </View>
  );
};

export default Staff;
