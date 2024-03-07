import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Styles from '../styles/otherStyles/Card';
import * as HelperStyles from '../utils/HelperStyles';

const Card = ({
  containerStyle,
  children,
  disabled = true,
  onPress = () => {},
}) => {
  // Theme Variables
  const Theme = useTheme().colors;

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => {
        onPress();
      }}
      style={[
        HelperStyles.justView('backgroundColor', Theme.card),
        Styles.cardContainer,
        containerStyle,
      ]}>
      {children}
    </TouchableOpacity>
  );
};

export default Card;
