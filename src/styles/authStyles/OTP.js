import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const OTP = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpLine: {
    backgroundColor: Colors.barBackground,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default OTP;
