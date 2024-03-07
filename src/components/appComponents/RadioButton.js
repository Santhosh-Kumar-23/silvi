import React from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Colors from '../../utils/Colors';
import Labels from '../../utils/Strings';
import Styles from '../../styles/otherStyles/RadioButton';
import * as HelperStyles from '../../utils/HelperStyles';

const RadioButton = ({
  containerStyle = {},
  disabled = false,
  innerCircleStyle = {},
  itemContainerStyle = {},
  itemTextContainerStyle = {},
  label = Labels.title,
  onValueChange = () => {},
  options = [],
  optionContainerStyle = {},
  optionLabelKey = null,
  optionTextStyle = {},
  optionValueKey = null,
  outerCircleStyle = {},
  radius = 20,
  value = null,
}) => {
  // RadioButton Variables
  const Theme = useTheme().colors;

  return (
    <View
      style={[
        HelperStyles.margin(0, 8),
        HelperStyles.padding(0, 3),
        containerStyle,
      ]}>
      <Text
        style={HelperStyles.textView(
          14,
          '600',
          Theme.primaryText,
          'left',
          'none',
        )}>
        {label}
      </Text>
      <View style={[Styles.optionContainer, optionContainerStyle]}>
        {options.map((optionData, index) => {
          return (
            <TouchableWithoutFeedback
              disabled={disabled}
              key={index}
              onPress={() => {
                onValueChange(optionData[optionValueKey]);
              }}>
              <View
                style={[
                  HelperStyles.flex(
                    options.length != 0 ? 1 / options.length : 1,
                  ),
                  Styles.itemContainer,
                  itemContainerStyle,
                ]}>
                <View
                  style={[
                    Styles.outerCircleContainer(radius),
                    HelperStyles.justView(
                      'borderColor',
                      value == optionData[optionValueKey]
                        ? Colors.primary
                        : Colors.lightText,
                    ),
                    outerCircleStyle,
                  ]}>
                  {value == optionData[optionValueKey] && (
                    <View
                      style={[
                        Styles.innerCircleContainer(radius / 2),
                        innerCircleStyle,
                      ]}
                    />
                  )}
                </View>
                <View
                  style={[Styles.itemTextContainer, itemTextContainerStyle]}>
                  <Text
                    style={[
                      HelperStyles.textView(
                        14,
                        '600',
                        Colors.lightText,
                        'center',
                        'none',
                      ),
                      optionTextStyle,
                    ]}>
                    {optionData[optionLabelKey] || null}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
};

export default RadioButton;
