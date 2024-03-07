import React from 'react';
import {useTheme} from '@react-navigation/native';
import Colors from '../utils/Colors';
import SkeletonLoader from 'react-native-skeleton-placeholder';
import * as Helpers from '../utils/Helpers';

const SkeletonPlaceholder = ({children}) => {
  // SkeletonPlaceholder Variables

  // Theme Variables
  const themeScheme = Helpers.getThemeScheme();
  const Theme = useTheme().colors;

  return (
    <SkeletonLoader
      backgroundColor={
        themeScheme == 'dark' ? Theme.background : Colors.background
      }
      highlightColor={themeScheme == 'dark' ? Colors.stroke25 : Colors.stroke5}>
      {children}
    </SkeletonLoader>
  );
};

export default SkeletonPlaceholder;
