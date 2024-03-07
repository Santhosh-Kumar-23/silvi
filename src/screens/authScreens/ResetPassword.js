import React, {useCallback, useState} from 'react';
import {BackHandler, Image, ScrollView, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {loadingStatus, resetPassword} from '../../redux/Root.Actions';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../assets/Index';
import Button from '../../components/appComponents/Button';
import Card from '../../containers/Card';
import FloatingTextInput from '../../components/appComponents/FloatingTextInput';
import Labels from '../../utils/Strings';
import Store from '../../redux/Store';
import Styles from '../../styles/authStyles/ResetPassword';
import * as ENV from '../../../env';
import * as Helpers from '../../utils/Helpers';
import * as HelperStyles from '../../utils/HelperStyles';

const ResetPassword = props => {
  // ResetPassword Variables
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  // Props Variables
  const email = props.route.params.email;

  // Error Variables
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [passwordInvalidError, setPasswordInvalidError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        isFocus = false;

        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }, []),
  );

  const backAction = function () {
    props.navigation.navigate('SignIn');

    return true;
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      Store.dispatch(loadingStatus(false));

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const handlePassword = txt => {
    const isValidPassword = Helpers.validatePassword(txt);

    newPasswordError && setNewPasswordError(false);

    setNewPassword(Boolean(txt) ? txt : null);

    setPasswordInvalidError(isValidPassword);
  };

  const handleResetPassword = () => {
    if (checkResetPassword()) {
      Store.dispatch(loadingStatus(true));

      const requestData = handleRequestData();

      ENV.currentEnvironment == Labels.development &&
        console.log('RESET PASSWORD REQUEST DATA::: ', requestData);

      handleAPIRequest(requestData);
    } else {
      handleErrorValidation();
    }
  };

  const checkResetPassword = () => {
    if (
      Boolean(newPassword) &&
      !passwordInvalidError &&
      Boolean(confirmPassword) &&
      newPassword == confirmPassword
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
      email: email,
      password: newPassword,
    };

    return requestData;
  };

  const handleAPIRequest = requestData => {
    props.resetPassword(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('RESET PASSWORD RESPONSE DATA::: ', response);

      handleReset();

      props.navigation.navigate('SignIn');
    });
  };

  const handleErrorValidation = () => {
    setNewPasswordError(Boolean(newPassword) ? false : true);
    setConfirmPasswordError(Boolean(confirmPassword) ? false : true);
    setPasswordMismatchError(
      Boolean(newPassword) && newPassword == confirmPassword ? false : true,
    );
  };

  const handleReset = () => {
    setNewPassword(null);
    setConfirmPassword(null);
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
            source={Assets.resetPassword}
            style={HelperStyles.imageView(180, 180)}
          />
          <View style={HelperStyles.screenSubContainer}>
            <Text
              style={[
                HelperStyles.textView(16, '700', Theme.text, 'left', 'none'),
                HelperStyles.margin(0, 8),
              ]}>
              {Labels.resetPassword}
            </Text>
            <Card containerStyle={HelperStyles.margin(0, 8)}>
              <FloatingTextInput
                autoCapitalize={'none'}
                ispassword={true}
                keyboardType={'default'}
                otherTextInputProps={{maxLength: 20}}
                textContentType={'newPassword'}
                title={Labels.newPassword}
                updateMasterState={txt => {
                  handlePassword(txt);
                }}
                value={newPassword}
              />
            </Card>
            {newPasswordError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 8),
                ]}>
                {Labels.newPasswordError}
              </Text>
            )}
            {Boolean(newPassword) && passwordInvalidError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 8),
                ]}>
                {newPassword.length < 6
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
              label={Labels.submit}
              loading={Boolean(props.loadingStatus)}
              onPress={() => {
                handleResetPassword();
              }}
            />
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
    resetPassword: (requestData, onResponse) => {
      dispatch(resetPassword(requestData, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
