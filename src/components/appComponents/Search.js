import React, {useCallback, useState} from 'react';
import {Image, TextInput, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Assets from '../../assets/Index';
import Card from '../../containers/Card';
import Colors from '../../utils/Colors';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome5';
import Labels from '../../utils/Strings';
import Styles from '../../styles/otherStyles/Search';
import * as HelperStyles from '../../utils/HelperStyles';

const Search = ({
  alterSearchIcon = false,
  cardContainerStyle = {},
  clearValue = false,
  closeIconColor = Colors.primaryText,
  closeIconContainerStyle = {},
  closeIconSize = 16,
  onChangeText = () => {},
  onClear = () => {},
  placeholderLabel = Labels.search,
  placeholderTextColor = Colors.primaryText,
  searchIconColor = Colors.primaryText,
  searchIconContainerStyle = {},
  searchIconSize = 24,
  textInputStyle = {},
}) => {
  // Search Variables
  const [searchQuery, setSearchQuery] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      clearValue && setSearchQuery(null);

      return () => {
        isFocus = false;
      };
    }, [clearValue]),
  );

  const renderSearchIcon = () => {
    return (
      <View style={[Styles.searchIconContainer, searchIconContainerStyle]}>
        <Image
          resizeMode={'contain'}
          source={Assets.search}
          style={[
            HelperStyles.imageView(searchIconSize, searchIconSize),
            HelperStyles.justView('tintColor', searchIconColor),
          ]}
        />
      </View>
    );
  };

  const renderCloseIcon = () => {
    return (
      Boolean(searchQuery) && (
        <TouchableOpacity
          onPress={() => {
            setSearchQuery(null);

            onClear();
          }}
          style={[Styles.closeIconContainer, closeIconContainerStyle]}>
          <FontAwesomeIcons
            name={'times'}
            size={closeIconSize}
            color={closeIconColor}
          />
        </TouchableOpacity>
      )
    );
  };

  const handleSearch = txt => {
    setSearchQuery(txt);

    onChangeText(txt);
  };

  return (
    <Card containerStyle={[Styles.cardContainer, cardContainerStyle]}>
      {!Boolean(alterSearchIcon) && renderSearchIcon()}
      <TextInput
        autoCapitalize={'none'}
        keyboardType={'default'}
        onChangeText={txt => {
          handleSearch(txt);
        }}
        placeholder={placeholderLabel}
        placeholderTextColor={placeholderTextColor}
        style={[
          HelperStyles.flex(1),
          HelperStyles.textView(14, '600', Colors.primaryText, 'left', 'none'),
          HelperStyles.justView(
            'paddingLeft',
            Boolean(alterSearchIcon) ? 12 : 0,
          ),
          textInputStyle,
        ]}
        textContentType={'none'}
        underlineColorAndroid={Colors.transparent}
        value={searchQuery}
      />
      {renderCloseIcon()}
      {Boolean(alterSearchIcon) && renderSearchIcon()}
    </Card>
  );
};

export default Search;
