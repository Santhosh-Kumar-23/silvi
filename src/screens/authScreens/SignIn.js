import React, {useCallback, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {loadingStatus, signIn} from '../../redux/Root.Actions';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../assets/Index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/appComponents/Button';
import Card from '../../containers/Card';
import Colors from '../../utils/Colors';
import FloatingTextInput from '../../components/appComponents/FloatingTextInput';
import ForgotPassword from './ForgotPassword';
import Labels from '../../utils/Strings';
import Store from '../../redux/Store';
import Styles from '../../styles/authStyles/SignIn';
import * as ENV from '../../../env';
import * as Helpers from '../../utils/Helpers';
import * as HelperStyles from '../../utils/HelperStyles';

const SignIn = props => {
  // SignIn Variables
  const [emailAddress, setEmailAddress] = useState(null);
  const [password, setPassword] = useState(null);
  const [forgotPasswordModalStatus, setForgotPasswordModalStatus] =
    useState(false);

  // Error Variables
  const [emailAddressError, setEmailAddressError] = useState(false);
  const [emailAddressInvalidError, setEmailAddressInvalidError] =
    useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordInvalidError, setPasswordInvalidError] = useState(false);

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      Store.dispatch(loadingStatus(false));

      return () => {
        isFocus = false;

        hideMessage();

        handleReset();
      };
    }, []),
  );

  const handleEmailAddress = txt => {
    const isValidEmailAddress = Helpers.validateEmail(txt);

    emailAddressError && setEmailAddressError(false);

    setEmailAddress(Boolean(txt) ? txt : null);

    setEmailAddressInvalidError(isValidEmailAddress);
  };

  const handlePassword = txt => {
    const isValidPassword = Helpers.validatePassword(txt);

    passwordError && setPasswordError(false);

    setPassword(Boolean(txt) ? txt : null);

    setPasswordInvalidError(isValidPassword);
  };

  const handleSignIn = () => {
    if (checkSignIn()) {
      Store.dispatch(loadingStatus(true));

      const requestData = handleRequestData();

      ENV.currentEnvironment == Labels.development &&
        console.log('SIGN IN REQUEST DATA::: ', requestData);

      handleAPIRequest(requestData);
    } else {
      handleErrorValidation();
    }
  };

  const checkSignIn = () => {
    if (
      Boolean(emailAddress) &&
      !emailAddressInvalidError &&
      Boolean(password) &&
      !passwordInvalidError
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleRequestData = () => {
    let requestData = {};

    requestData = {
      ...requestData,
      email: emailAddress,
      password: password,
    };

    return requestData;
  };

  const handleAPIRequest = requestData => {
    props.signIn(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('SIGN IN RESPONSE DATA::: ', response);

      if (
        response.hasOwnProperty('user') &&
        response.user.hasOwnProperty('isEmailVerified') &&
        response.user.isEmailVerified
      ) {
        response.hasOwnProperty('tokens') &&
          response.tokens.hasOwnProperty('access') &&
          response.tokens.access.hasOwnProperty('token') &&
          AsyncStorage.setItem('token', response.tokens.access.token);

        response.hasOwnProperty('tokens') &&
          response.tokens.hasOwnProperty('refresh') &&
          response.tokens.refresh.hasOwnProperty('token') &&
          AsyncStorage.setItem('refreshToken', response.tokens.refresh.token);

        response.hasOwnProperty('user') &&
          response.user.hasOwnProperty('id') &&
          AsyncStorage.setItem('userId', response.user.id);

        handleReset();

        props.navigation.navigate('Menu');
      } else if (response.hasOwnProperty('otp')) {
        handleReset();

        props.navigation.navigate('OTP', {
          for: Labels.accountActivation,
          otp: response.otp,
          registeredMail: emailAddress,
        });
      } else {
        showMessage({
          description: Labels.unableToGetUserDetails,
          icon: 'auto',
          message: Labels.error,
          type: 'danger',
        });
      }
    });
  };

  const handleErrorValidation = () => {
    setEmailAddressError(Boolean(emailAddress) ? false : true);
    setPasswordError(Boolean(password) ? false : true);
  };

  const handleReset = () => {
    setEmailAddress(null);
    setPassword(null);
    setForgotPasswordModalStatus(false);
    setEmailAddressError(false);
    setEmailAddressInvalidError(false);
    setPasswordError(false);
    setPasswordInvalidError(false);
  };

  return (
    <View style={HelperStyles.screenContainer(Theme.background)}>
      <ScrollView
        contentContainerStyle={HelperStyles.flexGrow(1)}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}>
        <View style={Styles.screenContainer}>
          <Image
            resizeMode={'contain'}
            source={Assets.logo}
            style={HelperStyles.imageView(88, 88)}
          />
          <View style={HelperStyles.screenSubContainer}>
            <Card containerStyle={HelperStyles.margin(0, 8)}>
              <FloatingTextInput
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                textContentType={'emailAddress'}
                title={Labels.emailAddress}
                updateMasterState={txt => {
                  handleEmailAddress(txt);
                }}
                value={emailAddress}
              />
            </Card>
            {emailAddressError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 8),
                ]}>
                {Labels.emailAddressError}
              </Text>
            )}
            {Boolean(emailAddress) && emailAddressInvalidError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 8),
                ]}>
                {Labels.emailAddressInvalidError}
              </Text>
            )}
            <Card containerStyle={HelperStyles.margin(0, 8)}>
              <FloatingTextInput
                autoCapitalize={'none'}
                ispassword={true}
                keyboardType={'default'}
                otherTextInputProps={{maxLength: 20}}
                showPasswordIcon={true}
                textContentType={'newPassword'}
                title={Labels.password}
                updateMasterState={txt => {
                  handlePassword(txt);
                }}
                value={password}
              />
            </Card>
            {passwordError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 8),
                ]}>
                {Labels.passwordError}
              </Text>
            )}
            {Boolean(password) && passwordInvalidError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 8),
                ]}>
                {password.length < 6
                  ? Labels.passwordCountError
                  : Labels.passwordInvalidError}
              </Text>
            )}
            <View style={HelperStyles.margin(0, 8)}>
              <TouchableOpacity
                onPress={() => {
                  setForgotPasswordModalStatus(!forgotPasswordModalStatus);
                }}>
                <Text
                  style={HelperStyles.textView(
                    14,
                    '400',
                    Theme.primaryText,
                    'right',
                    'none',
                  )}>
                  {Labels.forgotYourPassword}
                </Text>
              </TouchableOpacity>
            </View>
            <Button
              containerStyle={HelperStyles.margin(0, 24)}
              label={Labels.continue}
              loading={
                !Boolean(forgotPasswordModalStatus) &&
                Boolean(props.loadingStatus)
              }
              onPress={() => {
                handleSignIn();
              }}
            />
            <Text
              style={[
                HelperStyles.textView(
                  16,
                  '400',
                  Theme.primaryText,
                  'center',
                  'none',
                ),
                HelperStyles.margin(0, 4),
              ]}>
              {Labels.noAccount}
            </Text>
            <View
              style={[
                HelperStyles.justifyContentCenteredView('center'),
                HelperStyles.margin(0, 4),
              ]}>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('SignUp');
                }}>
                <Text
                  style={HelperStyles.textView(
                    14,
                    '700',
                    Colors.primary,
                    'center',
                    'none',
                  )}>
                  {Labels.createAccount}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <ForgotPassword
        {...props}
        onRequestClose={() => {
          setForgotPasswordModalStatus(!forgotPasswordModalStatus);
        }}
        visible={forgotPasswordModalStatus}
      />
    </View>
  );
};

const mapStateToProps = state => {
  return {
    loadingStatus: state.other.loadingStatus,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signIn: (requestData, onResponse) => {
      dispatch(signIn(requestData, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
