import React, {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, Text, View} from 'react-native';
import {
  accountCreate,
  accountUpdate,
  fetchBank,
  loadingStatus,
} from '../../../../redux/Root.Actions';
import {connect} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../../assets/Index';
import Button from '../../../../components/appComponents/Button';
import Card from '../../../../containers/Card';
import ColorPalette from '../../../../components/appComponents/ColorPalette';
import Colors from '../../../../utils/Colors';
import Dropdown from '../../../../components/appComponents/Dropdown';
import DropdownCard from '../../../../components/appComponents/DropdownCard';
import FloatingTextInput from '../../../../components/appComponents/FloatingTextInput';
import Labels from '../../../../utils/Strings';
import Network from '../../../../containers/Network';
import SkeletonButton from '../../../../components/skeletonComponents/SkeletonButton';
import SkeletonCard from '../../../../components/skeletonComponents/SkeletonCard';
import SkeletonColorPalette from '../../../../components/skeletonComponents/SkeletonColorPalette';
import SkeletonDropdown from '../../../../components/skeletonComponents/SkeletonDropdown';
import SkeletonLabel from '../../../../components/skeletonComponents/SkeletonLabel';
import Store from '../../../../redux/Store';
import Styles from '../../../../styles/appStyles/balance/account/CreateAccount';
import * as ENV from '../../../../../env';
import * as Helpers from '../../../../utils/Helpers';
import * as HelperStyles from '../../../../utils/HelperStyles';

