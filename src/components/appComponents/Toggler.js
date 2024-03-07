import {useFocusEffect, useTheme} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Assets from '../../assets/Index';
import Labels from '../../utils/Strings';
import Styles from '../../styles/otherStyles/Toggler';
import * as HelperStyles from '../../utils/HelperStyles';

const Toggler = ({
  arrowLeftContainerStyle = {},
  arrowLeftIconStyle = {},
  arrowRightContainerStyle = {},
  arrowRightIconStyle = {},
  containerStyle = {},
  iconSize = 28,
  index = 0,
  label = null,
  length = null,
  onValueChange = () => {},
  togglerContainerStyle = {},
  togglerTextStyle = {},
}) => {
  // Toggler Variables
  const [toggler, setToggler] = useState(null);

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      label && setToggler(label);

      return () => {
        isFocus = false;
      };
    }, [label]),
  );

  const handleBackward = () => {
    if (Boolean(length)) {
      const prevValue = index != 0 ? index - 1 : index;

      onValueChange(prevValue);
    } else {
      onValueChange(null);
    }
  };

  const handleForward = () => {
    if (Boolean(length)) {
      const nextValue = index != length - 1 ? index + 1 : index;

      onValueChange(nextValue);
    } else {
      onValueChange(null);
    }
  };

  return (
    <View style={[Styles.container, containerStyle]}>
      <TouchableOpacity
        onPress={() => {
          handleBackward();
        }}
        style={[Styles.arrowLeftContainer, arrowLeftContainerStyle]}>
        <Image
          resizeMode={'contain'}
          source={Assets.arrowLeft}
          style={[
            HelperStyles.imageView(iconSize, iconSize),
            HelperStyles.justView('tintColor', Theme.primaryText),
            arrowLeftIconStyle,
          ]}
        />
      </TouchableOpacity>
      <View style={[Styles.togglerContainer, togglerContainerStyle]}>
        <Text
          style={[
            HelperStyles.textView(
              14,
              '700',
              Theme.primaryText,
              'center',
              'none',
            ),
            togglerTextStyle,
          ]}>
          {toggler}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          handleForward();
        }}
        style={[Styles.arrowRightContainer, arrowRightContainerStyle]}>
        <Image
          resizeMode={'contain'}
          source={Assets.arrowRight}
          style={[
            HelperStyles.imageView(iconSize, iconSize),
            HelperStyles.justView('tintColor', Theme.primaryText),
            arrowRightIconStyle,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Toggler;
