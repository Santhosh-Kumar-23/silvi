import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';

const SettleClaims = StyleSheet.create({
  dropdownCardLabelContainerStyle: {paddingHorizontal: 4},
  dateTimeLabelStyle: {paddingHorizontal: 2},
  dateTimeValueStyle: {paddingHorizontal: 2},
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

export default SettleClaims;
