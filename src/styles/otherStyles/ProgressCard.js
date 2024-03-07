import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";

const ProgressCardStyles = StyleSheet.create({
    container: {
      width: '100%',
      borderRadius: 10,
      backgroundColor: Colors.barBackground,
      overflow: 'hidden',
    },
    inner: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      borderRadius: 4,
      backgroundColor: Colors.rashRed,
    },
    label: {
      zIndex: 1,
    },
  });

  export default ProgressCardStyles
  