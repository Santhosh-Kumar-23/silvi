import React, {useCallback, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {forgotPassword, loadingStatus} from '../../redux/Root.Actions';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../assets/Index';
import Button from '../../components/appComponents/Button';
import Card from '../../containers/Card';
import CustomModal from '../../components/appComponents/CustomModal';
import FloatingTextInput from '../../components/appComponents/FloatingTextInput';
import Labels from '../../utils/Strings';
import Store from '../../redux/Store';
import Styles from '../../styles/authStyles/ForgotPassword';
import * as ENV from '../../../env';
import * as Helpers from '../../utils/Helpers';
import * as HelperStyles from '../../utils/HelperStyles';

const ForgotPassword = props => {
  //ForgotPassword Variables
  const [registeredMailId, setRegisteredMailId] = useState(null);

  // Error Variables
  const [registeredMailIdError, setRegisteredMailIdError] = useState(false);
  const [registeredMailIdInvalidError, setRegisteredMailIdInvalidError] =
    useState(false);

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      Store.dispatch(loadingStatus(false));

      return () => {
        isFocus = false;

        handleReset();
      };
    }, []),
  );

  const handleRegisteredMailId = txt => {
    const isValidRegisteredMailId = Helpers.validateEmail(txt);

    registeredMailIdError && setRegisteredMailIdError(false);

    setRegisteredMailId(Boolean(txt) ? txt : null);

    setRegisteredMailIdInvalidError(isValidRegisteredMailId);
  };

  const handleForgotPassword = () => {
    if (checkForgotPassword()) {
      Store.dispatch(loadingStatus(true));

      const requestData = handleRequestData();

      ENV.currentEnvironment == Labels.development &&
        console.log('SIGN IN REQUEST DATA::: ', requestData);

      handleAPIRequest(requestData);
    } else {
      handleErrorValidation();
    }
  };

  const checkForgotPassword = () => {
    if (Boolean(registeredMailId) && !registeredMailIdInvalidError) {
      return true;
    } else {
      return false;
    }
  };

  const handleRequestData = () => {
    let requestData = {};

    requestData = {...requestData, email: registeredMailId};

    return requestData;
  };

  const handleAPIRequest = requestData => {
    props.forgotPassword(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('FORGOT PASSWORD RESPONSE DATA::: ', response);

      if (response.hasOwnProperty('otp') && Boolean(response.otp)) {
        handleReset();

        props.onRequestClose();

        props.navigation.navigate('OTP', {
          for: Labels.forgotPassword,
          otp: response.otp,
          registeredMail: registeredMailId,
        });
      } else {
        showMessage({
          description: Labels.unableToGetOTP,
          icon: 'auto',
          message: Labels.error,
          type: 'danger',
        });
      }
    });
  };

  const handleErrorValidation = () => {
    setRegisteredMailIdError(Boolean(registeredMailId) ? false : true);
  };

  const handleReset = () => {
    setRegisteredMailId(null);
    setRegisteredMailIdError(false);
    setRegisteredMailIdInvalidError(false);
  };

  return (
    <CustomModal
      onRequestClose={() => {
        props.onRequestClose();
      }}
      showDefaultChildren={false}
      visible={props.visible}>
      <View
        style={[
          HelperStyles.flexDirection('row'),
          HelperStyles.justifyContentCenteredView('center'),
        ]}>
        <TouchableOpacity
          onPress={() => {
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
            style={[
              HelperStyles.textView(16, '700', Theme.text, 'center', 'none'),
              HelperStyles.margin(0, 8),
            ]}>
            {Labels.verifyYourEmailAdress}
          </Text>
        </View>
      </View>
      <Card containerStyle={HelperStyles.margin(0, 8)}>
        <FloatingTextInput
          autoCapitalize={'none'}
          keyboardType={'email-address'}
          textContentType={'emailAddress'}
          title={Labels.registeredMailId}
          titleInActiveSize={14}
          updateMasterState={txt => {
            handleRegisteredMailId(txt);
          }}
          value={registeredMailId}
        />
      </Card>
      {registeredMailIdError && (
        <Text
          style={[
            HelperStyles.errorText,
            HelperStyles.justView('marginHorizontal', 8),
          ]}>
          {Labels.registeredMailIdError}
        </Text>
      )}
      {Boolean(registeredMailId) && registeredMailIdInvalidError && (
        <Text
          style={[
            HelperStyles.errorText,
            HelperStyles.justView('marginHorizontal', 8),
          ]}>
          {Labels.registeredMailIdInvalidError}
        </Text>
      )}
      <Button
        containerStyle={Styles.verifyMyMailButtonContainer}
        label={Labels.verifyMyMail}
        loading={Boolean(props.loadingStatus)}
        onPress={() => {
          handleForgotPassword();
        }}
      />
    </CustomModal>
  );
};

const mapStateToProps = state => {
  return {
    loadingStatus: state.other.loadingStatus,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    forgotPassword: (requestData, onResponse) => {
      dispatch(forgotPassword(requestData, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
