import React from 'react';
import {Text} from 'react-native';
import Card from '../../containers/Card';
import Colors from '../../utils/Colors';
import FloatingTextInput from './FloatingTextInput';
import Labels from '../../utils/Strings';
import * as HelperStyles from '../../utils/HelperStyles';

const CustomFloatingTextInput = ({
  autoCapitalize = 'none',
  cardContainerStyle = {},
  editable = true,
  errorLabel = Labels.fieldError,
  errorStatus = false,
  errorTextStyle = {},
  isDecimal = false,
  keyboardType = 'default',
  onChangeText = () => {},
  textContentType = 'none',
  textInputContainerStyle = {},
  textInputLabelStyle = {},
  textInputStyle = {},
  title = Labels.title,
  titleActiveColor = Colors.primaryText,
  titleActiveSize = 12,
  titleInactiveColor = Colors.lightText,
  titleInActiveSize = 16,
  value = null,
}) => {
  // CustomFloatingTextInput Variables

  return (
    <>
      <Card containerStyle={[HelperStyles.margin(0, 8), cardContainerStyle]}>
        <FloatingTextInput
          autoCapitalize={autoCapitalize}
          editable={editable}
          isDecimal={isDecimal}
          keyboardType={keyboardType}
          textContentType={textContentType}
          textInputContainerStyle={textInputContainerStyle}
          textInputLabelStyle={textInputLabelStyle}
          textInputStyle={textInputStyle}
          title={title}
          titleActiveColor={titleActiveColor}
          titleActiveSize={titleActiveSize}
          titleInactiveColor={titleInactiveColor}
          titleInActiveSize={titleInActiveSize}
          updateMasterState={txt => {
            onChangeText(txt);
          }}
          value={value}
        />
      </Card>
      {errorStatus && (
        <Text style={[HelperStyles.errorText, errorTextStyle]}>
          {errorLabel}
        </Text>
      )}
    </>
  );
};

export default CustomFloatingTextInput;
