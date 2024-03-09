import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Header from "../../components/navigation/Header";
import Screen from "../../components/Screen2";
import Svg, { Path, Defs, ClipPath, Image as SvgImage } from "react-native-svg";
import { RNHoleView } from "react-native-hole-view";
import BigTicket from "../../components/tickets/BigTicket";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../components/colors";
import { Camera, CameraType } from "expo-camera";
import { SimpleLineIcons } from "@expo/vector-icons";

import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = ({ navigation, navigation: { goBack }, route }) => {
  const { height, width } = useWindowDimensions();
  const [selected, setSelected] = useState("");
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1, padding: 10 }}>
      <View
      
        style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
      >
        <Text
          style={{ fontSize: 18, fontWeight: "500", color: colors.darkGrey, }}
        >
          Primeiro Nome
        </Text>
      </View>
      {/* <BottomSheetModalProvider>
    <View style={styles.sheetContainer}>
      <Button
        onPress={handlePresentModalPress}
        title="Present Modal"
        color="black"
      />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  </BottomSheetModalProvider> */}
    </View>
    // </Screen>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
