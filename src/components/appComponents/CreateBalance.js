import React, {useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Assets from '../../assets/Index';
import Colors from '../../utils/Colors';
import CreateAccountForm from '../../screens/appScreens/balance/account/CreateAccount';
import CreateCreditCardForm from '../../screens/appScreens/balance/creditCard/CreateCreditCard';
import CustomModal from './CustomModal';
import Labels from '../../utils/Strings';
import Styles from '../../styles/otherStyles/CreateBalance';
import * as ENV from '../../../env';
import * as HelperStyles from '../../utils/HelperStyles';

const CreateBalance = props => {
  // CreateBalance Variables
  const [changeAccount, setChangeAccount] = useState(null);

  // Theme Variables
  const Theme = useTheme().colors;

  return (
    <CustomModal
      clearDefaultChildren={true}
      modalContainerStyle={HelperStyles.justView('justifyContent', 'center')}
      onRequestClose={() => {
        props.onRequestClose();
      }}
      visible={props.visible}>
      <View
        style={[
          Styles.modalContainer,
          HelperStyles.justView('backgroundColor', Theme.background),
        ]}>
        <View style={Styles.modalHeaderContainer}>
          <TouchableOpacity
            onPress={() => {
              setChangeAccount(null);

              props.onRequestClose();
            }}
            style={Styles.backIconContainer}>
            <Image
              resizeMode={'contain'}
              source={Assets.back}
              style={[
                HelperStyles.imageView(24, 24),
                HelperStyles.justView('tintColor', Theme.primaryText),
              ]}
            />
          </TouchableOpacity>
          <View style={HelperStyles.justifyContentCenteredView('center')}>
            <Text
              style={HelperStyles.textView(
                16,
                '700',
                Colors.primaryText,
                'center',
                'none',
              )}>
              {changeAccount == Labels.credit
                ? Labels.createCreditCard
                : Labels.createAccount}
            </Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={HelperStyles.flexGrow(1)}
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}>
          <View style={Styles.formContainer}>
            {Boolean(changeAccount) && changeAccount == Labels.credit ? (
              <CreateCreditCardForm
                {...props}
                fromModal={true}
                onClose={customCreditCard => {
                  ENV.currentEnvironment == Labels.development &&
                    console.log(
                      'CREATE CREDIT CARD MODAL CUSTOM CREDIT CARD::: ',
                      customCreditCard,
                    );

                  setChangeAccount(null);

                  props.onConfirm(
                    customCreditCard?.bankName ?? null,
                    Labels.creditCard.replace(/\s/g, '').toLowerCase(),
                    customCreditCard?.id ?? null,
                  );

                  props.onRequestClose();
                }}
              />
            ) : (
              <CreateAccountForm
                {...props}
                fromModal={true}
                onClose={customAccountName => {
                  ENV.currentEnvironment == Labels.development &&
                    console.log(
                      'CREATE ACCOUNT MODAL CUSTOM ACCOUNT NAME::: ',
                      customAccountName,
                    );

                  if (customAccountName == Labels.credit) {
                    setChangeAccount(customAccountName);
                  } else {
                    props.onConfirm(
                      customAccountName,
                      Labels.savings.toLowerCase(),
                    );

                    props.onRequestClose();
                  }
                }}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </CustomModal>
  );
};

export default CreateBalance;
