import {StyleSheet} from 'react-native';

const RecommenderCard = StyleSheet.create({
  cardContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginHorizontal: 2,
    marginVertical: 8,
  },
  cardImageContainer: {
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    marginVertical: 2,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  imageLoader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  cardTextSubContainerI: {
    flex: 0.4875,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTextNameContainer: {
    flex: 0.75,
    justifyContent: 'flex-start',
  },
  cardTextRatingsContainer: {
    flex: 0.25,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cardTextSubContainerII: {
    flex: 0.4875,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cardTextVisitContainer: {
    flex: 0.625,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cardTextReceiptsContainer: {
    flex: 0.375,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default RecommenderCard;
