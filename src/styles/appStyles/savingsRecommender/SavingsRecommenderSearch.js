import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';
import * as Helpers from '../../../utils/Helpers';

const SavingsRecommenderSearch = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingsRecommenderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  savingsRecommenderCategoryContainer: {
    flex: 0.4875,
    justifyContent: 'center',
  },
  dropdownCardLabelContainerStyle: {paddingHorizontal: 4},
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
  mapContainer: {
    width: '100%',
    height: Helpers.windowHeight * 0.5,
  },
});

export default SavingsRecommenderSearch;
