import React, {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, Text, View} from 'react-native';
import {
  claimsBank,
  claimSettle,
  loadingStatus,
} from '../../../redux/Root.Actions';
import {connect} from 'react-redux';
import {hideMessage, showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Button from '../../../components/appComponents/Button';
import Card from '../../../containers/Card';
import Colors from '../../../utils/Colors';
import CreateBalance from '../../../components/appComponents/CreateBalance';
import CustomDateTimePicker from '../../../components/appComponents/CustomDateTimePicker';
import DropdownCard from '../../../components/appComponents/DropdownCard';
import Labels from '../../../utils/Strings';
import Network from '../../../containers/Network';
import SkeletonButton from '../../../components/skeletonComponents/SkeletonButton';
import SkeletonCard from '../../../components/skeletonComponents/SkeletonCard';
import SkeletonCustomDateTimePicker from '../../../components/skeletonComponents/SkeletonCustomDateTimePicker';
import SkeletonLabel from '../../../components/skeletonComponents/SkeletonLabel';
import Store from '../../../redux/Store';
import Styles from '../../../styles/appStyles/billing/SettleClaims';
import * as ENV from '../../../../env';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';

const SettleClaims = props => {
  // Props Variables
  const settleData =
    props.route.params && props.route.params.hasOwnProperty('settleData')
      ? props.route.params.settleData
      : null;

  // SettleClaims Variables
  const [bankList, setBankList] = useState(null);
  const [receivedPaymentVia, setReceivedPaymentVia] = useState(null);
  const [date, setDate] = useState(null);

  // Error Variables
  const [receivedPaymentViaError, setReceivedPaymentViaError] = useState(false);
  const [dateError, setDateError] = useState(false);

  // Other Variables
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [createBalanceModalStatus, setCreateBalanceModalStatus] =
    useState(false);

  // Theme Variables
  const themeScheme = Helpers.getThemeScheme();
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        setLoading(false);

        setRefreshing(false);
      }, 1000);
    }, [refreshing == true]),
  );

  const onRefresh = () => {
    setRefreshing(true);

    handleReset();

    setLoading(true);
  };

  const handleReset = () => {
    setReceivedPaymentVia(null);
    setDate(null);
    setReceivedPaymentViaError(false);
    setDateError(false);
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      claimsBank();

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const handleReceivedPaymentViaSelection = selectedValue => {
    receivedPaymentViaError && setReceivedPaymentViaError(false);

    const selectedReceivedPaymentVia =
      Boolean(selectedValue) && Object.keys(selectedValue).length != 0
        ? selectedValue.id
        : null;

    if (
      Boolean(selectedReceivedPaymentVia) &&
      selectedReceivedPaymentVia == Labels.addAccount
    ) {
      setReceivedPaymentVia(selectedReceivedPaymentVia);

      setCreateBalanceModalStatus(!createBalanceModalStatus);
    } else {
      setReceivedPaymentVia(selectedReceivedPaymentVia);
    }
  };

  const claimsBank = customBankName => {
    props.claimsBank(res => {
      const response = res.resJson.data.list;

      ENV.currentEnvironment == Labels.development &&
        console.log('SETTLE CLAIMS BANK RESPONSE DATA::: ', response);

      const customizeObject = {
        id: Labels.addAccount,
        name: Labels.addAccount,
      };

      if (Array.isArray(response)) {
        response.push(customizeObject);

        const filteredResponse = response.filter(
          lol =>
            lol?.type != Labels.creditCard.replace(/\s/g, '').toLowerCase(),
        );

        ENV.currentEnvironment == Labels.development &&
          console.log(
            'FILTERED RESPONSE (EXCEPT CREDIT CARD)::: ',
            filteredResponse,
          );

        if (Boolean(customBankName)) {
          const filteredBank = filteredResponse.filter(
            lol => lol.name == customBankName,
          );

          ENV.currentEnvironment == Labels.development &&
            console.log('FILTERED BANK::: ', filteredBank);

          filteredBank.length != 0 && setReceivedPaymentVia(filteredBank[0].id);
        } else {
          const defaultBank = filteredResponse.filter(
            lol => lol.name.toLowerCase() == Labels.default.toLowerCase(),
          );

          ENV.currentEnvironment == Labels.development &&
            console.log('SETTLE CLAIMS DEFAULT BANK::: ', defaultBank);

          defaultBank.length != 0 && [
            setReceivedPaymentVia(defaultBank[0].id),
            setReceivedPaymentViaError(false),
          ];
        }

        setBankList(filteredResponse);

        hideMessage();
      } else {
        setBankList(null);

        hideMessage();
      }
    });
  };

  const LabelSkeleton = ({height = 18, style = {}}) => {
    return <SkeletonLabel height={height} style={style} />;
  };

  const DropdownCardSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonCard />
      </View>
    );
  };

  const DateTimePickerInputSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonCustomDateTimePicker />
      </View>
    );
  };

  const ButtonSkeleton = ({height = 40, width = '100%'}) => {
    return (
      <SkeletonButton
        height={height}
        style={[
          HelperStyles.justView('alignSelf', 'center'),
          HelperStyles.justView('elevation', 0),
        ]}
        width={width}
      />
    );
  };

  const handleConfirm = () => {
    if (checkSettleClaims()) {
      Store.dispatch(loadingStatus(true));

      const requestData = handleRequestData();

      ENV.currentEnvironment == Labels.development &&
        console.log('SETTLE CLAIMS REQUEST DATA::: ', requestData);

      const claimId = settleData._id;

      props.claimSettle(claimId, requestData, res => {
        const response = res.resJson.data;

        ENV.currentEnvironment == Labels.development &&
          console.log('SETTLE CLAIMS REQUEST DATA::: ', response);

        props.navigation.goBack();
      });
    } else {
      handleErrorValidation();
    }
  };

  const checkSettleClaims = () => {
    if (Boolean(receivedPaymentVia) && Boolean(date)) {
      return true;
    } else {
      return false;
    }
  };

  const handleRequestData = () => {
    let requestData = {};

    requestData = {
      balance: {
        _id: receivedPaymentVia,
      },
      isSettled: true,
      isSettledOn: date,
    };

    return requestData;
  };

  const handleErrorValidation = () => {
    setReceivedPaymentViaError(Boolean(receivedPaymentVia) ? false : true);
    setDateError(Boolean(date) ? false : true);
  };

  const renderCreateBalanceModal = () => {
    return (
      <CreateBalance
        onConfirm={txt => {
          showMessage({
            icon: 'auto',
            message: Labels.fetchingCreatedBalanceData,
            position: 'bottom',
            type: 'default',
          });

          ENV.currentEnvironment == Labels.development &&
            console.log('SETTLE CLAIMS CREATE ACCOUNT TXT::: ', txt);

          const filteredBank = bankList.filter(lol => lol.name == txt);

          if (filteredBank.length != 0) {
            setReceivedPaymentVia(filteredBank[0].id);
          } else {
            claimsBank(txt);
          }
        }}
        onRequestClose={() => {
          setReceivedPaymentViaError(false);

          setReceivedPaymentVia(null);

          setCreateBalanceModalStatus(!createBalanceModalStatus);
        }}
        visible={createBalanceModalStatus}
      />
    );
  };

  return (
    <Network>
      <View style={HelperStyles.screenContainer(Theme.background)}>
        <ScrollView
          contentContainerStyle={HelperStyles.flexGrow(1)}
          keyboardShouldPersistTaps={'handled'}
          refreshControl={
            <RefreshControl
              tintColor={Colors.primary}
              refreshing={refreshing}
              onRefresh={() => {
                onRefresh();
              }}
            />
          }
          showsVerticalScrollIndicator={false}>
          <View style={HelperStyles.margin(20, 24)}>
            {!loading ? (
              <Text
                style={HelperStyles.textView(
                  14,
                  '600',
                  Theme.primaryText,
                  'left',
                  'none',
                )}>
                {Labels.settleMultipleClaims}
              </Text>
            ) : (
              <LabelSkeleton height={16} />
            )}
            {!loading ? (
              <DropdownCard
                floatLabel={Labels.account}
                label={`${Labels.receivedPaymentVia}...`}
                labelContainerStyle={Styles.dropdownCardLabelContainerStyle}
                onValueChange={selectedValue => {
                  ENV.currentEnvironment == Labels.development &&
                    console.log(
                      'RECEIVED PAYMENT VIA SELECTED VALUE::: ',
                      selectedValue,
                    );

                  handleReceivedPaymentViaSelection(selectedValue);
                }}
                isType={true}
                optionLabelKey={'name'}
                options={bankList}
                optionTypeKey={'type'}
                optionValueKey={'id'}
                value={receivedPaymentVia}
              />
            ) : (
              <DropdownCardSkeleton />
            )}
            {receivedPaymentViaError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 12),
                ]}>
                {Labels.receivedPaymentViaError}
              </Text>
            )}
            {!loading ? (
              <CustomDateTimePicker
                disabled={!Boolean(receivedPaymentVia)}
                isDark={themeScheme == 'dark'}
                labelStyle={Styles.dateTimeLabelStyle}
                minimumDate={new Date()}
                onDateChange={selectedValue => {
                  ENV.currentEnvironment == Labels.development &&
                    console.log('DATE SELECTED VALUE::: ', selectedValue);

                  dateError && setDateError(false);

                  setDate(selectedValue);
                }}
                value={date}
                valueStyle={Styles.dateTimeValueStyle}
              />
            ) : (
              <DateTimePickerInputSkeleton />
            )}
            {dateError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 12),
                ]}>
                {Labels.dateError}
              </Text>
            )}
          </View>
        </ScrollView>

        <Card containerStyle={Styles.buttonCardContainer}>
          {!loading ? (
            <Button
              containerStyle={Styles.buttonContainer}
              label={Labels.confirm}
              loading={
                !Boolean(createBalanceModalStatus) &&
                Boolean(props.loadingStatus)
              }
              onPress={() => {
                handleConfirm();
              }}
            />
          ) : (
            <ButtonSkeleton width={Helpers.windowWidth * 0.9125} />
          )}
        </Card>

        {renderCreateBalanceModal()}
      </View>
    </Network>
  );
};

const mapStateToProps = state => {
  return {
    loadingStatus: state.other.loadingStatus,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    claimsBank: onResponse => {
      dispatch(claimsBank(onResponse));
    },

    claimSettle: (claimId, requestData, onResponse) => {
      dispatch(claimSettle(claimId, requestData, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettleClaims);
