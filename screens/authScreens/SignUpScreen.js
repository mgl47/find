import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import colors from "../../components/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SignUpScreen = () => {
  const [user, setUser] = useState({ userName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showRepPassword, setShowRepPassword] = useState(false);

  const [confPassword, setConfPassword] = useState("");

  return (
    <View style={{ padding: 10 }}>
      <TextInput
        style={{ marginBottom: 5 }}
        underlineStyle={{ backgroundColor: colors.primary }}
        contentStyle={{ backgroundColor: colors.background ,fontWeight:"500"}}
        label="Nome de usuário (único)"
        activeUnderlineColor={colors.primary}
        value={user?.userName}
        onChangeText={(text) => setUser({ ...user, userName: text })}
      />
      <TextInput
        style={{ marginBottom: 5 }}
        underlineStyle={{ backgroundColor: colors.primary }}
        contentStyle={{ backgroundColor: colors.background ,fontWeight:"500"}}
        label="Email"
        activeUnderlineColor={colors.primary}
        value={user?.email}
        onChangeText={(text) => setUser({ ...user, email: text })}
      />
      <TextInput
        style={{ marginBottom: 5, backgroundColor: colors.background }}
        underlineStyle={{ backgroundColor: colors.primary }}
        contentStyle={{ backgroundColor: colors.background,fontWeight:"500" }}
        right={
          <TextInput.Icon
            onPress={() => setShowPassword(!showPassword)}
            icon={showPassword ? "eye" : "eye-off"}
          />
        }
        secureTextEntry={!showPassword}
        label="Palavra Passe"
        activeUnderlineColor={colors.primary}
        value={user?.password}
        onChangeText={(text) => setUser({ ...user, password: text })}
      />
      <TextInput
        style={{ marginBottom: 30, backgroundColor: colors.background }}
        underlineStyle={{ backgroundColor: colors.primary }}
        contentStyle={{ backgroundColor: colors.background ,fontWeight:"500"}}
        right={
          <TextInput.Icon
            onPress={() => setShowRepPassword(!showRepPassword)}
            icon={showRepPassword ? "eye" : "eye-off"}
          />
        }
        secureTextEntry={!showRepPassword}
        label="Confirmar Palavra Passe"
        activeUnderlineColor={colors.primary}
        value={confPassword}
        onChangeText={(text) => setConfPassword(text)}
      />
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
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({});
