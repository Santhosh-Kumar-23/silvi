import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';

const Claims = StyleSheet.create({
  claimAccordionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.sectionBar,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  claimAccordionLabelContainer: {
    flex: 0.9125,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  claimAccordionImageContainer: {
    flex: 0.0875,
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimAccordionImage: {
    width: 20,
    height: 20,
    tintColor: Colors.primaryText,
  },
  claimItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.barBackground,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  claimItemImageContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.barBackground,
    borderRadius: 36 / 2,
  },
  claimItemImage: {
    width: 24,
    height: 24,
    tintColor: Colors.primaryText,
  },
  claimItemLabelContainer: {
    flex: 0.4075,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  claimItemValueContainer: {
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
  claimStatus: {
    position: 'absolute',
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
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionLabelContainer: {
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
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

export default Claims;
