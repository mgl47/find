import { StyleSheet, Text, View } from "react-native";
import React from "react";

const AppInput = (props) => {
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
    </View>
  );
};

export default AppInput;

const styles = StyleSheet.create({});
