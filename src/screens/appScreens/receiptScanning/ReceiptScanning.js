import React, {useLayoutEffect} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTheme} from '@react-navigation/native';
import AddManually from './addManually/AddManually';
import Assets from '../../../assets/Index';
import Labels from '../../../utils/Strings';
import ScanReceipt from './ScanReceipt';
import TabBar from '../../../components/appComponents/TabBar';
import * as HelperStyles from '../../../utils/HelperStyles';

const ReceiptScanning = props => {
  // Props Variables
  const initialRouteName =
    Boolean(props) &&
    props.route.hasOwnProperty('params') &&
    Boolean(props.route.params) &&
    props.route.params.hasOwnProperty('initialRouteName') &&
    Boolean(props.route.params.initialRouteName)
      ? props.route.params.initialRouteName
      : 'AddManually';

  // ReceiptScanning Variables
  const TopTabs = createMaterialTopTabNavigator();

  // Theme Variables
  const Theme = useTheme().colors;

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => renderHeaderRight(),
    });
  });

  const renderHeaderRight = () => {
    return (
      <TouchableOpacity onPress={() => {}} style={HelperStyles.padding(4, 4)}>
        <Image
          resizeMode={'contain'}
          source={Assets.share}
          style={[
            HelperStyles.imageView(24, 24),
            HelperStyles.justView('tintColor', Theme.text),
          ]}
        />
      </TouchableOpacity>
    );
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
            tabBarStyle={HelperStyles.justView('marginHorizontal', 20)}
            type={'solid'}
          />
        )}
        style={[
          HelperStyles.flex(1),
          HelperStyles.justView('backgroundColor', Theme.background),
        ]}>
        <TopTabs.Screen
          name="AddManually"
          component={AddManually}
          options={{title: Labels.addManually}}
        />
        <TopTabs.Screen
          name="ScanReceipt"
          component={ScanReceipt}
          options={{title: Labels.scanReceipt}}
        />
      </TopTabs.Navigator>
    </View>
  );
};

export default ReceiptScanning;
