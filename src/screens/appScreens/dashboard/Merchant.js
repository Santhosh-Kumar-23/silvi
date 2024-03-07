import React from 'react';
import {Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Colors from '../../../utils/Colors';
import Network from '../../../containers/Network';
import Styles from '../../../styles/appStyles/dashboard/Merchant';
import * as HelperStyles from '../../../utils/HelperStyles';

const Merchant = props => {
  // Merchant Variables
  // Theme Variables
  const Theme = useTheme().colors;

  return (
    <Network>
      <View style={HelperStyles.screenContainer(Theme.background)}>
        <View style={Styles.screenContainer}>
          <View style={HelperStyles.screenSubContainer}>
            <Text
              style={HelperStyles.textView(
                16,
                '400',
                Colors.primary,
                'center',
                'capitalize',
              )}>
              Merchant Screen
            </Text>
          </View>
        </View>
      </View>
    </Network>
  );
};

export default Merchant;
