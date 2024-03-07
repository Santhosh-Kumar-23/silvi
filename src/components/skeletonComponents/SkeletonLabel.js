import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from '../../containers/SkeletonPlaceholder';
import * as HelperStyles from '../../utils/HelperStyles';

const SkeletonLabel = ({height = 16, style = {}, width = '75%'}) => {
  // SkeletonLabel Variables

  return (
    <SkeletonPlaceholder>
      <View style={[HelperStyles.imageView(height, width), style]} />
    </SkeletonPlaceholder>
  );
};

export default SkeletonLabel;
