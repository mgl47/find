import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import colors from "../colors";

const DesignContext = createContext();

export const DesignProvider = ({ children }) => {
  const { height, width } = Dimensions.get("window");
  const isIPhoneWithNotch =
    Platform.OS === "ios" &&
    (Dimensions.get("window").height === 852 ||
      Dimensions.get("window").height === 844 ||
      Dimensions.get("window").height === 812 ||
      Dimensions.get("window").height === 896 ||
      Dimensions.get("window").height === 926 ||
      Dimensions.get("window").height === 932);
  const memoedValue = useMemo(() => ({ height, width, isIPhoneWithNotch }), []);

  return (
    <DesignContext.Provider value={memoedValue}>
      {children}
    </DesignContext.Provider>
  );
};

export default DesignContext;

export function useDesign() {
  const context = useContext(DesignContext);

  return context;
}

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
