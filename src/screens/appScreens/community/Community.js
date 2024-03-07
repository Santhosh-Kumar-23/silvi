import React, {useLayoutEffect, useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTheme} from '@react-navigation/native';
import Assets from '../../../assets/Index';
import Followers from './Followers';
import Followings from './Followings';
import Labels from '../../../utils/Strings';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Styles from '../../../styles/appStyles/community/Community';
import TabBar from '../../../components/appComponents/TabBar';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';

const Community = props => {
  // Props Variables
  const initialRouteName =
    Boolean(props) &&
    props.route.hasOwnProperty('params') &&
    Boolean(props.route.params) &&
    props.route.params.hasOwnProperty('initialRouteName') &&
    Boolean(props.route.params.initialRouteName)
      ? props.route.params.initialRouteName
      : 'Followers';

  // Community Varibales
  const TopTabs = createMaterialTopTabNavigator();
  const [currentRoute, setCurrentRoute] = useState('Followers');

  // Theme Variables
  const Theme = useTheme().colors;

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => renderHeaderRight(),
    });
  });

  const renderHeaderRight = () => {
    return (
      <View style={HelperStyles.flexDirection('row')}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('FollowRequests');
          }}
          style={[
            Styles.headerIconContainer,
            HelperStyles.justView('marginRight', 12),
          ]}>
          <MaterialIcons color={Theme.text} name={'group'} size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('UserSearch');
          }}
          style={Styles.headerIconContainer}>
          <Image
            resizeMode={'contain'}
            source={Assets.search}
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
              Helpers.windowWidth / 2,
            )}
            type={'outlined'}
          />
        )}
        style={[
          HelperStyles.flex(1),
          HelperStyles.justView('backgroundColor', Theme.background),
        ]}>
        <TopTabs.Screen
          name="Followers"
          component={Followers}
          options={{
            title: `${Math.floor(Math.random() * 2000).toLocaleString(
              'en-GB',
            )} ${Labels.followers}`,
          }}
        />
        <TopTabs.Screen
          name="Followings"
          component={Followings}
          options={{
            title: `${Math.floor(Math.random() * 1500).toLocaleString(
              'en-GB',
            )} ${Labels.followings}`,
          }}
        />
      </TopTabs.Navigator>
    );
  };

  return (
    <View style={HelperStyles.screenContainer(Theme.background)}>
      {renderTabScreens()}
    </View>
  );
};

export default Community;
