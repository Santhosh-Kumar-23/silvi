import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';

const Billing = StyleSheet.create({
  billingAccordionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.sectionBar,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  billingAccordionLabelContainer: {
    flex: 0.9125,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  billingAccordionImageContainer: {
    flex: 0.0875,
    justifyContent: 'center',
    alignItems: 'center',
  },
  billingAccordionImage: {
    width: 20,
    height: 20,
    tintColor: Colors.primaryText,
  },
  billingItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.barBackground,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  billingItemImageContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.barBackground,
    borderRadius: 36 / 2,
  },
  billingItemImage: {
    width: 24,
    height: 24,
    tintColor: Colors.primaryText,
  },
  billingItemLabelContainer: {
    flex: 0.4075,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  billingItemValueContainer: {
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
  billingStatus: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 4,
    borderBottomRightRadius: 8,
    right: 0,
    bottom: 0,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  optionModalContainer: {
    maxHeight: '50%',
    borderRadius: 8,
    shadowColor: Colors.dropShadow,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowRadius: 16,
    elevation: 4,
  },
  optionModalSubContainer: {
    flexWrap: 'wrap',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  optionButtonCardContainer: {
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.dropShadow,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 2,
  },
  optionButtonContainer: {width: '95%'},
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionLabelContainer: {
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  modalContainer: {
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
  modalButtonContainer: {width: '100%', marginTop: 16},
});

export default Billing;
