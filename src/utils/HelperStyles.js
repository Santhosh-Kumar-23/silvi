import {StyleSheet} from 'react-native';
import Colors from './Colors';

// Error Text Styles
export const errorText = {
  color: Colors.red,
  fontFamily: 'Proxima Nova',
  fontSize: 12,
  fontWeight: '400',
  marginHorizontal: 4,
  marginVertical: 4,
};

// Flex Styles
export const flex = flexValue => {
  return {
    flex: flexValue,
  };
};

export const flexGrow = flexValue => {
  return {
    flexGrow: flexValue,
  };
};

export const flexDirection = flexDirectionValue => {
  return {
    flexDirection: flexDirectionValue,
  };
};

// Image Styles
export const imageView = (heightValue, widthValue) => {
  return {
    height: heightValue,
    width: widthValue,
  };
};

// Mandatory Icon Styles
export const mandatoryIcon = {
  color: Colors.red,
  fontFamily: 'Proxima Nova',
  fontSize: 14,
  fontWeight: '400',
  bottom: 4,
};

// Other Styles
export const justifyContentCenteredView = justifyContentValue => {
  return {
    justifyContent: justifyContentValue,
    alignItems: 'center',
  };
};

export const justView = (styleLabel, styleValue) => {
  return {
    [styleLabel]: styleValue,
  };
};

export const margin = (marginHorizontalValue, marginVerticalValue) => {
  return {
    marginHorizontal: marginHorizontalValue,
    marginVertical: marginVerticalValue,
  };
};

export const padding = (paddingHorizontalValue, paddingVerticalValue) => {
  return {
    paddingHorizontal: paddingHorizontalValue,
    paddingVertical: paddingVerticalValue,
  };
};

// Screen Styles
export const screenContainer = backgroundColorValue => {
  return {
    flex: 1,
    backgroundColor: backgroundColorValue,
  };
};

export const screenSubContainer = {
  marginHorizontal: 16,
  marginVertical: 16,
};

// Text Styles
export const textView = (
  sizeValue,
  weightValue,
  colorValue,
  alignValue,
  textTransformValue,
) => {
  return {
    color: colorValue,
    fontFamily: 'Proxima Nova',
    fontSize: sizeValue,
    fontWeight: weightValue,
    textAlign: alignValue,
    textTransform: textTransformValue,
  };
};

export const textStrikeThrough = {
  textDecorationLine: 'line-through',
  textDecorationStyle: 'solid',
};

//Sperator lines
export const speratorLine = {
  marginVertical: 8,
  borderBottomColor: Colors.primaryText,
  borderBottomWidth: StyleSheet.hairlineWidth,
};
