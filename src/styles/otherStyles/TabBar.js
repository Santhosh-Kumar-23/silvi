import {StyleSheet} from 'react-native';
import * as Helpers from '../../utils/Helpers';

const TabBar = StyleSheet.create({
  outLinedTabBarContainer: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  solidTabBarContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  outLinedContainer: {
    width: Helpers.windowWidth * 0.2875,
    height: Helpers.windowHeight * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 3,
  },
  solidContainer: {
    height: Helpers.windowHeight * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  solidTabBarBorderLeft: radiusValue => {
    return {
      borderTopLeftRadius: radiusValue,
      borderBottomLeftRadius: radiusValue,
    };
  },
  solidTabBarBorderRight: radiusValue => {
    return {
      borderTopRightRadius: radiusValue,
      borderBottomRightRadius: radiusValue,
    };
  },
});

export default TabBar;
