import React, {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, Text, View} from 'react-native';
import {
  creditCardCreate,
  creditCardUpdate,
  fetchCreditBank,
  fetchCardType,
  loadingStatus,
} from '../../../../redux/Root.Actions';
import {connect} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Button from '../../../../components/appComponents/Button';
import Card from '../../../../containers/Card';
import Colors from '../../../../utils/Colors';
import DropdownCard from '../../../../components/appComponents/DropdownCard';
import FloatingTextInput from '../../../../components/appComponents/FloatingTextInput';
import Labels from '../../../../utils/Strings';
import Network from '../../../../containers/Network';
import SkeletonButton from '../../../../components/skeletonComponents/SkeletonButton';
import SkeletonCard from '../../../../components/skeletonComponents/SkeletonCard';
import SkeletonLabel from '../../../../components/skeletonComponents/SkeletonLabel';
import Styles from '../../../../styles/appStyles/balance/creditCard/CreateCreditCard';
import * as ENV from '../../../../../env';
import * as Helpers from '../../../../utils/Helpers';
import * as HelperStyles from '../../../../utils/HelperStyles';

const CreateCreditCard = props => {
  // Props Variables
  const editData =
    props.hasOwnProperty('route') &&
    props.route.params &&
    props.route.params.hasOwnProperty('editData')
      ? props.route.params.editData
      : null;

  const fromModal = props.hasOwnProperty('fromModal') ? props.fromModal : false;

  // CreateCreditCard Variables
  const [name, setName] = useState(null);
  const [cardType, setCardType] = useState(null);
  const [creditCardName, setCreditCardName] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [limit, setLimit] = useState(null);
  const [rewardPoints, setRewardPoints] = useState(null);
  const [statementDate, setStatementDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);

  // Error Variables
  const [nameError, setNameError] = useState(false);
  const [creditCardNameError, setCreditCardNameError] = useState(false);
  const [cardTypeError, setCardTypeError] = useState(false);
  const [expiryDateError, setExpiryDateError] = useState(false);
  const [expiryValidDateError, setExpiryValidDateError] = useState(false);
  const [limitError, setLimitError] = useState(false);
  const [rewardPointsError, setRewardPointsError] = useState(false);
  const [statementDateError, setStatementDateError] = useState(false);

  // Other Variables
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nameOptions, setNameOptions] = useState(null);
  const [cardTypeOptions, setCardTypeOptions] = useState(null);
  const [statementDateOptions, setStatementDateOptions] = useState(null);
  const [helperCreditCard, setHelperCreditCard] = useState(null);

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
        : [fetchCreditBank(), fetchCardType(), handleDateGeneration()];

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const fetchCreditBank = async () => {
    await props.fetchCreditBank(res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('BANK LIST RESPONSE DATA::: ', res.resJson.data);

      setNameOptions(response);
    });
  };

  const fetchCardType = () => {
    props.fetchCardType(res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('CARD TYPE LIST RESPONSE DATA::: ', res.resJson.data);

      setCardTypeOptions(response);
    });
  };

  const handleDateGeneration = () => {
    const datesArray = Array(31)
      .fill()
      .map((_, index) => ({
        id: String(index + 1),
        name: String(index + 1),
      }));

    setStatementDateOptions(datesArray);
  };

  useFocusEffect(
    useCallback(() => {
      if (Boolean(editData)) {
        editData && handleEditData();
      } else {
        setTimeout(() => {
          setLoading(false);

          setRefreshing(false);
        }, 1000);
      }
    }, [refreshing == true]),
  );

  const handleEditData = () => {
    fetchCreditBank();

    setName(String(editData.bank.id));

    fetchCardType();

    setCardType(String(editData.cardtype.id));

    setCreditCardName(editData.name);

    setExpiryDate(editData.expiry);

    setLimit(Helpers.handleTextInputDecimal(String(editData.amount)));

    setRewardPoints(String(editData.points));

    handleDateGeneration();

    setStatementDate(String(editData.billCycle));

    const dueDate = {
      id: String(editData.billCycle),
      name: String(editData.billCycle),
    };

    handleDueData(dueDate);

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

  const handleNameSelection = selectedValue => {
    nameError && setNameError(false);

    const selectedName =
      Boolean(selectedValue) && Object.keys(selectedValue).length != 0
        ? selectedValue.id
        : null;

    setName(selectedName);
  };

  const handleCardTypeSelection = selectedValue => {
    cardTypeError && setCardTypeError(false);

    const selectedCardType =
      Boolean(selectedValue) && Object.keys(selectedValue).length != 0
        ? selectedValue.id
        : null;

    setCardType(selectedCardType);
  };

  const handleDueData = selectedValue => {
    Boolean(selectedValue) && Object.keys(selectedValue).length != 0
      ? [
          setStatementDate(selectedValue.id),

          setDueDate(Helpers.dueCalculator(selectedValue.id)),
        ]
      : [setStatementDate(null), setDueDate(null)];
  };

  const handleConfirm = () => {
    if (checkCreateCreditCard()) {
      props.loading(true);

      const requestData = handleRequestData();

      ENV.currentEnvironment == Labels.development &&
        console.log('CREDIT CARD CREATE REQUEST DATA::: ', requestData);

      const creditCardId = editData && editData.id;

      if (editData) {
        props.creditCardUpdate(creditCardId, requestData, res => {
          const response = res.resJson.data;

          ENV.currentEnvironment == Labels.development &&
            console.log('CREDIT CARD UPDATE RESPONSE DATA::: ', response);

          props.navigation.goBack();
        });
      } else {
        props.creditCardCreate(requestData, res => {
          const response = res.resJson.data;

          ENV.currentEnvironment == Labels.development &&
            console.log('CREDIT CARD CREATE RESPONSE DATA::: ', response);

          Boolean(helperCreditCard) && [
            (helperCreditCard['bankName'] = helperCreditCard['name']),
            delete helperCreditCard['name'],
            delete helperCreditCard['id'],
          ];

          Boolean(fromModal)
            ? props.onClose(
                Boolean(helperCreditCard)
                  ? {...helperCreditCard, ...response}
                  : null,
              )
            : props.navigation.goBack();
        });
      }
    } else {
      handleErrorValidation();
    }
  };

  const checkCreateCreditCard = () => {
    if (
      Boolean(name) &&
      Boolean(cardType) &&
      Boolean(creditCardName) &&
      Boolean(expiryDate) &&
      Helpers.validExpiredData(expiryDate) &&
      Helpers.checkField(limit) &&
      Boolean(rewardPoints) &&
      Boolean(statementDate)
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
      name: creditCardName,
      amount: limit,
      points: rewardPoints,
      expiry: expiryDate,
      cardtype: {
        _id: cardType,
      },
      bank: {
        _id: name,
      },
      billCycle: statementDate,
    };

    return requestData;
  };

  const handleErrorValidation = () => {
    setNameError(Boolean(name) ? false : true);
    setCardTypeError(Boolean(cardType) ? false : true);
    setCreditCardNameError(Boolean(creditCardName) ? false : true);
    setLimitError(Boolean(limit) ? false : true);
    setExpiryDateError(Boolean(expiryDate) ? false : true);
    Boolean(expiryDate) &&
      setExpiryValidDateError(
        Helpers.validExpiredData(expiryDate) ? false : true,
      );
    setRewardPointsError(Boolean(rewardPoints) ? false : true);
    setStatementDateError(Boolean(statementDate) ? false : true);
  };

  const handleReset = () => {
    setName(null);
    setCardType(null);
    setCreditCardName(null);
    setExpiryDate(null);
    setLimit(null);
    setRewardPoints(null);
    setStatementDate(null);
    setDueDate(null);
    setNameError(false);
    setCreditCardNameError(false);
    setCardTypeError(false);
    setExpiryDateError(false);
    setExpiryValidDateError(false);
    setLimitError(false);
    setRewardPointsError(false);
    setStatementDateError(false);
  };

  const LabelSkeleton = ({height = 18, style = {}}) => {
    return <SkeletonLabel height={height} style={style} />;
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
                {Labels.createAnCreditCard}
              </Text>
            ) : (
              <LabelSkeleton height={16} />
            )}
            <View style={HelperStyles.margin(0, 16)}>
              {!loading ? (
                <DropdownCard
                  floatLabel={Labels.name}
                  label={Labels.name}
                  onValueChange={selectedValue => {
                    ENV.currentEnvironment == Labels.development &&
                      console.log('NAME SELECTED VALUE::: ', selectedValue);

                    setHelperCreditCard(
                      Boolean(selectedValue) &&
                        Object.keys(selectedValue).length != 0
                        ? selectedValue
                        : null,
                    );

                    handleNameSelection(selectedValue);
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
                  floatLabel={Labels.creditCardType}
                  label={Labels.creditCardType}
                  onValueChange={selectedValue => {
                    ENV.currentEnvironment == Labels.development &&
                      console.log(
                        'CREDIT CARD TYPE SELECTED VALUE::: ',
                        selectedValue,
                      );

                    handleCardTypeSelection(selectedValue);
                  }}
                  optionLabelKey={'name'}
                  options={cardTypeOptions}
                  optionValueKey={'id'}
                  value={cardType}
                />
              ) : (
                <DropdownCardSkeleton />
              )}
              {cardTypeError && (
                <Text
                  style={[
                    HelperStyles.errorText,
                    HelperStyles.justView('marginHorizontal', 8),
                  ]}>
                  {Labels.cardTypeError}
                </Text>
              )}
              {!loading ? (
                <Card containerStyle={Styles.floatingTextInputCardContainer}>
                  <FloatingTextInput
                    autoCapitalize={'none'}
                    isCard={false}
                    isDecimal={false}
                    keyboardType={'default'}
                    textContentType={'none'}
                    textInputContainerStyle={Styles.floatingTextInputContainer}
                    textInputLabelStyle={Styles.floatingTextInputLabel}
                    textInputStyle={Styles.floatingTextInput}
                    title={Labels.creditCardName}
                    updateMasterState={txt => {
                      creditCardNameError && setCreditCardNameError(false);

                      setCreditCardName(txt);
                    }}
                    value={creditCardName}
                  />
                </Card>
              ) : (
                <FloatingTextInputSkeleton />
              )}
              {creditCardNameError && (
                <Text
                  style={[
                    HelperStyles.errorText,
                    HelperStyles.justView('marginHorizontal', 8),
                  ]}>
                  {Labels.creditCardNameError}
                </Text>
              )}
              {!loading ? (
                <Card containerStyle={Styles.floatingTextInputCardContainer}>
                  <FloatingTextInput
                    autoCapitalize={'none'}
                    isCard={true}
                    isDecimal={false}
                    keyboardType={'number-pad'}
                    textContentType={'none'}
                    textInputContainerStyle={Styles.floatingTextInputContainer}
                    textInputLabelStyle={Styles.floatingTextInputLabel}
                    textInputStyle={Styles.floatingTextInput}
                    title={Labels.expiryMonthYear}
                    updateMasterState={txt => {
                      expiryDateError && setExpiryDateError(false);

                      Boolean(txt) &&
                        setExpiryValidDateError(
                          Helpers.validExpiredData(txt) ? false : true,
                        );

                      setExpiryDate(txt);
                    }}
                    value={expiryDate}
                  />
                </Card>
              ) : (
                <FloatingTextInputSkeleton />
              )}
              {expiryDateError && (
                <Text
                  style={[
                    HelperStyles.errorText,
                    HelperStyles.justView('marginHorizontal', 8),
                  ]}>
                  {Labels.expiryDateError}
                </Text>
              )}
              {expiryValidDateError && (
                <Text
                  style={[
                    HelperStyles.errorText,
                    HelperStyles.justView('marginHorizontal', 8),
                  ]}>
                  {Labels.expiryValidDateError}
                </Text>
              )}
              {!loading ? (
                <Card containerStyle={Styles.floatingTextInputCardContainer}>
                  <FloatingTextInput
                    autoCapitalize={'none'}
                    isDecimal={true}
                    keyboardType={'number-pad'}
                    textContentType={'none'}
                    textInputContainerStyle={Styles.floatingTextInputContainer}
                    textInputLabelStyle={Styles.floatingTextInputLabel}
                    textInputStyle={Styles.floatingTextInput}
                    title={Labels.creditLimit}
                    updateMasterState={txt => {
                      limitError && setLimitError(false);

                      setLimit(txt);
                    }}
                    value={limit}
                  />
                </Card>
              ) : (
                <FloatingTextInputSkeleton />
              )}
              {limitError && (
                <Text
                  style={[
                    HelperStyles.errorText,
                    HelperStyles.justView('marginHorizontal', 8),
                  ]}>
                  {Labels.creditLimitError}
                </Text>
              )}
              {!loading ? (
                <Card containerStyle={Styles.floatingTextInputCardContainer}>
                  <FloatingTextInput
                    autoCapitalize={'none'}
                    isDecimal={false}
                    keyboardType={'number-pad'}
                    textContentType={'none'}
                    textInputContainerStyle={Styles.floatingTextInputContainer}
                    textInputLabelStyle={Styles.floatingTextInputLabel}
                    textInputStyle={Styles.floatingTextInput}
                    title={Labels.currentRewardPoints}
                    updateMasterState={txt => {
                      rewardPointsError && setRewardPointsError(false);

                      setRewardPoints(txt);
                    }}
                    value={rewardPoints}
                  />
                </Card>
              ) : (
                <FloatingTextInputSkeleton />
              )}
              {rewardPointsError && (
                <Text
                  style={[
                    HelperStyles.errorText,
                    HelperStyles.justView('marginHorizontal', 8),
                  ]}>
                  {Labels.rewardPointsError}
                </Text>
              )}
              {!loading ? (
                <>
                  <DropdownCard
                    floatLabel={Labels.statementDate}
                    label={Labels.statementDate}
                    onValueChange={selectedValue => {
                      ENV.currentEnvironment == Labels.development &&
                        console.log(
                          'STATEMENT DATE SELECTED VALUE::: ',
                          selectedValue,
                        );

                      statementDateError && setStatementDateError(false);

                      handleDueData(selectedValue);
                    }}
                    optionLabelKey={'name'}
                    options={statementDateOptions}
                    optionValueKey={'id'}
                    value={statementDate}
                  />
                  {Boolean(statementDate) && (
                    <Text
                      style={[
                        HelperStyles.textView(
                          12,
                          '700',
                          Colors.lightText,
                          'left',
                          'none',
                        ),
                        HelperStyles.margin(8, 4),
                      ]}>
                      {Labels.hint}:{' '}
                      <Text
                        style={HelperStyles.textView(
                          12,
                          '600',
                          Colors.lightText,
                          'left',
                          'none',
                        )}>
                        {`${Helpers.ordinalFormatter(
                          statementDate,
                        )} of every month will be your ${Labels.statementDate.toLowerCase()}.`}
                      </Text>
                    </Text>
                  )}
                </>
              ) : (
                <DropdownCardSkeleton />
              )}
              {statementDateError && (
                <Text
                  style={[
                    HelperStyles.errorText,
                    HelperStyles.justView('marginHorizontal', 8),
                  ]}>
                  {Labels.statementDateError}
                </Text>
              )}
              {!loading ? (
                <>
                  <Card containerStyle={Styles.floatingTextInputCardContainer}>
                    <FloatingTextInput
                      autoCapitalize={'none'}
                      editable={false}
                      keyboardType={'default'}
                      textContentType={'none'}
                      textInputContainerStyle={
                        Styles.floatingTextInputContainer
                      }
                      textInputLabelStyle={Styles.floatingTextInputLabel}
                      textInputStyle={Styles.floatingTextInput}
                      title={Labels.dueDate}
                      value={dueDate}
                    />
                  </Card>
                  {Boolean(dueDate) && (
                    <Text
                      style={[
                        HelperStyles.textView(
                          12,
                          '700',
                          Colors.lightText,
                          'left',
                          'none',
                        ),
                        HelperStyles.margin(8, 4),
                      ]}>
                      {Labels.hint}:{' '}
                      <Text
                        style={HelperStyles.textView(
                          12,
                          '600',
                          Colors.lightText,
                          'left',
                          'none',
                        )}>
                        {`${Helpers.ordinalFormatter(
                          dueDate,
                        )} of every month will be your ${Labels.dueDate.toLowerCase()}.`}
                      </Text>
                    </Text>
                  )}
                </>
              ) : (
                <FloatingTextInputSkeleton />
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
              loading={props.loadingStatus}
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
    creditCardCreate: (requestData, onResponse) => {
      dispatch(creditCardCreate(requestData, onResponse));
    },

    fetchCreditBank: onResponse => {
      dispatch(fetchCreditBank(onResponse));
    },

    fetchCardType: onResponse => {
      dispatch(fetchCardType(onResponse));
    },

    creditCardUpdate: (creditCardId, requestData, onResponse) => {
      dispatch(creditCardUpdate(creditCardId, requestData, onResponse));
    },

    loading: status => {
      dispatch(loadingStatus(status));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateCreditCard);
