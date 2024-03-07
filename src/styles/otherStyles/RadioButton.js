import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const RadioButton = StyleSheet.create({
  optionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: 12,
    marginTop: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  outerCircleContainer: outerRadius => {
    return {
      width: outerRadius,
      height: outerRadius,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderRadius: outerRadius / 2,
    };
  },
  innerCircleContainer: innerRadius => {
    return {
      width: innerRadius,
      height: innerRadius,
      backgroundColor: Colors.primary,
      borderRadius: innerRadius / 2,
    };
  },
  itemTextContainer: {paddingVertical: 2, paddingHorizontal: 4},
});

export default RadioButton;
