import {StyleSheet} from 'react-native';
import Colors from '../../../../utils/Colors';
import * as Helpers from '../../../../utils/Helpers';

const AccountView = StyleSheet.create({
  headerIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  cardContainer: {
    flex: 0.225,
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardSubContainerI: {
    flex: 0.65,
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
    flex: 0.35,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginVertical: 4,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  transactionAccordionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.sectionBar,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  transactionAccordionLabelContainer: {
    flex: 0.9125,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  transactionAccordionLabelSubContainerI: {
    flex: 0.425,
    justifyContent: 'center',
  },
  transactionAccordionLabelSubContainerII: {
    flex: 0.575,
    justifyContent: 'center',
  },
  transactionAccordionImageContainer: {
    flex: 0.0875,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionAccordionImage: {
    width: 20,
    height: 20,
    tintColor: Colors.primaryText,
  },
  transactionItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionItemImageContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 36 / 2,
  },
  transactionItemImage: {
    width: 18,
    height: 18,
    tintColor: Colors.primaryText,
  },
  transactionItemLabelContainer: {
    flex: 0.4075,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  transactionItemValueContainer: {
    flex: 0.4675,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  imageLoader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  cardSkeleton: {
    height: Helpers.windowWidth * 0.375,
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 16,
  },
  warningModalContainer: {
    borderRadius: 8,
    shadowColor: Colors.dropShadow,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  warningModalButtonContainer: {width: '100%', marginTop: 16},
});

export default AccountView;
