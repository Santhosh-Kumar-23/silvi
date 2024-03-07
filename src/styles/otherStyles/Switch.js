import {StyleSheet} from 'react-native';
import * as Helpers from '../../utils/Helpers';

const Switch = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 0.8,
    justifyContent: 'center',
  },
  switchContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  switchSubContainer: {
    width: Helpers.windowWidth * 0.11125,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 1,
  },
});

export default Switch;
