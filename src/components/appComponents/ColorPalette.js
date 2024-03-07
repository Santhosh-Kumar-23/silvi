import React, {useCallback, useState} from 'react';
import {Image, Text, TouchableWithoutFeedback, View} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../assets/Index';
import Button from './Button';
import Card from '../../containers/Card';
import Colors from '../../utils/Colors';
import CustomModal from './CustomModal';
import Labels from '../../utils/Strings';
import LinearGradient from 'react-native-linear-gradient';
import Styles from '../../styles/otherStyles/ColorPalette';
import * as ENV from '../../../env';
import * as HelperStyles from '../../utils/HelperStyles';

const ColorPalette = ({
  buttonCardContainerStyle = {},
  buttonContainerStyle = {},
  buttonLabel = Labels.confirm,
  colorPaletteSize = 44,
  colorPaletteContainerStyle = {},
  colorPaletteSubContainerStyle = {},
  column = 5,
  containerStyle = {},
  customModalContainerStyle = {},
  customModalLabelTextStyle = {},
  customModalSubContainerStyle = {},
  disabled = false,
  gradientContainerStyle = {},
  gradientStyle = {},
  iconContainerStyle = {},
  iconSize = 36,
  itemContainerStyle = {},
  label = null,
  labelTextStyle = {},
  onValueChange = () => {},
  rows = 5,
  textContainerStyle = {},
  tickImageStyle = {},
  value = null,
}) => {
  // ColorPalette Variables
  const [colorPaletteLabel, setColorPaletteLabel] = useState(null);
  const [colorPaletteModalStatus, setColorPaletteModalStatus] = useState(false);
  const [colorPalette, setColorPalette] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  // Other Variables
  const colorPaletteColors = [
    {color: Colors.gradientViolet, end: {x: 0, y: -1}, start: {x: 1, y: -1}},
    {color: Colors.gradientLightBlue, end: {x: 0, y: -1}, start: {x: 1, y: -1}},
    {color: Colors.gradientDarkBlue, end: {x: 1, y: 0}, start: {x: 0, y: 1}},
    {color: Colors.gradientGrassGreen, end: {x: 1, y: 0}, start: {x: 0, y: 1}},
    {color: Colors.gradientGreen, end: {x: 1, y: 0}, start: {x: 0, y: 0}},
    {color: Colors.gradientMagenta, end: {x: 1, y: 0}, start: {x: 0, y: 1}},
    {color: Colors.gradientPurple, end: {x: 1, y: 0}, start: {x: 0, y: 1}},
    {color: Colors.gradientDarkPurple, end: {x: 1, y: 0}, start: {x: 0, y: 1}},
    {color: Colors.gradientWarmGrey, end: {x: 1, y: 0}, start: {x: 0, y: 1}},
    {color: Colors.gradientGrey, end: {x: 1, y: 0}, start: {x: 0, y: 1}},
    {color: Colors.gradientYellow, end: {x: 1, y: 0}, start: {x: 0, y: 1}},
    {color: Colors.gradientOrange, end: {x: 1, y: 0}, start: {x: 0, y: 1}},
    {color: Colors.gradientDarkMagenta, end: {x: 1, y: 0}, start: {x: 0, y: 1}},
    {color: Colors.gradientDarkBrown, end: {x: 1, y: 0}, start: {x: 0, y: 1}},
  ];

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      init();

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const init = () => {
    setColorPaletteLabel(label || Labels.color);
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      handleColorPalette();

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const handleColorPalette = () => {
    const colorPaletteLength = colorPaletteColors.length;

    if (colorPaletteLength != 0) {
      let helperArray = [];
      iMax = rows;
      jMax = column;
      count = 0;

      for (let i = 0; i < colorPaletteLength / iMax; i++) {
        helperArray[i] = [];

        for (let j = 0; j < jMax; j++) {
          helperArray[i][j] = colorPaletteColors[count] || null;

          count++;
        }
      }

      setColorPalette(helperArray);
    } else {
      setColorPalette([]);
    }
  };

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
    const filteredValue = colorPaletteColors.filter(
      lol => String(lol.color) == value.color,
    );

    filteredValue.length != 0 && setSelectedColor(filteredValue[0]);
  };

  const renderColorPalette = () => {
    return (
      <TouchableWithoutFeedback
        disabled={disabled}
        onPress={() => {
          setColorPaletteModalStatus(!colorPaletteModalStatus);
        }}>
        <View style={[Styles.container, containerStyle]}>
          <LinearGradient
            colors={
              Boolean(selectedColor)
                ? selectedColor.color
                : [Colors.background, Colors.background]
            }
            end={{x: 1, y: 1}}
            start={{x: 0, y: 0}}
            style={[
              HelperStyles.imageView(iconSize, iconSize),
              Styles.iconContainer,
              !Boolean(selectedColor) && [
                HelperStyles.justView('borderStyle', 'dashed'),
                HelperStyles.justView('borderWidth', 1),
              ],
              HelperStyles.justView('borderRadius', iconSize / 2),
              iconContainerStyle,
            ]}
          />
          <View style={[Styles.textContainer, textContainerStyle]}>
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '400',
                  Colors.secondaryText,
                  'left',
                  'none',
                ),
                labelTextStyle,
              ]}>
              {colorPaletteLabel}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderColorPaletteModal = () => {
    return (
      <CustomModal
        clearDefaultChildren={true}
        onRequestClose={() => {
          setColorPaletteModalStatus(!colorPaletteModalStatus);
        }}
        visible={colorPaletteModalStatus}>
        <View
          style={[
            Styles.customModalContainer,
            HelperStyles.justView('backgroundColor', Theme.background),
            customModalContainerStyle,
          ]}>
          <View
            style={[
              Styles.customModalSubContainer,
              customModalSubContainerStyle,
            ]}>
            <View
              style={[HelperStyles.margin(0, 8), colorPaletteContainerStyle]}>
              <Text
                style={[
                  HelperStyles.textView(
                    14,
                    '700',
                    Theme.primaryText,
                    'center',
                    'none',
                  ),
                  customModalLabelTextStyle,
                ]}>
                {Labels.selectCustomColor}
              </Text>
            </View>
            <View
              style={[HelperStyles.margin(0, 4), colorPaletteContainerStyle]}>
              {colorPalette &&
                colorPalette.map((rowData, rowIndex) => (
                  <View
                    key={rowIndex}
                    style={[
                      Styles.colorPaletteSubContainer,
                      colorPaletteSubContainerStyle,
                    ]}>
                    {rowData.map((colorPaletteData, colorPaletteIndex) => (
                      <View
                        key={colorPaletteIndex}
                        style={[HelperStyles.flex(0.2), itemContainerStyle]}>
                        <TouchableWithoutFeedback
                          disabled={!Boolean(colorPaletteData)}
                          onPress={() => {
                            handleColorSelection(colorPaletteData);
                          }}>
                          <View
                            style={[
                              Styles.gradientContainer,
                              gradientContainerStyle,
                            ]}>
                            <LinearGradient
                              colors={
                                Boolean(colorPaletteData)
                                  ? colorPaletteData.color
                                  : [Theme.background, Theme.background]
                              }
                              end={
                                Boolean(colorPaletteData)
                                  ? colorPaletteData.end
                                  : {x: 0, y: 0}
                              }
                              start={
                                Boolean(colorPaletteData)
                                  ? colorPaletteData.start
                                  : {x: 0, y: 0}
                              }
                              style={[
                                HelperStyles.imageView(
                                  colorPaletteSize,
                                  colorPaletteSize,
                                ),
                                HelperStyles.justifyContentCenteredView(
                                  'center',
                                ),
                                HelperStyles.justView('borderRadius', 8),
                                gradientStyle,
                              ]}>
                              {Boolean(colorPaletteData) &&
                                Boolean(selectedColor) &&
                                String(selectedColor.color) ==
                                  colorPaletteData.color && (
                                  <Image
                                    resizeMode={'contain'}
                                    source={Assets.tick}
                                    style={[
                                      HelperStyles.imageView(
                                        colorPaletteSize / 2,
                                        colorPaletteSize / 2,
                                      ),
                                      tickImageStyle,
                                    ]}
                                  />
                                )}
                            </LinearGradient>
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    ))}
                  </View>
                ))}
            </View>
          </View>
        </View>
        <Card
          containerStyle={[
            Styles.buttonCardContainer,
            buttonCardContainerStyle,
          ]}>
          <Button
            containerStyle={[Styles.buttonContainer, buttonContainerStyle]}
            label={buttonLabel}
            loading={false}
            onPress={() => {
              setColorPaletteModalStatus(!colorPaletteModalStatus);

              onValueChange(selectedColor);
            }}
          />
        </Card>
      </CustomModal>
    );
  };

  const handleColorSelection = colorData => {
    const selectedValue = selectedColor != colorData ? colorData : null;

    ENV.currentEnvironment == Labels.development &&
      console.log('COLOR PALETTE SELECTED VALUE::: ', selectedValue);

    setSelectedColor(selectedValue);
  };

  return (
    <>
      {renderColorPalette()}

      {renderColorPaletteModal()}
    </>
  );
};

export default ColorPalette;
