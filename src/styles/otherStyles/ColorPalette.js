import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const ColorPalette = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 8,
  },
  iconContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: Colors.border,
  },
  textContainer: {flex: 1, justifyContent: 'center', marginLeft: 8},
  customModalContainer: {
    borderRadius: 8,
    shadowColor: Colors.dropShadow,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowRadius: 16,
    elevation: 4,
  },
  customModalSubContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  colorPaletteSubContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    marginVertical: 8,
  },
  gradientContainer: {
    alignSelf: 'center',
    shadowColor: Colors.dropShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
  },
  buttonCardContainer: {
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    shadowColor: Colors.dropShadow,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 2,
  },
  buttonContainer: {width: '95%'},
});

export default ColorPalette;
