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
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
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
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

import { ActivityIndicator, Checkbox, Chip } from "react-native-paper";

import colors from "../../colors";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from "react-native-reanimated";
import { TextInput } from "react-native-paper";

import axios from "axios";
import { useData } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";

const { height, width } = Dimensions.get("window");

export default OverviewSalesDescription = ({ sheetRef, type }) => {
  // const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["45%", "75%"], []);

  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     "keyboardDidShow",
  //     () => setKeyboardVisible(true)
  //   );
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     "keyboardDidHide",
  //     () => setKeyboardVisible(false)
  //   );

  //   return () => {
  //     keyboardDidShowListener.remove();
  //     keyboardDidHideListener.remove();
  //   };
  // }, []);
  const handleSheetChanges = useCallback((index) => {}, []);
  const [loading, setLoading] = useState(false);
  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-2} />,
    []
  );
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        enableOverDrag={false}
        ref={sheetRef}
        backdropComponent={renderBackdrop}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        handleStyle={{
          backgroundColor: colors.background,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.t5 }}
        // onDismiss={{}}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 2,
            }}
          >
            <Text numberOfLines={2} style={styles.label}>
              Qtd:
            </Text>
            <Text numberOfLines={2} style={styles.description}>
              Quantidade total do bilhete
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
              %:
            </Text>
            <Text numberOfLines={2} style={styles.description}>
              Percentagem do bilhete vendido
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
              V:
            </Text>
            <Text numberOfLines={2} style={styles.description}>
              Quantidade de bilhetes vendidos
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
              P:
            </Text>
            <Text numberOfLines={2} style={styles.description}>
              Quantidade de bilhetes vendidos na porta
            </Text>
          </View>

          <View style={styles.separator} />
        </BottomSheetView>
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
    padding: 10,

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
  separator: {
    width: "100%",
    height: 1,
    // right: 10,
    backgroundColor: colors.black,
    marginVertical: 5,
    alignSelf: "center",
  },
  label: {
    marginRight: 5,
    fontSize: 16,
    fontWeight: "500",
    color: colors.t4,
  },
  description: {
    alignSelf: "flex-start",
    fontSize: 15,
    fontWeight: "400",
    color: colors.t5,
    marginVertical: 3,
  },
});
