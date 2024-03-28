import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
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
} from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import Screen from "../../Screen2";
import SignInScreen from "../../../screens/authScreens/SignInScreen";
import SignUpScreen from "../../../screens/authScreens/SignUpScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import colors from "../../colors";
import Animated, { SlideInDown } from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Tab = createMaterialTopTabNavigator();
const AuthBottomSheet = ({ Event, authSheetRef, setAuthModalUp }) => {
  // const{authSheetRef}=useAuth()
  const snapPoints = useMemo(() => ["60", "85%"], []);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  const handleSheetChanges = useCallback((index) => {}, []);
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={authSheetRef}
        // index={keyboardVisible ? 1 : 0}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onDismiss={() => {
          Keyboard.dismiss(), setAuthModalUp(false);
        }}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={{ flex: 1 }}
          style={{
            padding: 10,
            flex: 1,
            backgroundColor: colors.background,
            // marginBottom: 200,
          }}
        >
          {/* <BottomSheetView style={styles.contentContainer}> */}
          <BottomSheetScrollView contentContainerStyle={{ flex: 1 }}>
            {/* <View style={{ flex: 1 }}> */}
            <Tab.Navigator
              screenOptions={{
                tabBarActiveTintColor: colors.primary,

                tabBarInactiveTintColor: colors.darkGrey,
                tabBarIndicatorContainerStyle: {
                  backgroundColor: colors.background,
                },
                tabBarLabelStyle: {
                  fontWeight: "600",
                  fontSize: 14,
                  color: colors.black2,
                },
                tabBarIndicatorStyle: {
                  width: "40%",
                  left: "5%",
                  backgroundColor: colors.primary,
                },
              }}
            >
              <Tab.Screen name="Entrar" component={SignInScreen} />
              <Tab.Screen name="Criar Conta" component={SignUpScreen} />
            </Tab.Navigator>
            {/* </View> */}
            {/* </BottomSheetView> */}
          </BottomSheetScrollView>
        </KeyboardAwareScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default AuthBottomSheet;

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    backgroundColor: colors.white,

    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 40,
    borderBottomWidth: 0.2,
    borderColor: colors.grey,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.3,
    // shadowRadius: -3,
    // elevation: 2
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
  },
});
