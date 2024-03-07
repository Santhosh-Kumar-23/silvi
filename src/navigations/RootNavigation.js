import React from 'react';
import {Image, TouchableWithoutFeedback, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import AppNavigation from './AppNavigation';
import Assets from '../assets/Index';
import AuthNavigation from './AuthNavigation';
import Styles from '../styles/navigationStyles/RootNavigation';
import * as HelperStyles from '../utils/HelperStyles';

const RootNavigation = () => {
  // RootNavigation Variables
  const Stack = createNativeStackNavigator();

  // Theme Variables
  const Theme = useTheme().colors;

  return (
    <Stack.Navigator
      initialRouteName={'Splash'}
      screenOptions={({navigation}) => ({
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerTitle: () => (
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate('Menu');
            }}>
            <View style={Styles.logoContainer}>
              <Image
                resizeMode={'contain'}
                source={Assets.logo}
                style={HelperStyles.imageView(44, 44)}
              />
            </View>
          </TouchableWithoutFeedback>
        ),
        headerShadowVisible: false,
        headerStyle: {backgroundColor: Theme.background},
      })}>
      {AuthNavigation()}
      {AppNavigation()}
    </Stack.Navigator>
  );
};

export default RootNavigation;
