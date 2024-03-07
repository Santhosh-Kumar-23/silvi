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
import {connect} from 'react-redux';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {
  fileUpload,
  incomeBank,
  incomeCategory,
  incomeCreate,
  incomeCreateSubCategory,
  incomeSubCategory,
  incomeUpdate,
  incomeView,
  loadingStatus,
  storeAccountViewOffset,
} from '../../../../redux/Root.Actions';
import {hideMessage, showMessage} from 'react-native-flash-message';
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
import Network from '../../../../containers/Network';
import RadioButton from '../../../../components/appComponents/RadioButton';
import SkeletonButton from '../../../../components/skeletonComponents/SkeletonButton';
import SkeletonCard from '../../../../components/skeletonComponents/SkeletonCard';
import SkeletonCustomDateTimePicker from '../../../../components/skeletonComponents/SkeletonCustomDateTimePicker';
import SkeletonDropdown from '../../../../components/skeletonComponents/SkeletonDropdown';
import SkeletonLabel from '../../../../components/skeletonComponents/SkeletonLabel';
import SkeletonPlaceholder from '../../../../containers/SkeletonPlaceholder';
import Store from '../../../../redux/Store';
import Styles from '../../../../styles/appStyles/receiptScanning/addManually/Income';
import TimePeriod from '../../../../components/appComponents/TimePeriod';
import * as ENV from '../../../../../env';
import * as Helpers from '../../../../utils/Helpers';
import * as HelperStyles from '../../../../utils/HelperStyles';

