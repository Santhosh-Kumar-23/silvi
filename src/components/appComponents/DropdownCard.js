import React, {useCallback, useState} from 'react';
import {
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../assets/Index';
import Button from './Button';
import Card from '../../containers/Card';
import Colors from '../../utils/Colors';
import CustomModal from './CustomModal';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome5';
import Labels from '../../utils/Strings';
import Search from './Search';
import Styles from '../../styles/otherStyles/DropdownCard';
import * as ENV from '../../../env';
import * as Helpers from '../../utils/Helpers';
import * as HelperStyles from '../../utils/HelperStyles';

const DropdownCard = ({
  arrowDownContainerStyle = {},
  arrowDownSize = 20,
  arrowDownTintColor = Colors.primaryText,
  buttonCardContainerStyle = {},
  buttonContainerStyle = {},
  buttonLabel = Labels.cancel,
  containerStyle = {},
  disabled = false,
  floatLabel = null,
  isType = false,
  label = null,
  labelContainerStyle = {},
  labelTextStyle = {},
  optionContainerStyle = {},
  optionIconContainerStyle = {},
  optionLabelContainerStyle = {},
  optionLabelStyle = {},
  optionModalContainerStyle = {},
  optionModalSubContainerStyle = {},
  optionLabelKey = null,
  options = [],
  optionValueKey = null,
  optionTypeKey = null,
  onValueChange = () => {},
  searchEnabled = true,
  subContainerStyle = {},
  value = null,
}) => {
  // DropdownCard Variables
  const [dropdownLabel, setDropdownLabel] = useState(null);
  const [optionsModalStatus, setOptionsModalStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState({});
  const [searchStatus, setSearchStatus] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState(null);

  // Other Variables
  const [hasOptions, setHasOptions] = useState(true);
  const exceptions = [Labels.addAccount, Labels.addNew, Labels.customize];

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      init();

      return () => {
        isFocus = false;
      };
    }, [options, searchEnabled]),
  );

  const init = () => {
    setDropdownLabel(label || Labels.dropDown);

    setSearchStatus(searchEnabled);

    setHasOptions(
      Array.isArray(options) &&
        options.length != 0 &&
        Boolean(optionLabelKey) &&
        Boolean(optionValueKey),
    );
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      options && value ? loadValue() : setSelectedOption({});

      return () => {
        isFocus = false;
      };
    }, [value, options]),
  );

  const loadValue = () => {
    const filteredValue = options.filter(lol => lol[optionValueKey] == value);

    filteredValue.length != 0 && [
      setSelectedOption(filteredValue[0]),

      !exceptions.includes(filteredValue[0][optionValueKey]) &&
        setOptionsModalStatus(false),
    ];
  };

  const renderDropdownCard = () => {
    return (
      <Card
        containerStyle={[
          Styles.container,
          HelperStyles.justView(
            'paddingVertical',
            Boolean(selectedOption[optionLabelKey]) ? 8.5 : 8,
          ),
          containerStyle,
        ]}
        disabled={disabled || !hasOptions}
        onPress={() => {
          setOptionsModalStatus(!optionsModalStatus);
        }}>
        <View style={[Styles.subContainer, subContainerStyle]}>
          <View
            style={[
              Styles.labelContainer,
              HelperStyles.justView(
                'paddingVertical',
                Boolean(selectedOption[optionLabelKey]) ? 0 : 7.5,
              ),
              labelContainerStyle,
            ]}>
            {Boolean(selectedOption[optionLabelKey]) && (
              <Text
                style={[
                  HelperStyles.textView(
                    12,
                    '400',
                    Colors.primaryText,
                    'left',
                    'none',
                  ),
                  labelTextStyle,
                ]}>
                {floatLabel || dropdownLabel}
              </Text>
            )}
            <Text
              style={[
                HelperStyles.textView(
                  16,
                  '400',
                  Boolean(selectedOption[optionLabelKey])
                    ? Theme.primaryText
                    : Colors.lightText,
                  'left',
                  'none',
                ),
                labelTextStyle,
              ]}>
              {Boolean(selectedOption[optionLabelKey])
                ? selectedOption[optionLabelKey]
                : dropdownLabel}
            </Text>
          </View>
          <View
            style={[
              Styles.arrowDownContainer,
              HelperStyles.justView(
                'paddingVertical',
                Boolean(selectedOption[optionLabelKey]) ? 0 : 7.5,
              ),
              arrowDownContainerStyle,
            ]}>
            <Image
              resizeMode={'contain'}
              source={Assets.arrow}
              style={[
                HelperStyles.imageView(arrowDownSize, arrowDownSize),
                HelperStyles.justView('tintColor', arrowDownTintColor),
              ]}
            />
          </View>
        </View>
      </Card>
    );
  };

  const renderOptionsModal = () => {
    return (
      <CustomModal
        clearDefaultChildren={true}
        onRequestClose={() => {
          setOptionsModalStatus(!optionsModalStatus);
        }}
        visible={optionsModalStatus}>
        <View
          style={[
            Styles.optionModalContainer,
            HelperStyles.justView('backgroundColor', Theme.background),
            optionModalContainerStyle,
          ]}>
          <View
            style={[
              Styles.optionModalSubContainer,
              HelperStyles.justView(
                'flexWrap',
                searchStatus ? 'wrap' : 'nowrap',
              ),
              optionModalSubContainerStyle,
            ]}>
            {searchStatus && (
              <Search
                clearValue={searchQuery == null}
                onClear={() => {
                  handleReset();
                }}
                onChangeText={txt => {
                  handleSearch(txt);
                }}
              />
            )}
            <ScrollView
              contentContainerStyle={HelperStyles.flexGrow(1)}
              keyboardShouldPersistTaps={'handled'}
              showsVerticalScrollIndicator={false}>
              {renderOptions()}
            </ScrollView>
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
              handleReset();

              setOptionsModalStatus(!optionsModalStatus);
            }}
          />
        </Card>
      </CustomModal>
    );
  };

  const handleReset = () => {
    setSearchQuery(null);
    setSearchSuggestions(null);
  };

  const handleSearch = query => {
    ENV.currentEnvironment == Labels.development &&
      console.log('DROPDOWN CARD SEARCHED QUERY::: ', query);

    setSearchQuery(query);

    const filteredOption = options.filter(
      lol =>
        Boolean(lol[optionLabelKey]) &&
        Boolean(query) &&
        lol[optionLabelKey].toLowerCase().includes(query.toLowerCase()),
    );

    ENV.currentEnvironment == Labels.development &&
      console.log('DROPDOWN CARD FILTERED OPTION::: ', filteredOption);

    setSearchSuggestions(Boolean(query) ? filteredOption : null);
  };

  const renderOptions = () => {
    const loadOptions = searchQuery ? searchSuggestions || [] : options;

    return Array.isArray(loadOptions) && loadOptions.length != 0 ? (
      loadOptions.map((lol, index) => {
        const optionLabel = lol[optionLabelKey] || null;
        const optionType = handleOptionType(lol[optionTypeKey] || null);
        const isOptionSelected =
          selectedOption[optionValueKey] == lol[optionValueKey];

        return (
          <TouchableWithoutFeedback
            key={index}
            onPress={() => {
              handleOptionSelection(lol);
            }}>
            <View
              style={[
                Styles.optionContainer,
                HelperStyles.justView('marginTop', index != 0 ? 8 : 0),
                optionContainerStyle,
              ]}>
              <View
                style={[
                  Styles.optionLabelContainer,
                  isType && Styles.optionTypeContainer,
                  optionLabelContainerStyle,
                ]}>
                <Text
                  style={[
                    HelperStyles.textView(
                      14,
                      '600',
                      Boolean(optionLabel) &&
                        Helpers.customOptions.includes(optionLabel)
                        ? Colors.primary
                        : Theme.text,
                      'left',
                      'none',
                    ),
                    optionLabelStyle,
                  ]}>
                  {optionLabel}
                </Text>
                {Boolean(isType) && Boolean(optionType) && (
                  <View>
                    <Text
                      style={[
                        HelperStyles.textView(
                          14,
                          '600',
                          Boolean(optionLabel) &&
                            Helpers.customOptions.includes(optionLabel)
                            ? Colors.primary
                            : Theme.text,
                          'left',
                          'none',
                        ),
                        optionLabelStyle,
                      ]}>
                      {` - ${optionType}`}
                    </Text>
                  </View>
                )}
              </View>
              {Boolean(isOptionSelected) && (
                <View
                  style={[
                    Styles.optionIconContainer,
                    optionIconContainerStyle,
                  ]}>
                  <FontAwesomeIcons
                    name={'check'}
                    size={16}
                    color={Colors.primary}
                  />
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        );
      })
    ) : (
      <View style={HelperStyles.margin(0, 16)}>
        <Text
          style={HelperStyles.textView(
            14,
            '600',
            Theme.text,
            'center',
            'none',
          )}>
          {Labels.noSuggestions}
        </Text>
      </View>
    );
  };

  const handleOptionSelection = optionData => {
    const selectedValue =
      selectedOption[optionValueKey] == optionData[optionValueKey]
        ? {}
        : optionData;

    Keyboard.dismiss();

    ENV.currentEnvironment == Labels.development &&
      console.log('DROPDOWN CARD SELECTED VALUE::: ', selectedValue);

    searchQuery && [Keyboard.dismiss(), setSearchQuery(null)];

    searchSuggestions && setSearchSuggestions(null);

    setSelectedOption(selectedValue);

    onValueChange(selectedValue);

    !exceptions.includes(selectedValue[optionValueKey]) &&
      selectedOption[optionValueKey] != selectedValue[optionValueKey] &&
      setOptionsModalStatus(!optionsModalStatus);
  };

  const handleOptionType = optionType => {
    switch (optionType) {
      case Labels.creditCard.replace(/\s/g, '').toLowerCase():
        return Labels.creditCard;

      case Labels.savings.toLowerCase():
        return Labels.savings;

      default:
        return optionType;
    }
  };

  return (
    <>
      {renderDropdownCard()}

      {renderOptionsModal()}
    </>
  );
};

export default DropdownCard;
