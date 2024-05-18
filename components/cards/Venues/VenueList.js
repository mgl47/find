import { Image, Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import colors from "../../colors";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function VenuesList(item) {

    const navigation=useNavigation()
  return (
    <View
      style={{
        paddingHorizontal: Platform?.OS === "ios" ? 10 : 0,
        marginTop: 10,
        borderRadius: 10,
        paddingVertical: Platform?.OS === "ios" ? 1 : 0,
        // shadowOffset: { width: 0.5, height: 0.5 },
        // shadowOpacity: 0.3,
        // shadowRadius: 1,
        // elevation: 2,
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 0.5,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          backgroundColor: colors.background2,
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate("venue", {item});
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                marginRight: 10,
                borderWidth: 0.1,
              }}
              source={{
                uri: item?.photos[3]?.[item?.photos[3]?.length - 1]?.uri,
              }}
            />
            <View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "500",
                  color: colors.t2,
                }}
              >
                {item?.displayName}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "500",
                  color: colors.t4,
                  left: 1,
                }}
              >
                {item?.address?.zone + ", " + item?.address?.city}
              </Text>
            </View>
          </View>

          <Entypo name="chevron-right" size={24} color={colors.t4} />
        </TouchableOpacity>

        {item?.description && <View style={styles.separator} />}
        {item?.description && (
          <View style={{ padding: 10 }}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 13,
                fontWeight: "500",
                color: colors.t4,
              }}
            >
              {item?.description}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
separator: {
      width: "95%",
      height: 1,
      backgroundColor: colors.separator,
      marginBottom: 2,
      alignSelf: "center",
    },
  });