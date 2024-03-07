import React, {useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {useTheme} from '@react-navigation/native';
import Assets from '../assets/Index';
import Labels from '../utils/Strings';
import * as HelperStyles from '../utils/HelperStyles';

const Network = props => {
  // Network Variables
  const [networkStatus, setNetworkStatus] = useState(true);

  // Other Variables
  const netInfo = useNetInfo().isConnected;

  // Theme Variables
  const Theme = useTheme().colors;

  useEffect(() => {
    setNetworkStatus(netInfo);
  }, [netInfo]);

  return (
    <>
      {networkStatus || networkStatus == null ? (
        props.children
      ) : (
        <View
          style={[
            HelperStyles.screenContainer(Theme.background),
            HelperStyles.justifyContentCenteredView('center'),
            HelperStyles.padding(12, 0),
          ]}>
          <Text
            style={HelperStyles.textView(
              16,
              '400',
              Theme.text,
              'center',
              'none',
            )}>
            {Labels.noInternetConnection}
          </Text>
          <View style={HelperStyles.margin(0, 32)}>
            <Image
              resizeMode={'contain'}
              source={Assets.noInternetConnection}
              style={HelperStyles.imageView(160, 160)}
            />
          </View>
          <Text
            style={HelperStyles.textView(
              12,
              '400',
              Theme.text,
              'center',
              'none',
            )}>
            {Labels.networkContent}
          </Text>
          <Text
            style={[
              HelperStyles.textView(12, '400', Theme.text, 'center', 'none'),
              HelperStyles.margin(0, 4),
            ]}>
            {Labels.refreshContent}
          </Text>
        </View>
      )}
    </>
  );
};

export default Network;
