import React, {useCallback, useRef, useState} from 'react';
import {Image, Platform, ScrollView, Text, TextInput, View} from 'react-native';
import {connect} from 'react-redux';
import {
  accountVerify,
  loadingStatus,
  otpVerify,
  resendOTP,
} from '../../redux/Root.Actions';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../assets/Index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/appComponents/Button';
import Colors from '../../utils/Colors';
import Labels from '../../utils/Strings';
import Store from '../../redux/Store';
import Styles from '../../styles/authStyles/OTP';
import * as ENV from '../../../env';
import * as HelperStyles from '../../utils/HelperStyles';

const OTP = props => {
  // OTP Variables
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [focusId, setFocusId] = useState(0);
  const [timerStarted, setTimerStarted] = useState(true);
  const [timer, setTimer] = useState(59);

  // Props Variables
  const actionFor = props.route.params.for;
  const registeredMail = props.route.params.registeredMail;
  const [receivedOTP, setReceviedOTP] = useState(props.route.params.otp);

  // Error Variables
  const [otpError, setOTPError] = useState(false);
  const [otpInvalidError, setOTPInvalidError] = useState(false);

  // Ref Variables
  const otpRef = useRef([]);

  // Other Variables
  let helperOTPArray = ['', '', '', '', '', ''];
  let intervalId;

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      Store.dispatch(loadingStatus(false));

      return () => {
        isFocus = false;
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      setOTP(helperOTPArray);

      return () => {
        isFocus = false;
      };
    }, [receivedOTP]),
  );

  useFocusEffect(
    useCallback(() => {
      handleTimer();

      return () => clearInterval(intervalId);
    }, [timerStarted, timer]),
  );

  const handleTimer = () => {
    if (timerStarted && timer != 0) {
      intervalId = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    } else {
      setTimerStarted(false);
    }
  };

  const encryptRegisteredMail = mailId => {
    return `${mailId.slice(0, 3)}${mailId
      .slice(3, mailId.indexOf('@'))
      .replace(/[a-z0-9]/g, '*')}${mailId.substring(
      mailId.indexOf('@'),
      mailId.indexOf('@') + 2,
    )}${mailId
      .slice(mailId.indexOf('@') + 2, mailId.length)
      .replace(/[a-z0-9]/g, '*')}`;
  };

  const renderOTP = () => {
    return (
      <>
        <View
          style={[
            HelperStyles.flexDirection('row'),
            HelperStyles.justifyContentCenteredView('space-evenly'),
            HelperStyles.margin(0, 24),
            (otpError || otpInvalidError) &&
              HelperStyles.justView('marginBottom', 16),
          ]}>
          {otp.map((lol, index) => (
            <TextInput
              key={index}
              autoCapitalize={'none'}
              color={Theme.text}
              keyboardType={
                Platform.OS === 'ios' ? 'decimal-pad' : 'number-pad'
              }
              maxLength={1}
              onBlur={() => {
                setFocusId(null);
              }}
              onChangeText={txt => {
                Boolean(txt) && handleTextInput(txt, index);
              }}
              onFocus={() => {
                setFocusId(index);
              }}
              onKeyPress={async ({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace') {
                  if (index === 0) {
                    setOTP(helperOTPArray);

                    otpRef.current[index].focus();
                  } else if (Boolean(otp[index])) {
                    setOTP(Object.values({...otp, [index]: ''}));
                  } else {
                    otpRef.current[index - 1].focus();
                  }
                }
              }}
              ref={el => {
                otpRef.current[index] = el;
              }}
              style={[
                HelperStyles.textView(
                  14,
                  '700',
                  Colors.primaryText,
                  'center',
                  'none',
                ),
                HelperStyles.margin(4, 0),
                Styles.otpLine,
                HelperStyles.justView(
                  'borderColor',
                  focusId === index ? Colors.primary : Colors.barBackground,
                ),
              ]}
              textContentType={'oneTimeCode'}
              value={Boolean(lol) ? lol : null}
            />
          ))}
        </View>
        {otpError && (
          <Text
            style={[
              HelperStyles.errorText,
              HelperStyles.justView('textAlign', 'center'),
              HelperStyles.justView('marginBottom', 8),
            ]}>
            {Labels.otpError}
          </Text>
        )}
        {Boolean(otp.join('')) && otpInvalidError && (
          <Text
            style={[
              HelperStyles.errorText,
              HelperStyles.justView('textAlign', 'center'),
              HelperStyles.justView('marginBottom', 8),
            ]}>
            {Labels.otpInvalidError}
          </Text>
        )}
      </>
    );
  };

  const handleTextInput = (val, index) => {
    let helper = otp;

    helper[index] = val;

    otpError && setOTPError(false);

    otpInvalidError && setOTPInvalidError(false);

    setOTP(helper);

    if (index === otp.length - 1) {
      otpRef.current[index].focus();
    } else {
      otpRef.current[index + 1].focus();
    }
  };

  const handleOTPVerify = () => {
    if (checkOTP()) {
      Store.dispatch(loadingStatus(true));

      const requestData = handleRequestData(actionFor);

      handleAPIRequest(actionFor, requestData);
    } else {
      handleErrorValidation();
    }
  };

  const handleResendOTP = () => {
    setReceviedOTP(null);

    setFocusId(0);

    otpRef.current[0].focus();

    setTimer(59);

    setTimerStarted(true);

    const requestData = handleRequestData(Labels.resendOTP);

    handleAPIRequest(Labels.resendOTP, requestData);
  };

  const checkOTP = () => {
    if (Boolean(otp.join('')) && otp.join('') == receivedOTP) {
      return true;
    } else {
      return false;
    }
  };

  const handleRequestData = label => {
    let requestData = {};

    switch (label) {
      case Labels.accountActivation:
      case Labels.forgotPassword:
      default:
        requestData = {
          ...requestData,
          email: registeredMail,
          otp: otp.join(''),
        };
        break;

      case Labels.resendOTP:
        requestData = {...requestData, email: registeredMail};
        break;
    }

    return requestData;
  };

  const handleAPIRequest = (label, requestData) => {
    switch (label) {
      case Labels.accountActivation:
        handleAccountActivationAPI(requestData);
        break;

      case Labels.forgotPassword:
      default:
        handleOTPVerifyAPI(requestData);
        break;

      case Labels.resendOTP:
        handleResendOTPAPI(requestData);
        break;
    }
  };

  const handleAccountActivationAPI = requestData => {
    ENV.currentEnvironment == Labels.development &&
      console.log('ACCOUNT ACTIVATION REQUEST DATA::: ', requestData);

    props.accountVerify(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('ACCOUNT ACTIVATION RESPONSE DATA::: ', response);

      if (response.hasOwnProperty('user')) {
        if (
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
        } else {
          showMessage({
            description: Labels.unableToVerifyRegisteredMail,
            icon: 'auto',
            message: Labels.error,
            type: 'danger',
          });
        }
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

  const handleOTPVerifyAPI = requestData => {
    ENV.currentEnvironment == Labels.development &&
      console.log('OTP VERIFY REQUEST DATA::: ', requestData);

    props.otpVerify(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('OTP VERIFY RESPONSE DATA::: ', response);

      handleReset();

      props.navigation.navigate('ResetPassword', {email: registeredMail});
    });
  };

  const handleResendOTPAPI = requestData => {
    ENV.currentEnvironment == Labels.development &&
      console.log('RESEND OTP REQUEST DATA::: ', requestData);

    props.resendOTP(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('RESEND OTP RESPONSE DATA::: ', response);

      if (response.hasOwnProperty('otp') && Boolean(response.otp)) {
        setReceviedOTP(response.otp);
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
    setOTPError(Boolean(otp.join('')) ? false : true);
    setOTPInvalidError(otp.join('') == receivedOTP ? false : true);
  };

  const handleReset = () => {
    helperOTPArray = ['', '', '', '', '', ''];

    setOTP(helperOTPArray);
    setOTPError(false);
    setTimerStarted(true);
    setTimer(59);
  };

  const secondsToMin = time => {
    let min = Math.floor(time / 60);
    let minutes = min >= 1 ? (String(min).length == 1 ? `0${min}` : min) : '00';

    let sec = String(time - min * 60);
    let seconds = sec >= 1 ? (sec.length == 1 ? `0${sec}` : sec) : '00';

    return minutes + ':' + seconds;
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
            source={Assets.lock}
            style={HelperStyles.imageView(180, 180)}
          />
          <View style={HelperStyles.screenSubContainer}>
            <Text
              style={[
                HelperStyles.textView(16, '700', Theme.text, 'center', 'none'),
                HelperStyles.margin(0, 8),
              ]}>
              {Labels.otpVerification}
            </Text>
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '400',
                  Colors.secondaryText,
                  'center',
                  'none',
                ),
                HelperStyles.margin(0, 4),
              ]}>
              {Labels.enterOTPToRegisterMail}
            </Text>
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '600',
                  Colors.secondaryText,
                  'center',
                  'none',
                ),
                HelperStyles.margin(0, 4),
              ]}>
              {encryptRegisteredMail(registeredMail)}
            </Text>
            {renderOTP()}
            {timer == 0 ? (
              <Text
                style={[
                  HelperStyles.textView(
                    14,
                    '400',
                    Colors.primaryText,
                    'center',
                    'none',
                  ),
                  HelperStyles.margin(0, 4),
                ]}>
                {Labels.noReceiveOTP}{' '}
                <Text
                  onPress={() => {
                    handleResendOTP();
                  }}
                  style={HelperStyles.textView(
                    14,
                    '700',
                    Colors.primary,
                    'center',
                    'none',
                  )}>
                  {Labels.resendOTP}
                </Text>
              </Text>
            ) : (
              <>
                <Text
                  style={[
                    HelperStyles.textView(
                      14,
                      '400',
                      Colors.lightText,
                      'center',
                      'none',
                    ),
                    HelperStyles.margin(0, 4),
                  ]}>
                  {Labels.resendOTP} in {secondsToMin(timer)}
                </Text>
                {ENV.currentEnvironment == Labels.development &&
                  Boolean(receivedOTP) && (
                    <Text
                      style={[
                        HelperStyles.textView(
                          16,
                          '700',
                          Colors.secondaryText,
                          'center',
                          'none',
                        ),
                        HelperStyles.margin(0, 8),
                      ]}>
                      {receivedOTP}
                    </Text>
                  )}
              </>
            )}
            <Button
              containerStyle={HelperStyles.margin(0, 16)}
              label={Labels.verify}
              loading={Boolean(props.loadingStatus)}
              onPress={() => {
                handleOTPVerify();
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
    accountVerify: (requestData, onResponse) => {
      dispatch(accountVerify(requestData, onResponse));
    },

    otpVerify: (requestData, onResponse) => {
      dispatch(otpVerify(requestData, onResponse));
    },

    resendOTP: (requestData, onResponse) => {
      dispatch(resendOTP(requestData, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OTP);
