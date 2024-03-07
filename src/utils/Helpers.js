import {Dimensions, Linking, useColorScheme} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Crashlytics from '@react-native-firebase/crashlytics';
import Labels from './Strings';
import Moment from 'moment';
import * as ENV from '../../env';

// Common Functions
export const handleLinking = url => {
  Linking.canOpenURL(url)
    .then(supported => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        showMessage({
          icon: 'auto',
          message: Labels.invalidAction,
          description: Labels.unableAction,
          type: 'warning',
        });
      }
    })
    .catch(error => {
      ENV.currentEnvironment != Labels.production &&
        Crashlytics().setAttributes({
          error: JSON.stringify(error),
          label: Labels.linking,
          type: 'catch',
        });

      showMessage({
        icon: 'auto',
        message: Labels.error,
        description: Labels.issueAction,
        type: 'danger',
      });
    });
};

export const handleTextInputDecimal = string => {
  if (Boolean(string) && !string.includes('.')) {
    return string.concat('.00');
  } else if (Boolean(string) && string.split('.')[1].length <= 1) {
    return string.concat(string.split('.')[1].length == 0 ? '00' : '0');
  } else {
    return string;
  }
};

export const kFormatter = value => {
  return Math.abs(value) > 999
    ? Math.sign(value) * (Math.abs(value) / 1000).toFixed(1) + 'k'
    : Math.sign(value) * Math.abs(value);
};

export const ordinalFormatter = value => {
  const ordinals = ['th', 'st', 'nd', 'rd'],
    helper = value % 100;

  return (
    value + (ordinals[(helper - 20) % 10] || ordinals[helper] || ordinals[0])
  );
};

export const dueCalculator = (
  value,
  valueFormat = Labels.formatD,
  dueDays = 20,
) => {
  var currentDate = Moment(value, valueFormat);
  var futureMonth = Moment(currentDate).add(dueDays, 'days');
  var futureMonthEnd = Moment(futureMonth).endOf('month');

  currentDate.date() != futureMonth.date() &&
    futureMonth.isSame(futureMonthEnd.format(Labels.formatYMD)) && [
      (futureMonth = futureMonth.add(1, 'd')),
    ];

  return futureMonth.format(Labels.formatD);
};

export const checkCardExpiry = (expiryDate, compareDate, dateTimeFormat) => {
  const cardDate = Moment(expiryDate, dateTimeFormat);
  const today = Moment(compareDate, dateTimeFormat);

  return cardDate.isValid() && today < cardDate.add(1, 'months');
};

// Common Variables
export const customOptions = [Labels.addAccount, Labels.addNew];

// DateTime Functions
export const compareDateTimes = (fromDateTime, toDateTime, dateTimeFormat) => {
  const from = Moment(fromDateTime, dateTimeFormat);
  const to = Moment(toDateTime, dateTimeFormat);

  if (from > to) {
    return true;
  } else {
    return false;
  }
};

export const formatDateYMD = date => {
  return Moment(date, Labels.formatMDY).format(Labels.formatYMD);
};

export const formatDateMDY = date => {
  return Moment(date, Labels.formatYMD).format(Labels.formatMDY);
};

export const formatDateTime = (
  dateTime,
  dateTimeFormat,
  expectedDateTimeFormat,
) => {
  return Moment(dateTime, dateTimeFormat).format(expectedDateTimeFormat);
};

export const formatDateTimeNow = (dateTime, dateTimeFormat) => {
  return Moment(dateTime, dateTimeFormat).fromNow(true);
};

// Get Screen Height
export const screenHeight = Dimensions.get('screen').height;

// Get Screen Weight
export const screenWidth = Dimensions.get('screen').width;

// Get Window Height
export const windowHeight = Dimensions.get('window').height;

// Get Window Weight
export const windowWidth = Dimensions.get('window').width;

// Regex Functions
export const validateEmail = emailId => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return !emailRegex.test(String(emailId).toLowerCase());
};

export const validatePassword = password => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,20}$/;

  return !passwordRegex.test(String(password));
};

export const validateUrl = url => {
  const urlRegex =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  return urlRegex.test(url);
};

export const validExpiredData = expiredDate => {
  const expiredex = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;

  return expiredex.test(expiredDate);
};

// Theme Functions
export const getThemeScheme = () => {
  return useColorScheme();
};

// Field Validation Functions
export const checkField = str => {
  return str && str.trim();
};

export const checkZero = amount => {
  return checkField(amount) && 0 < amount;
};
