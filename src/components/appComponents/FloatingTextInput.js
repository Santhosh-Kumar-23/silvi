import React, {useCallback, useState} from 'react';
import {Animated, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Colors from '../../utils/Colors';
import Labels from '../../utils/Strings';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Styles from '../../styles/otherStyles/FloatingTextInput';
import * as Helpers from '../../utils/Helpers';
import * as HelperStyles from '../../utils/HelperStyles';

const FloatingTextInput = ({
  autoCapitalize = 'none',
  editable = true,
  isCard = false,
  isDecimal = false,
  ispassword = false,
  keyboardType = 'default',
  otherTextInputProps = {},
  showMandatory = true,
  showPasswordIcon = false,
  textContentType = 'none',
  textInputContainerStyle = {},
  textInputLabelStyle = {},
  textInputStyle = {},
  title = Labels.title,
  titleActiveColor = Colors.primaryText,
  titleActiveSize = 12,
  titleInactiveColor = Colors.lightText,
  titleInActiveSize = 16,
  updateMasterState = () => {},
  value = null,
}) => {
  // FloatingTextInput Variables
  const [isFieldActive, setIsFieldActive] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(
    ispassword ? !ispassword : true,
  );

  // Animated Variables
  const position = new Animated.Value(value ? 1 : 0);

  // Other Variables
  const [maxLength, setMaxLength] = useState(null);
  const [editStatus, setEditStatus] = useState(false);
  const [removeValue, setRemoveValue] = useState(false);
  const [inBetweenEditStatus, setInBetweenEditStatus] = useState(false);

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      Helpers.checkField(value) ? loadValue() : setIsFieldActive(false);

      return () => {
        isFocus = false;
      };
    }, [value, inBetweenEditStatus]),
  );

  const loadValue = () => {
    setIsFieldActive(true);

    const customValue =
      !editStatus && isDecimal ? Helpers.handleTextInputDecimal(value) : value;

    onChangeText(customValue);
  };

  const handleBlur = () => {
    if (isFieldActive && !value) {
      setIsFieldActive(false);

      Animated.timing(position, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }

    isDecimal &&
      updateMasterState(
        Helpers.checkField(value)
          ? Helpers.handleTextInputDecimal(value)
          : value,
      );
  };

  const onChangeText = updatedValue => {
    if (
      isDecimal &&
      Helpers.checkField(updatedValue) &&
      updatedValue.includes('.')
    ) {
      !inBetweenEditStatus
        ? updatedValue.split('.')[1].length == 0
          ? setMaxLength(updatedValue.length + 2)
          : updatedValue.split('.')[1].length == 1
          ? setMaxLength(updatedValue.length + 1)
          : setMaxLength(updatedValue.length)
        : setMaxLength(updatedValue.length + 1);

      updateMasterState(updatedValue);
    } else if (isCard && Helpers.checkField(updatedValue)) {
      if (updatedValue.includes('/')) {
        !inBetweenEditStatus
          ? updatedValue.split('/')[1].length == 0
            ? setMaxLength(updatedValue.length + 2)
            : updatedValue.split('/')[1].length == 1
            ? setMaxLength(updatedValue.length + 1)
            : setMaxLength(updatedValue.length)
          : setMaxLength(updatedValue.length + 1);

        updateMasterState(updatedValue);
      } else {
        const joinTxt =
          updatedValue.length == 2 && !removeValue
            ? updatedValue.concat('/')
            : // : updatedValue.length == 3 && !removeValue
              // ? updatedValue + '/'
              updatedValue;

        updateMasterState(joinTxt);
      }
    } else {
      setMaxLength(null);

      updateMasterState(updatedValue);
    }
  };

  const handleFocus = () => {
    if (!isFieldActive) {
      setIsFieldActive(true);

      Animated.timing(position, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelAnimatedTitleStyles = () => {
    return {
      top: position.interpolate({
        inputRange: [0, 0],
        outputRange: [isFieldActive ? 0 : 12, 0],
      }),
      fontSize: isFieldActive ? titleActiveSize : titleInActiveSize,
      color: isFieldActive ? titleActiveColor : titleInactiveColor,
    };
  };

  return (
    <View
      style={[HelperStyles.justView('width', '100%'), textInputContainerStyle]}>
      <Animated.Text
        style={[
          Styles.textInputLabel,
          labelAnimatedTitleStyles(),
          textInputLabelStyle,
        ]}>
        {title}
        {showMandatory && (
          <View style={HelperStyles.justView('bottom', 4)}>
            <Text style={HelperStyles.mandatoryIcon}>{Labels.star}</Text>
          </View>
        )}
      </Animated.Text>
      <View
        style={[
          HelperStyles.flexDirection('row'),
          HelperStyles.justView('justifyContent', 'space-between'),
        ]}>
        <TextInput
          autoCapitalize={autoCapitalize}
          editable={editable}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onBlur={handleBlur}
          onChangeText={txt => {
            setEditStatus(true);

            onChangeText(txt);
          }}
          onEndEditing={() => {
            setEditStatus(false);
          }}
          onKeyPress={event => {
            if (event.nativeEvent.key == Labels.keyName) {
              setRemoveValue(true);
            } else {
              setRemoveValue(false);
            }
          }}
          onFocus={handleFocus}
          onSelectionChange={event => {
            Boolean(value) &&
            event.nativeEvent.selection.start < value.length - 2
              ? setInBetweenEditStatus(true)
              : setInBetweenEditStatus(false);
          }}
          secureTextEntry={!passwordVisibility}
          style={[
            Styles.textInputView,
            HelperStyles.justView('color', Theme.primaryText),
            textInputStyle,
          ]}
          textContentType={textContentType}
          underlineColorAndroid={Colors.transparent}
          value={value}
          {...otherTextInputProps}
        />
        {(showPasswordIcon || (Boolean(value) && ispassword)) && (
          <View
            style={[
              HelperStyles.flex(0.1),
              HelperStyles.justifyContentCenteredView('center'),
            ]}>
            <TouchableOpacity
              onPress={() => {
                setPasswordVisibility(!passwordVisibility);
              }}>
              <MaterialIcons
                name={passwordVisibility ? 'visibility-off' : 'visibility'}
                size={24}
                color={Colors.lightText}
                style={HelperStyles.justView('top', 4)}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default FloatingTextInput;
