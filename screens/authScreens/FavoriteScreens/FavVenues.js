import { View, FlatList } from "react-native";
import React from "react";

import VenuesList from "../../../components/cards/Venues/VenueList";
import { useAuth } from "../../../components/hooks/useAuth";
import Animated, { FadeIn } from "react-native-reanimated";

export default function FavVenues() {
  const { userData } = useAuth();

  return (
    <Animated.FlatList
    entering={FadeIn.duration(200)}

      data={userData?.favVenues}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={<View style={{ marginTop: 5 }} />}
      renderItem={({ item }) => {
        return <VenuesList {...item} />;
      }}
      ListFooterComponent={<View style={{ marginBottom: 50 }} />}
    />
  );
}
