import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {storeAccountEditStatus} from '../../redux/Root.Actions';
import Assets from '../../assets/Index';
import Colors from '../../utils/Colors';
import Labels from '../../utils/Strings';
import LinearGradient from 'react-native-linear-gradient';
import Store from '../../redux/Store';
import Styles from '../../styles/otherStyles/AccountCard';
import * as HelperStyles from '../../utils/HelperStyles';

const AccountCard = ({
  index = null,
  data = {},
  editStatus = false,
  navigation,
}) => {
  const accountTypeSource = accounttype => {
    switch (accounttype) {
      case Labels.bank:
        return Assets.bank;

      case Labels.cashInHand:
        return Assets.cash;

      case Labels.credit:
        return Assets.creditCard;

      case Labels.eWallet:
        return Assets.eWallet;

      default:
        return;
    }
  };

  const getAccountValue = accountData => {
    const accountValue = (accountData.amount || 0.0) + (accountData.cb || 0.0);

    return accountValue.toFixed(2);
  };

  return (
    <TouchableOpacity
      disabled={editStatus}
      onPress={() => {
        navigation.navigate('AccountView', {
          index: index,
        });
      }}>
      <LinearGradient
        colors={data.color.color}
        end={data.start}
        start={data.end}
        style={Styles.container}>
        <View style={Styles.iconContainer}>
          <Image
            resizeMode={'contain'}
            source={accountTypeSource(data.accountType)}
            style={Styles.iconImage}
          />
        </View>
        <View style={Styles.accountContainer}>
          <Text
            numberOfLines={1}
            style={HelperStyles.textView(
              16,
              '700',
              Colors.white,
              'left',
              'none',
            )}>
            {data.bank.name}
          </Text>
          <View style={Styles.accountSubContainer}>
            <View style={Styles.accountTypeContainer}>
              <Text
                style={HelperStyles.textView(
                  14,
                  '400',
                  Colors.white,
                  'left',
                  'none',
                )}>
                {data.accountType || null}
              </Text>
            </View>
            <View style={Styles.amountContainer}>
              {Boolean(editStatus) ? (
                <View
                  style={[
                    HelperStyles.flex(1),
                    HelperStyles.flexDirection('row'),
                    HelperStyles.justifyContentCenteredView('flex-end'),
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      Store.dispatch(storeAccountEditStatus(false));

                      if (
                        data.bank.name.toLowerCase() !=
                        Labels.default.toLowerCase()
                      ) {
                        navigation.navigate('CreateAccount', {editData: data});
                      } else {
                        showMessage({
                          icon: 'auto',
                          message: Labels.defaultAccountUpdateWarning,
                          position: 'bottom',
                          type: 'info',
                        });
                      }
                    }}
                    style={[
                      HelperStyles.justifyContentCenteredView('center'),
                      HelperStyles.justView('marginRight', 12),
                    ]}>
                    <Image
                      resizeMode={'contain'}
                      source={Assets.edit}
                      style={[
                        HelperStyles.imageView(22, 22),
                        HelperStyles.justView('tintColor', Colors.white),
                      ]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('AccountView', {
                        index: index,
                      });
                    }}
                    style={HelperStyles.justifyContentCenteredView('center')}>
                    <Image
                      resizeMode={'contain'}
                      source={Assets.list}
                      style={[
                        HelperStyles.imageView(22, 22),
                        HelperStyles.justView('tintColor', Colors.white),
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <Text
                  style={HelperStyles.textView(
                    16,
                    '700',
                    Colors.white,
                    'right',
                    'none',
                  )}>
                  {data.currency ? `${data.currency} ` : null}
                  {getAccountValue(data) || '0.00'}
                </Text>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default AccountCard;
