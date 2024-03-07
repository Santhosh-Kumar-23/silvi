import React, {useState} from 'react';
import {View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTheme} from '@react-navigation/native';
import Earning from './Earning';
import Spending from './Spending';
import TabBar from '../../../../../../components/appComponents/TabBar';
import * as Helpers from '../../../../../../utils/Helpers';
import * as HelperStyles from '../../../../../../utils/HelperStyles';

const CreatePoints = props => {
  // Props Variables
  const initialRouteName =
    Boolean(props) &&
    props.route.hasOwnProperty('params') &&
    Boolean(props.route.params) &&
    props.route.params.hasOwnProperty('initialRouteName') &&
    Boolean(props.route.params.initialRouteName)
      ? props.route.params.initialRouteName
      : 'Spending';

  // CreatePoints Varibales
  const TopTabs = createMaterialTopTabNavigator();
  const [currentRoute, setCurrentRoute] = useState('Spending');

  // Theme Variables
  const Theme = useTheme().colors;

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
              Helpers.windowWidth / 2,
            )}
            type={'outlined'}
          />
        )}
        style={[
          HelperStyles.flex(1),
          HelperStyles.justView('backgroundColor', Theme.background),
        ]}>
        <TopTabs.Screen name="Spending" component={Spending} />
        <TopTabs.Screen name="Earning" component={Earning} />
      </TopTabs.Navigator>
    );
  };

  return (
    <View style={HelperStyles.screenContainer(Theme.background)}>
      {renderTabScreens()}
    </View>
  );
};

export default CreatePoints;
