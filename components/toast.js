import { showMessage } from "react-native-flash-message";
import colors from "./colors";

export default function toast({ msg, textcolor, color, duration, hide }) {
  showMessage({
    message: msg,
    type: "warning",
    floating: true,
    animationDuration: duration || 400,
    backgroundColor: color || colors.primary,
    autoHide: hide || true,
    hideOnPress: true,
    titleStyle: {
      color: textcolor || colors.white,
      fontSize: 14,
      fontWeight: "500",
    },
  });
}
