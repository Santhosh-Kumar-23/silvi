import React from 'react';
import {View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTheme} from '@react-navigation/native';
import Expense from './Expense';
import Income from './Income';
import TabBar from '../../../../components/appComponents/TabBar';
import Transfer from './Transfer';
import * as Helpers from '../../../../utils/Helpers';
import * as HelperStyles from '../../../../utils/HelperStyles';

const AddManually = props => {
  // AddManually Variables
  const TopTabs = createMaterialTopTabNavigator();

  // Theme Variables
  const Theme = useTheme().colors;

  return (
    <View style={HelperStyles.screenContainer(Theme.background)}>
      <TopTabs.Navigator
        animationEnabled={true}
        initialRouteName={'Expense'}
        backBehavior={'history'}
        screenOptions={{swipeEnabled: false}}
        tabBar={props => (
          <TabBar
            {...props}
            tabBarItemStyle={{width: Helpers.windowWidth / 3}}
            type={'outlined'}
          />
        )}
        style={[
          HelperStyles.flex(1),
          HelperStyles.justView('backgroundColor', Theme.background),
        ]}>
        <TopTabs.Screen name="Expense" component={Expense} />
        <TopTabs.Screen name="Income" component={Income} />
        <TopTabs.Screen name="Transfer" component={Transfer} />
      </TopTabs.Navigator>
    </View>
  );
};
export default AddManually;
