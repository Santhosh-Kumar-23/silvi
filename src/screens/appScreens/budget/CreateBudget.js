import React, {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, Text, View} from 'react-native';
import {
  budgetCategory,
  budgetCreate,
  budgetCreateCategory,
  budgetCreateGroup,
  budgetGroup,
  budgetSubCategory,
  budgetCreateSubCategory,
  budgetUpdate,
  budgetView,
  loadingStatus,
} from '../../../redux/Root.Actions';
import {connect} from 'react-redux';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {hideMessage, showMessage} from 'react-native-flash-message';
import Assets from '../../../assets/Index';
import Button from '../../../components/appComponents/Button';
import Card from '../../../containers/Card';
import Colors from '../../../utils/Colors';
import CustomFloatingTextInput from '../../../components/appComponents/CustomFloatingTextInput';
import CustomizeModal from '../../../components/appComponents/CustomizeModal';
import Dropdown from '../../../components/appComponents/Dropdown';
import DropdownCard from '../../../components/appComponents/DropdownCard';
import FloatingTextInput from '../../../components/appComponents/FloatingTextInput';
import Labels from '../../../utils/Strings';
import Network from '../../../containers/Network';
import SkeletonButton from '../../../components/skeletonComponents/SkeletonButton';
import SkeletonCard from '../../../components/skeletonComponents/SkeletonCard';
import SkeletonDropdown from '../../../components/skeletonComponents/SkeletonDropdown';
import SkeletonLabel from '../../../components/skeletonComponents/SkeletonLabel';
import SkeletonSwitch from '../../../components/skeletonComponents/SkeletonSwitch';
import Store from '../../../redux/Store';
import Styles from '../../../styles/appStyles/budget/CreateBudget';
import Switch from '../../../components/appComponents/Switch';
import * as ENV from '../../../../env';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';

