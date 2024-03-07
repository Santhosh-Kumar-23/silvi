import React from 'react';
import {View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTheme} from '@react-navigation/native';
import Categories from './Categories';
import Merchant from './Merchant';
import TabBar from '../../../components/appComponents/TabBar';
import Transaction from './Transaction';
import Overview from './Overview';
import * as HelperStyles from '../../../utils/HelperStyles';

const Dashboard = props => {
  // Dashboard Variables
  const TopTabs = createMaterialTopTabNavigator();

  // Theme Variables
  const Theme = useTheme().colors;

  return (
    <View style={HelperStyles.screenContainer(Theme.background)}>
      <TopTabs.Navigator
        animationEnabled={true}
        initialRouteName={'Overview'}
        backBehavior={'history'}
        screenOptions={{swipeEnabled: false}}
        tabBar={props => (
          <TabBar {...props} horizontalScrollView={true} type={'outlined'} />
        )}
        style={[
          HelperStyles.flex(1),
          HelperStyles.justView('backgroundColor', Theme.background),
        ]}>
        <TopTabs.Screen name="Overview" component={Overview} />
        <TopTabs.Screen name="Transaction" component={Transaction} />
        <TopTabs.Screen name="Categories" component={Categories} />
        <TopTabs.Screen name="Merchant" component={Merchant} />
      </TopTabs.Navigator>
    </View>
  );
};

export default Dashboard;
