import React from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import SkeletonPlaceholder from '../../containers/SkeletonPlaceholder';
import * as Helpers from '../../utils/Helpers';
import * as HelperStyles from '../../utils/HelperStyles';

const SkeletonSwitch = ({
  height = 26,
  knobSize = 16,
  knobWidth = Helpers.windowWidth * 0.11125,
  labelWidth = '80%',
  switchWidth = '20%',
  width = '100%',
}) => {
  // SkeletonSwitch Variables

  // Theme Variables
  const Theme = useTheme().colors;

  return (
    <SkeletonPlaceholder>
      <View
        style={[
          HelperStyles.justView('width', width),
          HelperStyles.flexDirection('row'),
          HelperStyles.justView('justifyContent', 'space-between'),
        ]}>
        <View
          style={[
            HelperStyles.justView('width', labelWidth),
            HelperStyles.justView('justifyContent', 'center'),
          ]}>
          <View
            style={[
              HelperStyles.imageView(height, '100%'),
              HelperStyles.justView('alignItems', 'flex-start'),
            ]}
          />
        </View>
        <View
          style={[
            HelperStyles.justView('width', switchWidth),
            HelperStyles.justView('justifyContent', 'center'),
          ]}>
          <View
            style={[
              HelperStyles.justView('width', knobWidth),
              HelperStyles.justView('alignSelf', 'flex-end'),
              HelperStyles.padding(4, 4),
              HelperStyles.justView('borderColor', Theme.background),
              HelperStyles.justView('borderWidth', 1),
              HelperStyles.justView('borderRadius', knobSize),
            ]}>
            <View
              style={[
                HelperStyles.imageView(knobSize, knobSize),
                HelperStyles.justView('alignSelf', 'flex-start'),
                HelperStyles.justView('borderRadius', knobSize / 2),
              ]}
            />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default SkeletonSwitch;
