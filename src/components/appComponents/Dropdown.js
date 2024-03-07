import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Colors from '../../utils/Colors';
import CustomModal from './CustomModal';
import Labels from '../../utils/Strings';
import Search from './Search';
import Styles from '../../styles/otherStyles/Dropdown';
import * as ENV from '../../../env';
import * as Helpers from '../../utils/Helpers';
import * as HelperStyles from '../../utils/HelperStyles';

const Dropdown = ({
  activityIndicatorSize = 12,
  activityIndicatorColor = Colors.primary,
  containerStyle = {},
  disabled = false,
  imageContainerStyle = {},
  imageSize = 36,
  imageStyle = {},
  imageTintColor = Colors.primaryText,
  label = null,
  labelTextStyle = {},
  modalContainerStyle = {},
  modalHeaderLabel = Labels.title,
  modalHeaderLabelStyle = {},
  modalSubContainerStyle = {},
  optionContainerStyle = {},
  optionIconContainerStyle = {},
  optionIconSize = 44,
  optionIconStyle = {},
  optionRowContainerStyle = {},
  optionsColumns = 3,
  optionsRows = 3,
  textContainerStyle = {},
  onValueChange = () => {},
  optionImageKey = null,
  optionLabelKey = null,
  options = [],
  optionValueKey = null,
  searchEnabled = false,
  value = null,
}) => {
  // Dropdown Variables
  const [dropdownLabel, setDropdownLabel] = useState(null);
  const [optionsModalStatus, setOptionsModalStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState({});
  const [searchStatus, setSearchStatus] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState(null);

  // Other Variables
  const [hasOptions, setHasOptions] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
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
    setDropdownLabel(label || Labels.category);

    setSearchStatus(searchEnabled);

    setHasOptions(
      Array.isArray(options) &&
        options.length != 0 &&
        Boolean(optionImageKey) &&
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

  const renderDropdown = () => {
    return (
      <TouchableWithoutFeedback
        disabled={disabled || !hasOptions}
        onPress={() => {
          setOptionsModalStatus(!optionsModalStatus);
        }}>
        <View style={[Styles.container, containerStyle]}>
          <View
            style={[
              HelperStyles.imageView(imageSize, imageSize),
              Styles.imageContainer,
              (!Boolean(selectedOption[optionImageKey]) || imageLoader) && [
                HelperStyles.justView('borderStyle', 'dashed'),
                HelperStyles.justView('borderWidth', 1),
              ],
              HelperStyles.justView('borderRadius', imageSize / 2),
              imageContainerStyle,
            ]}>
            <Image
              onLoadStart={() => {
                setImageLoader(Boolean(selectedOption[optionImageKey]));
              }}
              onLoadEnd={() => {
                setImageLoader(false);
              }}
              resizeMode={'cover'}
              source={
                Boolean(selectedOption[optionImageKey])
                  ? Helpers.validateUrl(selectedOption[optionImageKey])
                    ? {uri: selectedOption[optionImageKey]}
                    : selectedOption[optionImageKey]
                  : null
              }
              style={[
                HelperStyles.imageView(imageSize - 20, imageSize - 20),
                HelperStyles.justView('tintColor', imageTintColor),
                imageStyle,
              ]}
            />
            {imageLoader && (
              <ActivityIndicator
                size={activityIndicatorSize}
                color={activityIndicatorColor}
                style={Styles.indicator}
              />
            )}
          </View>
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
              {Boolean(selectedOption[optionLabelKey])
                ? selectedOption[optionLabelKey]
                : dropdownLabel}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderOptionsModal = () => {
    return (
      <CustomModal
        clearDefaultChildren={true}
        modalContainerStyle={HelperStyles.justView('justifyContent', 'center')}
        onRequestClose={() => {
          setOptionsModalStatus(!optionsModalStatus);
        }}
        visible={optionsModalStatus}>
        <View
          style={[
            Styles.modalContainer,
            HelperStyles.justView('backgroundColor', Theme.background),
            modalContainerStyle,
          ]}>
          <View
            style={[
              Styles.modalSubContainer,
              HelperStyles.justView('flexWrap', 'nowrap'),
              modalSubContainerStyle,
            ]}>
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '700',
                  Theme.primaryText,
                  'center',
                  'capitalize',
                ),
                HelperStyles.margin(0, 8),
                modalHeaderLabelStyle,
              ]}>
              {modalHeaderLabel}
            </Text>
            {searchStatus && (
              <Search
                clearValue={searchQuery == null}
                onChangeText={txt => {
                  handleSearch(txt);
                }}
                onClear={() => {
                  handleSearchClear();
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
      </CustomModal>
    );
  };

  const handleSearch = query => {
    ENV.currentEnvironment == Labels.development &&
      console.log('DROPDOWN SEARCHED QUERY::: ', query);

    setSearchQuery(query);

    const filteredOption = options.filter(
      lol =>
        Boolean(lol[optionLabelKey]) &&
        Boolean(query) &&
        lol[optionLabelKey].toLowerCase().includes(query.toLowerCase()),
    );

    ENV.currentEnvironment == Labels.development &&
      console.log('DROPDOWN FILTERED OPTION::: ', filteredOption);

    setSearchSuggestions(Boolean(query) ? filteredOption : null);
  };

  const handleSearchClear = () => {
    setSearchQuery(null);

    setSearchSuggestions(null);
  };

  const renderOptions = () => {
    const customLoadOptions = searchQuery
      ? arrayResetter(searchSuggestions) || []
      : Boolean(options)
      ? arrayResetter(options)
      : [];

    return Array.isArray(customLoadOptions) && customLoadOptions.length != 0 ? (
      customLoadOptions.map((rowData, rowIndex) => (
        <View
          key={rowIndex}
          style={[Styles.optionRowContainer, optionRowContainerStyle]}>
          {rowData.map((lol, index) => {
            const isOptionSelected = Boolean(lol)
              ? selectedOption[optionValueKey] == lol[optionValueKey]
              : false;

            return (
              <TouchableWithoutFeedback
                disabled={!Boolean(lol)}
                key={index}
                onPress={() => {
                  handleOptionSelection(lol);
                }}>
                <View
                  style={[
                    HelperStyles.flex(1 / optionsColumns),
                    HelperStyles.justifyContentCenteredView('center'),
                    optionContainerStyle,
                  ]}>
                  <View
                    style={[
                      HelperStyles.imageView(optionIconSize, optionIconSize),
                      HelperStyles.justifyContentCenteredView('center'),
                      HelperStyles.justView(
                        'backgroundColor',
                        Boolean(lol)
                          ? Boolean(isOptionSelected)
                            ? Colors.primary
                            : Colors.background
                          : Theme.background,
                      ),
                      HelperStyles.justView('borderRadius', optionIconSize / 2),
                      optionIconContainerStyle,
                    ]}>
                    <Image
                      resizeMode={'contain'}
                      source={
                        Boolean(lol)
                          ? Helpers.validateUrl(lol[optionImageKey])
                            ? {uri: lol[optionImageKey]}
                            : lol[optionImageKey]
                          : null
                      }
                      style={[
                        HelperStyles.imageView(
                          optionIconSize / 1.5,
                          optionIconSize / 1.5,
                        ),
                        HelperStyles.justView(
                          'tintColor',
                          Boolean(isOptionSelected)
                            ? Colors.white
                            : Colors.primaryText,
                        ),
                        optionIconStyle,
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      HelperStyles.textView(
                        12,
                        '400',
                        Boolean(isOptionSelected)
                          ? Colors.primary
                          : Colors.secondaryText,
                        'center',
                        'none',
                      ),
                      HelperStyles.justView('marginTop', 4),
                    ]}>
                    {Boolean(lol) ? lol[optionLabelKey] : null}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      ))
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

  const arrayResetter = optionArray => {
    const optionArrayLength = optionArray.length;

    if (optionArrayLength != 0) {
      let helperArray = [],
        iMax = optionsRows,
        jMax = optionsColumns,
        count = 0;

      for (let i = 0; i < optionArrayLength / iMax; i++) {
        helperArray[i] = [];

        for (let j = 0; j < jMax; j++) {
          helperArray[i][j] = optionArray[count] || null;

          count++;
        }
      }

      return helperArray;
    } else {
      return [];
    }
  };

  const handleOptionSelection = optionData => {
    const selectedValue =
      selectedOption[optionValueKey] == optionData[optionValueKey]
        ? {}
        : optionData;

    ENV.currentEnvironment == Labels.development &&
      console.log('DROPDOWN SELECTED VALUE::: ', selectedValue);

    searchQuery && [Keyboard.dismiss(), setSearchQuery(null)];

    searchSuggestions && setSearchSuggestions(null);

    setSelectedOption(selectedValue);

    onValueChange(selectedValue);

    !exceptions.includes(selectedValue[optionValueKey]) &&
      selectedOption[optionValueKey] != selectedValue[optionValueKey] &&
      setOptionsModalStatus(!optionsModalStatus);
  };

  return (
    <>
      {renderDropdown()}

      {renderOptionsModal()}
    </>
  );
};

export default Dropdown;
