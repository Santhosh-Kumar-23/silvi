import React, {useCallback, useState} from 'react';
import {Text, View} from 'react-native';
import Card from '../../containers/Card';
import DropdownCard from './DropdownCard';
import FloatingTextInput from './FloatingTextInput';
import Labels from '../../utils/Strings';
import Styles from '../../styles/otherStyles/TimePeriod';
import * as ENV from '../../../env';
import * as HelperStyles from '../../utils/HelperStyles';
import {useFocusEffect} from '@react-navigation/native';

const TimePeriod = ({
  disabled = false,
  dropdownCardArrowDownContainerStyle = {},
  dropDownCardErrorStatus = false,
  dropdownCardLabelContainerStyle = {},
  dropDownCardValue = null,
  onChangeText = () => {},
  onValueChange = () => {},
  textInputCardContainerStyle = {},
  textInputContainerStyle = {},
  textInputErrorStatus = false,
  textInputIsDecimal = false,
  textInputLabelStyle = {},
  textInputValue = null,
}) => {
  // TimePeriod Variables
  const [time, setTime] = useState(null);
  const [frequency, setFrequency] = useState(null);

  // Other Variables
  const frequencyOptions = [
    {label: 'Day(s)', value: 'Day(s)'},
    {label: 'Month(s)', value: 'Month(s)'},
    {label: 'Week(s)', value: 'Week(s)'},
    {label: 'Year(s)', value: 'Year(s)'},
  ];

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      init();

      return () => {
        isFocus = false;
      };
    }, [dropDownCardValue, textInputValue]),
  );

  const init = () => {
    setTime(textInputValue);

    setFrequency(dropDownCardValue);
  };

  return (
    <View style={HelperStyles.margin(0, 8)}>
      <View style={Styles.container}>
        <View style={Styles.timeContainer}>
          <Card
            containerStyle={[
              Styles.floatingTextInputCardContainer,
              textInputCardContainerStyle,
            ]}>
            <FloatingTextInput
              autoCapitalize={'none'}
              editable={!disabled}
              isDecimal={textInputIsDecimal}
              keyboardType={'number-pad'}
              textContentType={'none'}
              textInputContainerStyle={[
                Styles.floatingTextInputContainer,
                textInputContainerStyle,
              ]}
              textInputLabelStyle={Styles.floatingTextInputLabel}
              textInputStyle={[Styles.floatingTextInput, textInputLabelStyle]}
              title={Labels.time}
              updateMasterState={txt => {
                ENV.currentEnvironment == Labels.development &&
                  console.log('TIME VALUE::: ', txt);

                setTime(txt);

                onChangeText(txt);
              }}
              value={time}
            />
          </Card>
          {textInputErrorStatus && (
            <Text
              style={[
                HelperStyles.errorText,
                HelperStyles.justView('marginHorizontal', 12),
              ]}>
              {Labels.timeError}
            </Text>
          )}
          {!textInputErrorStatus && dropDownCardErrorStatus && (
            <Text
              style={[
                HelperStyles.errorText,
                HelperStyles.justView('marginHorizontal', 12),
              ]}
            />
          )}
        </View>
        <View style={Styles.frequencyContainer}>
          <DropdownCard
            disabled={disabled}
            label={Labels.frequency}
            arrowDownContainerStyle={[
              HelperStyles.flex(0.25),
              dropdownCardArrowDownContainerStyle,
            ]}
            labelContainerStyle={[
              Styles.dropdownCardLabelContainerStyle,
              dropdownCardLabelContainerStyle,
            ]}
            onValueChange={selectedValue => {
              ENV.currentEnvironment == Labels.development &&
                console.log('FREQUENCY SELECTED VALUE::: ', selectedValue);

              onValueChange(
                Boolean(selectedValue) && Object.keys(selectedValue).length != 0
                  ? selectedValue.value
                  : null,
              );
            }}
            optionLabelKey={'label'}
            options={frequencyOptions}
            optionValueKey={'value'}
            searchEnabled={false}
            value={frequency}
          />
          {dropDownCardErrorStatus && (
            <Text
              style={[
                HelperStyles.errorText,
                HelperStyles.justView('marginHorizontal', 12),
              ]}>
              {Labels.frequencyError}
            </Text>
          )}
          {!dropDownCardErrorStatus && textInputErrorStatus && (
            <Text
              style={[
                HelperStyles.errorText,
                HelperStyles.justView('marginHorizontal', 12),
              ]}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default TimePeriod;
