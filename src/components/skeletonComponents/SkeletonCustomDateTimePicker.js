import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from '../../containers/SkeletonPlaceholder';
import * as HelperStyles from '../../utils/HelperStyles';

const SkeletonCustomDateTimePicker = ({
  height = 52,
  style = {},
  width = '100%',
}) => {
  // SkeletonCustomDateTimePicker Variables

  return (
    <SkeletonPlaceholder>
      <View
        style={[
          HelperStyles.imageView(height, width),
          HelperStyles.justView('borderRadius', 4),
          style,
        ]}
      />
    </SkeletonPlaceholder>
  );
};

export default SkeletonCustomDateTimePicker;
