import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-paper";
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
const SignInScreen = () => {
  //   const [text, setText] = useState("");
  const [user, setUser] = useState({ email: "", password: "" });
  const[firstMount,setFirstMount]=useState(true)
  const [showPassword, setShowPassword] = useState(false);
  const [onPassRecovery, setOnPassRecovery] = useState(false);
useEffect(() => {
 setFirstMount(false)
}, [])

  return (
    <View style={{ padding: 10, backgroundColor: colors.background }}>
      <TextInput
        style={{ marginBottom: 5 }}
        underlineStyle={{ backgroundColor: colors.primary }}
        contentStyle={{ backgroundColor: colors.background }}
        label="Nome de usuário ou Email"
        activeUnderlineColor={colors.primary}
        value={user?.email}
        onChangeText={(text) => setUser({ ...user, email: text })}
      />

      {!onPassRecovery && (
        <Animated.View
          entering={firstMount?null:SlideInUp.duration(400)}
          exiting={firstMount?null:SlideOutUp.duration(1000)}
          style={{}}
        >
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
        </Animated.View>
      )}
      {!onPassRecovery && (
        <Animated.View
          entering={firstMount?null:SlideInRight.duration(500)}
          exiting={firstMount?null:SlideOutRight.duration(500)}
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
          entering={firstMount?null:SlideInRight.duration(500)}
          exiting={firstMount?null:SlideOutRight.duration(500)}
        >
          <TouchableOpacity
            onPress={() => setOnPassRecovery(!onPassRecovery)}
            style={{ alignSelf: "flex-end", marginBottom: 20,marginTop:15, }}
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
        
        <Animated.Text
           entering={firstMount?null:SlideInRight.duration(500)}
           exiting={firstMount?null:SlideOutRight.duration(500)}
          style={{
            color: colors.white,
            marginLeft: 5,
            fontSize: 17,
            fontWeight: "500",
          }}
        >
          {!onPassRecovery?"Entrar":"Recuperar"}
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({});
