import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const Onboard = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 40 / 2,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
});

export default Onboard;
