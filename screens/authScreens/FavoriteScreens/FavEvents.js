import { View, FlatList } from "react-native";
import React from "react";
import SmallCard from "../../../components/cards/SmallCard";
import { useAuth } from "../../../components/hooks/useAuth";

export default function FavEvents() {
  const { userData } = useAuth();
  console.log("userData", userData?.favEvents?.length);
  return (
    <FlatList
      data={userData?.favEvents}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={<View style={{ marginTop: 5 }} />}
      renderItem={({ item }) => {
        return <SmallCard {...item} />;
      }}
      ListFooterComponent={<View style={{ marginBottom: 50 }} />}
    />
  );
}
