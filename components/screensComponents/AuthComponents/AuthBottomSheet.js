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
  BottomSheetBackdrop,
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
import { useAuth } from "../../hooks/useAuth";

const Tab = createMaterialTopTabNavigator();
const AuthBottomSheet = ({ Event, setAuthModalUp, authSheetRef2 }) => {
  const { authSheetRef } = useAuth();
  const snapPoints = useMemo(() => ["60", "75%", "85%"], []);
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

  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />,
    []
  );
  const handleSheetChanges = useCallback((index) => {}, []);
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        // keyboardBehavior=""
        ref={authSheetRef2 ?? authSheetRef}
        // index={keyboardVisible ? 1 : 0}
        // style={{zIndex:1000}}
        backdropComponent={renderBackdrop}
        index={keyboardVisible ? 2 : 1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onDismiss={() => {
          Keyboard.dismiss();
          setAuthModalUp && setAuthModalUp(false);
        }}
        enableOverDrag={false}
        handleStyle={{
          backgroundColor: colors.background,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.t5 }}
      >
        <TouchableWithoutFeedback
          onPressIn={() => Keyboard.dismiss()}
          style={{ flex: 1 }}
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
                  tabBarActiveTintColor: colors.t1,

                  tabBarInactiveTintColor: colors.t5,

                  tabBarIndicatorContainerStyle: {
                    backgroundColor: colors.background,
                  },

                  tabBarLabelStyle: {
                    fontWeight: "500",
                    fontSize: 14,
                    // color: colors.t2,
                  },
                  tabBarIndicatorStyle: {
                    width: "40%",
                    left: "5%",
                    backgroundColor: colors.t1,
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
        </TouchableWithoutFeedback>
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