const Income = props => {
  // Props variables
  const incomeId =
    props.route.params && props.route.params.hasOwnProperty('incomeId')
      ? props.route.params.incomeId
      : null;

  // Income Variables
  const [receivedPaymentForCategory, setReceivedPaymentForCategory] =
    useState(null);
  const [receivedPaymentForSubCategory, setReceivedPaymentForSubCategory] =
    useState(null);
  const [
    receivedPaymentForSubCategoryOthers,
    setReceivedPaymentForSubCategoryOthers,
  ] = useState(null);
  const [payer, setPayer] = useState(null);
  const [receivedPaymentVia, setReceivedPaymentVia] = useState(null);
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
  const [incomeDetailStatus, setIncomeDetailStatus] = useState(false);
  const [itemCategory, setItemCategory] = useState([]);
  const [itemSubCategoryTotal, setItemSubCategoryTotal] = useState(null);
  const [notes, setNotes] = useState(null);
  const [imagePickerModalStatus, setImagePickerModalStatus] = useState(false);
  const [attachment, setAttachment] = useState(null);

  // Error Variables
  const [receivedPaymentForCategoryError, setReceivedPaymentForCategoryError] =
    useState(false);
  const [
    receivedPaymentForSubCategoryError,
    setReceivedPaymentForSubCategoryError,
  ] = useState(false);
  const [
    receivedPaymentForSubCategoryOthersError,
    setReceivedPaymentForSubCategoryOthersError,
  ] = useState(false);
  const [payerError, setPayerError] = useState(false);
  const [receivedPaymentViaError, setReceivedPaymentViaError] = useState(false);
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
  const [subCategoryOtherVisible, setSubCategoryOtherVisible] = useState(null);
  const [bankList, setBankList] = useState(null);
  const [createBalanceModalStatus, setCreateBalanceModalStatus] =
    useState(false);
  const [customizeModalStatus, setCustomizeModalStatus] = useState(false);

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

      setIncomeDetailStatus(true);

      Boolean(incomeId)
        ? [
            showMessage({
              icon: 'auto',
              message: Labels.fetchingData,
              position: 'bottom',
              type: 'default',
            }),

            setLoading(true),
          ]
        : [incomeCategory(), incomeBank()];

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const incomeCategory = async () => {
    await props.incomeCategory(res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('INCOME CATEGORY RESPONSE DATA::: ', response);

      setCategoryOption(response);
    });
  };

  const incomeBank = async customBankName => {
    await props.incomeBank(res => {
      const response = res.resJson.data.list;

      ENV.currentEnvironment == Labels.development &&
        console.log('INCOME BANK RESPONSE DATA::: ', response);

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
            console.log('INCOME DEFAULT BANK::: ', defaultBank);

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

  useFocusEffect(
    useCallback(() => {
      if (Boolean(incomeId)) {
        incomeId && handleEditData();
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

    Boolean(incomeId) &&
      showMessage({
        icon: 'auto',
        message: Labels.fetchingData,
        position: 'bottom',
        type: 'default',
      });

    setLoading(true);
  };

  const handleEditData = () => {
    props.incomeView(incomeId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('INCOME VIEW RESPONSE DATA::: ', response);

      const infoResponse = res.resJson.data.info;

      ENV.currentEnvironment == Labels.development &&
        console.log('INCOME VIEW INFO RESPONSE DATA::: ', infoResponse);

      incomeCategory();

      setReceivedPaymentForCategory(infoResponse.category.id);

      incomeSubCategory(
        infoResponse.category.id,
        Boolean(infoResponse.subcategory) &&
          Object.keys(infoResponse.subcategory).length != 0
          ? infoResponse.subcategory.name
          : null,
      );

      setSubCategoryOtherVisible(
        Boolean(infoResponse.subcategory) &&
          Object.keys(infoResponse.subcategory).length != 0
          ? infoResponse.subcategory.name
          : null,
      );

      setReceivedPaymentForSubCategoryOthers(
        infoResponse.subcategoryOther || null,
      );

      incomeBank(
        infoResponse.hasOwnProperty('balance') &&
          infoResponse.balance.hasOwnProperty('bank') &&
          infoResponse.balance.bank.hasOwnProperty('name')
          ? infoResponse.balance.bank.name
          : null,
      );

      setPayer(infoResponse.payer);

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

  const incomeSubCategory = async (categoryId, customSubCategoryName) => {
    await props.incomeSubCategory(categoryId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('INCOME SUB CATEGORY RESPONSE DATA::: ', response);

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
            setReceivedPaymentForSubCategory(filteredSubCategory[0].id),
            setReceivedPaymentForSubCategoryOthers(filteredSubCategory[0].name),
          ];
        } else {
          setReceivedPaymentForSubCategory(null);
          setReceivedPaymentForSubCategoryOthers(null);
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

  const handleReceivedPaymentForSubCategorySelection = selectedValue => {
    receivedPaymentForSubCategoryError &&
      setReceivedPaymentForSubCategoryError(false);

    const selectedReceivedPaymentForSubCategory =
      Boolean(selectedValue) && Object.keys(selectedValue).length != 0
        ? selectedValue.id
        : null;

    const selectedReceivedPaymentForSubCategoryOtherVisible =
      Boolean(selectedValue) && Object.keys(selectedValue).length != 0
        ? selectedValue.name
        : null;

    if (
      Boolean(selectedReceivedPaymentForSubCategory) &&
      selectedReceivedPaymentForSubCategory == Labels.customize
    ) {
      setReceivedPaymentForSubCategory(selectedReceivedPaymentForSubCategory);

      setSubCategoryOtherVisible(
        selectedReceivedPaymentForSubCategoryOtherVisible,
      );

      setCustomizeModalStatus(!customizeModalStatus);
    } else {
      setReceivedPaymentForSubCategory(selectedReceivedPaymentForSubCategory);

      setSubCategoryOtherVisible(
        selectedReceivedPaymentForSubCategoryOtherVisible,
      );
    }

    setReceivedPaymentForSubCategoryOthers(null);
  };

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

  const renderIncomeDetailAccordion = () => {
    return (
      <View
        style={[
          Styles.incomeDetailAccordionContainer,
          !incomeDetailStatus && HelperStyles.justView('marginBottom', 8),
        ]}>
        <View style={Styles.incomeDetailAccordionLabelContainer}>
          <Text
            style={HelperStyles.textView(
              14,
              '600',
              Colors.primaryText,
              'left',
              'none',
            )}>
            {Labels.incomeDetail}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setIncomeDetailStatus(!incomeDetailStatus);
          }}
          style={Styles.incomeDetailAccordionImageContainer}>
          <Image
            resizeMode={'contain'}
            source={Assets.arrow}
            style={[
              Styles.incomeDetailAccordionImage,
              HelperStyles.justView('transform', [
                {rotate: incomeDetailStatus ? '180deg' : '0deg'},
              ]),
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderIncomeDetail = () => {
    return (
      <View style={Styles.incomeDetailContainer}>
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
                          {color: Theme.primaryText},
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
            HelperStyles.margin(4, 0),
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
        console.log('INCOME FILE UPLOAD RESPONSE DATA::: ', response);

      setAttachment(response.url);
    });
  };

  const LabelSkeleton = ({height = 18, style = {}}) => {
    return <SkeletonLabel height={height} style={style} />;
  };

  const DropdownSkeleton = () => {
    return <SkeletonDropdown textWidth={Helpers.windowWidth * 0.3} />;
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

  const IncomeDetailAccordionSkeleton = () => {
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

  const handleIncome = () => {
    if (checkIncome()) {
      Store.dispatch(loadingStatus(true));

      const requestData = handleRequestData();

      ENV.currentEnvironment == Labels.development &&
        console.log('INCOME REQUEST DATA::: ', requestData);

      if (incomeId) {
        props.incomeUpdate(incomeId, requestData, res => {
          handleReset();

          props.navigation.goBack();
        });
      } else {
        props.incomeCreate(requestData, res => {
          handleReset();

          if (findSelectedBankIndexOffset() != -1) {
            props.navigation.navigate('AccountView', {
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

  const checkIncome = () => {
    const receivedPaymentForSubCategoryOthersCheck =
      Boolean(receivedPaymentForSubCategory) &&
      subCategoryOtherVisible.toLowerCase() == Labels.others.toLowerCase()
        ? Boolean(receivedPaymentForSubCategoryOthers)
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

    if (
      Boolean(receivedPaymentForCategory) &&
      Boolean(receivedPaymentForSubCategory) &&
      Boolean(receivedPaymentForSubCategoryOthersCheck) &&
      Boolean(receivedPaymentVia) &&
      Helpers.checkField(payer) &&
      Boolean(totalAmountCheck) &&
      Boolean(date) &&
      Boolean(recurrence) &&
      Boolean(recurrenceFrequencyCheck) &&
      Boolean(recurrenceFrequencyOthersTimeCheck) &&
      Boolean(recurrenceFrequencyOthersFrequencyCheck) &&
      Boolean(itemSubCategoryTotalCheck)
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

        incomeId && object.income && delete object['income'];
        incomeId && object.id && delete object['id'];
      });

    requestData = {
      payer: payer,
      amount: Number(totalAmount),
      note: Helpers.checkField(notes) ? notes : null,
      attachment: attachment,
      datedOn: date,
      isReccurening: recurrence == Labels.yes ? true : false,
      balance: {
        _id: receivedPaymentVia,
      },
      category: {
        _id: receivedPaymentForCategory,
      },
      subcategory: {
        _id: receivedPaymentForSubCategory,
      },
      item: filteredItemCategory,
    };

    Boolean(subCategoryOtherVisible) &&
      subCategoryOtherVisible.toLowerCase() == Labels.others.toLowerCase() && [
        (requestData = {
          ...requestData,
          subcategoryOther: receivedPaymentForSubCategoryOthers,
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
    const helperArray = bankList.filter(lol => lol.id != Labels.addAccount);

    helperArray.reverse();

    const selectedAccountIndex = helperArray.findIndex(
      lol => lol.id == receivedPaymentVia,
    );

    const offset = Math.ceil((selectedAccountIndex + 1) / ENV.dataLimit);

    Store.dispatch(storeAccountViewOffset(offset));

    return selectedAccountIndex - (offset - 1) * ENV.dataLimit;
  };

  const handleErrorValidation = () => {
    setReceivedPaymentForCategoryError(
      Boolean(receivedPaymentForCategory) ? false : true,
    );
    setReceivedPaymentForSubCategoryError(
      Boolean(receivedPaymentForSubCategory) ? false : true,
    );
    setReceivedPaymentForSubCategoryOthersError(
      Boolean(receivedPaymentForSubCategory) &&
        subCategoryOtherVisible.toLowerCase() == Labels.others.toLowerCase()
        ? Boolean(receivedPaymentForSubCategoryOthers)
          ? false
          : true
        : false,
    );
    setReceivedPaymentViaError(Boolean(receivedPaymentVia) ? false : true);
    setPayerError(Helpers.checkField(payer) ? false : true);
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
    setReceivedPaymentForCategory(null);
    setReceivedPaymentForSubCategory(null);
    setReceivedPaymentForSubCategoryOthers(null);
    setPayer(null);
    setReceivedPaymentVia(null);
    setTotalAmount(null);
    setDate(null);
    setRecurrence(null);
    setRecurrenceFrequency(null);
    setRecurrenceFrequencyOthersTime(null);
    setRecurrenceFrequencyOthersFrequency(null);
    setIncomeDetailStatus(true);
    setItemCategory([]);
    setItemSubCategoryTotal(null);
    setNotes(null);
    setImagePickerModalStatus(false);
    setAttachment(null);
    setReceivedPaymentForCategoryError(false);
    setReceivedPaymentForSubCategoryError(false);
    setReceivedPaymentForSubCategoryOthersError(null);
    setPayerError(false);
    setReceivedPaymentViaError(false);
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
        onConfirm={txt => {
          showMessage({
            icon: 'auto',
            message: Labels.fetchingCreatedBalanceData,
            position: 'bottom',
            type: 'default',
          });

          ENV.currentEnvironment == Labels.development &&
            console.log('INCOME CREATE ACCOUNT TXT::: ', txt);

          const filteredBank = bankList.filter(lol => lol.name == txt);

          if (filteredBank.length != 0) {
            setReceivedPaymentVia(filteredBank[0].id);
          } else {
            incomeBank(txt);
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

  const renderCustomizeModal = () => {
    return (
      <CustomizeModal
        label={Labels.subCategory}
        onBack={() => {
          setReceivedPaymentForSubCategoryError(false);
          setReceivedPaymentForSubCategoryOthersError(false);

          setReceivedPaymentForSubCategory(null);
          setReceivedPaymentForSubCategoryOthers(null);
          setSubCategoryOtherVisible(null);

          setCustomizeModalStatus(!customizeModalStatus);
        }}
        onConfirm={txt => {
          ENV.currentEnvironment == Labels.development &&
            console.log('INCOME SUB CATEGORY CUSTOMIZE MODAL TXT::: ', txt);

          const filteredSubCategory = subCategoryOption.filter(
            lol => lol.name == txt,
          );

          if (filteredSubCategory.length != 0) {
            setReceivedPaymentForSubCategory(filteredSubCategory[0].id);

            setReceivedPaymentForSubCategoryOthers(filteredSubCategory[0].name);
          } else {
            incomeCreateSubCategory(txt);
          }
        }}
        onRequestClose={() => {
          setCustomizeModalStatus(!customizeModalStatus);
        }}
        visible={customizeModalStatus}
      />
    );
  };

  const incomeCreateSubCategory = customSubCategoryName => {
    const requestData = {
      category: {_id: receivedPaymentForCategory},
      icon: null,
      name: customSubCategoryName,
    };

    props.incomeCreateSubCategory(requestData, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('INCOME CREATE SUB CATEGORY RESPONSE DATA::: ', response);

      showMessage({
        icon: 'auto',
        message: Labels.fetchingCreatedSubCategoryData,
        position: 'bottom',
        type: 'default',
      });

      incomeSubCategory(receivedPaymentForCategory, customSubCategoryName);
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
                {Labels.receivedPaymentFor}
              </Text>
            ) : (
              <LabelSkeleton height={16} />
            )}
            <View style={Styles.receivedPaymentForContainer}>
              <View style={Styles.receivedPaymentForCategoryContainer}>
                {!loading ? (
                  <Dropdown
                    modalHeaderLabel={`${Labels.select} ${Labels.receivedPaymentFor}`}
                    onValueChange={selectedValue => {
                      ENV.currentEnvironment == Labels.development &&
                        console.log(
                          'RECEIVED PAYMENT FOR CATEGORY SELECTED VALUE::: ',
                          selectedValue,
                        );

                      receivedPaymentForCategoryError &&
                        setReceivedPaymentForCategoryError(false);

                      setReceivedPaymentForCategory(
                        Boolean(selectedValue) &&
                          Object.keys(selectedValue).length != 0
                          ? selectedValue.id
                          : null,
                      );

                      setReceivedPaymentForSubCategory(null);
                      setReceivedPaymentForSubCategoryOthers(null);
                      setSubCategoryOtherVisible(null);

                      Object.keys(selectedValue).length != 0 &&
                        incomeSubCategory(selectedValue.id);
                    }}
                    optionImageKey={'icon'}
                    optionLabelKey={'name'}
                    options={categoryOption}
                    optionValueKey={'id'}
                    searchEnabled={true}
                    value={receivedPaymentForCategory}
                  />
                ) : (
                  <DropdownSkeleton />
                )}
                {receivedPaymentForCategoryError && (
                  <Text
                    style={[
                      HelperStyles.errorText,
                      HelperStyles.justView('marginHorizontal', 0),
                    ]}>
                    {Labels.categoryError}
                  </Text>
                )}
                {!receivedPaymentForCategoryError &&
                  receivedPaymentForSubCategoryError && (
                    <Text
                      style={[
                        HelperStyles.errorText,
                        HelperStyles.justView('marginHorizontal', 0),
                      ]}
                    />
                  )}
              </View>
              <View style={Styles.receivedPaymentForSubCategoryContainer}>
                {!loading ? (
                  <Dropdown
                    disabled={!Boolean(receivedPaymentForCategory)}
                    label={Labels.subCategory}
                    modalHeaderLabel={`${Labels.select} ${Labels.receivedPaymentFor} ${Labels.subCategory}`}
                    onValueChange={selectedValue => {
                      ENV.currentEnvironment == Labels.development &&
                        console.log(
                          'RECEIVED PAYMENT FOR SUB CATEGORY SELECTED VALUE::: ',
                          selectedValue,
                        );

                      handleReceivedPaymentForSubCategorySelection(
                        selectedValue,
                      );
                    }}
                    optionImageKey={'icon'}
                    optionLabelKey={'name'}
                    options={subCategoryOption}
                    optionValueKey={'id'}
                    searchEnabled={true}
                    value={receivedPaymentForSubCategory}
                  />
                ) : (
                  <DropdownSkeleton />
                )}
                {receivedPaymentForSubCategoryError && (
                  <Text
                    style={[
                      HelperStyles.errorText,
                      HelperStyles.justView('marginHorizontal', 0),
                    ]}>
                    {Labels.subCategoryError}
                  </Text>
                )}
                {!receivedPaymentForSubCategoryError &&
                  receivedPaymentForCategoryError && (
                    <Text
                      style={[
                        HelperStyles.errorText,
                        HelperStyles.justView('marginHorizontal', 0),
                      ]}
                    />
                  )}
              </View>
            </View>
            {Boolean(receivedPaymentForSubCategory) &&
              Boolean(subCategoryOtherVisible) &&
              subCategoryOtherVisible.toLowerCase() ==
                Labels.others.toLowerCase() && (
                <CustomFloatingTextInput
                  autoCapitalize={'sentences'}
                  cardContainerStyle={Styles.floatingTextInputCardContainer}
                  editable={Boolean(
                    receivedPaymentForCategory && receivedPaymentForSubCategory,
                  )}
                  errorLabel={Labels.othersError}
                  errorStatus={receivedPaymentForSubCategoryOthersError}
                  errorTextStyle={HelperStyles.justView('marginHorizontal', 12)}
                  onChangeText={txt => {
                    ENV.currentEnvironment == Labels.development &&
                      console.log(
                        'RECEIVED PAYMENT FOR SUB CATEGORY OTHERS TXT::: ',
                        txt,
                      );

                    receivedPaymentForSubCategoryOthersError &&
                      setReceivedPaymentForSubCategoryOthersError(false);

                    setReceivedPaymentForSubCategoryOthers(txt);
                  }}
                  textInputContainerStyle={Styles.floatingTextInputContainer}
                  textInputLabelStyle={Styles.floatingTextInputLabel}
                  textInputStyle={Styles.floatingTextInput}
                  title={Labels.others}
                  value={receivedPaymentForSubCategoryOthers}
                />
              )}
            {!loading ? (
              <DropdownCard
                disabled={
                  !Boolean(
                    receivedPaymentForCategory && receivedPaymentForSubCategory,
                  )
                }
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
              <Card containerStyle={Styles.floatingTextInputCardContainer}>
                <FloatingTextInput
                  autoCapitalize={'none'}
                  editable={Boolean(
                    receivedPaymentForCategory && receivedPaymentForSubCategory,
                  )}
                  keyboardType={'default'}
                  textContentType={'none'}
                  textInputContainerStyle={Styles.floatingTextInputContainer}
                  textInputLabelStyle={Styles.floatingTextInputLabel}
                  textInputStyle={Styles.floatingTextInput}
                  title={Labels.payer}
                  updateMasterState={txt => {
                    payerError && setPayerError(false);

                    setPayer(txt);
                  }}
                  value={payer}
                />
              </Card>
            ) : (
              <FloatingTextInputSkeleton />
            )}
            {payerError && (
              <Text
                style={[
                  HelperStyles.errorText,
                  HelperStyles.justView('marginHorizontal', 12),
                ]}>
                {Labels.payerError}
              </Text>
            )}
            {!loading ? (
              <Card containerStyle={Styles.floatingTextInputCardContainer}>
                <FloatingTextInput
                  autoCapitalize={'none'}
                  editable={Boolean(
                    receivedPaymentForCategory && receivedPaymentForSubCategory,
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
                  !Boolean(
                    receivedPaymentForCategory && receivedPaymentForSubCategory,
                  )
                }
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
                disabled={
                  !Boolean(
                    receivedPaymentForCategory && receivedPaymentForSubCategory,
                  )
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
                        receivedPaymentForCategory &&
                          receivedPaymentForSubCategory,
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
                  <DropdownSkeleton />
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
                          receivedPaymentForCategory &&
                            receivedPaymentForSubCategory,
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
            renderIncomeDetailAccordion()
          ) : (
            <IncomeDetailAccordionSkeleton />
          )}
          {incomeDetailStatus && renderIncomeDetail()}
        </ScrollView>

        <Card containerStyle={Styles.buttonCardContainer}>
          {!loading ? (
            <Button
              containerStyle={Styles.buttonContainer}
              label={incomeId ? Labels.updateIncome : Labels.addIncome}
              loading={
                !Boolean(createBalanceModalStatus) &&
                Boolean(props.loadingStatus)
              }
              onPress={() => {
                handleIncome();
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
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fileUpload: (requestData, onResponse) => {
      dispatch(fileUpload(requestData, onResponse));
    },

    incomeBank: onResponse => {
      dispatch(incomeBank(onResponse));
    },

    incomeCategory: onResponse => {
      dispatch(incomeCategory(onResponse));
    },

    incomeCreate: (requestData, onResponse) => {
      dispatch(incomeCreate(requestData, onResponse));
    },

    incomeCreateSubCategory: (requestData, onResponse) => {
      dispatch(incomeCreateSubCategory(requestData, onResponse));
    },

    incomeSubCategory: (categoryId, onResponse) => {
      dispatch(incomeSubCategory(categoryId, onResponse));
    },

    incomeUpdate: (incomeId, requestData, onResponse) => {
      dispatch(incomeUpdate(incomeId, requestData, onResponse));
    },

    incomeView: (incomeId, onResponse) => {
      dispatch(incomeView(incomeId, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Income);
