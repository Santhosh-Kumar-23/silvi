import {StyleSheet} from 'react-native';
import Colors from '../../../../utils/Colors';

const Account = StyleSheet.create({
  totalCashFlowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.sectionBar,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  totalCashFlowTextContainer: {
    flex: 0.4375,
    justifyContent: 'center',
  },
  totalCashFlowValueContainer: {
    flex: 0.5375,
    justifyContent: 'center',
  },
});

export default Account;
