import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import colors from "../../components/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const SignInScreen = () => {
  //   const [text, setText] = useState("");
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={{ padding: 10 }}>
      <TextInput
      
        style={{ marginBottom: 5 }}
        underlineStyle={{ backgroundColor: colors.primary }}
        contentStyle={{ backgroundColor: colors.background }}
        label="Nome de usuário ou Email"

        
        activeUnderlineColor={colors.primary}

        value={user?.email}
        onChangeText={(text) => setUser({ ...user, email: text })}
      />
      <TextInput
        style={{ marginBottom: 20, backgroundColor: colors.background }}
        underlineStyle={{ backgroundColor: colors.primary }}
        contentStyle={{ backgroundColor: colors.background }}
        label="Palavra Passe"
        activeUnderlineColor={colors.primary}

        right={
          <TextInput.Icon
            onPress={() => setShowPassword(!showPassword)}
            icon={showPassword ? "eye" : "eye-off"}
          />
        }
        secureTextEntry={!showPassword}
        value={user?.password}
        onChangeText={(text) => setUser({ ...user, password: text })}
      />
      <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 20 }}>
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
      <TouchableOpacity
        style={{
          alignSelf: "center",
          flexDirection: "row",
          height: 50,
          width: "90%",
          backgroundColor: colors.primary,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
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
          Entrar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({});
