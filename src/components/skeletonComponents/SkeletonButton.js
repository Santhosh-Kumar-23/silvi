import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from '../../containers/SkeletonPlaceholder';
import * as HelperStyles from '../../utils/HelperStyles';

const SkeletonButton = ({height = 40, style = {}, width = '100%'}) => {
  // SkeletonButton Variables

  return (
    <SkeletonPlaceholder>
      <View
        style={[
          HelperStyles.imageView(height, width),
          HelperStyles.justView('borderRadius', 4),
          HelperStyles.padding(8, 8),
          HelperStyles.justView('elevation', 4),
          style,
        ]}
      />
    </SkeletonPlaceholder>
  );
};

export default SkeletonButton;
