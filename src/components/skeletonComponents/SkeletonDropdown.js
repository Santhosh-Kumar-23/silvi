import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from '../../containers/SkeletonPlaceholder';
import * as Helpers from '../../utils/Helpers';
import * as HelperStyles from '../../utils/HelperStyles';

const SkeletonDropdown = ({
  imageSize = 36,
  imageStyle = {},
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
            HelperStyles.imageView(imageSize, imageSize),
            HelperStyles.justView('borderRadius', imageSize / 2),
            imageStyle,
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

export default SkeletonDropdown;
