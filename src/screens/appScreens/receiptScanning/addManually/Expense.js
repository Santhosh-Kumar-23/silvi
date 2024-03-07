import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  expenseBank,
  expenseCategory,
  expenseCreate,
  expenseCreateGroup,
  expenseCreateSubCategory,
  expenseGroup,
  expenseSubCategory,
  expenseUpdate,
  expenseView,
  fileUpload,
  loadingStatus,
  routingName,
  storeAccountViewOffset,
  storeCreditCardViewOffset,
} from '../../../../redux/Root.Actions';
import {connect} from 'react-redux';
import {hideMessage, showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../../assets/Index';
import Button from '../../../../components/appComponents/Button';
import Card from '../../../../containers/Card';
import Colors from '../../../../utils/Colors';
import CreateBalance from '../../../../components/appComponents/CreateBalance';
import CustomDateTimePicker from '../../../../components/appComponents/CustomDateTimePicker';
import CustomFloatingTextInput from '../../../../components/appComponents/CustomFloatingTextInput';
import CustomizeModal from '../../../../components/appComponents/CustomizeModal';
import Dropdown from '../../../../components/appComponents/Dropdown';
import DropdownCard from '../../../../components/appComponents/DropdownCard';
import FloatingTextInput from '../../../../components/appComponents/FloatingTextInput';
import ImagePicker from '../../../../components/appComponents/ImagePicker';
import Labels from '../../../../utils/Strings';
import moment from 'moment';
import Network from '../../../../containers/Network';
import RadioButton from '../../../../components/appComponents/RadioButton';
import SkeletonButton from '../../../../components/skeletonComponents/SkeletonButton';
import SkeletonCard from '../../../../components/skeletonComponents/SkeletonCard';
import SkeletonCustomDateTimePicker from '../../../../components/skeletonComponents/SkeletonCustomDateTimePicker';
import SkeletonDropdown from '../../../../components/skeletonComponents/SkeletonDropdown';
import SkeletonLabel from '../../../../components/skeletonComponents/SkeletonLabel';
import SkeletonPlaceholder from '../../../../containers/SkeletonPlaceholder';
import SkeletonSwitch from '../../../../components/skeletonComponents/SkeletonSwitch';
import Store from '../../../../redux/Store';
import Styles from '../../../../styles/appStyles/receiptScanning/addManually/Expense';
import Switch from '../../../../components/appComponents/Switch';
import TimePeriod from '../../../../components/appComponents/TimePeriod';
import * as ENV from '../../../../../env';
import * as Helpers from '../../../../utils/Helpers';
import * as HelperStyles from '../../../../utils/HelperStyles';

const Expense = props => {
  // Props variables
  const expenseId =
    props.route.params && props.route.params.hasOwnProperty('expenseId')
      ? props.route.params.expenseId
      : null;

  // Expense Variables
  const [madePaymentForCategory, setMadePaymentForCategory] = useState(null);
  const [madePaymentForSubCategory, setMadePaymentForSubCategory] =
    useState(null);
  const [madePaymentForSubCategoryOthers, setMadePaymentForSubCategoryOthers] =
    useState(null);
  const [claimableExpense, setClaimableExpense] = useState(false);
  const [group, setGroup] = useState(null);
  const [payee, setPayee] = useState(null);
  const [madePaymentVia, setMadePaymentVia] = useState(null);
  const [creditCard, setCreditCard] = useState(null);
  const [creditCardExpiry, setCreditCardExpiry] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [date, setDate] = useState(null);
  const [recurrence, setRecurrence] = useState(null);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState(null);
  const [recurrenceFrequencyOthersTime, setRecurrenceFrequencyOthersTime] =
    useState(null);
  const [
    recurrenceFrequencyOthersFrequency,
    setRecurrenceFrequencyOthersFrequency,
  ] = useState(null);
  const [expenseDetailStatus, setExpenseDetailStatus] = useState(false);
  const [itemCategory, setItemCategory] = useState([]);
  const [itemSubCategoryTotal, setItemSubCategoryTotal] = useState(null);
  const [notes, setNotes] = useState(null);
  const [imagePickerModalStatus, setImagePickerModalStatus] = useState(false);
  const [attachment, setAttachment] = useState(null);

  // Error Variables
  const [madePaymentForCategoryError, setMadePaymentForCategoryError] =
    useState(false);
  const [madePaymentForSubCategoryError, setMadePaymentForSubCategoryError] =
    useState(false);
  const [
    madePaymentForSubCategoryOthersError,
    setMadePaymentForSubCategoryOthersError,
  ] = useState(false);
  const [groupError, setGroupError] = useState(false);
  const [payeeError, setPayeeError] = useState(false);
  const [madePaymentViaError, setMadePaymentViaError] = useState(false);
  const [creditCardError, setCreditCardError] = useState(false);
  const [creditCardExpiryError, setCreditCardExpiryError] = useState(false);
  const [totalAmountError, setTotalAmountError] = useState(false);
  const [amountZeroError, setAmounZeroError] = useState(false);
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
  const [itemSubCategoryError, setItemSubCategoryError] = useState(false);

  // Other Variables
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
  const [categoryOption, setCategoryOption] = useState(null);
  const [subCategoryOption, setSubCategoryOption] = useState(null);
  const [creditCardOptions, setCreditCardOptions] = useState(null);
  const [subCategoryOtherVisible, setSubCategoryOtherVisible] = useState(null);
  const [groupList, setGroupList] = useState(null);
  const [bankList, setBankList] = useState(null);
  const [createBalanceModalStatus, setCreateBalanceModalStatus] =
    useState(false);
  const [customizeModalStatus, setCustomizeModalStatus] = useState(false);
  const [customizeFor, setCustomizeFor] = useState(null);

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
  const themeScheme = Helpers.getThemeScheme();
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      setExpenseDetailStatus(true);

      Boolean(expenseId)
        ? [
            showMessage({
              icon: 'auto',
              message: Labels.fetchingData,
              position: 'bottom',
              type: 'default',
            }),

            setLoading(true),
          ]
        : [expenseCategory(), expenseGroup(), expenseBank()];

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const expenseCategory = async () => {
    await props.expenseCategory(res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('EXPENSE CATEGORY RESPONSE DATA::: ', response);

      setCategoryOption(response);
    });
  };

  const expenseGroup = async customGroupName => {
    await props.expenseGroup(res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('EXPENSE CLAIMABLE GROUP RESPONSE DATA::: ', response);

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

        setGroupList(response);

        hideMessage();
      } else {
        setGroupList(null);

        hideMessage();
      }
    });
  };

  const expenseBank = async (customBankName, type, creditCardId) => {
    await props.expenseBank(res => {
      const response = res.resJson.data.list;

      ENV.currentEnvironment == Labels.development &&
        console.log('EXPENSE BANK RESPONSE DATA::: ', response);

      const customizeObject = {
        id: Labels.addAccount,
        name: Labels.addAccount,
      };

      if (Array.isArray(response)) {
        response.push(customizeObject);

        if (Boolean(customBankName)) {
          let filterCredit = [];

          const filteredBank = response.filter(
            lol => lol.name == customBankName,
          );

          ENV.currentEnvironment == Labels.development &&
            console.log('FILTERED BANK::: ', filteredBank);

          Boolean(type) && [
            (filterCredit = filteredBank.filter(
              lol =>
                lol.type == Labels.creditCard.replace(/\s/g, '').toLowerCase(),
            )),
          ];
          if (
            Boolean(type) &&
            type == Labels.creditCard.replace(/\s/g, '').toLowerCase() &&
            filterCredit.length != 0
          ) {
            setMadePaymentVia(filterCredit[0]?.id ?? null);
            setCreditCardOptions(filterCredit[0]?.creditCard ?? null);

            const filteredCreditCard =
              filterCredit[0]?.creditCard?.filter(
                lol => lol._id == creditCardId,
              ) ?? [];

            filteredCreditCard.length != 0
              ? [
                  setCreditCard(filteredCreditCard[0]?._id ?? null),
                  setCreditCardExpiry(filteredCreditCard[0]?.expiry ?? null),
                ]
              : [setCreditCard(null), setCreditCardExpiry(null)];
          } else {
            filteredBank.length != 0 && setMadePaymentVia(filteredBank[0].id);
          }
        } else {
          const defaultBank = response.filter(
            lol => lol.name.toLowerCase() == Labels.default.toLowerCase(),
          );

          ENV.currentEnvironment == Labels.development &&
            console.log('EXPENSE DEFAULT BANK::: ', defaultBank);

          defaultBank.length != 0 && [
            setMadePaymentVia(defaultBank[0].id),
            setMadePaymentViaError(false),
          ];
        }

        setBankList(response);

        hideMessage();
      } else {
        setBankList(null);

        hideMessage();
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (Boolean(expenseId)) {
        expenseId && handleEditData();
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

    Boolean(expenseId) &&
      showMessage({
        icon: 'auto',
        message: Labels.fetchingData,
        position: 'bottom',
        type: 'default',
      });

    setLoading(true);
  };

  const handleEditData = () => {
    props.expenseView(expenseId, async res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('EXPENSE VIEW RESPONSE DATA::: ', response);

      const infoResponse = res.resJson.data.info;

      ENV.currentEnvironment == Labels.development &&
        console.log('EXPENSE VIEW INFO RESPONSE DATA::: ', infoResponse);

      expenseCategory();

      setMadePaymentForCategory(infoResponse.category.id);

      expenseSubCategory(
        infoResponse.category.id,
        Boolean(infoResponse.subcategory) &&
          Object.keys(infoResponse.subcategory).length != 0
          ? infoResponse.subcategory.name
          : null,
      );

      setMadePaymentForSubCategoryOthers(infoResponse.subcategoryOther || null);

      setSubCategoryOtherVisible(
        Boolean(infoResponse.subcategory) &&
          Object.keys(infoResponse.subcategory).length != 0
          ? infoResponse.subcategory.name
          : null,
      );

      setClaimableExpense(infoResponse.claimable);

      expenseGroup(
        infoResponse.hasOwnProperty('group') &&
          infoResponse.group.hasOwnProperty('name')
          ? infoResponse.group.name
          : null,
      );

      const checkAccountName =
        infoResponse.hasOwnProperty('balance') &&
        infoResponse.balance.hasOwnProperty('bank') &&
        infoResponse.balance.bank.hasOwnProperty('name')
          ? infoResponse.balance.bank.name
          : null;

      const checkCreditCardName =
        infoResponse.hasOwnProperty('creditcard') &&
        infoResponse.creditcard.hasOwnProperty('bank') &&
        infoResponse.creditcard.bank.hasOwnProperty('name')
          ? infoResponse.creditcard.bank.name
          : null;

      const checkCreditCardCardTypeId =
        infoResponse.hasOwnProperty('creditcard') &&
        infoResponse.creditcard.hasOwnProperty('cardtype') &&
        infoResponse.creditcard.hasOwnProperty('id')
          ? infoResponse.creditcard.id
          : null;

      expenseBank(
        checkAccountName || checkCreditCardName,
        Boolean(checkCreditCardName)
          ? Labels.creditCard.replace(/\s/g, '').toLowerCase()
          : null,
        checkCreditCardCardTypeId,
      );

      setPayee(infoResponse.payee);

      setTotalAmount(String(infoResponse.amount));

      setDate(infoResponse.datedOn);

      setRecurrence(infoResponse.isReccurening ? Labels.yes : Labels.no);

      setRecurrenceFrequency(infoResponse.reccurenceFrequency);

      setRecurrenceFrequencyOthersTime(String(infoResponse.reccurenceTime));

      setRecurrenceFrequencyOthersFrequency(
        infoResponse.reccurenceTimeFrequency,
      );

      if (Array.isArray(response.items) && response.items.length != 0) {
        response.items.forEach(object => {
          object['price'] = Helpers.handleTextInputDecimal(
            Boolean(object.price) ? String(object.price) : '0',
          );

          object['length'] = Boolean(object.price)
            ? String(object.price).split('.')[1].length == 0
              ? String(object.price).length + 2
              : String(object.price).split('.')[1].length == 1
              ? String(object.price).length + 1
              : String(object.price).length
            : null;

          object['error'] = false;
        });

        setItemCategory(response.items);
      } else {
        setItemCategory([]);
      }

      setNotes(infoResponse.note);

      setAttachment(infoResponse.attachment || null);

      setLoading(false);

      setRefreshing(false);
    });
  };

  const expenseSubCategory = async (categoryId, customSubCategoryName) => {
    await props.expenseSubCategory(categoryId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('EXPENSE SUB CATEGORY RESPONSE DATA::: ', response);

      const customizeObject = {
        icon: Assets.customize,
        id: Labels.customize,
        name: Labels.customize,
      };

      if (Array.isArray(response)) {
        const checkForUncategorized =
          Boolean(categoryOption) && Array.isArray(categoryOption)
            ? categoryOption.filter(lol => lol.id == categoryId)
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
            setMadePaymentForSubCategory(filteredSubCategory[0].id),
            setMadePaymentForSubCategoryOthers(filteredSubCategory[0].name),
          ];
        } else {
          setMadePaymentForSubCategory(null);
          setMadePaymentForSubCategoryOthers(null);
          setSubCategoryOtherVisible(null);
        }

        setSubCategoryOption(response);

        hideMessage();
      } else {
        setSubCategoryOption(null);

        hideMessage();
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      handleItemSubCategoryTotal();

      return () => {
        isFocus = false;
      };
    }, [itemCategory]),
  );

  const handleItemSubCategoryTotal = () => {
    const getTotal =
      itemCategory.length != 0
        ? itemCategory.reduce(function (total, currentValue) {
            return total + Number(currentValue.price);
          }, 0)
        : 0;

    setItemSubCategoryTotal(String(getTotal));
  };

  const handleMadePaymentForSubCategorySelection = selectedValue => {
    setCustomizeFor(Labels.subCategory);

    madePaymentForSubCategoryError && setMadePaymentForSubCategoryError(false);

    const selectedMadePaymentForSubCategory =
      Boolean(selectedValue) && Object.keys(selectedValue).length != 0
        ? selectedValue.id
        : null;

    const selectedMadePaymentForSubCategoryOtherVisible =
      Boolean(selectedValue) && Object.keys(selectedValue).length != 0
        ? selectedValue.name
        : null;

    if (
      Boolean(selectedMadePaymentForSubCategory) &&
      selectedMadePaymentForSubCategory == Labels.customize
    ) {
      setMadePaymentForSubCategory(selectedMadePaymentForSubCategory);

      setSubCategoryOtherVisible(selectedMadePaymentForSubCategoryOtherVisible);

      setCustomizeModalStatus(!customizeModalStatus);
    } else {
      setMadePaymentForSubCategory(selectedMadePaymentForSubCategory);

      setSubCategoryOtherVisible(selectedMadePaymentForSubCategoryOtherVisible);
    }

    setMadePaymentForSubCategoryOthers(null);
  };

  const handleMadePaymentViaSelection = selectedValue => {
    madePaymentViaError && setMadePaymentViaError(false);

    creditCardError && setCreditCardError(false);

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

    const selectedCreditCard =
      Boolean(selectedValue) &&
      Object.keys(selectedValue).length != 0 &&
      selectedValue.hasOwnProperty('type') &&
      selectedValue.creditCard.length != 0
        ? selectedValue.type
        : '';

    setCreditCardOptions(
      selectedCreditCard.toLowerCase() ==
        Labels.creditCard.replace(/\s/g, '').toLowerCase()
        ? selectedValue.creditCard
        : null,
    );

    setCreditCard(null);

    setCreditCardExpiry(null);
  };

  const handleCardExpiry = selectedDate => {
    const customSelectedDate = moment(selectedDate).format(
      `${Labels.formatMM}/${Labels.formatYY}`,
    );

    const checkExpiry = Helpers.checkCardExpiry(
      creditCardExpiry,
      customSelectedDate,
      `${Labels.formatMM}/${Labels.formatYY}`,
    );

    setCreditCardExpiryError(!Boolean(checkExpiry));
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

  const renderExpenseDetailAccordion = () => {
    return (
      <View
        style={[
          Styles.expenseDetailAccordionContainer,
          !expenseDetailStatus && HelperStyles.justView('marginBottom', 8),
        ]}>
        <View style={Styles.expenseDetailAccordionLabelContainer}>
          <Text
            style={HelperStyles.textView(
              14,
              '600',
              Colors.primaryText,
              'left',
              'none',
            )}>
            {Labels.expenseDetail}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setExpenseDetailStatus(!expenseDetailStatus);
          }}
          style={Styles.expenseDetailAccordionImageContainer}>
          <Image
            resizeMode={'contain'}
            source={Assets.arrow}
            style={[
              Styles.expenseDetailAccordionImage,
              HelperStyles.justView('transform', [
                {rotate: expenseDetailStatus ? '180deg' : '0deg'},
              ]),
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderExpenseDetail = () => {
    return (
      <View style={Styles.expenseDetailContainer}>
        {renderItemCategory()}
        {!loading ? renderNotes() : <FloatingTextInputSkeleton />}
        {renderAtachment()}
      </View>
    );
  };

  const renderItemCategory = () => {
    return (
      <Card containerStyle={Styles.itemCategoryCardContainer}>
        {!loading ? (
          <Text
            style={HelperStyles.textView(
              14,
              '400',
              Colors.secondaryText,
              'left',
              'none',
            )}>
            {Labels.itemCategory}
          </Text>
        ) : (
          <LabelSkeleton />
        )}
        <View style={HelperStyles.margin(0, 8)}>
          {itemCategory.length != 0 &&
            itemCategory.map((lol, index) => (
              <View key={index}>
                <View style={Styles.itemContainer}>
                  <Card containerStyle={Styles.keyInItemContainer}>
                    <TextInput
                      autoCapitalize={'words'}
                      autoFocus={true}
                      keyboardType={'default'}
                      onChangeText={txt => {
                        handleItems(
                          Labels.update,
                          String(index),
                          Labels.keyInItem,
                          txt,
                        );
                      }}
                      placeholder={Labels.keyInItem}
                      placeholderTextColor={Colors.secondaryText}
                      style={[
                        Styles.textInputContainer,
                        HelperStyles.justView('color', Theme.primaryText),
                      ]}
                      textContentType={'none'}
                      underlineColorAndroid={Colors.transparent}
                      value={lol.name}
                    />
                  </Card>
                  <Card containerStyle={Styles.rmContainer}>
                    <View style={Styles.rmLabelContainer}>
                      <Text
                        style={HelperStyles.textView(
                          12,
                          '700',
                          Colors.lightText,
                          'center',
                          'uppercase',
                        )}>
                        {Labels.rm}
                      </Text>
                    </View>
                    <View style={Styles.rmTextInputContainer}>
                      <TextInput
                        autoCapitalize={'words'}
                        keyboardType={'number-pad'}
                        maxLength={lol.length}
                        onBlur={() => {
                          let helperArray = [...itemCategory];

                          helperArray[index].length = Helpers.checkField(
                            lol.price,
                          )
                            ? lol.price.length + 3
                            : null;

                          helperArray[index].price =
                            Helpers.handleTextInputDecimal(
                              Helpers.checkField(lol.price)
                                ? String(lol.price)
                                : '0',
                            );

                          setItemCategory(helperArray);
                        }}
                        onChangeText={txt => {
                          handleItems(
                            Labels.update,
                            String(index),
                            Labels.rm,
                            txt,
                          );
                        }}
                        placeholder={Labels.rm}
                        placeholderTextColor={Colors.secondaryText}
                        style={[
                          Styles.textInputContainer,
                          HelperStyles.justView('color', Theme.primaryText),
                        ]}
                        textContentType={'none'}
                        underlineColorAndroid={Colors.transparent}
                        value={lol.price}
                      />
                    </View>
                  </Card>
                  <View
                    style={HelperStyles.justifyContentCenteredView('center')}>
                    <TouchableOpacity
                      onPress={() => {
                        handleItems(Labels.delete, String(index));
                      }}
                      style={Styles.trashContainer}>
                      <Image
                        resizeMode={'contain'}
                        source={Assets.trash}
                        style={[
                          HelperStyles.imageView(12, 12),
                          HelperStyles.justView('tintColor', Colors.primary),
                        ]}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {lol.error && (
                  <Text
                    style={[
                      HelperStyles.errorText,
                      HelperStyles.justView('textAlign', 'center'),
                    ]}>
                    {Labels.itemNameValueError}
                  </Text>
                )}
              </View>
            ))}
          {itemSubCategoryError && (
            <Text
              style={[
                HelperStyles.errorText,
                HelperStyles.justView('textAlign', 'center'),
              ]}>
              {Labels.itemSubCategoryError}
            </Text>
          )}
          {!loading ? (
            <Button
              containerStyle={[
                Styles.addItemButtonContainer,
                HelperStyles.margin(0, itemCategory.length != 0 ? 8 : 16),
              ]}
              isImage={true}
              label={Labels.addItem}
              mode={'outlined'}
              onPress={() => {
                handleItems(Labels.add);
              }}
              renderImage={() => {
                return (
                  <View style={HelperStyles.justView('marginRight', 4)}>
                    <Image
                      resizeMode={'contain'}
                      source={Assets.plus}
                      style={[
                        HelperStyles.imageView(18, 18),
                        HelperStyles.justView('tintColor', Colors.primary),
                      ]}
                    />
                  </View>
                );
              }}
              textStyle={[
                HelperStyles.justView('color', Colors.primaryText),
                HelperStyles.justView('textTransform', 'none'),
              ]}
            />
          ) : (
            <View style={HelperStyles.margin(0, 16)}>
              <ButtonSkeleton width={'95%'} />
            </View>
          )}
        </View>
        <View
          style={[
            HelperStyles.justView('borderBottomColor', Colors.grey),
            HelperStyles.justView('borderBottomWidth', 1),
          ]}
        />
        <View style={Styles.totalContainer}>
          <View
            style={[
              HelperStyles.flex(0.475),
              HelperStyles.justView('justifyContent', 'center'),
            ]}>
            {!loading ? (
              <Text
                style={HelperStyles.textView(
                  14,
                  '700',
                  itemCategory.length != 0
                    ? Theme.primaryText
                    : Colors.darkElectricBlue,
                  'left',
                  'none',
                )}>
                {Labels.total}
              </Text>
            ) : (
              <LabelSkeleton />
            )}
          </View>
          <View
            style={[
              HelperStyles.flex(0.475),
              HelperStyles.justView('justifyContent', 'center'),
            ]}>
            {!loading ? (
              <Text
                style={HelperStyles.textView(
                  14,
                  '700',
                  itemCategory.length != 0
                    ? Theme.primaryText
                    : Colors.darkElectricBlue,
                  'right',
                  'none',
                )}>
                {`${Labels.rm} ${
                  Boolean(itemSubCategoryTotal)
                    ? parseFloat(itemSubCategoryTotal).toFixed(2)
                    : '-'
                }`}
              </Text>
            ) : (
              <LabelSkeleton
                height={19}
                style={HelperStyles.justView('alignSelf', 'flex-end')}
              />
            )}
          </View>
        </View>
      </Card>
    );
  };

  const handleItems = (actionFor, index, label, txt) => {
    let helperArray = [...itemCategory],
      helperObject = {
        length: null,
        name: null,
        price: null,
        priceUnit: Labels.rm,
      };

    ENV.currentEnvironment == Labels.development &&
      console.log('ITEM CATEGORY INDEX::: ', index);

    itemSubCategoryError && setItemSubCategoryError(false);

    const getIndex = Boolean(index)
      ? helperArray.findIndex((lol, inx) => inx == index)
      : null;

    switch (actionFor) {
      case Labels.add:
        if (helperArray.length != 0) {
          const checkInsert = helperArray.every(
            lol =>
              Helpers.checkField(lol.name) && Helpers.checkField(lol.price),
          );

          if (checkInsert) {
            helperArray.push(helperObject);
          } else {
            helperArray[itemCategory.length - 1].error = true;
          }
        } else {
          helperArray.push(helperObject);
        }
        break;

      case Labels.delete:
        helperArray.splice(getIndex, 1);
        break;

      case Labels.update:
        helperArray[index].error = false;

        switch (label) {
          case Labels.keyInItem:
            helperArray[index].name = txt;
            break;

          case Labels.rm:
            if (Boolean(txt) && txt.includes('.')) {
              helperArray[index].length =
                txt.split('.')[1].length == 0
                  ? txt.length + 2
                  : txt.split('.')[1].length == 1
                  ? txt.length + 1
                  : txt.length;

              helperArray[index].price = txt;
            } else {
              helperArray[index].length = null;

              helperArray[index].price = txt;
            }
            break;

          default:
            break;
        }
        break;

      default:
        break;
    }

    ENV.currentEnvironment == Labels.development &&
      console.log('HELPER ARRAY::: ', helperArray);

    setItemCategory(helperArray);
  };

  const renderNotes = () => {
    return (
      <Card containerStyle={Styles.floatingTextInputCardContainer}>
        <FloatingTextInput
          autoCapitalize={'sentences'}
          keyboardType={'default'}
          textContentType={'none'}
          textInputContainerStyle={Styles.floatingTextInputContainer}
          textInputLabelStyle={Styles.floatingTextInputLabel}
          textInputStyle={Styles.floatingTextInput}
          title={`${Labels.addNote}...`}
          updateMasterState={txt => {
            setNotes(txt);
          }}
          value={notes}
        />
      </Card>
    );
  };

  const renderAtachment = () => {
    return (
      <View style={HelperStyles.margin(0, 16)}>
        <View
          style={[
            HelperStyles.flex(1),
            HelperStyles.flexDirection('row'),
            HelperStyles.justView('justifyContent', 'space-between'),
          ]}>
          <View
            style={[
              HelperStyles.flex(attachment ? 0.85 : 1),
              HelperStyles.justView('justifyContent', 'center'),
            ]}>
            {!loading ? (
              <Text
                style={HelperStyles.textView(
                  14,
                  '600',
                  Theme.primaryText,
                  'left',
                  'none',
                )}>
                {Labels.attachment}
              </Text>
            ) : (
              <LabelSkeleton />
            )}
          </View>
          {Boolean(attachment) && (
            <View
              style={[
                HelperStyles.flex(0.15),
                HelperStyles.justView('justifyContent', 'center'),
                HelperStyles.justView('alignItems', 'flex-end'),
              ]}>
              <TouchableOpacity
                onPress={() => {
                  setAttachment(null);
                }}
                style={[
                  HelperStyles.imageView(30, 30),
                  HelperStyles.justifyContentCenteredView('center'),
                  HelperStyles.justView('backgroundColor', Colors.lightText),
                  HelperStyles.justView('borderRadius', 30 / 2),
                ]}>
                <Image
                  resizeMode={'contain'}
                  source={Assets.close}
                  style={[
                    HelperStyles.imageView(12, 12),
                    HelperStyles.justView('tintColor', Colors.white),
                  ]}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {Boolean(attachment) ? (
          <View style={Styles.attachmentViewContainer}>
            <Image
              source={{uri: attachment}}
              onLoadStart={() => {
                setImageLoader(true);
              }}
              onLoadEnd={() => {
                setImageLoader(false);
              }}
              style={Styles.attachmentView}
            />
            {imageLoader && (
              <ActivityIndicator
                size={12}
                color={Theme.text}
                style={Styles.activityIndicator}
              />
            )}
          </View>
        ) : !loading ? (
          <Button
            containerStyle={Styles.attachReceiptInvoiceButtonContainer}
            isImage={true}
            label={Labels.attachReceiptInvoice}
            mode={'outlined'}
            onPress={() => {
              setImagePickerModalStatus(!imagePickerModalStatus);
            }}
            renderImage={() => {
              return (
                <View style={HelperStyles.justView('marginRight', 4)}>
                  <Image
                    resizeMode={'contain'}
                    source={Assets.plus}
                    style={[
                      HelperStyles.imageView(18, 18),
                      HelperStyles.justView('tintColor', Colors.lightText),
                    ]}
                  />
                </View>
              );
            }}
            textStyle={HelperStyles.justView('color', Colors.lightText)}
          />
        ) : (
          <View style={HelperStyles.justView('marginTop', 16)}>
            <ButtonSkeleton />
          </View>
        )}
      </View>
    );
  };

  const fileUpload = imageBlob => {
    let formData = new FormData();

    formData.append('file', imageBlob);

    props.fileUpload(formData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('EXPENSE FILE UPLOAD RESPONSE DATA::: ', response);

      setAttachment(response.url);
    });
  };

  const LabelSkeleton = ({height = 18, style = {}}) => {
    return <SkeletonLabel height={height} style={style} />;
  };

  const DropdownSkeleton = () => {
    return <SkeletonDropdown textWidth={Helpers.windowWidth * 0.3} />;
  };

  const SwitchSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonSwitch />
      </View>
    );
  };

  const DropdownCardSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonCard />
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

  const ExpenseDetailAccordionSkeleton = () => {
    return (
      <SkeletonPlaceholder>
        <View style={HelperStyles.imageView(35, '100%')} />
      </SkeletonPlaceholder>
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

  const handleExpense = () => {
    if (checkExpense()) {
      Store.dispatch(loadingStatus(true));

      const requestData = handleRequestData();

      ENV.currentEnvironment == Labels.development &&
        console.log('EXPENSE REQUEST DATA::: ', requestData);

      if (expenseId) {
        props.expenseUpdate(expenseId, requestData, res => {
          handleReset();

          if (
            Boolean(props.routingName) &&
            props.routingName == Labels.claimRouteName
          ) {
            Store.dispatch(routingName(null));

            props.navigation.navigate('BillingClaim');
          } else {
            props.navigation.goBack();
          }
        });
      } else {
        props.expenseCreate(requestData, res => {
          handleReset();

          if (findSelectedBankIndexOffset() != -1) {
            Boolean(creditCardOptions)
              ? props.navigation.navigate('CreditCardTransaction', {
                  index: findSelectedBankIndexOffset(),
                })
              : props.navigation.navigate('AccountView', {
                  index: findSelectedBankIndexOffset(),
                });
          } else {
            props.navigation.goBack();
          }
        });
      }
    } else {
      handleErrorValidation();
    }
  };

  const checkExpense = () => {
    const madePaymentForSubCategoryOthersCheck =
      Boolean(madePaymentForSubCategory) &&
      subCategoryOtherVisible.toLowerCase() == Labels.others.toLowerCase()
        ? Boolean(madePaymentForSubCategoryOthers)
        : true;

    const totalAmountCheck =
      Helpers.checkField(totalAmount) && Helpers.checkZero(totalAmount);

    const recurrenceFrequencyCheck =
      Boolean(recurrence) && recurrence == Labels.yes
        ? Boolean(recurrenceFrequency)
        : true;

    const recurrenceFrequencyOthersTimeCheck =
      Boolean(recurrenceFrequency) &&
      recurrenceFrequency.toLowerCase() == Labels.others.toLowerCase()
        ? Helpers.checkField(recurrenceFrequencyOthersTime)
        : true;

    const recurrenceFrequencyOthersFrequencyCheck =
      Boolean(recurrenceFrequency) &&
      recurrenceFrequency.toLowerCase() == Labels.others.toLowerCase()
        ? Boolean(recurrenceFrequencyOthersFrequency)
        : true;

    const itemSubCategoryTotalCheck =
      itemCategory.length != 0 &&
      Helpers.checkField(itemSubCategoryTotal) &&
      Helpers.checkZero(itemSubCategoryTotal) &&
      Boolean(totalAmountCheck)
        ? Boolean(parseFloat(itemSubCategoryTotal).toFixed(2) == totalAmount)
        : true;

    const payMentCheck =
      Boolean(madePaymentVia) && Boolean(creditCardOptions)
        ? Boolean(creditCard)
        : Boolean(madePaymentVia);

    if (
      Boolean(madePaymentForCategory) &&
      Boolean(madePaymentForSubCategory) &&
      Boolean(madePaymentForSubCategoryOthersCheck) &&
      Boolean(group) &&
      Boolean(payMentCheck) &&
      Helpers.checkField(payee) &&
      Boolean(totalAmountCheck) &&
      Boolean(date) &&
      Boolean(recurrence) &&
      Boolean(recurrenceFrequencyCheck) &&
      Boolean(recurrenceFrequencyOthersTimeCheck) &&
      Boolean(recurrenceFrequencyOthersFrequencyCheck) &&
      Boolean(itemSubCategoryTotalCheck) &&
      !creditCardExpiryError
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleRequestData = () => {
    let requestData = {};

    const filteredItemCategory =
      itemCategory.length != 0
        ? itemCategory.filter(lol => lol.name && lol.price)
        : [];

    filteredItemCategory.length != 0 &&
      filteredItemCategory.forEach(object => {
        delete object['length'];
        delete object['error'];

        expenseId && object.expense && delete object['expense'];
        expenseId && object.id && delete object['id'];
      });

    requestData = {
      ...requestData,
      payee: payee,
      claimable: claimableExpense,
      amount: Number(totalAmount),
      note: Helpers.checkField(notes) ? notes : null,
      attachment: attachment,
      datedOn: date,
      isReccurening: recurrence == Labels.yes ? true : false,
      category: {
        _id: madePaymentForCategory,
      },
      subcategory: {
        _id: madePaymentForSubCategory,
      },
      group: {_id: group},
      item: filteredItemCategory,
    };

    Boolean(creditCardOptions)
      ? (requestData = {
          ...requestData,
          creditcard: {
            _id: creditCard,
          },
        })
      : (requestData = {
          ...requestData,
          balance: {
            _id: madePaymentVia,
          },
        });

    Boolean(subCategoryOtherVisible) &&
      subCategoryOtherVisible.toLowerCase() == Labels.others.toLowerCase() && [
        (requestData = {
          ...requestData,
          subcategoryOther: madePaymentForSubCategoryOthers,
        }),
      ];

    Boolean(recurrence) &&
      recurrence == Labels.yes && [
        (requestData = {
          ...requestData,
          reccurenceFrequency: recurrenceFrequency,
        }),
      ];

    Boolean(recurrence) &&
      Boolean(recurrenceFrequency) &&
      recurrenceFrequency.toLowerCase() == Labels.others.toLowerCase() && [
        (requestData = {
          ...requestData,
          reccurenceTime: Number(recurrenceFrequencyOthersTime),
          reccurenceTimeFrequency: recurrenceFrequencyOthersFrequency,
        }),
      ];

    return requestData;
  };

  const findSelectedBankIndexOffset = () => {
    let creditCardHelperArray = [],
      selectedAccountIndex;

    const helperArray = bankList.filter(lol => lol.id != Labels.addAccount);

    if (Boolean(creditCardOptions) && Boolean(creditCard)) {
      const creditHelperArray = helperArray.filter(
        lol => lol.type == Labels.creditCard.replace(/\s/g, '').toLowerCase(),
      );

      creditHelperArray.map(lol => {
        Boolean(lol) &&
          lol.hasOwnProperty('creditCard') &&
          Boolean(lol.creditCard) &&
          Array.isArray(lol.creditCard) &&
          lol.creditCard.length != 0 &&
          lol.creditCard.map(lol => {
            creditCardHelperArray.push(lol);
          });
      });

      creditCardHelperArray.sort(
        (object1, object2) =>
          new Date(object2.updatedAt).getTime() -
          new Date(object1.updatedAt).getTime(),
      );

      selectedAccountIndex = creditCardHelperArray.findIndex(
        lol => lol._id == creditCard,
      );

      const offset = Math.ceil((selectedAccountIndex + 1) / ENV.dataLimit);

      Store.dispatch(storeCreditCardViewOffset(offset));

      return selectedAccountIndex - (offset - 1) * ENV.dataLimit;
    } else {
      const savingHelperArray = helperArray.filter(
        lol => lol.type == Labels.savings.toLowerCase(),
      );

      savingHelperArray.reverse();

      selectedAccountIndex = savingHelperArray.findIndex(
        lol => lol.id == madePaymentVia,
      );

      const offset = Math.ceil((selectedAccountIndex + 1) / ENV.dataLimit);

      Store.dispatch(storeAccountViewOffset(offset));

      return selectedAccountIndex - (offset - 1) * ENV.dataLimit;
    }
  };

  const handleErrorValidation = () => {
    setMadePaymentForCategoryError(
      Boolean(madePaymentForCategory) ? false : true,
    );
    setMadePaymentForSubCategoryError(
      Boolean(madePaymentForSubCategory) ? false : true,
    );
    setMadePaymentForSubCategoryOthersError(
      Boolean(madePaymentForSubCategory) &&
        subCategoryOtherVisible.toLowerCase() == Labels.others.toLowerCase()
        ? Boolean(madePaymentForSubCategoryOthers)
          ? false
          : true
        : false,
    );
    setGroupError(Boolean(group) ? false : true);
    setMadePaymentViaError(Boolean(madePaymentVia) ? false : true);

    Boolean(creditCardOptions) &&
      setCreditCardError(Boolean(creditCard) ? false : true);

    setPayeeError(Helpers.checkField(payee) ? false : true);

    Helpers.checkField(totalAmount)
      ? setAmounZeroError(Helpers.checkZero(totalAmount) ? false : true)
      : setTotalAmountError(Helpers.checkField(totalAmount) ? false : true);

    setDateError(Boolean(date) ? false : true);
    setRecurrenceError(Boolean(recurrence) ? false : true);
    setRecurrenceFrequencyError(
      Boolean(recurrence) && recurrence == Labels.yes
        ? Boolean(recurrenceFrequency)
          ? false
          : true
        : false,
    );
    setRecurrenceFrequencyOthersTimeError(
      Boolean(recurrenceFrequency) &&
        recurrenceFrequency.toLowerCase() == Labels.others.toLowerCase()
        ? Helpers.checkField(recurrenceFrequencyOthersTime)
          ? false
          : true
        : false,
    );
    setRecurrenceFrequencyOthersFrequencyError(
      Boolean(recurrenceFrequency) &&
        recurrenceFrequency.toLowerCase() == Labels.others.toLowerCase()
        ? Boolean(recurrenceFrequencyOthersFrequency)
          ? false
          : true
        : false,
    );
    setItemSubCategoryError(
      Helpers.checkField(itemSubCategoryTotal) &&
        Helpers.checkZero(itemSubCategoryTotal) &&
        Helpers.checkField(totalAmount) &&
        Helpers.checkZero(totalAmount) &&
        !Boolean(parseFloat(itemSubCategoryTotal).toFixed(2) == totalAmount)
        ? true
        : false,
    );
  };

  const handleReset = () => {
    setMadePaymentForCategory(null);
    setMadePaymentForSubCategory(null);
    setMadePaymentForSubCategoryOthers(null);
    setClaimableExpense(false);
    setGroup(null);
    setPayee(null);
    setMadePaymentVia(null);
    setCreditCard(null);
    setCreditCardExpiry(null);
    setCreditCardOptions(null);
    setTotalAmount(null);
    setDate(null);
    setRecurrence(null);
    setRecurrenceFrequency(null);
    setRecurrenceFrequencyOthersTime(null);
    setRecurrenceFrequencyOthersFrequency(null);
    setExpenseDetailStatus(true);
    setItemCategory([]);
    setItemSubCategoryTotal(null);
    setNotes(null);
    setImagePickerModalStatus(false);
    setAttachment(null);
    setMadePaymentForCategoryError(false);
    setMadePaymentForSubCategoryError(false);
    setMadePaymentForSubCategoryOthersError(false);
    setGroupError(false);
    setPayeeError(false);
    setMadePaymentViaError(false);
    setCreditCardError(false);
    setCreditCardExpiryError(false);
    setTotalAmountError(false);
    setAmounZeroError(false);
    setDateError(false);
    setRecurrenceError(false);
    setRecurrenceFrequencyError(false);
    setRecurrenceFrequencyOthersTimeError(false);
    setRecurrenceFrequencyOthersFrequencyError(false);
    setItemSubCategoryError(false);
  };

  const renderCreateBalanceModal = () => {
    return (
      <CreateBalance
        onConfirm={(bankName, type, creditCardId) => {
          showMessage({
            icon: 'auto',
            message: Labels.fetchingCreatedBalanceData,
            position: 'bottom',
            type: 'default',
          });

          if (type == Labels.creditCard.replace(/\s/g, '').toLowerCase()) {
            expenseBank(
              bankName,
              Labels.creditCard.replace(/\s/g, '').toLowerCase(),
              creditCardId,
            );

            setDate(null);
          } else {
            let filteredBank = [];

            filteredBank = bankList.filter(
              lol => lol.name == bankName && lol.type == type,
            );

            ENV.currentEnvironment == Labels.development &&
              console.log('EXPENSE FILTERD ACCOUNT TXT::: ', filteredBank);

            if (filteredBank.length != 0) {
              setMadePaymentVia(filteredBank[0].id);
            } else {
              expenseBank(bankName);
            }
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

  const renderCustomizeModal = () => {
    return (
      <CustomizeModal
        label={customizeFor}
        onBack={() => {
          setCustomizeModalStatus(!customizeModalStatus);

          switch (customizeFor) {
            case Labels.group:
              setGroupError(false);

              setGroup(null);

              setCustomizeFor(null);
              break;

            case Labels.subCategory:
              setMadePaymentForSubCategoryError(false);
              setMadePaymentForSubCategoryOthersError(false);

              setMadePaymentForSubCategory(null);
              setMadePaymentForSubCategoryOthers(null);
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
            case Labels.group:
              ENV.currentEnvironment == Labels.development &&
                console.log('EXPENSE GROUP CUSTOMIZE MODAL TXT::: ', txt);

              const filteredGroups = groupList.filter(lol => lol.name == txt);

              if (filteredGroups.length != 0) {
                setGroup(filteredGroups[0].id);
              } else {
                expenseCreateGroup(txt);
              }

              setCustomizeFor(null);
              break;

            case Labels.subCategory:
              ENV.currentEnvironment == Labels.development &&
                console.log(
                  'EXPENSE SUB CATEGORY CUSTOMIZE MODAL TXT::: ',
                  txt,
                );

              const filteredSubCategory = subCategoryOption.filter(
                lol => lol.name == txt,
              );

              if (filteredSubCategory.length != 0) {
                setMadePaymentForSubCategory(filteredSubCategory[0].id);

                setMadePaymentForSubCategoryOthers(filteredSubCategory[0].name);
              } else {
                expenseCreateSubCategory(txt);
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

  const expenseCreateGroup = customGroupName => {
    const requestData = {
      name: customGroupName,
    };

    props.expenseCreateGroup(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('EXPENSE CREATE GROUP RESPONSE DATA::: ', response);

      showMessage({
        icon: 'auto',
        message: Labels.fetchingCreatedGroupData,
        position: 'bottom',
        type: 'default',
      });

      expenseGroup(customGroupName);
    });
  };

  const expenseCreateSubCategory = customSubCategoryName => {
    const requestData = {
      category: {_id: madePaymentForCategory},
      icon: null,
      name: customSubCategoryName,
    };

    props.expenseCreateSubCategory(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('EXPENSE CREATE SUB CATEGORY RESPONSE DATA::: ', response);

      showMessage({
        icon: 'auto',
        message: Labels.fetchingCreatedSubCategoryData,
        position: 'bottom',
        type: 'default',
      });

      expenseSubCategory(madePaymentForCategory, customSubCategoryName);
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
                {Labels.madePaymentFor}
              </Text>
            ) : (
              <LabelSkeleton height={16} />
            )}
            <View style={Styles.madePaymentForContainer}>
              <View style={Styles.madePaymentForCategoryContainer}>
                {!loading ? (
                  <Dropdown
                    modalHeaderLabel={`${Labels.select} ${Labels.madePaymentFor} ${Labels.category}`}
                    onValueChange={selectedValue => {
                      ENV.currentEnvironment == Labels.development &&
                        console.log(
                          'MADE PAYMENT FOR CATEGORY SELECTED VALUE::: ',
                          selectedValue,
                        );

                      madePaymentForCategoryError &&
                        setMadePaymentForCategoryError(false);

                      setMadePaymentForCategory(
                        Boolean(selectedValue) &&
                          Object.keys(selectedValue).length != 0
                          ? selectedValue.id
                          : null,
                      );

                      setMadePaymentForSubCategory(null);
                      setMadePaymentForSubCategoryOthers(null);
                      setSubCategoryOtherVisible(null);

                      Object.keys(selectedValue).length != 0 &&
                        expenseSubCategory(selectedValue.id);
                    }}
                    optionImageKey={'icon'}
                    optionLabelKey={'name'}
                    options={categoryOption}
                    optionValueKey={'id'}
                    searchEnabled={true}
                    value={madePaymentForCategory}
                  />
                ) : (
                  <DropdownSkeleton />
                )}
                {madePaymentForCategoryError && (
                  <Text
                    style={[
                      HelperStyles.errorText,
                      HelperStyles.justView('marginHorizontal', 0),
                    ]}>
                    {Labels.categoryError}
                  </Text>
                )}
                {!madePaymentForCategoryError &&
                  madePaymentForSubCategoryError && (
                    <Text
                      style={[
                        HelperStyles.errorText,
                        HelperStyles.justView('marginHorizontal', 0),
                      ]}
                    />
                  )}
              </View>
              <View style={Styles.madePaymentForSubCategoryContainer}>
                {!loading ? (
                  <Dropdown
                    disabled={!Boolean(madePaymentForCategory)}
                    label={Labels.subCategory}
                    modalHeaderLabel={`${Labels.select} ${Labels.madePaymentFor} ${Labels.subCategory}`}
                    onValueChange={selectedValue => {
                      ENV.currentEnvironment == Labels.development &&
                        console.log(
                          'MADE PAYMENT FOR SUB CATEGORY SELECTED VALUE::: ',
                          selectedValue,
                        );

                      handleMadePaymentForSubCategorySelection(selectedValue);
                    }}
                    optionImageKey={'icon'}
                    optionLabelKey={'name'}
                    options={subCategoryOption}
                    optionValueKey={'id'}
                    searchEnabled={true}
                    value={madePaymentForSubCategory}
                  />
                ) : (
                  <DropdownSkeleton />
                )}
                {madePaymentForSubCategoryError && (
                  <Text
                    style={[
                      HelperStyles.errorText,
                      HelperStyles.justView('marginHorizontal', 0),
                    ]}>
                    {Labels.subCategoryError}
                  </Text>
                )}
                {!madePaymentForSubCategoryError &&
                  madePaymentForCategoryError && (
                    <Text
                      style={[
                        HelperStyles.errorText,
                        HelperStyles.justView('marginHorizontal', 0),
                      ]}
                    />
                  )}
              </View>
            </View>
            {Boolean(madePaymentForSubCategory) &&
              Boolean(subCategoryOtherVisible) &&
              subCategoryOtherVisible.toLowerCase() ==
                Labels.others.toLowerCase() && (
                <CustomFloatingTextInput
                  autoCapitalize={'sentences'}
                  cardContainerStyle={Styles.floatingTextInputCardContainer}
                  editable={Boolean(
                    madePaymentForCategory && madePaymentForSubCategory,
                  )}
                  errorLabel={Labels.othersError}
                  errorStatus={madePaymentForSubCategoryOthersError}
                  errorTextStyle={HelperStyles.justView('marginHorizontal', 12)}
                  onChangeText={txt => {
                    ENV.currentEnvironment == Labels.development &&
                      console.log(
                        'MADE PAYMENT FOR SUB CATEGORY OTHERS TXT::: ',
                        txt,
                      );

                    madePaymentForSubCategoryOthersError &&
                      setMadePaymentForSubCategoryOthersError(false);

                    setMadePaymentForSubCategoryOthers(txt);
                  }}
                  textInputContainerStyle={Styles.floatingTextInputContainer}
                  textInputLabelStyle={Styles.floatingTextInputLabel}
                  textInputStyle={Styles.floatingTextInput}
                  title={Labels.others}
                  value={madePaymentForSubCategoryOthers}
                />
              )}
            {!loading ? (
              <Switch
                disabled={
                  !Boolean(madePaymentForCategory && madePaymentForSubCategory)
                }
                containerStyle={HelperStyles.margin(0, 8)}
                label={Labels.recordClaimableExpense}
                onValueChange={() => {
                  setClaimableExpense(!claimableExpense);
                }}
                value={claimableExpense}
              />
            ) : (
              <SwitchSkeleton />
            )}
            {!loading ? (
              <DropdownCard
                disabled={
                  !Boolean(madePaymentForCategory && madePaymentForSubCategory)
                }
                floatLabel={Labels.groupName}
                label={`${Labels.groupName}...`}
                labelContainerStyle={Styles.dropdownCardLabelContainerStyle}
                onValueChange={selectedValue => {
                  ENV.currentEnvironment == Labels.development &&
                    console.log('GROUP NAME SELECTED VALUE::: ', selectedValue);

                  handleGroupSelection(selectedValue);
                }}
                optionLabelKey={'name'}
                options={groupList}
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
                  HelperStyles.justView('marginHorizontal', 12),
                ]}>
                {Labels.groupNameError}
              </Text>
            )}
            {!loading ? (
              <DropdownCard
                disabled={
                  !Boolean(madePaymentForCategory && madePaymentForSubCategory)
                }
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
                optionValueKey={'id'}
                optionTypeKey={'type'}
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
            {Boolean(madePaymentVia && creditCardOptions) && (
              <DropdownCard
                disabled={
                  !Boolean(
                    madePaymentForCategory &&
                      madePaymentForSubCategory &&
                      madePaymentVia,
                  )
                }
                floatLabel={Labels.creditCard}
                label={`${Labels.creditCard}...`}
                labelContainerStyle={Styles.dropdownCardLabelContainerStyle}
                onValueChange={selectedValue => {
                  ENV.currentEnvironment == Labels.development &&
                    console.log(
                      'CREDIT CARD SELECTED VALUE::: ',
                      selectedValue,
                    );

                  creditCardError && setCreditCardError(false);

                  setCreditCard(
                    Boolean(selectedValue) &&
                      Object.keys(selectedValue).length != 0
                      ? selectedValue._id
                      : null,
                  );

                  creditCardExpiryError && setCreditCardExpiryError(false);

                  setCreditCardExpiry(
                    Boolean(selectedValue) &&
                      Object.keys(selectedValue).length != 0
                      ? selectedValue.expiry
                      : null,
                  );

                  setDate(null);
                }}
                isType={true}
                options={creditCardOptions}
                optionLabelKey={'name'}
                optionValueKey={'_id'}
                optionTypeKey={'cardtypename'}
                value={creditCard}
              />
            )}
            {creditCardError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 12),
                ]}>
                {Labels.creditCardError}
              </Text>
            )}
            {!loading ? (
              <Card containerStyle={Styles.floatingTextInputCardContainer}>
                <FloatingTextInput
                  autoCapitalize={'none'}
                  editable={Boolean(
                    madePaymentForCategory && madePaymentForSubCategory,
                  )}
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
                  editable={Boolean(
                    madePaymentForCategory && madePaymentForSubCategory,
                  )}
                  keyboardType={'number-pad'}
                  isDecimal={true}
                  textContentType={'none'}
                  textInputContainerStyle={Styles.floatingTextInputContainer}
                  textInputLabelStyle={Styles.floatingTextInputLabel}
                  textInputStyle={Styles.floatingTextInput}
                  title={Labels.totalAmount}
                  updateMasterState={txt => {
                    totalAmountError && setTotalAmountError(false);

                    amountZeroError && setAmounZeroError(false);

                    setTotalAmount(txt);
                  }}
                  value={totalAmount}
                />
              </Card>
            ) : (
              <FloatingTextInputSkeleton />
            )}
            {totalAmountError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 12),
                ]}>
                {Labels.totalAmountError}
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
              <CustomDateTimePicker
                disabled={
                  !Boolean(madePaymentForCategory && madePaymentForSubCategory)
                }
                isDark={themeScheme == 'dark'}
                labelStyle={Styles.dateTimeLabelStyle}
                maximumDate={new Date()}
                onDateChange={selectedValue => {
                  ENV.currentEnvironment == Labels.development &&
                    console.log('DATE SELECTED VALUE::: ', selectedValue);

                  dateError && setDateError(false);

                  setDate(selectedValue);

                  creditCardExpiryError && setCreditCardExpiryError(false);

                  Boolean(creditCardExpiry && selectedValue) &&
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
            {creditCardExpiryError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 12),
                ]}>
                Sorry! Your credit card has expired on{' '}
                {Helpers.formatDateTime(
                  creditCardExpiry,
                  `${Labels.formatMM}/${Labels.formatYY}`,
                  `${Labels.formatMMM}, ${Labels.formatYYYY}`,
                )}
                !
              </Text>
            )}
            {!loading ? (
              <RadioButton
                disabled={
                  !Boolean(madePaymentForCategory && madePaymentForSubCategory)
                }
                label={Labels.recurrence}
                onValueChange={selectedValue => {
                  ENV.currentEnvironment == Labels.development &&
                    console.log('RECURRENCE SELECTED VALUE::: ', selectedValue);

                  recurrenceError && setRecurrenceError(false);

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
                    disabled={
                      !Boolean(
                        madePaymentForCategory && madePaymentForSubCategory,
                      )
                    }
                    label={Labels.recurrenceFrequency}
                    labelContainerStyle={Styles.dropdownCardLabelContainerStyle}
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
                    <TimePeriod
                      disabled={
                        !Boolean(
                          madePaymentForCategory && madePaymentForSubCategory,
                        )
                      }
                      dropDownCardErrorStatus={
                        recurrenceFrequencyOthersFrequencyError
                      }
                      onChangeText={txt => {
                        ENV.currentEnvironment == Labels.development &&
                          console.log('RECURRENCE OTHERS TIME TXT::: ', txt);

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
                          setRecurrenceFrequencyOthersFrequencyError(false);

                        setRecurrenceFrequencyOthersFrequency(selectedValue);
                      }}
                      textInputValue={recurrenceFrequencyOthersTime}
                      dropDownCardValue={recurrenceFrequencyOthersFrequency}
                      textInputErrorStatus={recurrenceFrequencyOthersTimeError}
                    />
                  )}
              </>
            )}
          </View>
          {!loading ? (
            renderExpenseDetailAccordion()
          ) : (
            <ExpenseDetailAccordionSkeleton />
          )}
          {expenseDetailStatus && renderExpenseDetail()}
        </ScrollView>

        <Card containerStyle={Styles.buttonCardContainer}>
          {!loading ? (
            <Button
              containerStyle={Styles.buttonContainer}
              label={expenseId ? Labels.updateExpense : Labels.addExpense}
              loading={
                !Boolean(createBalanceModalStatus) &&
                Boolean(props.loadingStatus)
              }
              onPress={() => {
                handleExpense();
              }}
            />
          ) : (
            <ButtonSkeleton width={Helpers.windowWidth * 0.9125} />
          )}
        </Card>

        <ImagePicker
          onChange={fileData => {
            showMessage({
              icon: 'auto',
              message: Labels.uploadingFile,
              position: 'bottom',
              type: 'default',
            });

            ENV.currentEnvironment == Labels.development &&
              console.log('IMAGE PICKER RESPONSE::: ', fileData);

            let helperImage = fileData.path.substring(
              fileData.path.lastIndexOf('/') + 1,
            );

            const customFileData = {
              type: fileData.mime,
              name: helperImage,
              uri: fileData.path,
              size: fileData.size,
              lastModified: new Date(),
              modificationDate: fileData.modificationDate,
            };

            ENV.currentEnvironment == Labels.development &&
              console.log('CUSTOM FILE DATA::: ', customFileData);

            fileUpload(customFileData);
          }}
          onRequestClose={() => {
            setImagePickerModalStatus(!imagePickerModalStatus);
          }}
          visible={imagePickerModalStatus}
        />

        {renderCreateBalanceModal()}

        {renderCustomizeModal()}
      </View>
    </Network>
  );
};

const mapStateToProps = state => {
  return {
    loadingStatus: state.other.loadingStatus,
    routingName: state.other.routingName,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    expenseBank: onResponse => {
      dispatch(expenseBank(onResponse));
    },

    expenseCategory: onResponse => {
      dispatch(expenseCategory(onResponse));
    },

    expenseCreate: (requestData, onResponse) => {
      dispatch(expenseCreate(requestData, onResponse));
    },

    expenseCreateGroup: (requestData, onResponse) => {
      dispatch(expenseCreateGroup(requestData, onResponse));
    },

    expenseCreateSubCategory: (requestData, onResponse) => {
      dispatch(expenseCreateSubCategory(requestData, onResponse));
    },

    expenseGroup: onResponse => {
      dispatch(expenseGroup(onResponse));
    },

    expenseSubCategory: (categoryId, onResponse) => {
      dispatch(expenseSubCategory(categoryId, onResponse));
    },

    expenseUpdate: (expenseId, requestData, onResponse) => {
      dispatch(expenseUpdate(expenseId, requestData, onResponse));
    },

    expenseView: (expenseId, onResponse) => {
      dispatch(expenseView(expenseId, onResponse));
    },

    fileUpload: (requestData, onResponse) => {
      dispatch(fileUpload(requestData, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Expense);
