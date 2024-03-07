import {StyleSheet} from 'react-native';
import Colors from '../../../../utils/Colors';

const CreditCartList = StyleSheet.create({
  headerIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  creditItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.barBackground,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  creditItemImageContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.barBackground,
    borderRadius: 36 / 2,
  },
  creditItemImage: {
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
  creditItemLabelContainer: {
    flex: 0.4075,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  creditItemValueContainer: {
    flex: 0.4675,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});

export default CreditCartList;
