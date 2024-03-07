import React, {useCallback, useLayoutEffect, useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {
  billingList,
  claimList,
  storeBillingEditStatus,
  storeClaimEditStatus,
} from '../../../redux/Root.Actions';
import {connect} from 'react-redux';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../assets/Index';
import Billing from './Billing';
import Claims from './Claims';
import Labels from '../../../utils/Strings';
import moment from 'moment';
import Store from '../../../redux/Store';
import Styles from '../../../styles/appStyles/billing/Billing';
import TabBar from '../../../components/appComponents/TabBar';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';

const BillingClaim = props => {
  // Props Variables
  const initialRouteName =
    Boolean(props) &&
    props.route.hasOwnProperty('params') &&
    Boolean(props.route.params) &&
    props.route.params.hasOwnProperty('initialRouteName') &&
    Boolean(props.route.params.initialRouteName)
      ? props.route.params.initialRouteName
      : 'Billing';

  // Balance Variables
  const TopTabs = createMaterialTopTabNavigator();
  const [currentRoute, setCurrentRoute] = useState('Billing');

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
      <View style={HelperStyles.flexDirection('row')}>
        {currentRoute == 'Billing' && (
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('CreateBilling');
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
        )}
        <TouchableOpacity
          onPress={() => {
            handleEdit();
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
      </View>
    );
  };

  const handleEdit = () => {
    switch (currentRoute) {
      case Labels.billing:
        Boolean(props.billingListStatus)
          ? Store.dispatch(storeBillingEditStatus(!props.billingEditStatus))
          : showMessage({
              icon: 'auto',
              message: Labels.noTransactionsFound,
              position: 'bottom',
              type: 'info',
            });

        break;

      case `${Labels.claim}s`:
        Boolean(props.claimListStatus)
          ? Store.dispatch(storeClaimEditStatus(!props.claimEditStatus))
          : showMessage({
              icon: 'auto',
              message: Labels.noTransactionsFound,
              position: 'bottom',
              type: 'info',
            });

        break;

      default:
        break;
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      handleFetch();

      return () => {
        Store.dispatch(storeClaimEditStatus(false));
        isFocus = false;
      };
    }, [currentRoute]),
  );

  const handleFetch = () => {
    switch (currentRoute) {
      case Labels.billing:
        billingList();

        break;

      case `${Labels.claim}s`:
        claimList();

        break;

      default:
        break;
    }
  };

  const billingList = () => {
    const requestData = {
      month: Helpers.formatDateTime(moment(), null, Labels.formatM),
      year: Helpers.formatDateTime(moment(), null, Labels.formatYYYY),
    };

    props.billingList(requestData, res => {});
  };

  const claimList = () => {
    const requestData = {
      month: Helpers.formatDateTime(moment(), null, Labels.formatM),
      year: Helpers.formatDateTime(moment(), null, Labels.formatYYYY),
    };

    props.claimList(requestData, res => {});
  };

  return (
    <View style={HelperStyles.screenContainer(Theme.background)}>
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
        <TopTabs.Screen name="Billing" component={Billing} />
        <TopTabs.Screen name="Claims" component={Claims} />
      </TopTabs.Navigator>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    billingEditStatus: state.app.billing.billingEditStatus,
    billingListStatus: state.app.billing.billingListStatus,
    claimEditStatus: state.app.claims.claimEditStatus,
    claimListStatus: state.app.claims.claimListStatus,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    billingList: (requestData, onResponse) => {
      dispatch(billingList(requestData, onResponse));
    },

    claimList: (requestData, onResponse) => {
      dispatch(claimList(requestData, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BillingClaim);
