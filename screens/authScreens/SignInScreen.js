import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, TextInput } from "react-native-paper";
import colors from "../../components/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
} from "react-native-reanimated";
import axios from "axios";
import BlockModal from "../../components/screensComponents/BlockModal";
import { useAuth } from "../../components/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ScrollView } from "react-native-gesture-handler";

const SignInScreen = () => {
  const navigation = useNavigation();

  const { getUpdatedUser, setUser, setHeaderToken, authSheetRef } = useAuth();
  const [person, setPerson] = useState({ email: "", password: "" });
  const [firstMount, setFirstMount] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [onPassRecovery, setOnPassRecovery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstAttempt, setFirstAttempt] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    setFirstMount(false);
  }, []);
  const url = process.env.EXPO_PUBLIC_API_URL;
  const validated = person.email && person.password;

  const signIn = async () => {
    Keyboard.dismiss();
    setErrorMsg("");

    setFirstAttempt(false);
    setLoading(true);
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 1500);
    });
    try {
      if (validated) {
        const response = await axios.post(
          `${url}/auth/login`,
          {
            username: person.email,
            password: person.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status == 200) {
          setUser(response.data.user);
          setHeaderToken("Bearer " + response.data.token);
          await AsyncStorage.setItem(
            "headerToken",
            "Bearer " + response.data.token
          );

          const jsonValue = JSON.stringify(response.data.user);
          await AsyncStorage.setItem("user", jsonValue);
          authSheetRef?.current?.close();
          navigation.openDrawer();
          getUpdatedUser(
            response.data.user?._id,
            "Bearer " + response.data.token
          );
        }
        // await new Promise((resolve,reject) => setTimeout(resolve, 1500));
      }
      Keyboard.dismiss();
    } catch (error) {
      if (error.response) {
        console.log(error?.response?.data?.msg);
        setErrorMsg(error.response.data.msg);
      } else {
        console.log(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     header: () => <ActivityIndicator color={colors.primary} />,
  //   });
  // }, [loading,]);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAwareScrollView
        // keyboardShouldPersistTaps="never"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          padding: 10,
          backgroundColor: colors.background,
          flex: 1,
          // marginBottom: 300,
        }}
      >
        {/* <View> */}
        <BlockModal active={loading} />
        <TextInput
          error={!firstAttempt && !person.email}
          style={{ marginBottom: 5, backgroundColor: colors.background }}
          // autoFocus
          mode="outlined"
          activeOutlineColor={colors.primary}
          underlineStyle={{ backgroundColor: colors.primary }}
          outlineColor={colors.primary}
          // contentStyle={{  fontWeight: "500",borderColor:"red" }}
          label="Nome de usuário ou Email"
          activeUnderlineColor={colors.primary}
          value={person?.email}
          onChangeText={(text) => setPerson({ ...person, email: text })}
        />

        {!onPassRecovery && (
          <Animated.View
            entering={firstMount ? null : SlideInUp.duration(400)}
            exiting={firstMount ? null : SlideOutUp.duration(1000)}
            style={{}}
          >
            <TextInput
              error={!firstAttempt && !person.password}
              style={{ marginBottom: 20, backgroundColor: colors.background }}
              underlineStyle={{ backgroundColor: colors.primary }}
              mode="outlined"
              outlineColor={colors.primary}
              activeOutlineColor={colors.primary}
              label="Palavra Passe"
              activeUnderlineColor={colors.primary}
              right={
                <TextInput.Icon
                  onPress={() => setShowPassword(!showPassword)}
                  icon={showPassword ? "eye" : "eye-off"}
                />
              }
              secureTextEntry={!showPassword}
              value={person?.password}
              onChangeText={(text) => setPerson({ ...person, password: text })}
              onSubmitEditing={validated ? signIn : null}
            />
          </Animated.View>
        )}
        {!onPassRecovery && (
          <Animated.View
            entering={firstMount ? null : SlideInRight.duration(500)}
            exiting={firstMount ? null : SlideOutRight.duration(500)}
          >
            <TouchableOpacity
              onPress={() => setOnPassRecovery(!onPassRecovery)}
              style={{ alignSelf: "flex-end", marginBottom: 20 }}
            >
              <Text
                style={{
                  color: colors.primary,
                  marginLeft: 5,
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                Esqueceu a palavra passe?
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        {onPassRecovery && (
          <Animated.View
            entering={firstMount ? null : SlideInRight.duration(500)}
            exiting={firstMount ? null : SlideOutRight.duration(500)}
          >
            <TouchableOpacity
              onPress={() => setOnPassRecovery(!onPassRecovery)}
              style={{ alignSelf: "flex-end", marginBottom: 20, marginTop: 15 }}
            >
              <Text
                style={{
                  color: colors.primary,
                  marginLeft: 5,
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                Já tem uma conta?
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        <View>
          <Text
            style={{
              position: "absolute",
              color: "#b00000",
              left: 15,
              top: -52,
            }}
          >
            {errorMsg}
          </Text>
          <TouchableOpacity
            disabled={!validated}
            onPress={signIn}
            style={{
              alignSelf: "center",
              flexDirection: "row",
              height: 50,
              width: "90%",
              backgroundColor: colors.primary,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              shadowOffset: { width: 0.5, height: 0.5 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              elevation: 2,
              marginBottom: 15,
            }}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={24}
                  color={colors.white}
                />

                <Animated.Text
                  entering={firstMount ? null : SlideInRight.duration(500)}
                  exiting={firstMount ? null : SlideOutRight.duration(500)}
                  style={{
                    color: colors.white,
                    marginLeft: 5,
                    fontSize: 17,
                    fontWeight: "500",
                  }}
                >
                  {!onPassRecovery ? "Entrar" : "Recuperar"}
                </Animated.Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({});
