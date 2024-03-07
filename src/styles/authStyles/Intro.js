import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import * as Helpers from '../../utils/Helpers';

const Intro = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 120 / 2,
  },
  activeDotView: {
    width: 16,
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8 / 2,
    bottom: Helpers.windowHeight * 0.125,
  },
  dotView: {
    width: 8,
    height: 8,
    backgroundColor: Colors.barBackground,
    borderRadius: 8 / 2,
    bottom: Helpers.windowHeight * 0.125,
  },
  buttonContainer: {
    width: '90%',
    alignSelf: 'center',
    elevation: 0,
  },
});

export default Intro;
