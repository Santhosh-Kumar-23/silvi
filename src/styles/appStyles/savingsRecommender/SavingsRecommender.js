import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';

const SavingsRecommender = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  cardContainer: {
    backgroundColor: Colors.barBackground,
    justifyContent: 'space-between',
    marginVertical: 8,
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
    height: 36,
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
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cardTextDistanceContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cardTextViewItemsContainer: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default SavingsRecommender;
