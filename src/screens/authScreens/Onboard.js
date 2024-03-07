import React, {useCallback, useState} from 'react';
import {BackHandler, Image, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {showMessage} from 'react-native-flash-message';
import {
  loadingStatus,
  socialSignIn,
  storeFCMToken,
} from '../../redux/Root.Actions';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../assets/Index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/appComponents/Button';
import Crashlytics from '@react-native-firebase/crashlytics';
import Indicator from '../../components/appComponents/Indicator';
import Labels from '../../utils/Strings';
import Messaging from '@react-native-firebase/messaging';
import Store from '../../redux/Store';
import Styles from '../../styles/authStyles/Onboard';
import * as ENV from '../../../env';
import * as HelperStyles from '../../utils/HelperStyles';

const Onboard = props => {
  // Onboard Variables
  const [exitCount, setExitCount] = useState(0);

  // Other Variables
  const [indicatorModalStatus, setIndicatorModalStatus] = useState(false);

  // Theme Variables
  const Theme = useTheme().colors;

  // Google Configuration
  GoogleSignin.configure({
    // To specify the client ID of type Android [Android]
    androidClientId: ENV.googleAndroidClientId,

    // To access on behalf of the user, default is email and profile [Android]
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],

    // To specify the client ID of type iOS [iOS]
    iosClientId: ENV.googleIOSClientId,

    // To specify the client ID of type Web [Web]
    // To verify user ID and offline access
    webClientId: ENV.googleWebClientId,
  });

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      init();

      return () => {
        isFocus = false;

        setIndicatorModalStatus(false);
      };
    }, []),
  );

  const init = () => {
    Store.dispatch(loadingStatus(false));

    setIndicatorModalStatus(true);
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        isFocus = false;

        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }, [exitCount]),
  );

  const backAction = () => {
    setTimeout(() => {
      setExitCount(0);
    }, 2000);

    switch (exitCount) {
      case 0:
        setExitCount(exitCount + 1);

        showMessage({
          icon: 'auto',
          message: Labels.exitText,
          position: 'bottom',
          type: 'default',
        });
        break;

      case 1:
        BackHandler.exitApp();
        break;

      default:
        break;
    }

    return true;
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      initPushNotification();

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const initPushNotification = () => {
    // Checks for notification permission
    checkPermission();

    // Listen for notification when app is in background
    backgroundNotification();

    // Listen for notification when app is closed
    closedNotification();
  };

  const checkPermission = async () => {
    const permissionStatus = await Messaging().hasPermission();

    ENV.currentEnvironment == Labels.development &&
      console.log('NOTIFICATION PERMISSION::: ', permissionStatus);

    if (permissionStatus) {
      getToken();
    } else {
      requestPermission();
    }
  };

  const getToken = async () => {
    const fcmToken = await Messaging().getToken();

    ENV.currentEnvironment == Labels.development &&
      console.log('PUSH NOTIFICATION TOKEN::: ', fcmToken);

    Store.dispatch(storeFCMToken(fcmToken));
  };

  const requestPermission = async () => {
    try {
      await Messaging().requestPermission();

      getToken();
    } catch (error) {
      showMessage({
        description: Labels.deniedNotificationPermission,
        icon: 'auto',
        message: Labels.permissionDenied,
        type: 'danger',
      });
    }
  };

  const backgroundNotification = () => {
    Messaging().onNotificationOpenedApp(messageData => {
      ENV.currentEnvironment == Labels.development &&
        console.log('BACKGROUND NOTIFICATION::: ', messageData);
    });
  };

  const closedNotification = async () => {
    Messaging()
      .getInitialNotification()
      .then(messageData => {
        ENV.currentEnvironment == Labels.development &&
          console.log('CLOSED NOTIFICATION::: ', messageData);
      });
  };

  const handleFacebookSignIn = () => {
    Store.dispatch(loadingStatus(true));

    LoginManager.logInWithPermissions([
      'public_profile',
      'email',
      'user_managed_groups',
    ]).then(result => {
      if (result.error) {
        Crashlytics().setAttributes({
          error: JSON.stringify(result.error),
          label: Labels.facebookSignIn,
          type: 'catch',
        });

        showMessage({
          description: Labels.facebookSignInError,
          icon: 'auto',
          message: Labels.error,
          type: 'danger',
        });
      } else {
        if (result.isCancelled) {
          Store.dispatch(loadingStatus(false));
        } else {
          AccessToken.getCurrentAccessToken().then(facebookInfo => {
            ENV.currentEnvironment == Labels.development &&
              console.log('FACEBOOK USER INFO::: ', facebookInfo);

            const accessToken = facebookInfo.accessToken;

            const responseInfoCallback = (error, facebookUserInfo) => {
              if (error) {
                Store.dispatch(loadingStatus(false));

                showMessage({
                  description: Labels.unableToGetUserDetails,
                  icon: 'auto',
                  message: Labels.error,
                  type: 'danger',
                });
              } else {
                ENV.currentEnvironment == Labels.development &&
                  console.log('FACEBOOK RESPONSE INFO::: ', facebookUserInfo);

                const customUserInfo = {
                  email: facebookUserInfo.email,
                  name: facebookUserInfo.email.slice(
                    0,
                    facebookUserInfo.email.indexOf('@'),
                  ),
                  OAuthId: facebookInfo.userID,
                  OAuthProvider: 'facebook',
                  password: null,
                };

                handleSocialSignIn(customUserInfo);
              }
            };

            const facebookUserInfoRequest = new GraphRequest(
              '/me',
              {
                accessToken: accessToken,
                parameters: {
                  fields: {
                    string: 'email, first_name, last_name, middle_name, name',
                  },
                },
              },
              responseInfoCallback,
            );

            // Start the graph request.
            new GraphRequestManager()
              .addRequest(facebookUserInfoRequest)
              .start();
          });
        }
      }
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      Store.dispatch(loadingStatus(true));

      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

      const googleUserInfo = await GoogleSignin.signIn();

      ENV.currentEnvironment == Labels.development &&
        console.log('GOOGLE USER INFO::: ', googleUserInfo);

      const customUserInfo = {
        email: googleUserInfo.user.email,
        name: googleUserInfo.user.email.slice(
          0,
          googleUserInfo.user.email.indexOf('@'),
        ),
        OAuthId: googleUserInfo.user.id,
        OAuthProvider: 'google',
        password: 'google123',
      };

      handleSocialSignIn(customUserInfo);
    } catch (error) {
      Store.dispatch(loadingStatus(false));

      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          // User cancelled the SignIn flow
          break;

        case statusCodes.IN_PROGRESS:
          // Operation (e.g. sign in) is in progress already
          showMessage({
            description: Labels.googleSignInProgress,
            icon: 'auto',
            message: Labels.warning,
            type: 'warning',
          });

          break;

        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // Play services not available or outdated
          Crashlytics().setAttributes({
            error: JSON.stringify(error),
            label: Labels.googleSignIn,
            type: 'catch',
          });

          showMessage({
            description: Labels.googlePlayServiceOutdated,
            icon: 'auto',
            message: Labels.error,
            type: 'danger',
          });
          break;

        default:
          break;
      }
    }
  };

  const handleSocialSignIn = userInfo => {
    showMessage({
      icon: 'auto',
      message: `${Labels.authenticating}...`,
      position: 'bottom',
      type: 'default',
    });

    ENV.currentEnvironment == Labels.development &&
      console.log('USER INFO::: ', userInfo);

    props.socialSignIn(userInfo, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('SOCIAL SIGN IN RESPONSE DATA::: ', response);

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

      props.navigation.navigate('Menu');
    });
  };

  return (
    <View style={HelperStyles.screenContainer(Theme.background)}>
      <View style={Styles.screenContainer}>
        <Image
          resizeMode={'contain'}
          source={Assets.logo}
          style={HelperStyles.imageView(88, 88)}
        />
        <View style={HelperStyles.margin(32, 16)}>
          <Button
            label={Labels.signUp}
            loading={false}
            containerStyle={HelperStyles.margin(0, 8)}
            onPress={() => {
              props.navigation.navigate('SignUp');
            }}
          />
          <Button
            mode="light"
            label={Labels.logIn}
            loading={false}
            containerStyle={HelperStyles.margin(0, 8)}
            onPress={() => {
              props.navigation.navigate('SignIn');
            }}
          />
          <View style={HelperStyles.margin(0, 16)}>
            <Text
              style={HelperStyles.textView(
                14,
                '400',
                Theme.primaryText,
                'center',
                'none',
              )}>
              {Labels.signInWithSocial}
            </Text>
          </View>
          <View
            style={[
              HelperStyles.flexDirection('row'),
              HelperStyles.justifyContentCenteredView('center'),
            ]}>
            <TouchableOpacity
              onPress={() => {
                handleFacebookSignIn();
              }}
              style={Styles.socialIconContainer}>
              <Image
                resizeMode={'contain'}
                source={Assets.facebook}
                style={HelperStyles.imageView(24, 24)}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleGoogleSignIn();
              }}
              style={Styles.socialIconContainer}>
              <Image
                resizeMode={'contain'}
                source={Assets.google}
                style={HelperStyles.imageView(20, 20)}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {indicatorModalStatus && (
        <Indicator mode={'modal'} visible={Boolean(props.loadingStatus)} />
      )}
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
    socialSignIn: (requestData, onResponse) => {
      dispatch(socialSignIn(requestData, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Onboard);
