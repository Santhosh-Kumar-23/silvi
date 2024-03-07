import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/core';
import React, { useCallback } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import * as ENV from '../../../env';
import Assets from '../../assets/Index';
import { fetchUser } from '../../redux/Root.Actions';
import Styles from '../../styles/authStyles/Splash';
import * as HelperStyles from '../../utils/HelperStyles';
import Labels from '../../utils/Strings';

const Splash = props => {
  // Splash Variables

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      init();

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const init = () => {
    checkUserStatus();
  };

  const checkUserStatus = async () => {
    const token = await AsyncStorage.getItem('token');

    ENV.currentEnvironment == Labels.development &&
      console.log('TOKEN::: ', token);

    if (Boolean(token)) {
      fetchUser();
    } else {
      setTimeout(() => {
        props.navigation.navigate('Intro');
      }, 1000);
    }
  };

  const fetchUser = async () => {
    const userId = await AsyncStorage.getItem('userId');

    ENV.currentEnvironment == Labels.development &&
      console.log('USER ID::: ', userId);

    props.fetchUser(userId, res => {
      const response = res.resJson;

      ENV.currentEnvironment == Labels.development &&
        console.log('FETCH USER RESPONSE DATA::: ', response);

      props.navigation.navigate('Menu');
    });
  };

  return (
    <View style={Styles.screenContainer}>
      <View style={HelperStyles.screenSubContainer}>
        <Image
          resizeMode={'contain'}
          source={Assets.logo}
          style={HelperStyles.imageView(96, 96)}
        />
      </View>
    </View>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: (userId, onResponse) => {
      dispatch(fetchUser(userId, onResponse));
    },
  };
};

export default connect(null, mapDispatchToProps)(Splash);
