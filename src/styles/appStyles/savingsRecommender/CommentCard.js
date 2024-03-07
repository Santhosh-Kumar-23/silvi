import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';

const CommentCard = StyleSheet.create({
  cardContainer: {
    justifyContent: 'space-between',
    borderRadius: 0,
    marginVertical: 8,
    paddingHorizontal: 0,
    elevation: 0,
  },
  cardImageContainer: {
    width: 64,
    height: 64,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 64 / 2,
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

export default CommentCard;
