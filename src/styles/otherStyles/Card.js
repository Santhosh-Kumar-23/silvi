import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const Card = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 4,
  },
});

export default Card;
