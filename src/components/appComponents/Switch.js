import React from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Colors from '../../utils/Colors';
import Labels from '../../utils/Strings';
import Styles from '../../styles/otherStyles/Switch';
import * as HelperStyles from '../../utils/HelperStyles';

const Switch = ({
  containerStyle = {},
  disabled = false,
  knobSize = 16,
  knobStyle = {},
  label = Labels.switch,
  labelStyle = {},
  onValueChange = () => {},
  switchContainerStyle = {},
  switchSubContainerStyle = {},
  textContainerStyle = {},
  thumbColor = {false: Colors.lightText, true: Colors.primary},
  trackColor = {false: Colors.lightText, true: Colors.primary},
  value = false,
}) => {
  // Switch Variables

  // Theme Variables
  const Theme = useTheme().colors;

  return (
    <View style={[Styles.container, containerStyle]}>
      <View style={[Styles.textContainer, textContainerStyle]}>
        <Text
          style={[
            HelperStyles.textView(
              14,
              '600',
              Theme.primaryText,
              'left',
              'none',
            ),
            HelperStyles.justView('lineHeight', 16),
            labelStyle,
          ]}>
          {label}
        </Text>
      </View>
      <View style={[Styles.switchContainer, switchContainerStyle]}>
        <TouchableWithoutFeedback
          disabled={disabled}
          onPress={() => {
            onValueChange();
          }}>
          <View
            style={[
              Styles.switchSubContainer,
              HelperStyles.justView('backgroundColor', Theme.background),
              HelperStyles.justView(
                'borderColor',
                value ? trackColor.true : trackColor.false,
              ),
              HelperStyles.justView('borderRadius', knobSize),
              switchSubContainerStyle,
            ]}>
            <View
              style={[
                HelperStyles.imageView(knobSize, knobSize),
                HelperStyles.justView(
                  'alignSelf',
                  value ? 'flex-end' : 'flex-start',
                ),
                HelperStyles.justView(
                  'backgroundColor',
                  value ? thumbColor.true : thumbColor.false,
                ),
                HelperStyles.justView('borderRadius', 16 / 2),
                knobStyle,
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default Switch;
