import React, {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {
  spendingCategory,
  spendingCreate,
  spendingCreateSubCategory,
  spendingSubCategory,
  spendingUpdate,
  loadingStatus,
} from '../../../../../../redux/Root.Actions';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../../../../assets/Index';
import Button from '../../../../../../components/appComponents/Button';
import Card from '../../../../../../containers/Card';
import CustomDateTimePicker from '../../../../../../components/appComponents/CustomDateTimePicker';
import CustomizeModal from '../../../../../../components/appComponents/CustomizeModal';
import Colors from '../../../../../../utils/Colors';
import Dropdown from '../../../../../../components/appComponents/Dropdown';
import FloatingTextInput from '../../../../../../components/appComponents/FloatingTextInput';
import Labels from '../../../../../../utils/Strings';
import moment from 'moment';
import Network from '../../../../../../containers/Network';
import SkeletonButton from '../../../../../../components/skeletonComponents/SkeletonButton';
import SkeletonCard from '../../../../../../components/skeletonComponents/SkeletonCard';
import SkeletonCustomDateTimePicker from '../../../../../../components/skeletonComponents/SkeletonCustomDateTimePicker';
import SkeletonDropdown from '../../../../../../components/skeletonComponents/SkeletonDropdown';
import SkeletonLabel from '../../../../../../components/skeletonComponents/SkeletonLabel';
import Styles from '../../../../../../styles/appStyles/balance/creditCard/rewards/points/Spending';
import * as ENV from '../../../../../../../env';
import * as Helpers from '../../../../../../utils/Helpers';
import * as HelperStyles from '../../../../../../utils/HelperStyles';

const Spending = props => {
  // Props Variables
  const editData =
    props.hasOwnProperty('route') &&
    props.route.params &&
    props.route.params.hasOwnProperty('editData')
      ? props.route.params.editData
      : null;

  // Spending Variables
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [payee, setPayee] = useState(null);
  const [points, setPoints] = useState(null);
  const [date, setDate] = useState(null);

  // Error Variables
  const [categoryError, setCategoryError] = useState(false);
  const [subCategoryError, setSubCategoryError] = useState(false);
  const [payeeError, setPayeeError] = useState(false);
  const [pointsError, setPointsError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [creditCardExpiryError, setCreditCardExpiryError] = useState(false);

  // Other Variables
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState(null);
  const [subCategoryOptions, setSubCategoryOptions] = useState(null);
  const [customizeModalStatus, setCustomizeModalStatus] = useState(false);
  const [customizeFor, setCustomizeFor] = useState(null);

  // Theme Variables
  const themeScheme = Helpers.getThemeScheme();
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
        : [spendingCategory()];

      return () => {
        handleReset();

        isFocus = false;
      };
    }, []),
  );

  const spendingCategory = async () => {
    await props.spendingCategory(res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('SPENDING CATEGORY RESPONSE DATA::: ', response);

      setCategoryOptions(response);
    });
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
    spendingCategory();

    setCategory(editData.category.id || editData.category._id);

    spendingSubCategory(
      editData.category.id || editData.category._id,
      Boolean(editData.category.id || editData.category._id) &&
        Boolean(editData.subcategory) &&
        Object.keys(editData.subcategory).length != 0
        ? editData.subcategory.name
        : null,
    );

    setPayee(editData.name);

    setPoints(String(editData.points));

    setDate(editData.datedOn);

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

  const spendingSubCategory = async (categoryId, customSubCategoryName) => {
    await props.spendingSubCategory(categoryId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('SPENDING SUB CATEGORY RESPONSE DATA::: ', response);

      const customizeObject = {
        icon: Assets.customize,
        id: Labels.customize,
        name: Labels.customize,
      };

      if (Array.isArray(response)) {
        const checkForUncategorized =
          Boolean(categoryOptions) && Array.isArray(categoryOptions)
            ? categoryOptions.filter(lol => lol.id == categoryId)
            : [{id: categoryId, name: customSubCategoryName}];

        checkForUncategorized.length != 0 &&
          checkForUncategorized[0].name == Labels.uncategorized &&
          response.push(customizeObject);

        if (Boolean(customSubCategoryName)) {
          const filteredSubCategory = response.filter(
            lol => lol.name == customSubCategoryName,
          );
          ENV.currentEnvironment == Labels.development &&
            console.log('FILTERED SUB CATEGORY::: ', filteredSubCategory);

          filteredSubCategory.length != 0 &&
            setSubCategory(filteredSubCategory[0].id);
        } else {
          setSubCategory(null);
        }

        setSubCategoryOptions(response);
      } else {
        setSubCategoryOptions(null);
      }
    });
  };

  const handleSubCategorySelection = selectedValue => {
    setCustomizeFor(Labels.subCategory);

    subCategoryError && setSubCategoryError(false);

    const selectedMadePaymentForSubCategory =
      Boolean(selectedValue) && Object.keys(selectedValue).length != 0
        ? selectedValue.id
        : null;

    if (
      Boolean(selectedMadePaymentForSubCategory) &&
      selectedMadePaymentForSubCategory == Labels.customize
    ) {
      setSubCategory(selectedMadePaymentForSubCategory);

      setCustomizeModalStatus(!customizeModalStatus);
    } else {
      setSubCategory(selectedMadePaymentForSubCategory);
    }
  };

  const handleCardExpiry = selectedDate => {
    const customSelectedDate = moment(selectedDate).format(
      `${Labels.formatMM}/${Labels.formatYY}`,
    );

    const checkExpiry = Helpers.checkCardExpiry(
      props.creditCardExpiry,
      customSelectedDate,
      `${Labels.formatMM}/${Labels.formatYY}`,
    );

    setCreditCardExpiryError(!Boolean(checkExpiry));
  };

  const handleConfirm = () => {
    if (checkSpending()) {
      props.loading(true);

      const requestData = handleRequestData();

      ENV.currentEnvironment == Labels.development &&
        console.log('SPENDING REQUEST DATA::: ', requestData);

      const spendingId = editData && (editData.id || editData._id);

      if (editData) {
        props.spendingUpdate(spendingId, requestData, res => {
          const response = res.resJson.data;

          ENV.currentEnvironment == Labels.development &&
            console.log('SPENDING UPDATE RESPONSE DATA :::: ', response);

          props.navigation.goBack();
        });
      } else {
        props.spendingCreate(requestData, res => {
          const response = res.resJson.data;

          ENV.currentEnvironment == Labels.development &&
            console.log('SPENDING CREATE RESPONSE DATA::: ', response);

          props.navigation.goBack();
        });
      }
    } else {
      handleErrorValidation();
    }
  };

  const checkSpending = () => {
    if (
      Boolean(category) &&
      Boolean(subCategory) &&
      Boolean(payee) &&
      Boolean(points) &&
      Boolean(date) &&
      !creditCardExpiryError
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleRequestData = () => {
    let requestData = {};

    requestData = {
      name: payee,
      points: points,
      datedOn: date,
      transactiontype: Labels.spending.toLowerCase(),
      creditcard: {
        _id: props.creditCardId,
      },
      category: {
        _id: category,
      },
      subcategory: {
        _id: subCategory,
      },
    };

    return requestData;
  };

  const handleErrorValidation = () => {
    setCategoryError(Boolean(category ? false : true));
    setSubCategoryError(Boolean(subCategory) ? false : true);
    setPayeeError(Boolean(payee) ? false : true);
    setPointsError(Boolean(points) ? false : true);
    setDateError(Boolean(date) ? false : true);
  };

  const handleReset = () => {
    setCategory(null);
    setSubCategory(null);
    setPayee(null);
    setPoints(null);
    setDate(null);
    setCategoryError(false);
    setSubCategoryError(false);
    setPayeeError(false);
    setPointsError(false);
    setDateError(false);
  };

  const renderCustomizeModal = () => {
    return (
      <CustomizeModal
        label={customizeFor}
        onBack={() => {
          setCustomizeModalStatus(!customizeModalStatus);

          switch (customizeFor) {
            case Labels.subCategory:
              setSubCategoryError(false);

              setSubCategory(null);

              setCustomizeFor(null);
              break;

            default:
              setCustomizeFor(null);
              break;
          }
        }}
        onConfirm={txt => {
          switch (customizeFor) {
            case Labels.subCategory:
              ENV.currentEnvironment == Labels.development &&
                console.log(
                  'SPENDING SUB CATEGORY CUSTOMIZE MODAL TXT::: ',
                  txt,
                );

              const filteredSubCategory = subCategoryOptions.filter(
                lol => lol.name == txt,
              );

              if (filteredSubCategory.length != 0) {
                setSubCategory(filteredSubCategory[0].id);
              } else {
                spendingCreateSubCategory(txt);
              }

              setCustomizeFor(null);
              break;

            default:
              setCustomizeFor(null);
              break;
          }
        }}
        onRequestClose={() => {
          setCustomizeModalStatus(!customizeModalStatus);
        }}
        visible={customizeModalStatus}
      />
    );
  };

  const spendingCreateSubCategory = customSubCategoryName => {
    const requestData = {
      category: {_id: category},
      icon: null,
      name: customSubCategoryName,
    };

    props.spendingCreateSubCategory(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('SPENDING CREATE SUB CATEGORY RESPONSE DATA::: ', response);

      showMessage({
        icon: 'auto',
        message: Labels.fetchingCreatedSubCategoryData,
        position: 'bottom',
        type: 'default',
      });

      spendingSubCategory(category, customSubCategoryName);
    });
  };

  const LabelSkeleton = ({height = 18, style = {}}) => {
    return <SkeletonLabel height={height} style={style} />;
  };

  const DropdownSkeleton = () => {
    return <SkeletonDropdown textWidth={Helpers.windowWidth * 0.25} />;
  };

  const FloatingTextInputSkeleton = () => {
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
                {`${Labels.spendingFor}...`}
              </Text>
            ) : (
              <LabelSkeleton height={16} />
            )}
            <View style={Styles.spendingForContainer}>
              <View style={Styles.spendingTypeContainer}>
                {!loading ? (
                  <>
                    <Dropdown
                      modalHeaderLabel={`${Labels.select} ${Labels.spendingFor} ${Labels.category}`}
                      onValueChange={selectedValue => {
                        ENV.currentEnvironment == Labels.development &&
                          console.log(
                            'SPENDING FOR CATEGORY SELECTED VALUE::: ',
                            selectedValue,
                          );

                        categoryError && setCategoryError(false);

                        setCategory(
                          Boolean(selectedValue) &&
                            Object.keys(selectedValue).length != 0
                            ? selectedValue.id
                            : null,
                        );

                        setSubCategory(null);

                        Object.keys(selectedValue).length != 0 &&
                          spendingSubCategory(selectedValue.id);
                      }}
                      optionImageKey={'icon'}
                      optionLabelKey={'name'}
                      options={categoryOptions}
                      optionValueKey={'id'}
                      searchEnabled={true}
                      value={category}
                    />
                    {categoryError && (
                      <Text
                        style={[
                          HelperStyles.errorText,
                          HelperStyles.justView('marginHorizontal', 0),
                        ]}>
                        {Labels.categoryError}
                      </Text>
                    )}
                  </>
                ) : (
                  <DropdownSkeleton />
                )}
              </View>
              <View style={Styles.spendingTypeContainer}>
                {!loading ? (
                  <>
                    <Dropdown
                      disabled={!Boolean(category)}
                      label={Labels.subCategory}
                      labelTextStyle={HelperStyles.justView(
                        'color',
                        Colors.lightText,
                      )}
                      modalHeaderLabel={`${Labels.select} ${Labels.category}`}
                      onValueChange={selectedValue => {
                        ENV.currentEnvironment == Labels.development &&
                          console.log(
                            'CATEGORY FOR SELECTED VALUE::: ',
                            selectedValue,
                          );

                        handleSubCategorySelection(selectedValue);
                      }}
                      optionImageKey={'icon'}
                      optionLabelKey={'name'}
                      options={subCategoryOptions}
                      optionValueKey={'id'}
                      searchEnabled={true}
                      value={subCategory}
                    />
                    {subCategoryError && (
                      <Text
                        style={[
                          HelperStyles.errorText,
                          HelperStyles.justView('marginHorizontal', 0),
                        ]}>
                        {Labels.subCategoryError}
                      </Text>
                    )}
                  </>
                ) : (
                  <DropdownSkeleton />
                )}
              </View>
            </View>
            {!loading ? (
              <Card containerStyle={Styles.floatingTextInputCardContainer}>
                <FloatingTextInput
                  autoCapitalize={'none'}
                  editable={Boolean(category && subCategory)}
                  keyboardType={'default'}
                  textContentType={'none'}
                  textInputContainerStyle={Styles.floatingTextInputContainer}
                  textInputLabelStyle={Styles.floatingTextInputLabel}
                  textInputStyle={Styles.floatingTextInput}
                  title={Labels.payee}
                  updateMasterState={txt => {
                    payeeError && setPayeeError(false);

                    setPayee(txt);
                  }}
                  value={payee}
                />
              </Card>
            ) : (
              <FloatingTextInputSkeleton />
            )}
            {payeeError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 12),
                ]}>
                {Labels.payeeError}
              </Text>
            )}
            {!loading ? (
              <Card containerStyle={Styles.floatingTextInputCardContainer}>
                <FloatingTextInput
                  autoCapitalize={'none'}
                  editable={Boolean(category && subCategory)}
                  isDecimal={false}
                  keyboardType={'number-pad'}
                  textContentType={'none'}
                  textInputContainerStyle={Styles.floatingTextInputContainer}
                  textInputLabelStyle={Styles.floatingTextInputLabel}
                  textInputStyle={Styles.floatingTextInput}
                  title={Labels.points}
                  updateMasterState={txt => {
                    pointsError && setPointsError(false);

                    setPoints(txt);
                  }}
                  value={points}
                />
              </Card>
            ) : (
              <FloatingTextInputSkeleton />
            )}
            {pointsError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 8),
                ]}>
                {Labels.pointsError}
              </Text>
            )}
            {!loading ? (
              <CustomDateTimePicker
                disabled={!Boolean(category && subCategory)}
                isDark={themeScheme == 'dark'}
                labelStyle={Styles.dateTimeLabelStyle}
                maximumDate={new Date()}
                onDateChange={selectedValue => {
                  ENV.currentEnvironment == Labels.development &&
                    console.log('DATE SELECTED VALUE::: ', selectedValue);

                  dateError && setDateError(false);

                  setDate(selectedValue);

                  creditCardExpiryError && setCreditCardExpiryError(false);

                  Boolean(props.creditCardExpiry && selectedValue) &&
                    handleCardExpiry(selectedValue);
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
            {Boolean(props.creditCardExpiry) && creditCardExpiryError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 12),
                ]}>
                Sorry! Your credit card has expired on{' '}
                {Helpers.formatDateTime(
                  props.creditCardExpiry,
                  `${Labels.formatMM}/${Labels.formatYY}`,
                  `${Labels.formatMMM}, ${Labels.formatYYYY}`,
                )}
                !
              </Text>
            )}
          </View>
        </ScrollView>

        <Card containerStyle={[Styles.buttonCardContainer]}>
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

        {renderCustomizeModal()}
      </View>
    </Network>
  );
};

const mapStateToProps = state => {
  return {
    creditCardId: state.app.creditCard.creditCardId,
    creditCardExpiry: state.app.creditCard.creditCardExpiry,
    loadingStatus: state.other.loadingStatus,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    spendingCategory: onResponse => {
      dispatch(spendingCategory(onResponse));
    },

    spendingCreate: (requestData, onResponse) => {
      dispatch(spendingCreate(requestData, onResponse));
    },

    spendingCreateSubCategory: (requestData, onResponse) => {
      dispatch(spendingCreateSubCategory(requestData, onResponse));
    },

    spendingSubCategory: (categoryId, onResponse) => {
      dispatch(spendingSubCategory(categoryId, onResponse));
    },

    spendingUpdate: (spendingId, requestData, onResponse) => {
      dispatch(spendingUpdate(spendingId, requestData, onResponse));
    },

    loading: status => {
      dispatch(loadingStatus(status));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Spending);
