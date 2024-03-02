import React, { forwardRef } from "react";
import { TextInput, StyleSheet, View, TouchableOpacity } from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "./colors";

const AppTextInput = forwardRef((props, ref) => {
  const {
    value,
    padding,
    width,
    placeholder,
    keyboardType,
    secureTextEntry,
    autoCapitalize,
    onChangeText,
    onChange,
    icon,
    onDelete,
    autoCorrect,
    textContentType,
    onBlur,
    numberOfLines,
    multiline,
    maxLength,
    defaultValue,
    onSubmitEditing,
    autoFocus,
    returnKeyType,
    clearButtonMode,
    inputWidth,
    placeholderTextColor,
    iconColor,
    textColor,
    ...otherProps
  } = props;
  return (
    <View style={[styles.container, { width }, { padding }, { ...otherProps }]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={iconColor ? iconColor : colors.description}
          style={styles.icon}
        />
      )}

      <TextInput
        ref={ref} // Set the ref for the text input
        placeholderTextColor={
          placeholderTextColor ? placeholderTextColor : colors.description
        }
        placeholder={placeholder}
        style={[
          styles.input,
          {
            width: inputWidth ? inputWidth : value ? "83%" : "90%",
            color: textColor ? textColor : colors.black,
          },
        ]}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        onChange={onChange}
        textContentType={textContentType}
        onBlur={onBlur}
        numberOfLines={numberOfLines}
        multiline={multiline}
        maxLength={maxLength}
        onSubmitEditing={onSubmitEditing}
        defaultValue={defaultValue}
        value={value}
        autoFocus={autoFocus}
        returnKeyType={returnKeyType}
        clearButtonMode={clearButtonMode}
      />
      {value && onDelete && (
        <TouchableOpacity onPress={onDelete}>
          <Entypo
            name="circle-with-cross"
            size={18}
            color={iconColor ? iconColor : colors.description}
            style={styles.icon2}
          />
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    fontSize: 15,
    width: "90%",
    justifyContent: "center",
    height: 40,
    bottom: 15,
  },
  container: {
    backgroundColor: colors.grey,
    borderRadius: 25,
    flexDirection: "row",
    width: "100%",
    padding: 15,
    marginVertical: 10,
    height: 40,
    alignSelf: "center",
  },
  icon: {
    marginRight: 10,
    // color: colors.description,
  },
  icon2: {
    // marginLeft: 10,
    position: "absolute",
    right: -20,
    alignSelf: "center",
    // color: colors.description,
  },
});

export default AppTextInput;