const CreateBudget = props => {
  // Props Variables
  const budgetId =
    props.route.params && props.route.params.hasOwnProperty('budgetId')
      ? props.route.params.budgetId
      : null;

  // CreateBudget Variables
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [subCategoryOthers, setSubCategoryOthers] = useState(null);
  const [group, setGroup] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [amount, setAmount] = useState(null);
  const [notification, setNotification] = useState(false);

  // Error Variables
  const [categoryError, setCategoryError] = useState(false);
  const [subCategoryError, setSubCategoryError] = useState(false);
  const [subCategoryOthersError, setSubCategoryOthersError] = useState(false);
  const [groupError, setGroupError] = useState(false);
  const [currencyError, setCurrencyError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [amountZeroError, setAmounZeroError] = useState(false);

  // Other Variables
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [customizeModalStatus, setCustomizeModalStatus] = useState(false);
  const [customizeFor, setCustomizeFor] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState(null);
  const [subCategoryOptions, setSubCategoryOptions] = useState(null);
  const [groupOptions, setGroupOptions] = useState(null);
  const [subCategoryOtherVisible, setSubCategoryOtherVisible] = useState(null);

  const currencyOptions = [{label: Labels.rm}, {label: 'SGD'}];

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      Boolean(budgetId)
        ? [
            showMessage({
              icon: 'auto',
              message: Labels.fetchingData,
              position: 'bottom',
              type: 'default',
            }),

            setLoading(true),
          ]
        : [budgetCategory(), budgetGroup()];

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const budgetCategory = async customCategoryName => {
    await props.budgetCategory(res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('BUDGET CATEGORY RESPONSE DATA::: ', response);

      // Uncomment for below lines of custom budget creation
      // const customizeObject = {
      //   icon: Assets.customize,
      //   id: Labels.customize,
      //   isDefault: true,
      //   name: Labels.customize,
      // };

      if (Array.isArray(response)) {
        // Uncomment for below lines of custom budget creation
        // response.push(customizeObject);

        if (Boolean(customCategoryName)) {
          const filteredCategory = response.filter(
            lol => lol.name == customCategoryName,
          );

          ENV.currentEnvironment == Labels.development &&
            console.log('FILTERED CATEGORY::: ', filteredCategory);

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

  const budgetGroup = async customGroupName => {
    await props.budgetGroup(res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('BUDGET GROUP RESPONSE DATA::: ', response);

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
      if (Boolean(budgetId)) {
        budgetId && handleEditData();
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

    Boolean(budgetId) &&
      showMessage({
        icon: 'auto',
        message: Labels.fetchingData,
        position: 'bottom',
        type: 'default',
      });

    setLoading(true);
  };

  const handleEditData = () => {
    props.budgetView(budgetId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('BUDGET VIEW RESPONSE DATA::: ', response);

      budgetCategory(response.category.name);

      budgetSubCategory(
        response.category.id,
        Boolean(response.subcategory) &&
          Object.keys(response.subcategory).length != 0
          ? response.subcategory.name
          : null,
      );

      setSubCategoryOthers(response.subcategoryOther || null);

      setSubCategoryOtherVisible(
        Boolean(response.subcategory) &&
          Object.keys(response.subcategory).length != 0
          ? response.subcategory.name
          : null,
      );

      budgetGroup(response.group.name);

      setCurrency(response.currency);

      setAmount(String(response.amount));

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
    setCurrency(null);
    setAmount(null);
    setNotification(false);
    setCategoryError(false);
    setSubCategoryError(false);
    setSubCategoryOthersError(false);
    setGroupError(false);
    setCurrencyError(false);
    setAmountError(false);
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
      budgetSubCategory(selectedCategory);
  };

  const budgetSubCategory = async (categoryId, customSubCategoryName) => {
    await props.budgetSubCategory(categoryId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('BUDGET SUB CATEGORY RESPONSE DATA::: ', response);

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

  const FloatingTextInputSkeleton = () => {
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

  const handleConfirm = () => {
    if (checkCreateBudget()) {
      Store.dispatch(loadingStatus(true));

      const requestData = handleRequestData();

      ENV.currentEnvironment == Labels.development &&
        console.log('BUDGET CREATE ACCOUNT REQUEST DATA::: ', requestData);

      if (Boolean(budgetId)) {
        props.budgetUpdate(budgetId, requestData, res => {
          const response = res.resJson.data;

          ENV.currentEnvironment == Labels.development &&
            console.log('BUDGET UPDATE ACCOUNT RESPONSE DATA::: ', response);

          props.navigation.navigate('Budget');
        });
      } else {
        props.budgetCreate(requestData, res => {
          const response = res.resJson.data;

          ENV.currentEnvironment == Labels.development &&
            console.log('BUDGET CREATE ACCOUNT RESPONSE DATA::: ', response);

          props.navigation.goBack();
        });
      }
    } else {
      handleErrorValidation();
    }
  };

  const checkCreateBudget = () => {
    const subCategoryOthersCheck =
      Boolean(subCategory) &&
      subCategoryOtherVisible.toLowerCase() == Labels.others.toLowerCase()
        ? Boolean(subCategoryOthers)
        : true;

    if (
      Boolean(category) &&
      Boolean(subCategory) &&
      Boolean(subCategoryOthersCheck) &&
      Boolean(group) &&
      Helpers.checkField(amount) &&
      Helpers.checkZero(amount) &&
      Boolean(currency)
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
      currency: currency,
      amount: Number(amount),
      notify: notification,
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
    setCategoryError(Boolean(category) ? false : true);
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
    Helpers.checkField(amount)
      ? setAmounZeroError(Helpers.checkZero(amount) ? false : true)
      : setAmountError(Helpers.checkField(amount) ? false : true);
    setCurrencyError(Boolean(currency) ? false : true);
  };

  const renderCustomizeModal = () => {
    return (
      <CustomizeModal
        label={customizeFor}
        onBack={() => {
          setCustomizeModalStatus(!customizeModalStatus);

          switch (customizeFor) {
            case Labels.category:
              setCategoryError(false);

              setCategory(null);

              setCustomizeFor(null);
              break;

            case Labels.group:
              setGroupError(false);

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
              break;
          }
        }}
        onConfirm={txt => {
          switch (customizeFor) {
            case Labels.category:
              ENV.currentEnvironment == Labels.development &&
                console.log('BUDGET CATEGORY CUSTOMIZE MODAL TXT::: ', txt);

              const filteredCategory = categoryOptions.filter(
                lol => lol.name == txt,
              );

              if (filteredCategory.length != 0) {
                setCategory(filteredCategory[0].id);
              } else {
                budgetCreateCategory(txt);
              }

              setCustomizeFor(null);
              break;

            case Labels.group:
              ENV.currentEnvironment == Labels.development &&
                console.log('BUDGET GROUP CUSTOMIZE MODAL TXT::: ', txt);

              const filteredGroups = groupOptions.filter(
                lol => lol.name == txt,
              );

              if (filteredGroups.length != 0) {
                setGroup(filteredGroups[0].id);
              } else {
                budgetCreateGroup(txt);
              }

              setCustomizeFor(null);
              break;

            case Labels.subCategory:
              ENV.currentEnvironment == Labels.development &&
                console.log('BUDGET SUB CATEGORY CUSTOMIZE MODAL TXT::: ', txt);

              const filteredSubCategory = subCategoryOptions.filter(
                lol => lol.name == txt,
              );

              if (filteredSubCategory.length != 0) {
                setSubCategory(filteredSubCategory[0].id);

                setSubCategoryOthers(filteredSubCategory[0].name);
              } else {
                budgetCreateSubCategory(txt);
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

  const budgetCreateCategory = customCategoryName => {
    const requestData = {
      name: customCategoryName,
    };

    props.budgetCreateCategory(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('BUDGET CREATE CATEGORY RESPONSE DATA::: ', response);

      showMessage({
        icon: 'auto',
        message: Labels.fetchingCreatedCategoryData,
        position: 'bottom',
        type: 'default',
      });

      budgetCategory(customCategoryName);
    });
  };

  const budgetCreateGroup = customGroupName => {
    const requestData = {
      name: customGroupName,
    };

    props.budgetCreateGroup(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('BUDGET CREATE GROUP RESPONSE DATA::: ', response);

      showMessage({
        icon: 'auto',
        message: Labels.fetchingCreatedGroupData,
        position: 'bottom',
        type: 'default',
      });

      budgetGroup(customGroupName);
    });
  };

  const budgetCreateSubCategory = customSubCategoryName => {
    const requestData = {
      category: {_id: category},
      icon: null,
      name: customSubCategoryName,
    };

    props.budgetCreateSubCategory(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('BUDGET CREATE SUB CATEGORY RESPONSE DATA::: ', response);

      showMessage({
        icon: 'auto',
        message: Labels.fetchingCreatedSubCategoryData,
        position: 'bottom',
        type: 'default',
      });

      budgetSubCategory(category, customSubCategoryName);
    });
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
                {Labels.createAnBudget}
              </Text>
            ) : (
              <LabelSkeleton height={16} />
            )}
            <View style={Styles.createBudgetContainer}>
              <View style={Styles.createBudgetCategoryContainer}>
                {!loading ? (
                  <>
                    <Dropdown
                      label={Labels.category}
                      labelTextStyle={HelperStyles.justView(
                        'color',
                        Colors.lightText,
                      )}
                      modalHeaderLabel={Labels.budgetCategory}
                      onValueChange={selectedValue => {
                        ENV.currentEnvironment == Labels.development &&
                          console.log(
                            'CATEGORY SELECTED VALUE::: ',
                            selectedValue,
                          );

                        handleCategorySelection(selectedValue);
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
              <View style={Styles.createBudgetSubCategoryContainer}>
                {!loading ? (
                  <>
                    <Dropdown
                      disabled={!Boolean(category)}
                      label={Labels.subCategory}
                      labelTextStyle={HelperStyles.justView(
                        'color',
                        Colors.lightText,
                      )}
                      modalHeaderLabel={Labels.budgetSubCategory}
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
                  floatLabel={Labels.addOrSelectGroup}
                  label={Labels.addOrSelectGroup}
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

                      amountZeroError && setAmounZeroError(false);

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
              {amountZeroError && (
                <Text
                  style={[
                    HelperStyles.errorText,
                    HelperStyles.justView('marginHorizontal', 8),
                  ]}>
                  {Labels.zeroError}
                </Text>
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
    budgetCategory: onResponse => {
      dispatch(budgetCategory(onResponse));
    },

    budgetCreate: (requestData, onResponse) => {
      dispatch(budgetCreate(requestData, onResponse));
    },

    budgetCreateCategory: (requestData, onResponse) => {
      dispatch(budgetCreateCategory(requestData, onResponse));
    },

    budgetCreateGroup: (requestData, onResponse) => {
      dispatch(budgetCreateGroup(requestData, onResponse));
    },

    budgetCreateSubCategory: (requestData, onResponse) => {
      dispatch(budgetCreateSubCategory(requestData, onResponse));
    },

    budgetGroup: onResponse => {
      dispatch(budgetGroup(onResponse));
    },

    budgetSubCategory: (categoryId, onResponse) => {
      dispatch(budgetSubCategory(categoryId, onResponse));
    },

    budgetUpdate: (budgetId, requestData, onResponse) => {
      dispatch(budgetUpdate(budgetId, requestData, onResponse));
    },

    budgetView: (budgetId, onResponse) => {
      dispatch(budgetView(budgetId, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateBudget);
