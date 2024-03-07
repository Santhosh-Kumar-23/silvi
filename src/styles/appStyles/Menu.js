import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import * as Helpers from '../../utils/Helpers';

const Menu = StyleSheet.create({
  headerIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  bellEllipseIconContainer: {position: 'absolute', top: 2, right: 6, zIndex: 1},
  menuCardContainer: {
    flexDirection: 'column',
    width: Helpers.windowWidth * 0.238125,
    height: Helpers.windowHeight * 0.15,
    borderStyle: 'dashed',
    borderRadius: 10,
    shadowColor: Colors.dropShadow,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  menuCardImageContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 36 / 2,
  },
  fabContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: 20,
    bottom: 20,
  },
  fabTextContainer: {
    backgroundColor: Colors.barBackground,
    borderRadius: 4,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default Menu;
