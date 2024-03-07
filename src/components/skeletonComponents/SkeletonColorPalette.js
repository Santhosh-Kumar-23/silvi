import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from '../../containers/SkeletonPlaceholder';
import * as Helpers from '../../utils/Helpers';
import * as HelperStyles from '../../utils/HelperStyles';

const SkeletonColorPalette = ({
  iconSize = 36,
  iconStyle = {},
  itemStyle = {},
  textHeight = 16,
  textStyle = {},
  textWidth = Helpers.windowWidth * 0.5,
}) => {
  return (
    <SkeletonPlaceholder>
      <View
        style={[
          HelperStyles.flexDirection('row'),
          HelperStyles.justifyContentCenteredView('flex-start'),
          HelperStyles.margin(0, 8),
          itemStyle,
        ]}>
        <View
          style={[
            HelperStyles.imageView(iconSize, iconSize),
            HelperStyles.justView('borderRadius', iconSize / 2),
            iconStyle,
          ]}
        />
        <View
          style={[
            HelperStyles.imageView(textHeight, textWidth),
            HelperStyles.justView('marginLeft', 8),
            textStyle,
          ]}
        />
      </View>
    </SkeletonPlaceholder>
  );
};

export default SkeletonColorPalette;
