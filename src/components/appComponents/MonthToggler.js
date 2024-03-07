import {useFocusEffect, useTheme} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Assets from '../../assets/Index';
import Labels from '../../utils/Strings';
import moment from 'moment';
import Styles from '../../styles/otherStyles/MonthToggler';
import * as ENV from '../../../env';
import * as HelperStyles from '../../utils/HelperStyles';

const MonthToggler = ({
  arrowLeftContainerStyle = {},
  arrowLeftIconStyle = {},
  arrowRightContainerStyle = {},
  arrowRightIconStyle = {},
  containerStyle = {},
  iconSize = 28,
  monthContainerStyle = {},
  monthTextStyle = {},
  onValueChange = () => {},
  value = null,
}) => {
  // MonthToggler Variables
  const [month, setMonth] = useState(moment());

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      value && loadValue();

      return () => {
        isFocus = false;
      };
    }, [value]),
  );

  const loadValue = () => {
    setMonth(moment(value));
  };

  const handleBackward = () => {
    const prevMonth = moment(month).subtract(1, Labels.formatM);

    ENV.currentEnvironment == Labels.development &&
      console.log('MONTH TOGGLER BACKWARD::: ', prevMonth);

    setMonth(prevMonth);

    onValueChange(prevMonth);
  };

  const handleForward = () => {
    const nextMonth = moment(month).add(1, Labels.formatM);

    ENV.currentEnvironment == Labels.development &&
      console.log('MONTH TOGGLER FORWARD::: ', nextMonth);

    setMonth(nextMonth);

    onValueChange(nextMonth);
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
      <View style={[Styles.monthContainer, monthContainerStyle]}>
        <Text
          style={[
            HelperStyles.textView(
              14,
              '700',
              Theme.primaryText,
              'center',
              'none',
            ),
            monthTextStyle,
          ]}>
          {moment(month)
            .format(`${Labels.formatMMM} ${Labels.formatYYYY}`)
            .toUpperCase()}
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

export default MonthToggler;
