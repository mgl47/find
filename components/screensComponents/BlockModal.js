import { View, Text, Modal } from "react-native";
import React from "react";

const BlockModal = ({ active }) => {
  return (
    <Modal
      visible={active}
      animationType="slide"
      // presentationStyle="formSheet"
      transparent
    ></Modal>
  );
};

export default BlockModal;
