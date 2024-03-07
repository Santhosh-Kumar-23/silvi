import React, {useCallback, useLayoutEffect, useState} from 'react';
import {
  BackHandler,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {clearReduxStates, logout} from '../../redux/Root.Actions';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../assets/Index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../../containers/Card';
import Colors from '../../utils/Colors';
import Crashlytics from '@react-native-firebase/crashlytics';
import CustomModal from '../../components/appComponents/CustomModal';
import Labels from '../../utils/Strings';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Network from '../../containers/Network';
import Store from '../../redux/Store';
import Styles from '../../styles/appStyles/Menu';
import * as ENV from '../../../env';
import * as HelperStyles from '../../utils/HelperStyles';

const Menu = props => {
  // Menu Variables
  const [exitApp, setExitApp] = useState(false);

  // Theme Variables
  const Theme = useTheme().colors;

  // Other Variables
  const menus = [
    [
      {assetName: Assets.dashboard, menuName: Labels.dashboard},
      {assetName: Assets.balance, menuName: Labels.balance},
      {assetName: Assets.billingClaims, menuName: Labels.billingClaims},
    ],
    [
      {assetName: Assets.budget, menuName: Labels.budget},
      {assetName: Assets.receiptScanning, menuName: Labels.receiptScanning},
      {
        assetName: Assets.discountRecommender,
        disabled: true,
        menuName: Labels.discountRecommender,
      },
    ],
    [
      {
        assetName: Assets.comapreRewardItems,
        menuName: Labels.comapreRewardItems,
      },
      {assetName: Assets.creditCard, menuName: Labels.creditCard},
      {assetName: Assets.loan, menuName: Labels.loan},
    ],
    [
      {assetName: Assets.balanceTransfer, menuName: Labels.balanceTransfer},
      {
        assetName: Assets.cashFromCreditCard,
        menuName: Labels.cashFromCreditCard,
      },
      {assetName: null, menuName: null},
    ],
  ];

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => renderHeaderRight(),
    });
  });

  const renderHeaderRight = () => {
    return (
      <View style={HelperStyles.flexDirection('row')}>
        <TouchableOpacity
          onPress={() => {}}
          style={[
            Styles.headerIconContainer,
            HelperStyles.justView('marginRight', 12),
          ]}>
          <Image
            resizeMode={'contain'}
            source={Assets.profile}
            style={[
              HelperStyles.imageView(24, 24),
              HelperStyles.justView('tintColor', Theme.text),
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Notification');
          }}
          style={[
            Styles.headerIconContainer,
            HelperStyles.justView('marginRight', 12),
          ]}>
          <View style={Styles.bellEllipseIconContainer}>
            <Image
              resizeMode={'contain'}
              source={Assets.bellEllipse}
              style={HelperStyles.imageView(8, 8)}
            />
          </View>
          <Image
            resizeMode={'contain'}
            source={Assets.bell}
            style={[
              HelperStyles.imageView(24, 24),
              HelperStyles.justView('tintColor', Theme.text),
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleLogout();
          }}
          style={Styles.headerIconContainer}>
          <MaterialIcons color={Theme.text} name={'logout'} size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  const handleLogout = async () => {
    showMessage({
      icon: 'auto',
      message: `${Labels.loggingOut}...`,
      position: 'bottom',
      type: 'default',
    });

    const requestData = {userId: props.userDetails.user.id};

    ENV.currentEnvironment == Labels.development &&
      console.log('LOGOUT REQUEST DATA::: ', requestData);

    props.logout(requestData, async res => {
      ENV.currentEnvironment == Labels.development &&
        console.log('LOGOUT RESPONSE DATA::: ', res);

      props.userDetails.user.OAuthProvider == Labels.google &&
        handleGoogleSignOut();

      Store.dispatch(clearReduxStates());

      await AsyncStorage.getAllKeys().then(keys =>
        AsyncStorage.multiRemove(keys),
      );

      props.navigation.navigate('Onboard');
    });
  };

  const handleGoogleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      showMessage({
        description: Labels.signOutError,
        icon: 'auto',
        message: Labels.error,
        type: 'danger',
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        isFocus = false;

        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }, [exitApp]),
  );

  const backAction = function () {
    setExitApp(true);

    return true;
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      ENV.currentEnvironment != Labels.production && initCrashlytics();

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const initCrashlytics = () => {
    Crashlytics().setUserId('0');

    Crashlytics().log('The user has logged in successfully!');
  };

  const renderMenuCard = menuCardData => {
    return (
      <Card
        containerStyle={[
          Styles.menuCardContainer,
          HelperStyles.justView(
            'borderColor',
            Boolean(menuCardData.disabled) ? Colors.border25 : Colors.border,
          ),
          HelperStyles.justView(
            'borderWidth',
            Boolean(menuCardData.menuName) ? 1 : 0,
          ),
          (Boolean(menuCardData.disabled) ||
            !Boolean(menuCardData.menuName)) && [
            HelperStyles.justView('elevation', 0),
          ],
          !Boolean(menuCardData.menuName) && [
            HelperStyles.justView('backgroundColor', Theme.background),
          ],
        ]}
        disabled={
          Boolean(menuCardData.disabled) || !Boolean(menuCardData.menuName)
        }
        onPress={() => {
          handleMenuCardNavigation(menuCardData.menuName);
        }}>
        {Boolean(menuCardData.assetName) && (
          <View
            style={[
              HelperStyles.flex(0.5),
              HelperStyles.justifyContentCenteredView('center'),
            ]}>
            <View style={Styles.menuCardImageContainer}>
              <Image
                resizeMode={'contain'}
                source={menuCardData.assetName}
                style={[
                  HelperStyles.imageView(18, 18),
                  Boolean(menuCardData.disabled) &&
                    HelperStyles.justView('tintColor', Colors.border25),
                ]}
              />
            </View>
          </View>
        )}
        {Boolean(menuCardData.menuName) && (
          <View
            style={[
              HelperStyles.flex(0.5),
              HelperStyles.justView('marginTop', 8),
            ]}>
            <Text
              style={HelperStyles.textView(
                12,
                '400',
                Boolean(menuCardData.disabled)
                  ? Colors.secondaryText25
                  : Colors.secondaryText,
                'center',
                'capitalize',
              )}>
              {menuCardData.menuName}
            </Text>
          </View>
        )}
      </Card>
    );
  };

  const handleMenuCardNavigation = menuName => {
    switch (menuName) {
      case Labels.balance:
        props.navigation.navigate('Balance');
        break;

      case Labels.balanceTransfer:
        props.navigation.navigate('SavingsRecommenderSearch');
        break;

      case Labels.billingClaims:
        props.navigation.navigate('BillingClaim');
        break;

      case Labels.budget:
        props.navigation.navigate('BudgetProgress');
        break;

      case Labels.cashFromCreditCard:
        props.navigation.navigate('Community');
        break;

      case Labels.dashboard:
        props.navigation.navigate('Dashboard');
        break;

      case Labels.receiptScanning:
        props.navigation.navigate('ReceiptScanning');
        break;

      default:
        break;
    }
  };

  const renderFab = () => {
    return (
      <View style={Styles.fabContainer}>
        <TouchableOpacity onPress={() => {}}>
          <Image
            resizeMode={'contain'}
            source={Assets.chat}
            style={HelperStyles.imageView(40, 40)}
          />
        </TouchableOpacity>
        <View style={Styles.fabTextContainer}>
          <Text
            style={HelperStyles.textView(
              10,
              '400',
              Colors.secondaryText,
              'center',
              'capitalize',
            )}>
            {Labels.askSilvi}
          </Text>
        </View>
      </View>
    );
  };

  const handleExitApp = () => {
    setExitApp(!exitApp);
  };

  return (
    <Network>
      <View style={HelperStyles.screenContainer(Theme.background)}>
        <ScrollView
          contentContainerStyle={HelperStyles.flexGrow(1)}
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}>
          <View style={HelperStyles.margin(36, 16)}>
            <View style={HelperStyles.margin(0, 8)}>
              <Text
                style={HelperStyles.textView(
                  14,
                  '600',
                  Theme.primaryText,
                  'left',
                  'capitalize',
                )}>
                {Labels.menuWelcome}
              </Text>
            </View>
            <View style={HelperStyles.margin(0, 8)}>
              {menus.map((menuRowData, rowIndex) => (
                <View
                  key={rowIndex}
                  style={[
                    HelperStyles.flexDirection('row'),
                    HelperStyles.justifyContentCenteredView('space-between'),
                    HelperStyles.justView('marginTop', rowIndex != 0 ? 24 : 8),
                  ]}>
                  {menuRowData.map((menuData, dataIndex) => (
                    <React.Fragment key={dataIndex}>
                      {renderMenuCard(menuData)}
                    </React.Fragment>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {renderFab()}

        <CustomModal
          message={Labels.exitApp}
          onNegative={() => {
            handleExitApp();
          }}
          onPositive={() => {
            handleExitApp();

            BackHandler.exitApp();
          }}
          onRequestClose={() => {
            handleExitApp();
          }}
          visible={exitApp}
        />
      </View>
    </Network>
  );
};

const mapStateToProps = state => {
  return {
    userDetails: state.auth.userDetails,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: (requestData, onResponse) => {
      dispatch(logout(requestData, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
