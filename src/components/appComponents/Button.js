import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../utils/Colors';
import Styles from '../../styles/otherStyles/Button';
import * as HelperStyles from '../../utils/HelperStyles';

const Button = ({
  containerStyle = null,
  isImage = false,
  label = 'Button',
  loading = false,
  mode = 'solid',
  onPress = () => {},
  renderImage = () => {},
  textStyle = null,
  touchable = false,
}) => {
  // Button Variables

  // Other Variables
  let customContainerStyle = {},
    customTextStyle = {};

  switch (mode) {
    case 'light':
      customContainerStyle = {
        ...customContainerStyle,
        backgroundColor: Colors.barBackground,
        borderColor: Colors.barBackground,
        borderRadius: 4,
        borderWidth: 0.5,
      };

      customTextStyle = {color: Colors.primaryText, top: isImage ? 2 : 0};
      break;

    case 'outlined':
      customContainerStyle = {
        ...customContainerStyle,
        backgroundColor: Colors.white,
        borderColor: Colors.primary,
        borderRadius: 4,
        borderWidth: 0.5,
      };

      customTextStyle = {color: Colors.primary, top: isImage ? 2 : 0};
      break;

    case 'solid':
    default:
      customContainerStyle = {
        ...customContainerStyle,
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        borderRadius: 4,
        borderWidth: 0.5,
      };

      customTextStyle = {color: Colors.white, top: isImage ? 2 : 0};
      break;
  }

  const handleOnPress = () => {
    onPress();
  };

  const renderButton = () => {
    return (
      <View
        style={[
          HelperStyles.flex(1),
          HelperStyles.justifyContentCenteredView('center'),
        ]}>
        <View style={HelperStyles.justifyContentCenteredView('center')}>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <View
              style={[
                HelperStyles.flex(1),
                HelperStyles.flexDirection('row'),
                HelperStyles.justifyContentCenteredView('center'),
              ]}>
              {isImage && renderImage()}
              <Text
                style={[
                  HelperStyles.textView(
                    16,
                    '600',
                    Colors.white,
                    'center',
                    'capitalize',
                  ),
                  customTextStyle,
                  textStyle,
                ]}>
                {label}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      disabled={touchable || loading}
      style={[
        Styles.buttonContainer,
        customContainerStyle,
        containerStyle,
        loading && HelperStyles.justView('backgroundColor', Colors.primary),
      ]}
      onPress={() => {
        handleOnPress();
      }}>
      {renderButton()}
    </TouchableOpacity>
  );
};

export default Button;
