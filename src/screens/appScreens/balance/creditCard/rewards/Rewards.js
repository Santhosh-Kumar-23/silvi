import React, {useLayoutEffect, useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {storeCreditCardPointsEditStatus} from '../../../../../redux/Root.Actions';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTheme} from '@react-navigation/native';
import Assets from '../../../../../assets/Index';
import Catelogue from './Catelogue';
import Points from './points/Points';
import Store from '../../../../../redux/Store';
import Styles from '../../../../../styles/appStyles/balance/creditCard/rewards/Rewards';
import Summary from './Summary';
import TabBar from '../../../../../components/appComponents/TabBar';
import * as Helpers from '../../../../../utils/Helpers';
import * as HelperStyles from '../../../../../utils/HelperStyles';

const Rewards = props => {
  // Props Variables
  const initialRouteName =
    Boolean(props) &&
    props.route.hasOwnProperty('params') &&
    Boolean(props.route.params) &&
    props.route.params.hasOwnProperty('initialRouteName') &&
    Boolean(props.route.params.initialRouteName)
      ? props.route.params.initialRouteName
      : 'Summary';

  // Rewards Variables
  const TopTabs = createMaterialTopTabNavigator();
  const [currentRoute, setCurrentRoute] = useState('Summary');

  // Theme Variables
  const Theme = useTheme().colors;

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => currentRoute == 'Points' && renderHeaderRight(),
    });
  });

  const renderHeaderRight = () => {
    return (
      <View style={HelperStyles.flexDirection('row')}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('CreatePoints');
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
        <TouchableOpacity
          onPress={() => {
            Store.dispatch(storeCreditCardPointsEditStatus(!props.editStatus));
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
            horizontalScrollView={false}
            tabBarItemStyle={HelperStyles.justView(
              'width',
              Helpers.windowWidth / 3,
            )}
            type={'outlined'}
          />
        )}
        style={[
          HelperStyles.flex(1),
          HelperStyles.justView('backgroundColor', Theme.background),
        ]}>
        <TopTabs.Screen name="Summary" component={Summary} />
        <TopTabs.Screen name="Catelogue" component={Catelogue} />
        <TopTabs.Screen name="Points" component={Points} />
      </TopTabs.Navigator>
    );
  };

  return (
    <View style={HelperStyles.screenContainer(Theme.background)}>
      {renderTabScreens()}
    </View>
  );
};

const mapStateToProps = state => {
  return {
    editStatus: state.app.creditCard.creditCardPointsEditStatus,
  };
};

export default connect(mapStateToProps, null)(Rewards);
