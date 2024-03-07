import React, {useCallback, useLayoutEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {accountList, storeAccountEditStatus} from '../../../redux/Root.Actions';
import {connect} from 'react-redux';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Account from './account/Account';
import Assets from '../../../assets/Index';
import Button from '../../../components/appComponents/Button';
import CreditCard from './creditCard/CreditCard';
import Icon from 'react-native-vector-icons/Entypo';
import Labels from '../../../utils/Strings';
import SkeletonCard from '../../../components/skeletonComponents/SkeletonCard';
import SkeletonPlaceholder from '../../../containers/SkeletonPlaceholder';
import Store from '../../../redux/Store';
import Styles from '../../../styles/appStyles/balance/Balance';
import TabBar from '../../../components/appComponents/TabBar';
import * as ENV from '../../../../env';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';

const Balance = props => {
  // Props Variables
  const initialRouteName =
    Boolean(props) &&
    props.route.hasOwnProperty('params') &&
    Boolean(props.route.params) &&
    props.route.params.hasOwnProperty('initialRouteName') &&
    Boolean(props.route.params.initialRouteName)
      ? props.route.params.initialRouteName
      : 'Account';

  // Balance Variables
  const TopTabs = createMaterialTopTabNavigator();
  const [accounts, setAccounts] = useState(null);
  const [currentRoute, setCurrentRoute] = useState('Account');

  // Theme Variables
  const Theme = useTheme().colors;

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => renderHeaderLeft(),
      headerRight: () => renderHeaderRight(),
    });
  });

  const renderHeaderLeft = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Menu');
        }}
        style={[
          HelperStyles.justifyContentCenteredView('center'),
          HelperStyles.padding(4, 4),
        ]}>
        <Image
          resizeMode={'contain'}
          source={Assets.home}
          style={[
            HelperStyles.imageView(24, 24),
            HelperStyles.justView('tintColor', Theme.text),
          ]}
        />
      </TouchableOpacity>
    );
  };

  const renderHeaderRight = () => {
    return (
      Boolean(accounts) &&
      Array.isArray(accounts) &&
      accounts.length != 0 && (
        <View style={HelperStyles.flexDirection('row')}>
          <TouchableOpacity
            onPress={() => {
              handleRoute();
            }}
            style={[
              Styles.headerIconContainer,
              HelperStyles.justView('marginRight', 12),
            ]}>
            <Image
              resizeMode={'contain'}
              source={Assets.plus}
              style={[
                HelperStyles.imageView(24, 24),
                HelperStyles.justView('tintColor', Theme.text),
              ]}
            />
          </TouchableOpacity>
          {currentRoute == Labels.balanceAccount ? (
            <TouchableOpacity
              onPress={() => {
                Store.dispatch(
                  storeAccountEditStatus(!props.accountEditStatus),
                );
              }}
              style={Styles.headerIconContainer}>
              <Image
                resizeMode={'contain'}
                source={Assets.edit}
                style={[
                  HelperStyles.imageView(24, 24),
                  HelperStyles.justView('tintColor', Theme.text),
                ]}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('CreditCardList');
              }}
              style={Styles.headerIconContainer}>
              <Icon name="list" size={22} color={Theme.text} />
            </TouchableOpacity>
          )}
        </View>
      )
    );
  };

  const handleRoute = () => {
    switch (currentRoute) {
      case Labels.balanceAccount:
        props.navigation.navigate('CreateAccount');
        break;

      case Labels.balanceCreditCard:
        props.navigation.navigate('CreateCreditCard');
        break;
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      getAccountList();

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const getAccountList = () => {
    const requestData = {offset: 1, limit: ENV.dataLimit};

    props.accountList(requestData, res => {
      const response = res.resJson.data;

      setAccounts(response.list.results);
    });
  };

  const renderTabScreens = () => {
    return (
      <TopTabs.Navigator
        animationEnabled={true}
        initialRouteName={initialRouteName}
        backBehavior={'history'}
        screenOptions={{swipeEnabled: false}}
        tabBar={props => (
          <TabBar
            {...props}
            getCurrentRoute={routeName => {
              setCurrentRoute(routeName);
            }}
            horizontalScrollView={true}
            tabBarItemStyle={HelperStyles.justView(
              'width',
              Helpers.windowWidth * 0.5,
            )}
            type={'outlined'}
          />
        )}
        style={[
          HelperStyles.flex(1),
          HelperStyles.justView('backgroundColor', Theme.background),
        ]}>
        <TopTabs.Screen name="Account" component={Account} />
        <TopTabs.Screen
          name="CreditCard"
          component={CreditCard}
          options={{tabBarLabel: Labels.creditCard}}
        />
      </TopTabs.Navigator>
    );
  };

  const renderCreateAccount = () => {
    return (
      <View style={Styles.screenContainer}>
        <View style={HelperStyles.margin(24, 24)}>
          <Text
            style={HelperStyles.textView(
              14,
              '400',
              Theme.primaryText,
              'center',
              'none',
            )}>
            {Labels.createFirstAccount}
          </Text>
          <Button
            containerStyle={HelperStyles.margin(0, 16)}
            label={Labels.createYourAccount}
            onPress={() => {
              props.navigation.navigate('CreateAccount');
            }}
            textStyle={HelperStyles.justView('textTransform', 'none')}
          />
        </View>
      </View>
    );
  };

  const BalanceTabSkeleton = () => {
    return (
      <View
        style={[
          HelperStyles.flexDirection('row'),
          {justifyContent: 'space-around'},
        ]}>
        <SkeletonCard
          height={Helpers.windowHeight * 0.04}
          width={Helpers.windowWidth * 0.4}
          style={HelperStyles.justView('borderRadius', 8)}
        />
        <SkeletonCard
          height={Helpers.windowHeight * 0.04}
          width={Helpers.windowWidth * 0.4}
          style={HelperStyles.justView('borderRadius', 8)}
        />
      </View>
    );
  };

  const BalanceTabLineSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonPlaceholder>
          <View style={HelperStyles.imageView(4, '100%')} />
        </SkeletonPlaceholder>
      </View>
    );
  };

  const TotalCashFlowSkeleton = () => {
    return (
      <SkeletonPlaceholder>
        <View style={HelperStyles.imageView(43, '100%')} />
      </SkeletonPlaceholder>
    );
  };

  const AccountCardSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonCard
          height={Helpers.windowHeight * 0.11625}
          style={HelperStyles.justView('borderRadius', 8)}
        />
      </View>
    );
  };

  const renderCreateAccountSkeleton = () => {
    return (
      <View style={HelperStyles.flex(1)}>
        <BalanceTabSkeleton />
        <BalanceTabLineSkeleton />
        <TotalCashFlowSkeleton />
        <View style={HelperStyles.margin(24, 8)}>
          <AccountCardSkeleton />
          <AccountCardSkeleton />
          <AccountCardSkeleton />
          <AccountCardSkeleton />
          <AccountCardSkeleton />
          <AccountCardSkeleton />
        </View>
      </View>
    );
  };

  return (
    <View style={HelperStyles.screenContainer(Theme.background)}>
      {Boolean(accounts) ? (
        <>
          {Array.isArray(accounts) && accounts.length != 0
            ? renderTabScreens()
            : renderCreateAccount()}
        </>
      ) : (
        renderCreateAccountSkeleton()
      )}
    </View>
  );
};

const mapStateToProps = state => {
  return {
    accountEditStatus: state.app.account.accountEditStatus,
    creditCardEditStatus: state.app.creditCard.creditCardEditStatus,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    accountList: (requestData, onResponse) => {
      dispatch(accountList(requestData, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Balance);
