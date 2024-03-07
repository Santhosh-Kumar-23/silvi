import React, {useCallback, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {loadingStatus, signUp, emailVerify} from '../../redux/Root.Actions';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../assets/Index';
import Button from '../../components/appComponents/Button';
import Card from '../../containers/Card';
import Colors from '../../utils/Colors';
import FloatingTextInput from '../../components/appComponents/FloatingTextInput';
import Labels from '../../utils/Strings';
import Store from '../../redux/Store';
import Styles from '../../styles/authStyles/SignUp';
import * as ENV from '../../../env';
import * as Helpers from '../../utils/Helpers';
import * as HelperStyles from '../../utils/HelperStyles';

const SignUp = props => {
  // SignUp Variables
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  // Other Variables
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [emailAvailableErrorContent, setEmailAvailableErrorContent] =
    useState(null);

  // Error Variables
  const [userNameError, setUserNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailInvalidError, setEmailInvalidError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordInvalidError, setPasswordInvalidError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);

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

  const handleEmail = txt => {
    const isValidEmail = Helpers.validateEmail(txt);

    emailError && setEmailError(false);

    setEmail(Boolean(txt) ? txt : null);

    setEmailInvalidError(isValidEmail);
  };

  const handlePassword = txt => {
    const isValidPassword = Helpers.validatePassword(txt);

    passwordError && setPasswordError(false);

    setPassword(Boolean(txt) ? txt : null);

    setPasswordInvalidError(isValidPassword);
  };

  const emailVerify = () => {
    const requestData = {email: email};

    props.emailVerify(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('EMAIL VERIFY RESPONSE DATA::: ', response);

      setEmailAvailable(!response.isAvailable);

      setEmailAvailableErrorContent(response.message);
    });
  };

  const handleSignUp = () => {
    if (checkSignUp()) {
      Store.dispatch(loadingStatus(true));

      const requestData = handleRequestData();

      ENV.currentEnvironment == Labels.development &&
        console.log('SIGN UP REQUEST DATA::: ', requestData);

      handleAPIRequest(requestData);
    } else {
      handleErrorValidation();
    }
  };

  const checkSignUp = () => {
    if (
      Boolean(userName) &&
      Boolean(email) &&
      !emailAvailable &&
      !emailInvalidError &&
      Boolean(password) &&
      !passwordInvalidError &&
      Boolean(confirmPassword) &&
      password == confirmPassword
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleRequestData = () => {
    let requestData = {OAuthProvider: 'local'};

    requestData = {
      ...requestData,
      email: email,
      name: userName,
      password: password,
    };

    return requestData;
  };

  const handleAPIRequest = requestData => {
    props.signUp(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('SIGN UP RESPONSE DATA::: ', response);

      if (response.hasOwnProperty('otp')) {
        handleReset();

        props.navigation.navigate('OTP', {
          for: Labels.accountActivation,
          otp: response.otp,
          registeredMail: email,
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
    setUserNameError(Boolean(userName) ? false : true);
    setEmailError(Boolean(email) ? false : true);
    setPasswordError(Boolean(password) ? false : true);
    setConfirmPasswordError(Boolean(confirmPassword) ? false : true);
    setPasswordMismatchError(
      Boolean(password) && password == confirmPassword ? false : true,
    );
  };

  const handleReset = () => {
    setUserName(null);
    setEmail(null);
    setPassword(null);
    setConfirmPassword(null);
    setEmailAvailable(false);
    setEmailAvailableErrorContent(null);
    setUserNameError(false);
    setEmailError(false);
    setEmailInvalidError(false);
    setPasswordError(false);
    setPasswordInvalidError(false);
    setConfirmPasswordError(false);
    setPasswordMismatchError(false);
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
                keyboardType={'default'}
                textContentType={'username'}
                title={Labels.userName}
                updateMasterState={txt => {
                  userNameError && setUserNameError(false);

                  setUserName(txt);
                }}
                value={userName}
              />
            </Card>
            {userNameError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 8),
                ]}>
                {Labels.userNameError}
              </Text>
            )}
            <Card containerStyle={HelperStyles.margin(0, 8)}>
              <FloatingTextInput
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                textContentType={'emailAddress'}
                title={Labels.email}
                updateMasterState={txt => {
                  setEmailAvailable(false);

                  setEmailAvailableErrorContent(null);

                  handleEmail(txt);
                }}
                value={email}
                otherTextInputProps={{
                  onEndEditing: () => {
                    Boolean(email) && emailVerify();
                  },
                }}
              />
            </Card>
            {emailError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 8),
                ]}>
                {Labels.emailError}
              </Text>
            )}
            {emailAvailable && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 8),
                ]}>
                {emailAvailableErrorContent}
              </Text>
            )}
            {Boolean(email) && emailInvalidError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 8),
                ]}>
                {Labels.emailInvalidError}
              </Text>
            )}
            <Card containerStyle={HelperStyles.margin(0, 8)}>
              <FloatingTextInput
                autoCapitalize={'none'}
                ispassword={true}
                keyboardType={'default'}
                otherTextInputProps={{maxLength: 20}}
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
            <Card containerStyle={HelperStyles.margin(0, 8)}>
              <FloatingTextInput
                autoCapitalize={'none'}
                ispassword={true}
                keyboardType={'default'}
                otherTextInputProps={{maxLength: 20}}
                textContentType={'none'}
                title={Labels.confirmPassword}
                updateMasterState={txt => {
                  confirmPasswordError && setConfirmPasswordError(false);

                  passwordMismatchError && setPasswordMismatchError(false);

                  setConfirmPassword(txt);
                }}
                value={confirmPassword}
              />
            </Card>
            {confirmPasswordError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 8),
                ]}>
                {Labels.confirmPasswordError}
              </Text>
            )}
            {Boolean(confirmPassword) && passwordMismatchError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 8),
                ]}>
                {Labels.passwordMismatchError}
              </Text>
            )}
            <Button
              containerStyle={HelperStyles.margin(0, 24)}
              label={Labels.signUp}
              loading={Boolean(props.loadingStatus)}
              onPress={() => {
                handleSignUp();
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
              {Labels.alreadyAccount}
            </Text>
            <View
              style={[
                HelperStyles.justifyContentCenteredView('center'),
                HelperStyles.margin(0, 4),
              ]}>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('SignIn');
                }}>
                <Text
                  style={HelperStyles.textView(
                    14,
                    '700',
                    Colors.primary,
                    'center',
                    'none',
                  )}>
                  {Labels.logIn}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
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
    signUp: (requestData, onResponse) => {
      dispatch(signUp(requestData, onResponse));
    },
    emailVerify: (requestData, onResponse) => {
      dispatch(emailVerify(requestData, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
