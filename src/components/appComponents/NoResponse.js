import React from 'react';
import {Image, Text, View} from 'react-native';
import Assets from '../../assets/Index';
import Colors from '../../utils/Colors';
import Labels from '../../utils/Strings';
import * as HelperStyles from '../../utils/HelperStyles';

const NoResponse = () => {
  // NoResponse Variables

  return (
    <View
      style={[
        HelperStyles.flex(1),
        HelperStyles.justifyContentCenteredView('center'),
      ]}>
      <Image
        resizeMode={'contain'}
        source={Assets.noResponse}
        style={HelperStyles.imageView('37.5%', '50%')}
      />
      <Text
        style={HelperStyles.textView(
          20,
          '700',
          Colors.primary,
          'center',
          'none',
        )}>
        {Labels.whoops}
      </Text>
      <Text
        style={[
          HelperStyles.textView(16, '600', Colors.lightText, 'center', 'none'),
          HelperStyles.margin(0, 8),
        ]}>
        {Labels.notFindAnything}
      </Text>
    </View>
  );
};

export default NoResponse;
