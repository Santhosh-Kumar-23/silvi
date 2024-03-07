import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from '../../containers/SkeletonPlaceholder';
import * as HelperStyles from '../../utils/HelperStyles';

const SkeletonCard = ({height = 52, style = {}, width = '100%'}) => {
  // SkeletonCard Variables

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

export default SkeletonCard;
