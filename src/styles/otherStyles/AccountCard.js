import {StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import * as Helpers from '../../utils/Helpers';

const AccountCard = StyleSheet.create({
  container: {
    width: '100%',
    height: Helpers.windowHeight * 0.11625,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
    paddingVertical: 12,
  },
  iconContainer: {
    flex: 0.125,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  iconImage: {width: 24, height: 24, tintColor: Colors.white},
  accountContainer: {
    flex: 0.8625,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  accountSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  accountTypeContainer: {
    flex: 0.4375,
    justifyContent: 'center',
    paddingRight: 4,
  },
  amountContainer: {
    flex: 0.5375,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
});

export default AccountCard;
