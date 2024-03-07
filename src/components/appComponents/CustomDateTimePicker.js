import React, {useCallback, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Button from './Button';
import Card from '../../containers/Card';
import Colors from '../../utils/Colors';
import CustomModal from './CustomModal';
import DateTimePicker from 'react-native-date-picker';
import Labels from '../../utils/Strings';
import Moment from 'moment';
import Styles from '../../styles/otherStyles/CustomDateTimePicker';
import * as ENV from '../../../env';
import * as Helpers from '../../utils/Helpers';
import * as HelperStyles from '../../utils/HelperStyles';

const CustomDateTimePicker = ({
  buttonLabel = Labels.save,
  buttonCardContainerStyle = {},
  buttonContainerStyle = {},
  cardConatinerStyle = {},
  customModalContainerStyle = {},
  dateLabel = Labels.date,
  dateLabelI = Labels.startDate,
  dateLabelII = Labels.endDate,
  dateTimeConatinerIStyle = {},
  dateTimeConatinerIIStyle = {},
  dateTimeFormat = Labels.formatD4M4Y,
  dateTimeLabelContainerStyle = {},
  dateTimeLabelStyle = {},
  dateTimePickerContainerStyle = {},
  dateTimeValueContainerStyle = {},
  dateTimeValueStyle = {},
  disabled = false,
  errorCardContainerStyle = {},
  errorTextStyle = {},
  isDark = false,
  isSingle = true,
  label = Labels.date,
  labelStyle = {},
  maximumDate = null,
  minimumDate = null,
  mode = 'date',
  onDateChange = () => {},
  value = null,
  valueStyle = {},
}) => {
  // CustomDateTimePicker Variables
  const [dateTimePickerModalStatus, setDateTimePickerModalStatus] =
    useState(false);
  const [dateTimePickerFor, setDateTimePickerFor] = useState(null);
  const [date, setDate] = useState(Moment());
  const [dateI, setDateI] = useState(Moment());
  const [dateII, setDateII] = useState(Moment().add('1', 'day'));

  // Error Variables
  const [dateTimeInvalidError, setDateTimeInvalidError] = useState(false);

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      setDateTimePickerFor(!isSingle ? dateLabelI : dateLabel);

      return () => {
        isFocus = false;
      };
    }, [dateTimePickerModalStatus]),
  );

  const renderDateTimePickerModal = () => {
    return (
      <CustomModal
        clearDefaultChildren={true}
        onRequestClose={() => {
          setDateTimePickerModalStatus(!dateTimePickerModalStatus);
        }}
        visible={dateTimePickerModalStatus}>
        <View
          style={[
            Styles.customModalContainer,
            HelperStyles.justView('backgroundColor', Theme.background),
            customModalContainerStyle,
          ]}>
          {!isSingle ? renderDouble() : renderSingle()}
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
              handleSave();
            }}
          />
        </Card>
      </CustomModal>
    );
  };

  const renderSingle = () => {
    return renderDateTimePicker();
  };

  const renderDouble = () => {
    return (
      <>
        <View style={[Styles.dateTimeContainerI, dateTimeConatinerIStyle]}>
          <View
            style={[
              Styles.dateTimeLabelContainer,
              dateTimeLabelContainerStyle,
            ]}>
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '400',
                  Theme.primaryText,
                  'left',
                  'none',
                ),
                dateTimeLabelStyle,
              ]}>
              {dateLabelI}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setDateTimePickerFor(dateLabelI);
            }}
            style={[
              Styles.dateTimeValueContainer,
              dateTimeValueContainerStyle,
            ]}>
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '400',
                  Theme.primaryText,
                  'right',
                  'none',
                ),
                dateTimeValueStyle,
              ]}>
              {Moment(dateI).format(dateTimeFormat)}
            </Text>
          </TouchableOpacity>
        </View>
        {dateTimePickerFor == dateLabelI && renderDateTimePicker()}
        <View style={[Styles.dateTimeConatinerII, dateTimeConatinerIIStyle]}>
          <View
            style={[
              Styles.dateTimeLabelContainer,
              dateTimeLabelContainerStyle,
            ]}>
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '400',
                  Theme.primaryText,
                  'left',
                  'none',
                ),
                dateTimeLabelStyle,
              ]}>
              {dateLabelII}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setDateTimePickerFor(dateLabelII);
            }}
            style={[
              Styles.dateTimeValueContainer,
              dateTimeValueContainerStyle,
            ]}>
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '400',
                  Theme.primaryText,
                  'right',
                  'none',
                ),
                dateTimeValueStyle,
              ]}>
              {Moment(dateII).format(dateTimeFormat)}
            </Text>
          </TouchableOpacity>
        </View>
        {dateTimePickerFor == dateLabelII && renderDateTimePicker()}
        {dateTimeInvalidError && (
          <Card
            containerStyle={[
              Styles.errorCardContainer,
              errorCardContainerStyle,
            ]}>
            <Text style={[HelperStyles.errorText, errorTextStyle]}>
              {Labels.dateTimeInvalidError}
            </Text>
          </Card>
        )}
      </>
    );
  };

  const handleSave = () => {
    if (!isSingle) {
      const checkStatus = Helpers.compareDateTimes(
        dateI,
        dateII,
        dateTimeFormat,
      );
      if (!checkStatus) {
        setDateTimePickerFor(null);

        onDateChange(dateI, dateII);

        setDateTimePickerModalStatus(!dateTimePickerModalStatus);
      } else {
        setDateTimeInvalidError(checkStatus);
      }
    } else {
      setDateTimePickerFor(null);

      onDateChange(date);

      setDateTimePickerModalStatus(!dateTimePickerModalStatus);
    }
  };

  const renderDateTimePicker = () => {
    let stateValue;

    switch (dateTimePickerFor) {
      case dateLabel:
        stateValue = date;
        break;

      case dateLabelI:
        stateValue = dateI;
        break;

      case dateLabelII:
        stateValue = dateII;
        break;

      default:
        break;
    }

    return (
      <View
        style={[
          Styles.dateTimePickerContainer,
          HelperStyles.padding(!isSingle ? 8 : 16, !isSingle ? 8 : 16),
          HelperStyles.justView('borderTopWidth', !isSingle ? 0.5 : 0),
          dateTimePickerContainerStyle,
        ]}>
        <DateTimePicker
          androidVariant={'iosClone'}
          date={
            dateTimePickerFor
              ? new Date(new Date(Moment(stateValue).format()).getTime())
              : new Date()
          }
          fadeToColor={isDark ? Colors.black : Colors.white}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          mode={mode}
          onDateChange={selectedValue => {
            handleDateTimePicker(selectedValue);
          }}
          textColor={Theme.text}
        />
      </View>
    );
  };

  const handleDateTimePicker = selectedValue => {
    ENV.currentEnvironment == Labels.development &&
      console.log('SELECTED DATE TIME PICKER::: ', selectedValue);

    dateTimeInvalidError && setDateTimeInvalidError(false);

    switch (dateTimePickerFor) {
      case dateLabel:
        setDate(selectedValue);
        break;

      case dateLabelI:
        setDateI(selectedValue);
        break;

      case dateLabelII:
        setDateII(selectedValue);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Card
        containerStyle={[
          Styles.cardConatiner,
          HelperStyles.justView('paddingVertical', Boolean(value) ? 7 : 16),
          cardConatinerStyle,
        ]}
        disabled={disabled}
        onPress={() => {
          setDate(Moment());

          setDateTimePickerModalStatus(!dateTimePickerModalStatus);
        }}>
        {Boolean(value) && (
          <Text
            style={[
              HelperStyles.textView(
                12,
                '400',
                Theme.primaryText,
                'left',
                'none',
              ),
              labelStyle,
            ]}>
            {label}
          </Text>
        )}
        <View
          style={[HelperStyles.flex(1), HelperStyles.justView('marginTop', 2)]}>
          <Text
            style={[
              HelperStyles.textView(
                16,
                '400',
                Boolean(value) ? Theme.primaryText : Colors.lightText,
                'left',
                'none',
              ),
              valueStyle,
            ]}>
            {value ? Moment(value).format(dateTimeFormat) : label}
          </Text>
        </View>
      </Card>

      {renderDateTimePickerModal()}
    </>
  );
};

export default CustomDateTimePicker;
