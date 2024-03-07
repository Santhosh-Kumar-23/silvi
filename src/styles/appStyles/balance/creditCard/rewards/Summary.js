import {StyleSheet} from 'react-native';
import Colors from '../../../../../utils/Colors';
import * as Helpers from '../../../../../utils/Helpers';

const Summary = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 0.3,
    backgroundColor: Colors.barBackground,
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardSubContainerI: {
    flex: 0.575,
    justifyContent: 'flex-start',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  cardInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabelContainer: {
    flex: 0.85,
    justifyContent: 'center',
  },
  cardImageContainer: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  cardSubContainerII: {
    flex: 0.2375,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  cardSubContainerIII: {
    flex: 0.1875,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cardSkeleton: {
    height: Helpers.windowWidth * 0.4125,
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 16,
  },
  summaryAccordionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.sectionBar,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  summaryAccordionLabelContainer: {
    flex: 0.9125,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
  summaryAccordionLabelSubContainerI: {
    flex: 0.425,
    justifyContent: 'center',
  },
  summaryAccordionImageContainer: {
    flex: 0.0875,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryAccordionImage: {
    width: 20,
    height: 20,
    tintColor: Colors.primaryText,
  },
  summaryItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.barBackground,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  summaryItemImageContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.barBackground,
    borderRadius: 36 / 2,
  },
  summaryItemImage: {
    width: 24,
    height: 24,
    tintColor: Colors.primaryText,
  },
  imageLoader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  summaryItemLabelContainer: {
    flex: 0.4075,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  summaryItemValueContainer: {
    flex: 0.4675,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});

export default Summary;
