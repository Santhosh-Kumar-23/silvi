import React, {useState, useCallback} from 'react';
import {RefreshControl, ScrollView, Text, View} from 'react-native';
import {
  billingBank,
  billingSettle,
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
import Styles from '../../../styles/appStyles/billing/SettleBillings';
import * as ENV from '../../../../env';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';

const SettleBillings = props => {
  // Props Variables
  const settleData =
    props.route.params && props.route.params.hasOwnProperty('settleData')
      ? props.route.params.settleData
      : null;

  // SettleBillings Variables
  const [bankList, setBankList] = useState(null);
  const [madePaymentVia, setMadePaymentVia] = useState(null);
  const [date, setDate] = useState(null);

  // Error Variables
  const [madePaymentViaError, setMadePaymentViaError] = useState(false);
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
    setMadePaymentVia(null);
    setDate(null);
    setMadePaymentViaError(false);
    setDateError(false);
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      billingBank();

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const billingBank = customBankName => {
    props.billingBank(res => {
      const response = res.resJson.data.list;

      ENV.currentEnvironment == Labels.development &&
        console.log('SETTLE BILLINGS BANK RESPONSE DATA::: ', response);

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

          filteredBank.length != 0 && setMadePaymentVia(filteredBank[0].id);
        } else {
          const defaultBank = filteredResponse.filter(
            lol => lol.name.toLowerCase() == Labels.default.toLowerCase(),
          );

          ENV.currentEnvironment == Labels.development &&
            console.log('SETTLE BILLING DEFAULT BANK::: ', defaultBank);

          defaultBank.length != 0 && [
            setMadePaymentVia(defaultBank[0].id),
            setMadePaymentViaError(false),
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

  const handleMadePaymentViaSelection = selectedValue => {
    madePaymentViaError && setMadePaymentViaError(false);

    const selectedMadePaymentVia =
      Boolean(selectedValue) && Object.keys(selectedValue).length != 0
        ? selectedValue.id
        : null;

    if (
      Boolean(selectedMadePaymentVia) &&
      selectedMadePaymentVia == Labels.addAccount
    ) {
      setMadePaymentVia(selectedMadePaymentVia);

      setCreateBalanceModalStatus(!createBalanceModalStatus);
    } else {
      setMadePaymentVia(selectedMadePaymentVia);
    }
  };

  const handleConfirm = () => {
    if (checkSettleBillings()) {
      Store.dispatch(loadingStatus(true));

      const requestData = handleRequestData();

      ENV.currentEnvironment == Labels.development &&
        console.log('SETTLE CLAIMS REQUEST DATA::: ', requestData);

      const billingId = settleData._id;

      props.billingSettle(billingId, requestData, res => {
        const response = res.resJson.data;

        props.navigation.goBack();

        ENV.currentEnvironment == Labels.development &&
          console.log('SETTLE CLAIMS REQUEST DATA::: ', response);
      });
    } else {
      handleErrorValidation();
    }
  };

  const checkSettleBillings = () => {
    if (Boolean(madePaymentVia) && Boolean(date)) {
      return true;
    } else {
      return false;
    }
  };

  const handleRequestData = () => {
    let requestData = {};

    requestData = {
      isSettled: true,
      isSettledOn: date,
      balance: {
        _id: madePaymentVia,
      },
    };

    return requestData;
  };

  const handleErrorValidation = () => {
    setMadePaymentViaError(Boolean(madePaymentVia) ? false : true);
    setDateError(Boolean(date) ? false : true);
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
            console.log('SETTLE BILLINGS CREATE ACCOUNT TXT::: ', txt);

          const filteredBank = bankList.filter(lol => lol.name == txt);

          if (filteredBank.length != 0) {
            setMadePaymentVia(filteredBank[0].id);
          } else {
            billingBank(txt);
          }
        }}
        onRequestClose={() => {
          setMadePaymentViaError(false);

          setMadePaymentVia(null);

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
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              tintColor={Colors.primary}
              refreshing={refreshing}
              onRefresh={() => {
                onRefresh();
              }}
            />
          }>
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
                {Labels.settleMultipleBills}
              </Text>
            ) : (
              <LabelSkeleton height={16} />
            )}
            {!loading ? (
              <DropdownCard
                floatLabel={Labels.account}
                label={`${Labels.madePaymentVia}...`}
                labelContainerStyle={Styles.dropdownCardLabelContainerStyle}
                onValueChange={selectedValue => {
                  ENV.currentEnvironment == Labels.development &&
                    console.log(
                      'MADE PAYMENT VIA SELECTED VALUE::: ',
                      selectedValue,
                    );

                  handleMadePaymentViaSelection(selectedValue);
                }}
                isType={true}
                optionLabelKey={'name'}
                options={bankList}
                optionTypeKey={'type'}
                optionValueKey={'id'}
                value={madePaymentVia}
              />
            ) : (
              <DropdownCardSkeleton />
            )}
            {madePaymentViaError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 12),
                ]}>
                {Labels.madePaymentViaError}
              </Text>
            )}
            {!loading ? (
              <CustomDateTimePicker
                disabled={!Boolean(madePaymentVia)}
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
    billingBank: onResponse => {
      dispatch(billingBank(onResponse));
    },

    billingSettle: (billingId, requestData, onResponse) => {
      dispatch(billingSettle(billingId, requestData, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettleBillings);