const CreateAccount = props => {
  // Props Variables
  const editData =
    props.hasOwnProperty('route') &&
    props.route.params &&
    props.route.params.hasOwnProperty('editData')
      ? props.route.params.editData
      : null;

  const fromModal = props.hasOwnProperty('fromModal') ? props.fromModal : false;

  // CreateAccount Variables
  const [accountType, setAccountType] = useState(null);
  const [color, setColor] = useState(null);
  const [name, setName] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [amount, setAmount] = useState(null);

  // Error Variables
  const [accountTypeError, setAccountTypeError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [currencyError, setCurrencyError] = useState(false);
  const [amountError, setAmountError] = useState(false);

  // Other Variables
  const [nameOptions, setNameOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [helperName, setHelperName] = useState(null);

  const accountTypeOptions = [
    {image: Assets.bank, label: Labels.bank},
    {image: Assets.cash, label: Labels.cashInHand},
    {image: Assets.creditCard, label: Labels.credit},
    {image: Assets.eWallet, label: Labels.eWallet},
  ];

  const currencyOptions = [{label: 'RM'}, {label: 'SGD'}];

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      Boolean(editData)
        ? [
            showMessage({
              icon: 'auto',
              message: Labels.fetchingData,
              position: 'bottom',
              type: 'default',
            }),

            setLoading(true),
          ]
        : [fetchBank()];

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const fetchBank = async () => {
    await props.fetchBank(res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('BANK LIST RESPONSE DATA::: ', res.resJson.data);

      setNameOptions(response);
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (Boolean(editData)) {
        setTimeout(() => {
          editData && handleEditData();
        }, 1000);
      } else {
        setTimeout(() => {
          setLoading(false);

          setRefreshing(false);
        }, 1000);
      }
    }, [refreshing == true]),
  );

  const handleEditData = () => {
    setAccountType(editData.accountType);

    setColor(editData.color);

    fetchBank();

    setName(String(editData.bank.id));

    setCurrency(editData.currency);

    setAmount(Helpers.handleTextInputDecimal(String(editData.amount)));

    setLoading(false);

    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);

    handleReset();

    Boolean(editData) &&
      showMessage({
        icon: 'auto',
        message: Labels.fetchingData,
        position: 'bottom',
        type: 'default',
      });

    setLoading(true);
  };

  const LabelSkeleton = ({height = 18, style = {}}) => {
    return <SkeletonLabel height={height} style={style} />;
  };

  const DropdownSkeleton = () => {
    return <SkeletonDropdown textWidth={Helpers.windowWidth * 0.25} />;
  };

  const ColorPaletteSkeleton = ({textWidth = Helpers.windowWidth * 0.25}) => {
    return (
      <SkeletonColorPalette
        itemStyle={HelperStyles.justView('marginVertical', 8.5)}
        textWidth={textWidth}
      />
    );
  };

  const DropdownCardSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonCard height={51} />
      </View>
    );
  };

  const FloatingTextInputSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonCard />
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
    if (checkCreateAccount()) {
      Store.dispatch(loadingStatus(true));

      const requestData = handleRequestData();

      ENV.currentEnvironment == Labels.development &&
        console.log('BALANCE CREATE ACCOUNT REQUEST DATA::: ', requestData);

      const accountId = editData && editData._id;

      if (editData) {
        props.accountUpdate(accountId, requestData, res => {
          ENV.currentEnvironment == Labels.development &&
            console.log(
              'BALANCE UPDATED ACCOUNT RESPONSE DATA::: ',
              res.resJson,
            );

          props.navigation.navigate('Balance');
        });
      } else {
        props.accountCreate(requestData, res => {
          ENV.currentEnvironment == Labels.development &&
            console.log(
              'BALANCE CREATE ACCOUNT RESPONSE DATA::: ',
              res.resJson,
            );

          Boolean(fromModal)
            ? props.onClose(helperName)
            : props.navigation.navigate('Balance');
        });
      }
    } else {
      handleErrorValidation();
    }
  };

  const checkCreateAccount = () => {
    if (
      Boolean(accountType) &&
      Boolean(color) &&
      Boolean(name) &&
      Boolean(currency) &&
      Helpers.checkField(amount)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleRequestData = () => {
    let requestData = {};

    requestData = {
      ...requestData,
      accountType: accountType,
      color: color,
      bank: {
        _id: name,
      },
      currency: currency,
      amount: amount,
    };

    return requestData;
  };

  const handleErrorValidation = () => {
    setAccountTypeError(Boolean(accountType) ? false : true);
    setColorError(Boolean(color) ? false : true);
    setNameError(Boolean(name) ? false : true);
    setCurrencyError(Boolean(currency) ? false : true);
    setAmountError(Helpers.checkField(amount) ? false : true);
  };

  const handleReset = () => {
    setAccountType(null);
    setColor(null);
    setName(null);
    setCurrency(null);
    setAmount(null);
    setHelperName(null);
    setAccountTypeError(false);
    setColorError(false);
    setNameError(false);
    setCurrencyError(false);
    setAmountError(false);
  };

  const handleAccountTypeNavigation = selectedAccountType => {
    switch (selectedAccountType) {
      case Labels.credit:
        Boolean(fromModal)
          ? props.onClose(selectedAccountType)
          : props.navigation.navigate('CreateCreditCard');
        break;
      default:
        break;
    }
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
          <View style={HelperStyles.margin(20, 20)}>
            {!loading ? (
              <Text
                style={HelperStyles.textView(
                  14,
                  '600',
                  Theme.primaryText,
                  'left',
                  'none',
                )}>
                {Labels.createAnAccount}
              </Text>
            ) : (
              <LabelSkeleton height={16} />
            )}
            <View style={Styles.createAccountContainer}>
              <View style={Styles.accountTypeContainer}>
                {!loading ? (
                  <>
                    <Dropdown
                      label={Labels.accountType}
                      labelTextStyle={HelperStyles.justView(
                        'color',
                        Colors.lightText,
                      )}
                      modalHeaderLabel={`${Labels.select} ${Labels.accountType}`}
                      onValueChange={selectedValue => {
                        ENV.currentEnvironment == Labels.development &&
                          console.log(
                            'ACCOUNT TYPE FOR SELECTED VALUE::: ',
                            selectedValue,
                          );

                        const selectedAccountType =
                          Boolean(selectedValue) &&
                          Object.keys(selectedValue).length != 0
                            ? selectedValue.label
                            : null;

                        accountTypeError && setAccountTypeError(false);

                        setAccountType(selectedAccountType);

                        Boolean(selectedAccountType) &&
                          handleAccountTypeNavigation(selectedAccountType);
                      }}
                      optionImageKey={'image'}
                      optionLabelKey={'label'}
                      options={accountTypeOptions}
                      optionValueKey={'label'}
                      value={accountType}
                    />
                    {accountTypeError && (
                      <Text
                        style={[
                          HelperStyles.errorText,
                          HelperStyles.justView('marginHorizontal', 0),
                        ]}>
                        {Labels.accountTypeError}
                      </Text>
                    )}
                    {!accountTypeError && colorError && (
                      <Text style={HelperStyles.errorText} />
                    )}
                  </>
                ) : (
                  <DropdownSkeleton />
                )}
              </View>
              <View style={Styles.colorContainer}>
                {!loading ? (
                  <>
                    <ColorPalette
                      labelTextStyle={HelperStyles.justView(
                        'color',
                        Colors.lightText,
                      )}
                      onValueChange={selectedValue => {
                        ENV.currentEnvironment == Labels.development &&
                          console.log(
                            'COLOR SELECTED VALUE::: ',
                            selectedValue,
                          );

                        if (Boolean(selectedValue)) {
                          colorError && setColorError(false);

                          setColor(selectedValue);
                        } else {
                          setColorError(true);
                        }
                      }}
                      value={color}
                    />
                    {colorError && (
                      <Text
                        style={[
                          HelperStyles.errorText,
                          HelperStyles.justView('marginHorizontal', 0),
                        ]}>
                        {Labels.colorError}
                      </Text>
                    )}
                    {!colorError && accountTypeError && (
                      <Text style={HelperStyles.errorText} />
                    )}
                  </>
                ) : (
                  <ColorPaletteSkeleton />
                )}
              </View>
            </View>
            <View style={HelperStyles.margin(0, 16)}>
              {!loading ? (
                <DropdownCard
                  disabled={!Boolean(accountType)}
                  floatLabel={Labels.name}
                  label={Labels.name}
                  onValueChange={selectedValue => {
                    ENV.currentEnvironment == Labels.development &&
                      console.log('NAME SELECTED VALUE::: ', selectedValue);

                    nameError && setNameError(false);

                    setName(
                      Boolean(selectedValue) &&
                        Object.keys(selectedValue).length != 0
                        ? selectedValue.id
                        : null,
                    );

                    setHelperName(
                      Boolean(selectedValue) &&
                        Object.keys(selectedValue).length != 0
                        ? selectedValue.name
                        : null,
                    );
                  }}
                  optionLabelKey={'name'}
                  options={nameOptions}
                  optionValueKey={'id'}
                  value={name}
                />
              ) : (
                <DropdownCardSkeleton />
              )}
              {nameError && (
                <Text
                  style={[
                    HelperStyles.errorText,
                    HelperStyles.justView('marginHorizontal', 8),
                  ]}>
                  {Labels.nameError}
                </Text>
              )}
              {!loading ? (
                <DropdownCard
                  disabled={!Boolean(accountType)}
                  floatLabel={Labels.currency}
                  label={Labels.currency}
                  onValueChange={selectedValue => {
                    ENV.currentEnvironment == Labels.development &&
                      console.log('CURRENCY SELECTED VALUE::: ', selectedValue);

                    currencyError && setCurrencyError(false);

                    setCurrency(
                      Boolean(selectedValue) &&
                        Object.keys(selectedValue).length != 0
                        ? selectedValue.label
                        : null,
                    );
                  }}
                  optionLabelKey={'label'}
                  options={currencyOptions}
                  optionValueKey={'label'}
                  value={currency}
                />
              ) : (
                <DropdownCardSkeleton />
              )}
              {currencyError && (
                <Text
                  style={[
                    HelperStyles.errorText,
                    HelperStyles.justView('marginHorizontal', 8),
                  ]}>
                  {Labels.currencyError}
                </Text>
              )}
              {!loading ? (
                <Card containerStyle={Styles.floatingTextInputCardContainer}>
                  <FloatingTextInput
                    autoCapitalize={'none'}
                    editable={Boolean(accountType)}
                    isDecimal={true}
                    keyboardType={'number-pad'}
                    textContentType={'none'}
                    textInputContainerStyle={Styles.floatingTextInputContainer}
                    textInputLabelStyle={Styles.floatingTextInputLabel}
                    textInputStyle={Styles.floatingTextInput}
                    title={Labels.amount}
                    updateMasterState={txt => {
                      amountError && setAmountError(false);

                      setAmount(txt);
                    }}
                    value={amount}
                  />
                </Card>
              ) : (
                <FloatingTextInputSkeleton />
              )}
              {amountError && (
                <Text
                  style={[
                    HelperStyles.errorText,
                    HelperStyles.justView('marginHorizontal', 8),
                  ]}>
                  {Labels.amountError}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        <Card
          containerStyle={[
            Styles.buttonCardContainer,
            !props.hasOwnProperty('route') &&
              HelperStyles.justView('elevation', 0),
          ]}>
          {!loading ? (
            <Button
              containerStyle={Styles.buttonContainer}
              label={Labels.confirm}
              loading={Boolean(props.loadingStatus)}
              onPress={() => {
                handleConfirm();
              }}
            />
          ) : (
            <ButtonSkeleton width={Helpers.windowWidth * 0.9125} />
          )}
        </Card>
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
    accountCreate: (requestData, onResponse) => {
      dispatch(accountCreate(requestData, onResponse));
    },

    accountUpdate: (accountId, requestData, onResponse) => {
      dispatch(accountUpdate(accountId, requestData, onResponse));
    },

    fetchBank: onResponse => {
      dispatch(fetchBank(onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);
