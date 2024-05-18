import { View, FlatList } from "react-native";
import React from "react";

import VenuesList from "../../../components/cards/Venues/VenueList";
import { useAuth } from "../../../components/hooks/useAuth";

export default function FavVenues() {
  const { userData } = useAuth();

  return (
    <FlatList
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
