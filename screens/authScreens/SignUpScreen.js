import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import colors from "../../components/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BlockModal from "../../components/screensComponents/BlockModal";
import axios from "axios";
import { useAuth } from "../../components/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SignUpScreen = () => {
  const navigation = useNavigation();

  const url = process.env.EXPO_PUBLIC_API_URL;
  const { setUser ,authSheetRef,setHeaderToken} = useAuth();

  const [person, setPerson] = useState({
    username: "",
    email: "",
    password: "",
    confPassword: "",
  });
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isUsernameValid, setIsUsernameValid] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showRepPassword, setShowRepPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [loading, setLoading] = useState(false);
  const [firstAttempt, setFirstAttempt] = useState(true);

  function validateEmail(text) {
    // Regular expression to match email format
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(text != "" && regex.test(text));
    setPerson({ ...person, email: text });
  }
  function validateUsername(text) {
    // Regular expression to match email format
    const regex = /^[a-z0-9._]+$/i;
    setIsUsernameValid(text != "" && regex.test(text));
    setPerson({ ...person, username: text });
  }
  function validatePassword(text) {
    setIsPasswordValid(text != "" && person.password == text);
    setPerson({ ...person, confPassword: text });
  }

  const validated = isEmailValid && isPasswordValid && isUsernameValid;

  const signUp = async () => {
    setErrorMsg("");
    setFirstAttempt(false);
    setLoading(true);
    try {
      if (validated) {
        const response = await axios.post(
          `${url}/auth/register`,
          {
            username: person.username.toLocaleLowerCase(),
            email: person.email.toLocaleLowerCase(),
            password: person.confPassword.toLocaleLowerCase(),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setHeaderToken("Bearer " + response.data.token)

        setUser(response.data.user);
        await AsyncStorage.setItem("headerToken", "Bearer "+response.data.token);
        authSheetRef?.current?.close()

        navigation.openDrawer();
      }
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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAwareScrollView
        style={{
          padding: 10,
          flex: 1,
          backgroundColor: colors.background,
          // marginBottom: 200,
        }}
      >
        <BlockModal active={loading} />

        <TextInput
          error={!isUsernameValid}
          style={{ marginBottom: 10, backgroundColor: colors.background }}
          underlineStyle={{ backgroundColor: colors.primary }}
          mode="outlined"
          outlineColor={colors.primary}
          activeOutlineColor={colors.primary}
          // contentStyle={{ backgroundColor: colors.background, fontWeight: "500" }}
          label="Nome de usuário (único)"
          activeUnderlineColor={colors.primary}
          value={person?.username}
          onChangeText={validateUsername}
          autoCapitalize="none"
        />
        <TextInput
          error={!isEmailValid}
          style={{ marginBottom: 10, backgroundColor: colors.background }}
          underlineStyle={{ backgroundColor: colors.primary }}
          mode="outlined"
          activeOutlineColor={colors.primary}
          outlineColor={colors.primary}
          // contentStyle={{ backgroundColor: colors.background, fontWeight: "500" }}
          label="Email"
          activeUnderlineColor={colors.primary}
          value={person?.email}
          onChangeText={validateEmail}
          autoCapitalize="none"

          // onChangeText={(text) => setUser({ ...user, email: text })}
        />
        <TextInput
          style={{ marginBottom: 10, backgroundColor: colors.background }}
          underlineStyle={{ backgroundColor: colors.primary }}
          mode="outlined"
          outlineColor={colors.primary}
          activeOutlineColor={colors.primary}
          // contentStyle={{ backgroundColor: colors.background, fontWeight: "500" }}
          right={
            <TextInput.Icon
              onPress={() => setShowPassword(!showPassword)}
              icon={showPassword ? "eye" : "eye-off"}
            />
          }
          secureTextEntry={!showPassword}
          label="Palavra Passe"
          activeUnderlineColor={colors.primary}
          value={person?.password}
          onChangeText={(text) => setPerson({ ...person, password: text })}
          autoCapitalize="none"
        />
        <TextInput
          error={!isPasswordValid}
          mode="outlined"
          outlineColor={colors.primary}
          activeOutlineColor={colors.primary}
          style={{ marginBottom: 20, backgroundColor: colors.background }}
          // style={{ marginBottom: 30, backgroundColor: colors.background }}
          underlineStyle={{ backgroundColor: colors.primary }}
          // contentStyle={{ backgroundColor: colors.background, fontWeight: "500" }}
          right={
            <TextInput.Icon
              onPress={() => setShowRepPassword(!showRepPassword)}
              icon={showRepPassword ? "eye" : "eye-off"}
            />
          }
          secureTextEntry={!showRepPassword}
          label="Confirmar Palavra Passe"
          activeUnderlineColor={colors.primary}
          value={person.confPassword}
          onChangeText={validatePassword}
          onSubmitEditing={validated ? signUp : null}
          autoCapitalize="none"
        />
        <View>
          <Text
            style={{
              position: "absolute",
              color: "#b00000",
              left: 15,
              top: -25,
            }}
          >
            {errorMsg}
          </Text>
          <TouchableOpacity
            disabled={!validated}
            onPress={signUp}
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
            }}
          >
            <MaterialCommunityIcons
              name="account-outline"
              size={24}
              color={colors.white}
            />
            <Text
              style={{
                color: colors.white,
                marginLeft: 5,
                fontSize: 17,
                fontWeight: "500",
              }}
            >
              Criar Conta
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({});
