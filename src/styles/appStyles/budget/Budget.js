import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';

const Budget = StyleSheet.create({
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
  budgetItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.barBackground,
    borderRadius: 8,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  budgetItemImageContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.barBackground,
    borderRadius: 36 / 2,
  },
  budgetItemImage: {
    width: 24,
    height: 24,
    tintColor: Colors.primaryText,
  },
  budgetItemLabelContainer: {
    flex: 0.4075,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  budgetItemValueContainer: {
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
});

export default Budget;
