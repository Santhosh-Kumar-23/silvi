import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';

const SavingsRecommenderView = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: Colors.barBackground,
    justifyContent: 'space-between',
  },
  imageLoader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  cardTextSubContainerI: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTextNameContainer: {
    flex: 0.75,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  cardTextRatingsContainer: {
    flex: 0.25,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cardTextSubContainerII: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 4,
  },
});

export default SavingsRecommenderView;
