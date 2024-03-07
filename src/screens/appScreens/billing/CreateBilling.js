import React, {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, Text, View} from 'react-native';
import {
  billingCategory,
  billingCreateCategory,
  billingGroup,
  billingCreateGroup,
  billingCreate,
  billingSubCategory,
  billingCreateSubCategory,
  billingUpdate,
  billingView,
  loadingStatus,
} from '../../../redux/Root.Actions';
import {connect} from 'react-redux';
import {hideMessage, showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../assets/Index';
import Button from '../../../components/appComponents/Button';
import Card from '../../../containers/Card';
import Colors from '../../../utils/Colors';
import CustomDateTimePicker from '../../../components/appComponents/CustomDateTimePicker';
import CustomFloatingTextInput from '../../../components/appComponents/CustomFloatingTextInput';
import CustomizeModal from '../../../components/appComponents/CustomizeModal';
import Dropdown from '../../../components/appComponents/Dropdown';
import DropdownCard from '../../../components/appComponents/DropdownCard';
import FloatingTextInput from '../../../components/appComponents/FloatingTextInput';
import Labels from '../../../utils/Strings';
import Network from '../../../containers/Network';
import RadioButton from '../../../components/appComponents/RadioButton';
import SkeletonButton from '../../../components/skeletonComponents/SkeletonButton';
import SkeletonCard from '../../../components/skeletonComponents/SkeletonCard';
import SkeletonCustomDateTimePicker from '../../../components/skeletonComponents/SkeletonCustomDateTimePicker';
import SkeletonDropdown from '../../../components/skeletonComponents/SkeletonDropdown';
import SkeletonLabel from '../../../components/skeletonComponents/SkeletonLabel';
import SkeletonSwitch from '../../../components/skeletonComponents/SkeletonSwitch';
import Store from '../../../redux/Store';
import Styles from '../../../styles/appStyles/billing/CreateBilling';
import Switch from '../../../components/appComponents/Switch';
import TimePeriod from '../../../components/appComponents/TimePeriod';
import * as ENV from '../../../../env';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';

const CreateBilling = props => {
  // Props Variables
  const billingId =
    props.route.params && props.route.params.hasOwnProperty('billingId')
      ? props.route.params.billingId
      : null;

  // Billing Variables
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [subCategoryOthers, setSubCategoryOthers] = useState(null);
  const [group, setGroup] = useState(null);
  const [payee, setPayee] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [amount, setAmount] = useState(null);
  const [date, setDate] = useState(null);
  const [recurrence, setRecurrence] = useState(null);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState(null);
  const [recurrenceFrequencyOthersTime, setRecurrenceFrequencyOthersTime] =
    useState(null);
  const [
    recurrenceFrequencyOthersFrequency,
    setRecurrenceFrequencyOthersFrequency,
  ] = useState(null);
  const [notification, setNotification] = useState(false);

  //Error Variables
  const [categoryError, setCategoryError] = useState(false);
  const [subCategoryError, setSubCategoryError] = useState(false);
  const [subCategoryOthersError, setSubCategoryOthersError] = useState(false);
  const [groupError, setGroupError] = useState(false);
  const [payeeError, setPayeeError] = useState(false);
  const [currencyError, setCurrencyError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [amountLabelError, setAmountLabelError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [recurrenceError, setRecurrenceError] = useState(false);
  const [recurrenceFrequencyError, setRecurrenceFrequencyError] =
    useState(false);
  const [
    recurrenceFrequencyOthersTimeError,
    setRecurrenceFrequencyOthersTimeError,
  ] = useState(false);
  const [
    recurrenceFrequencyOthersFrequencyError,
    setRecurrenceFrequencyOthersFrequencyError,
  ] = useState(false);

  // Other Variables
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [customizeFor, setCustomizeFor] = useState(null);
  const [customizeModalStatus, setCustomizeModalStatus] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState(null);
  const [subCategoryOptions, setSubCategoryOptions] = useState(null);
  const [groupOptions, setGroupOptions] = useState(null);
  const [subCategoryOtherVisible, setSubCategoryOtherVisible] = useState(null);

  const currencyOptions = [{label: Labels.rm}, {label: 'SGD'}];

  const noYesOptions = [
    {label: Labels.yes, value: Labels.yes},
    {label: Labels.no, value: Labels.no},
  ];

  const recurrenceOptions = [
    {label: Labels.daily},
    {label: Labels.monthly},
    {label: Labels.weekly},
    {label: Labels.yearly},
    {label: Labels.others},
  ];

  // Theme Variables
  const Theme = useTheme().colors;
  const themeScheme = Helpers.getThemeScheme();

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      Boolean(billingId)
        ? [
            showMessage({
              icon: 'auto',
              message: Labels.fetchingData,
              position: 'bottom',
              type: 'default',
            }),

            setLoading(true),
          ]
        : [billingCategory(), billingGroup()];

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const billingCategory = async customCategoryName => {
    await props.billingCategory(res => {
      const response = res.resJson.data;

      // Uncomment for below lines of custom category creation
      // const customizeObject = {
      //   icon: Assets.customize,
      //   id: Labels.customize,
      //   isDefault: true,
      //   name: Labels.customize,
      // };

      if (Array.isArray(response)) {
        // Uncomment for below line of custom category creation
        // response.push(customizeObject);

        if (Boolean(customCategoryName)) {
          const filteredCategory = response.filter(
            lol => lol.name == customCategoryName,
          );

          filteredCategory.length != 0 && setCategory(filteredCategory[0].id);
        } else {
          setCategory(null);
        }

        setCategoryOptions(response);

        hideMessage();
      } else {
        setCategoryOptions(null);

        hideMessage();
      }
    });
  };

  const billingGroup = async customGroupName => {
    await props.billingGroup(res => {
      const response = res.resJson.data;

      const customizeObject = {
        icon: Assets.customize,
        id: Labels.addNew,
        isDefault: true,
        name: Labels.addNew,
      };

      if (Array.isArray(response)) {
        response.push(customizeObject);

        if (Boolean(customGroupName)) {
          const filteredGroup = response.filter(
            lol => lol.name == customGroupName,
          );

          ENV.currentEnvironment == Labels.development &&
            console.log('FILTERED GROUP::: ', filteredGroup);

          filteredGroup.length != 0 && setGroup(filteredGroup[0].id);
        } else {
          setGroup(null);
        }

        setGroupOptions(response);

        hideMessage();
      } else {
        setGroupOptions(null);

        hideMessage();
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (Boolean(billingId)) {
        billingId && handleEditData();
      } else {
        setTimeout(() => {
          setLoading(false);

          setRefreshing(false);
        }, 1000);
      }
    }, [refreshing == true]),
  );

  const onRefresh = () => {
    setRefreshing(true);

    handleReset();

    Boolean(billingId) &&
      showMessage({
        icon: 'auto',
        message: Labels.fetchingData,
        position: 'bottom',
        type: 'default',
      });

    setLoading(true);
  };

  const handleEditData = () => {
    props.billingView(billingId, res => {
      const response = res.resJson.data.info;
      billingCategory(response.category.name);

      billingSubCategory(
        response.category.id,
        Boolean(response.subcategory) &&
          Object.keys(response.subcategory).length != 0
          ? response.subcategory.name
          : null,
      );

      billingGroup(response.group.name);

      setPayee(response.payee);

      setCurrency(response.currency);

      setAmount(String(response.amount));

      setDate(response.datedOn);

      setRecurrence(response.isReccurening ? Labels.yes : Labels.no);

      setRecurrenceFrequency(response.reccurenceFrequency);

      setRecurrenceFrequencyOthersTime(
        Boolean(response.reccurenceTime)
          ? String(response.reccurenceTime)
          : null,
      );

      setRecurrenceFrequencyOthersFrequency(response.reccurenceTimeFrequency);

      setNotification(response.notify);

      setLoading(false);

      setRefreshing(false);
    });
  };

  const handleReset = () => {
    setCategory(null);
    setSubCategory(null);
    setSubCategoryOthers(null);
    setGroup(null);
    setPayee(null);
    setCurrency(null);
    setAmount(null);
    setDate(null);
    setRecurrence(null);
    setRecurrenceFrequency(null);
    setRecurrenceFrequencyOthersTime(null);
    setRecurrenceFrequencyOthersFrequency(null);
    setNotification(false);
    setCategoryError(false);
    setSubCategoryError(false);
    setSubCategoryOthersError(false);
    setGroupError(false);
    setPayeeError(false);
    setCurrencyError(false);
    setAmountError(false);
    setAmountLabelError(false);
    setDateError(false);
    setRecurrenceError(false);
    setRecurrenceFrequencyError(false);
    setRecurrenceFrequencyOthersTimeError(false);
    setRecurrenceFrequencyOthersFrequencyError(false);
  };

  const handleCategorySelection = selectedValue => {
    setCustomizeFor(Labels.category);

    categoryError && setCategoryError(false);

    const selectedCategory =
      Boolean(selectedValue) && Object.keys(selectedValue).length != 0
        ? selectedValue.id
        : null;

    if (Boolean(selectedCategory) && selectedCategory == Labels.customize) {
      setCategory(selectedCategory);

      setCustomizeModalStatus(!customizeModalStatus);
    } else {
      setCategory(selectedCategory);
    }

    setSubCategory(null);
    setSubCategoryOthers(null);
    setSubCategoryOtherVisible(null);

    Object.keys(selectedValue).length != 0 &&
      billingSubCategory(selectedCategory);
  };

  const billingSubCategory = async (categoryId, customSubCategoryName) => {
    await props.billingSubCategory(categoryId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('BILLING SUB CATEGORY RESPONSE DATA::: ', response);

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

          filteredSubCategory.length != 0 && [
            setSubCategory(filteredSubCategory[0].id),
            setSubCategoryOtherVisible(filteredSubCategory[0].name),
            setSubCategoryOthers(filteredSubCategory[0].name),
          ];
        } else {
          setSubCategory(null);
          setSubCategoryOthers(null);
          setSubCategoryOtherVisible(null);
        }

        setSubCategoryOptions(response);

        hideMessage();
      } else {
        setSubCategoryOptions(null);

        hideMessage();
      }
    });
  };

  const handleSubCategorySelection = selectedValue => {
    setCustomizeFor(Labels.subCategory);

    subCategoryError && setSubCategoryError(false);

    const selectedSubCategory =
      Boolean(selectedValue) && Object.keys(selectedValue).length != 0
        ? selectedValue.id
        : null;

    const selectedSubCategoryOtherVisible =
      Boolean(selectedValue) && Object.keys(selectedValue).length != 0
        ? selectedValue.name
        : null;

    if (
      Boolean(selectedSubCategory) &&
      selectedSubCategory == Labels.customize
    ) {
      setSubCategory(selectedSubCategory);

      setSubCategoryOtherVisible(selectedSubCategoryOtherVisible);

      setCustomizeModalStatus(!customizeModalStatus);
    } else {
      setSubCategory(selectedSubCategory);

      setSubCategoryOtherVisible(selectedSubCategoryOtherVisible);
    }

    setSubCategoryOthers(null);
  };

  const handleGroupSelection = selectedValue => {
    setCustomizeFor(Labels.group);

    groupError && setGroupError(false);

    const selectedGroup =
      Boolean(selectedValue) && Object.keys(selectedValue).length != 0
        ? selectedValue.id
        : null;

    if (Boolean(selectedGroup) && selectedGroup == Labels.addNew) {
      setGroup(selectedGroup);

      setCustomizeModalStatus(!customizeModalStatus);
    } else {
      setGroup(selectedGroup);
    }
  };

  const LabelSkeleton = ({height = 18, style = {}}) => {
    return <SkeletonLabel height={height} style={style} />;
  };

  const DropdownSkeleton = () => {
    return <SkeletonDropdown textWidth={Helpers.windowWidth * 0.25} />;
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

  const DateTimePickerInputSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonCustomDateTimePicker />
      </View>
    );
  };

  const RadioButtonSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonCard />
      </View>
    );
  };

  const SwitchSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonSwitch />
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
    if (checkCreateBilling()) {
      Store.dispatch(loadingStatus(true));

      const requestData = handleRequestData();

      ENV.currentEnvironment == Labels.development &&
        console.log('BILLING CREATE ACCOUNT REQUEST DATA::: ', requestData);

      if (Boolean(billingId)) {
        props.billingUpdate(billingId, requestData, res => {
          props.navigation.navigate('BillingClaim');
        });
      } else {
        props.billingCreate(requestData, res => {
          props.navigation.goBack();
        });
      }
    } else {
      handleErrorValidation();
    }
  };

  const checkCreateBilling = () => {
    const subCategoryOthersCheck =
      Boolean(subCategory) &&
      subCategoryOtherVisible.toLowerCase() == Labels.others.toLowerCase()
        ? Boolean(subCategoryOthers)
        : true;

    const recurrenceFrequencyOthersFrequencyCheck =
      Boolean(recurrenceFrequency) &&
      recurrenceFrequency.toLowerCase() == Labels.others.toLowerCase()
        ? Boolean(recurrenceFrequencyOthersFrequency)
        : true;

    const recurrenceFrequencyOthersTimeCheck =
      Boolean(recurrenceFrequency) &&
      recurrenceFrequency.toLowerCase() == Labels.others.toLowerCase()
        ? Helpers.checkField(recurrenceFrequencyOthersTime)
        : true;

    const recurrenceFrequencyCheck =
      Boolean(recurrence) && recurrence == Labels.yes
        ? Boolean(recurrenceFrequency)
        : true;

    if (
      Boolean(category) &&
      Boolean(subCategory) &&
      Boolean(subCategoryOthersCheck) &&
      Boolean(group) &&
      Helpers.checkField(payee) &&
      Boolean(currency) &&
      Helpers.checkField(amount) &&
      Helpers.checkZero(amount) &&
      Boolean(date) &&
      Boolean(recurrence) &&
      Boolean(recurrenceFrequencyCheck) &&
      Boolean(recurrenceFrequencyOthersFrequencyCheck) &&
      Boolean(recurrenceFrequencyOthersTimeCheck)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleRequestData = () => {
    let requestData = {};

    requestData = {
      payee: payee,
      amount: Number(amount),
      currency: currency,
      notify: notification,
      datedOn: date,
      isReccurening: recurrence == Labels.yes ? true : false,
      reccurenceFrequency: recurrenceFrequency,
      reccurenceTime: recurrenceFrequencyOthersTime,
      reccurenceTimeFrequency: recurrenceFrequencyOthersFrequency,
      category: {
        _id: category,
      },
      subcategory: {
        _id: subCategory,
      },
      group: {
        _id: group,
      },
    };

    Boolean(subCategoryOtherVisible) &&
      subCategoryOtherVisible.toLowerCase() == Labels.others.toLowerCase() && [
        (requestData = {
          ...requestData,
          subcategoryOther: subCategoryOthers,
        }),
      ];

    return requestData;
  };

  const handleErrorValidation = () => {
    setCategoryError(Boolean(category ? false : true));

    setSubCategoryError(Boolean(subCategory) ? false : true);

    setSubCategoryOthersError(
      Boolean(subCategory) &&
        subCategoryOtherVisible.toLowerCase() == Labels.others.toLowerCase()
        ? Boolean(subCategoryOthers)
          ? false
          : true
        : false,
    );

    setGroupError(Boolean(group) ? false : true);

    setPayeeError(Helpers.checkField(payee) ? false : true);

    setCurrencyError(Boolean(currency) ? false : true);

    Helpers.checkField(amount)
      ? setAmountLabelError(Helpers.checkZero(amount) ? false : true)
      : setAmountError(Helpers.checkField(amount) ? false : true);

    setDateError(Boolean(date) ? false : true);

    setRecurrenceError(Boolean(recurrence) ? false : true);

    Boolean(recurrence) &&
      recurrence == Labels.yes && [
        setRecurrenceFrequencyError(
          Boolean(recurrenceFrequency) ? false : true,
        ),

        Boolean(recurrenceFrequency) &&
          recurrenceFrequency == Labels.others && [
            setRecurrenceFrequencyOthersTimeError(
              Helpers.checkField(recurrenceFrequencyOthersTime) ? false : true,
            ),

            setRecurrenceFrequencyOthersFrequencyError(
              Boolean(recurrenceFrequencyOthersFrequency) ? false : true,
            ),
          ],
      ];
  };

  const renderCustomizeModal = () => {
    return (
      <CustomizeModal
        label={customizeFor}
        onBack={() => {
          setCustomizeModalStatus(!customizeModalStatus);

          switch (customizeFor) {
            case Labels.category:
              setCategory(null);

              setCustomizeFor(null);
              break;

            case Labels.group:
              setGroup(null);

              setCustomizeFor(null);
              break;

            case Labels.subCategory:
              setSubCategoryError(false);
              setSubCategoryOthersError(false);

              setSubCategory(null);
              setSubCategoryOthers(null);
              setSubCategoryOtherVisible(null);

              setCustomizeFor(null);
              break;

            default:
              setCustomizeFor(null);
          }
        }}
        onConfirm={txt => {
          ENV.currentEnvironment == Labels.development &&
            console.log('BILLING CUSTOMIZE MODAL TXT::: ', txt);

          switch (customizeFor) {
            case Labels.category:
              const filteredCategory = categoryOptions.filter(
                lol => lol.name == txt,
              );

              ENV.currentEnvironment == Labels.development &&
                console.log(
                  'CATEGORY CUSTOMIZE MODAL TXT::: ',
                  filteredCategory,
                );

              if (filteredCategory.length != 0) {
                setCategory(filteredCategory[0].id);
              } else {
                billingCreateCategory(txt);
              }

              setCustomizeFor(null);
              break;

            case Labels.group:
              const filteredGroup = groupOptions.filter(lol => lol.name == txt);

              ENV.currentEnvironment == Labels.development &&
                console.log('GROUP CUSTOMIZE MODAL TXT::: ', filteredGroup);

              if (filteredGroup.length != 0) {
                setGroup(filteredGroup[0].id);
              } else {
                billingCreateGroup(txt);
              }
              setCustomizeFor(null);
              break;

            case Labels.subCategory:
              ENV.currentEnvironment == Labels.development &&
                console.log(
                  'BILLING SUB CATEGORY CUSTOMIZE MODAL TXT::: ',
                  txt,
                );

              const filteredSubCategory = subCategoryOptions.filter(
                lol => lol.name == txt,
              );

              if (filteredSubCategory.length != 0) {
                setSubCategory(filteredSubCategory[0].id);

                setSubCategoryOthers(filteredSubCategory[0].name);
              } else {
                billingCreateSubCategory(txt);
              }

              setCustomizeFor(null);
              break;

            default:
              setCustomizeFor(null);
          }
        }}
        onRequestClose={() => {
          setCustomizeModalStatus(!customizeModalStatus);
        }}
        visible={customizeModalStatus}
      />
    );
  };

  const billingCreateCategory = customCategoryName => {
    const requestData = {
      name: customCategoryName,
    };

    props.billingCreateCategory(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('BILLING CREATE CATEGORY RESPONSE DATA::: ', response);

      showMessage({
        icon: 'auto',
        message: Labels.fetchingCreatedCategoryData,
        position: 'bottom',
        type: 'default',
      });

      billingCategory(customCategoryName);
    });
  };

  const billingCreateGroup = customeGroupName => {
    const requestData = {
      name: customeGroupName,
    };

    props.billingCreateGroup(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('BILLING CREATE GROUP RESPONSE DATA::: ', response);

      showMessage({
        icon: 'auto',
        message: Labels.fetchingCreatedGroupData,
        position: 'bottom',
        type: 'default',
      });

      billingGroup(customeGroupName);
    });
  };

  const billingCreateSubCategory = customSubCategoryName => {
    const requestData = {
      category: {_id: category},
      icon: null,
      name: customSubCategoryName,
    };

    props.billingCreateSubCategory(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('BILLING CREATE SUB CATEGORY RESPONSE DATA::: ', response);

      showMessage({
        icon: 'auto',
        message: Labels.fetchingCreatedSubCategoryData,
        position: 'bottom',
        type: 'default',
      });

      billingSubCategory(category, customSubCategoryName);
    });
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
                {Labels.createAnBilling}
              </Text>
            ) : (
              <LabelSkeleton height={16} />
            )}
            <View style={Styles.createBillingContainer}>
              <View style={Styles.createBillingCategoryContainer}>
                {!loading ? (
                  <>
                    <Dropdown
                      label={Labels.category}
                      labelTextStyle={HelperStyles.justView(
                        'color',
                        Colors.lightText,
                      )}
                      modalHeaderLabel={Labels.billingCategory}
                      onValueChange={selectedValue => {
                        ENV.currentEnvironment == Labels.development &&
                          console.log(
                            'ACCOUNT TYPE FOR SELECTED VALUE::: ',
                            selectedValue,
                          );

                        handleCategorySelection(selectedValue);
                      }}
                      optionImageKey={'icon'}
                      optionLabelKey={'name'}
                      options={categoryOptions}
                      optionValueKey={'id'}
                      value={category}
                      searchEnabled={true}
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
                    {!categoryError && subCategoryError && (
                      <Text
                        style={[
                          HelperStyles.errorText,
                          HelperStyles.justView('marginHorizontal', 0),
                        ]}
                      />
                    )}
                  </>
                ) : (
                  <DropdownSkeleton />
                )}
              </View>
              <View style={Styles.createBillingSubCategoryContainer}>
                {!loading ? (
                  <>
                    <Dropdown
                      disabled={!Boolean(category)}
                      label={Labels.subCategory}
                      labelTextStyle={HelperStyles.justView(
                        'color',
                        Colors.lightText,
                      )}
                      modalHeaderLabel={Labels.billingSubCategory}
                      onValueChange={selectedValue => {
                        ENV.currentEnvironment == Labels.development &&
                          console.log(
                            'SUB CATEGORY SELECTED VALUE::: ',
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
                    {!subCategoryError && categoryError && (
                      <Text
                        style={[
                          HelperStyles.errorText,
                          HelperStyles.justView('marginHorizontal', 0),
                        ]}
                      />
                    )}
                  </>
                ) : (
                  <DropdownSkeleton />
                )}
              </View>
            </View>
            {Boolean(subCategory) &&
              Boolean(subCategoryOtherVisible) &&
              subCategoryOtherVisible.toLowerCase() ==
                Labels.others.toLowerCase() && (
                <CustomFloatingTextInput
                  autoCapitalize={'sentences'}
                  cardContainerStyle={Styles.floatingTextInputCardContainer}
                  editable={Boolean(category && subCategory)}
                  errorLabel={Labels.othersError}
                  errorStatus={subCategoryOthersError}
                  errorTextStyle={HelperStyles.justView('marginHorizontal', 12)}
                  onChangeText={txt => {
                    ENV.currentEnvironment == Labels.development &&
                      console.log('SUB CATEGORY OTHERS TXT::: ', txt);

                    subCategoryOthersError && setSubCategoryOthersError(false);

                    setSubCategoryOthers(txt);
                  }}
                  textInputContainerStyle={Styles.floatingTextInputContainer}
                  textInputLabelStyle={Styles.floatingTextInputLabel}
                  textInputStyle={Styles.floatingTextInput}
                  title={Labels.others}
                  value={subCategoryOthers}
                />
              )}
            <View style={HelperStyles.margin(0, 8)}>
              {!loading ? (
                <DropdownCard
                  disabled={!Boolean(category && subCategory)}
                  floatLabel={Labels.billingAddOrSelectGroup}
                  label={Labels.billingAddOrSelectGroup}
                  onValueChange={selectedValue => {
                    ENV.currentEnvironment == Labels.development &&
                      console.log('GROUP SELECTED VALUE::: ', selectedValue);

                    handleGroupSelection(selectedValue);
                  }}
                  optionLabelKey={'name'}
                  options={groupOptions}
                  optionValueKey={'id'}
                  value={group}
                />
              ) : (
                <DropdownCardSkeleton />
              )}
              {groupError && (
                <Text
                  style={[
                    HelperStyles.errorText,
                    HelperStyles.justView('marginHorizontal', 8),
                  ]}>
                  {Labels.groupError}
                </Text>
              )}
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
                    title={Labels.billingPayee}
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
                    HelperStyles.justView('marginHorizontal', 8),
                  ]}>
                  {Labels.payeeError}
                </Text>
              )}
              {!loading ? (
                <DropdownCard
                  disabled={!Boolean(category && subCategory)}
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
                    editable={Boolean(category && subCategory)}
                    isDecimal={true}
                    keyboardType={'number-pad'}
                    textContentType={'none'}
                    textInputContainerStyle={Styles.floatingTextInputContainer}
                    textInputLabelStyle={Styles.floatingTextInputLabel}
                    textInputStyle={Styles.floatingTextInput}
                    title={Labels.amount}
                    updateMasterState={txt => {
                      amountError && setAmountError(false);

                      amountLabelError && setAmountLabelError(false);

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
              {amountLabelError && (
                <Text
                  style={[
                    HelperStyles.errorText,
                    HelperStyles.justView('marginHorizontal', 8),
                  ]}>
                  {Labels.zeroError}
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
              {!loading ? (
                <RadioButton
                  disabled={!Boolean(category && subCategory)}
                  label={Labels.recurrence}
                  onValueChange={selectedValue => {
                    ENV.currentEnvironment == Labels.development &&
                      console.log(
                        'RECURRENCE SELECTED VALUE::: ',
                        selectedValue,
                      );

                    recurrenceError && setRecurrenceError(false);

                    setRecurrenceFrequencyError(false);

                    setRecurrence(selectedValue);

                    setRecurrenceFrequency(null);
                    setRecurrenceFrequencyOthersTime(null);
                  }}
                  options={noYesOptions}
                  optionLabelKey={'label'}
                  optionValueKey={'value'}
                  value={recurrence}
                />
              ) : (
                <RadioButtonSkeleton />
              )}
              {recurrenceError && (
                <Text
                  style={[
                    HelperStyles.errorText,
                    HelperStyles.justView('marginHorizontal', 12),
                  ]}>
                  {Labels.recurrenceError}
                </Text>
              )}
              {Boolean(recurrence) && recurrence == Labels.yes && (
                <>
                  {!loading ? (
                    <DropdownCard
                      disabled={!Boolean(category && subCategory)}
                      label={Labels.recurrenceFrequency}
                      labelContainerStyle={
                        Styles.dropdownCardLabelContainerStyle
                      }
                      onValueChange={selectedValue => {
                        ENV.currentEnvironment == Labels.development &&
                          console.log(
                            'RECURRENCE FREQUENCY SELECTED VALUE::: ',
                            selectedValue,
                          );

                        recurrenceFrequencyError &&
                          setRecurrenceFrequencyError(false);

                        setRecurrenceFrequency(
                          Boolean(selectedValue) &&
                            Object.keys(selectedValue).length != 0
                            ? selectedValue.label
                            : null,
                        );

                        setRecurrenceFrequencyOthersTime(null);
                        setRecurrenceFrequencyOthersFrequency(null);
                        setRecurrenceFrequencyOthersTimeError(false);
                        setRecurrenceFrequencyOthersFrequencyError(false);
                      }}
                      optionLabelKey={'label'}
                      options={recurrenceOptions}
                      optionValueKey={'label'}
                      searchEnabled={false}
                      value={recurrenceFrequency}
                    />
                  ) : (
                    <DropdownCardSkeleton />
                  )}
                  {recurrenceFrequencyError && (
                    <Text
                      style={[
                        HelperStyles.errorText,
                        HelperStyles.justView('marginHorizontal', 12),
                      ]}>
                      {Labels.recurrenceFrequencyError}
                    </Text>
                  )}
                  {Boolean(recurrenceFrequency) &&
                    recurrenceFrequency.toLowerCase() ==
                      Labels.others.toLowerCase() && (
                      <>
                        {!loading ? (
                          <TimePeriod
                            disabled={!Boolean(category && subCategory)}
                            dropDownCardErrorStatus={
                              recurrenceFrequencyOthersFrequencyError
                            }
                            onChangeText={txt => {
                              ENV.currentEnvironment == Labels.development &&
                                console.log(
                                  'RECURRENCE OTHERS TIME TXT::: ',
                                  txt,
                                );

                              recurrenceFrequencyOthersTimeError &&
                                setRecurrenceFrequencyOthersTimeError(false);

                              setRecurrenceFrequencyOthersTime(txt);
                            }}
                            onValueChange={selectedValue => {
                              ENV.currentEnvironment == Labels.development &&
                                console.log(
                                  'RECURRENCE OTHERS FREQUENCY SELECTED VALUE::: ',
                                  selectedValue,
                                );

                              recurrenceFrequencyOthersFrequencyError &&
                                setRecurrenceFrequencyOthersFrequencyError(
                                  false,
                                );

                              setRecurrenceFrequencyOthersFrequency(
                                selectedValue,
                              );
                            }}
                            textInputValue={recurrenceFrequencyOthersTime}
                            dropDownCardValue={
                              recurrenceFrequencyOthersFrequency
                            }
                            textInputErrorStatus={
                              recurrenceFrequencyOthersTimeError
                            }
                          />
                        ) : (
                          <DropdownCardSkeleton />
                        )}
                      </>
                    )}
                </>
              )}
              {!loading ? (
                <Switch
                  disabled={!Boolean(category && subCategory)}
                  containerStyle={HelperStyles.margin(0, 8)}
                  label={Labels.notification}
                  onValueChange={() => {
                    setNotification(!notification);
                  }}
                  value={notification}
                />
              ) : (
                <SwitchSkeleton />
              )}
            </View>
          </View>
        </ScrollView>

        <Card containerStyle={Styles.buttonCardContainer}>
          {!loading ? (
            <Button
              containerStyle={Styles.buttonContainer}
              label={Labels.done}
              loading={props.loadingStatus}
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
    loadingStatus: state.other.loadingStatus,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    billingCategory: onResponse => {
      dispatch(billingCategory(onResponse));
    },

    billingCreate: (requestData, onResponse) => {
      dispatch(billingCreate(requestData, onResponse));
    },

    billingGroup: onResponse => {
      dispatch(billingGroup(onResponse));
    },

    billingCreateCategory: (requestData, onResponse) => {
      dispatch(billingCreateCategory(requestData, onResponse));
    },

    billingCreateGroup: (requestData, onResponse) => {
      dispatch(billingCreateGroup(requestData, onResponse));
    },

    billingCreateSubCategory: (requestData, onResponse) => {
      dispatch(billingCreateSubCategory(requestData, onResponse));
    },

    billingSubCategory: (categoryId, onResponse) => {
      dispatch(billingSubCategory(categoryId, onResponse));
    },

    billingUpdate: (billingId, requestData, onResponse) => {
      dispatch(billingUpdate(billingId, requestData, onResponse));
    },

    billingView: (billingId, onResponse) => {
      dispatch(billingView(billingId, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateBilling);
