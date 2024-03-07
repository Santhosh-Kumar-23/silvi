import React, {useCallback, useLayoutEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {expenseDelete, expenseView} from '../../../../redux/Root.Actions';
import {connect} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../../assets/Index';
import Colors from '../../../../utils/Colors';
import CustomModal from '../../../../components/appComponents/CustomModal';
import Labels from '../../../../utils/Strings';
import Network from '../../../../containers/Network';
import NoResponse from '../../../../components/appComponents/NoResponse';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import SkeletonLabel from '../../../../components/skeletonComponents/SkeletonLabel';
import SkeletonPlaceholder from '../../../../containers/SkeletonPlaceholder';
import Styles from '../../../../styles/appStyles/receiptScanning/addManually/ExpenseView';
import * as Endpoints from '../../../../api/Endpoints';
import * as ENV from '../../../../../env';
import * as Helpers from '../../../../utils/Helpers';
import * as HelperStyles from '../../../../utils/HelperStyles';
import * as ShareContent from '../../../../utils/ShareContent';

const ExpenseView = props => {
  // Props Variables
  const expenseId = props.route.params.hasOwnProperty('expenseId')
    ? props.route.params.expenseId
    : props.hasOwnProperty('expenseId')
    ? props.expenseId
    : null;

  // ExpenseView Variables
  const [expenseData, setExpenseData] = useState(null);
  const [imageLoader, setImageLoader] = useState(false);
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);

  // Other Variables
  const [refreshing, setRefreshing] = useState(false);

  // Theme Variables
  const Theme = useTheme().colors;

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => renderHeaderRight(),
    });
  });

  const renderHeaderRight = () => {
    return (
      <View style={HelperStyles.flexDirection('row')}>
        <TouchableOpacity
          onPress={() => {
            handleShare();
          }}
          style={[
            Styles.headerIconContainer,
            HelperStyles.justView('marginRight', 12),
          ]}>
          <Image
            resizeMode={'contain'}
            source={Assets.share}
            style={[
              HelperStyles.imageView(24, 24),
              HelperStyles.justView('tintColor', Theme.text),
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setDeleteModalStatus(!deleteModalStatus);
          }}
          style={[
            Styles.headerIconContainer,
            HelperStyles.justView('marginRight', 12),
          ]}>
          <Image
            resizeMode={'contain'}
            source={Assets.delete}
            style={[
              HelperStyles.imageView(22, 22),
              HelperStyles.justView('tintColor', Theme.text),
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (
              !Boolean(expenseData.info.isSettled) &&
              !Boolean(expenseData.info.isWriteOff)
            ) {
              props.navigation.navigate('Expense', {expenseId: expenseId});
            } else if (
              Boolean(expenseData.info.claimable) &&
              Boolean(expenseData.info.isWriteOff)
            ) {
              showMessage({
                icon: 'auto',
                message: Labels.claimWriteOffEditWarning,
                position: 'bottom',
                type: 'info',
              });
            } else {
              showMessage({
                icon: 'auto',
                message: Labels.claimEditWarning,
                position: 'bottom',
                type: 'info',
              });
            }
          }}
          style={Styles.headerIconContainer}>
          <Image
            resizeMode={'contain'}
            source={Assets.edit}
            style={[
              HelperStyles.imageView(24, 24),
              HelperStyles.justView('tintColor', Theme.text),
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const handleShare = async () => {
    const userId =
      Boolean(props.userDetails) &&
      props.userDetails.hasOwnProperty('user') &&
      props.userDetails.user.hasOwnProperty('id') &&
      Boolean(props.userDetails.user.id)
        ? props.userDetails.user.id
        : null;

    const fileName = `${Labels.expense}${Boolean(userId) ? `_${userId}` : ''}`;

    let htmlTopdfOptions = {
      html: ShareContent.expenseShareContent(
        expenseData.info,
        expenseData.items,
      ),
      fileName: fileName,
      directory: 'Documents',
    };

    const fileData = await RNHTMLtoPDF.convert(htmlTopdfOptions);

    if (Boolean(fileData) && typeof fileData == 'object') {
      const shareOptions = {
        message: `Click the below link to view the expense: \n ${ENV.deepLinkingHost}/${Endpoints.expense}/${expenseId}`,
        subject: Labels.expense,
        title: Labels.expense,
        type: 'application/pdf',
        url: `file://${fileData.filePath}`,
      };

      await Share.open(shareOptions);
    } else {
      showMessage({
        description: Labels.conversionError,
        icon: 'auto',
        message: Labels.error,
        type: 'danger',
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      fetchExpense();

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const fetchExpense = () => {
    props.expenseView(expenseId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('EXPENSE VIEW RESPONSE DATA::: ', response);

      setExpenseData(response);

      setRefreshing(false);
    });
  };

  const onRefresh = () => {
    setRefreshing(true);

    setExpenseData(null);

    showMessage({
      icon: 'auto',
      message: Labels.fetchingData,
      position: 'bottom',
      type: 'default',
    });

    fetchExpense();
  };

  const renderMadePaymentFor = () => {
    const madePaymentForData = expenseData.info || null;

    const madePaymentForCategory =
      Boolean(madePaymentForData) &&
      madePaymentForData.hasOwnProperty('category') &&
      madePaymentForData.category.hasOwnProperty('name') &&
      Boolean(madePaymentForData.category.name)
        ? madePaymentForData.category.name
        : '-';

    const madePaymentForSubCategory =
      Boolean(madePaymentForData) &&
      madePaymentForData.hasOwnProperty('subcategory') &&
      madePaymentForData.subcategory.hasOwnProperty('name') &&
      Boolean(madePaymentForData.subcategory.name)
        ? madePaymentForData.subcategory.name
        : '-';

    return (
      <View style={HelperStyles.margin(0, 8)}>
        <Text
          style={HelperStyles.textView(
            12,
            '600',
            Colors.secondaryText,
            'left',
            'none',
          )}>
          {Labels.madePaymentFor}
        </Text>
        <View
          style={[
            HelperStyles.flexDirection('row'),
            HelperStyles.justView('justifyContent', 'space-between'),
            HelperStyles.justView('marginTop', 4),
          ]}>
          <View
            style={[
              HelperStyles.flex(0.4875),
              HelperStyles.justView('justifyContent', 'center'),
            ]}>
            <Text
              style={HelperStyles.textView(
                12,
                '600',
                Colors.secondaryText,
                'left',
                'none',
              )}>
              {Labels.category}
            </Text>
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '700',
                  Theme.primaryText,
                  'left',
                  'none',
                ),
                HelperStyles.justView('marginTop', 2),
              ]}>
              {madePaymentForCategory}
            </Text>
          </View>
          <View
            style={[
              HelperStyles.flex(0.4875),
              HelperStyles.justView('justifyContent', 'center'),
            ]}>
            <Text
              style={HelperStyles.textView(
                12,
                '600',
                Colors.secondaryText,
                'left',
                'none',
              )}>
              {Labels.subCategory}
            </Text>
            <Text
              style={[
                HelperStyles.textView(
                  14,
                  '700',
                  Theme.primaryText,
                  'left',
                  'none',
                ),
                HelperStyles.justView('marginTop', 2),
              ]}>
              {madePaymentForSubCategory.toLowerCase() ==
              Labels.others.toLowerCase()
                ? `${madePaymentForSubCategory} (${madePaymentForData.subcategoryOther})`
                : madePaymentForSubCategory}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderClaimable = () => {
    const claimableGroupData = expenseData.info || null;

    const claimable =
      Boolean(claimableGroupData) &&
      claimableGroupData.hasOwnProperty('claimable') &&
      Boolean(claimableGroupData.claimable)
        ? claimableGroupData.claimable
        : false;

    return (
      <View style={HelperStyles.margin(0, 8)}>
        <Text
          style={HelperStyles.textView(
            12,
            '600',
            Colors.secondaryText,
            'left',
            'none',
          )}>
          {Labels.claimable}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {Boolean(claimable) ? Labels.yes : Labels.no}
        </Text>
      </View>
    );
  };

  const renderGroup = () => {
    const groupData = expenseData.info || null;

    const groupName =
      Boolean(groupData) &&
      groupData.hasOwnProperty('group') &&
      Boolean(groupData.group) &&
      groupData.group.hasOwnProperty('name') &&
      Boolean(groupData.group.name)
        ? groupData.group.name
        : '-';

    return (
      <View style={HelperStyles.margin(0, 8)}>
        <Text
          style={HelperStyles.textView(
            12,
            '600',
            Colors.secondaryText,
            'left',
            'none',
          )}>
          {Labels.groupName}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {groupName}
        </Text>
      </View>
    );
  };

  const renderMadePaymentVia = () => {
    const madePaymentViaData = expenseData.info || null;

    const checkBalanceKey =
      Boolean(madePaymentViaData) &&
      madePaymentViaData.hasOwnProperty('balance') &&
      Boolean(madePaymentViaData.balance) &&
      madePaymentViaData.balance.hasOwnProperty('bank') &&
      Boolean(madePaymentViaData.balance.bank) &&
      madePaymentViaData.balance.bank.hasOwnProperty('name') &&
      Boolean(madePaymentViaData.balance.bank.name)
        ? madePaymentViaData.balance.bank.name
        : null;

    const checkCreditCardKey =
      madePaymentViaData.hasOwnProperty('creditcard') &&
      Boolean(madePaymentViaData.creditcard) &&
      madePaymentViaData.creditcard.hasOwnProperty('bank') &&
      Boolean(madePaymentViaData.creditcard.bank) &&
      madePaymentViaData.creditcard.bank.hasOwnProperty('name') &&
      Boolean(madePaymentViaData.creditcard.bank.name)
        ? madePaymentViaData.creditcard.bank.name
        : null;

    const madePaymentViaBank = checkBalanceKey || checkCreditCardKey || '-';

    const creditCardName =
      madePaymentViaData.hasOwnProperty('creditcard') &&
      Boolean(madePaymentViaData.creditcard) &&
      madePaymentViaData.creditcard.hasOwnProperty('name')
        ? madePaymentViaData.creditcard.name
        : null;

    const creditCardType =
      madePaymentViaData.hasOwnProperty('creditcard') &&
      Boolean(madePaymentViaData.creditcard) &&
      madePaymentViaData.creditcard.hasOwnProperty('cardtype') &&
      madePaymentViaData.creditcard.cardtype.hasOwnProperty('name')
        ? madePaymentViaData.creditcard.cardtype.name
        : null;

    return (
      <View style={HelperStyles.margin(0, 8)}>
        <Text
          style={HelperStyles.textView(
            12,
            '600',
            Colors.secondaryText,
            'left',
            'none',
          )}>
          {Labels.madePaymentVia}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {madePaymentViaBank}
          {Boolean(creditCardType && creditCardName) && (
            <Text
              style={HelperStyles.textView(
                14,
                '700',
                Theme.primaryText,
                'left',
                'none',
              )}>
              {` - ${creditCardType} (${creditCardName})`}
            </Text>
          )}
        </Text>
      </View>
    );
  };

  const renderShopPayee = () => {
    const shopPayeeData = expenseData.info || null;

    const shopPayee =
      Boolean(shopPayeeData) &&
      shopPayeeData.hasOwnProperty('payee') &&
      Boolean(shopPayeeData.payee)
        ? shopPayeeData.payee
        : '-';

    return (
      <View style={HelperStyles.margin(0, 8)}>
        <Text
          style={HelperStyles.textView(
            12,
            '600',
            Colors.secondaryText,
            'left',
            'none',
          )}>
          {Labels.shop} / {Labels.payee}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {shopPayee}
        </Text>
      </View>
    );
  };

  const renderTotalAmount = () => {
    const totalAmountData = expenseData.info || null;

    const totalAmount =
      Boolean(totalAmountData) &&
      totalAmountData.hasOwnProperty('amount') &&
      Boolean(totalAmountData.amount)
        ? parseFloat(totalAmountData.amount).toFixed(2)
        : '0.00';

    return (
      <View style={HelperStyles.margin(0, 8)}>
        <Text
          style={HelperStyles.textView(
            12,
            '600',
            Colors.secondaryText,
            'left',
            'none',
          )}>
          {Labels.totalAmount}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {Labels.rm} {totalAmount}
        </Text>
      </View>
    );
  };

  const renderDate = () => {
    const dateData = expenseData.info || null;

    const date =
      Boolean(dateData) &&
      dateData.hasOwnProperty('datedOn') &&
      Boolean(dateData.datedOn)
        ? Helpers.formatDateTime(dateData.datedOn, null, Labels.formatll)
        : '-';

    return (
      <View style={HelperStyles.margin(0, 8)}>
        <Text
          style={HelperStyles.textView(
            12,
            '600',
            Colors.secondaryText,
            'left',
            'none',
          )}>
          {Labels.date}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {date}
        </Text>
      </View>
    );
  };

  const renderRecurrence = () => {
    const recurrenceData = expenseData.info || null;

    const recurrence =
      Boolean(recurrenceData) &&
      recurrenceData.hasOwnProperty('isReccurening') &&
      Boolean(recurrenceData.isReccurening)
        ? Labels.yes
        : Labels.no;

    return (
      <View style={HelperStyles.margin(0, 8)}>
        <Text
          style={HelperStyles.textView(
            12,
            '600',
            Colors.secondaryText,
            'left',
            'none',
          )}>
          {Labels.recurrence}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {recurrence}
        </Text>
      </View>
    );
  };

  const renderRecurrenceFrequency = () => {
    const recurrenceFrequencyData = expenseData.info || null;

    const recurrence =
      Boolean(recurrenceFrequencyData) &&
      recurrenceFrequencyData.hasOwnProperty('isReccurening') &&
      Boolean(recurrenceFrequencyData.isReccurening)
        ? recurrenceFrequencyData.isReccurening
          ? Labels.yes
          : Labels.no
        : null;

    const recurrenceFrequency =
      Boolean(recurrenceFrequencyData) &&
      recurrenceFrequencyData.hasOwnProperty('reccurenceFrequency') &&
      Boolean(recurrenceFrequencyData.reccurenceFrequency)
        ? recurrenceFrequencyData.reccurenceFrequency
        : '-';

    return (
      Boolean(recurrence) &&
      recurrence.toLowerCase() == Labels.yes.toLowerCase() && (
        <View style={HelperStyles.margin(0, 8)}>
          <Text
            style={HelperStyles.textView(
              12,
              '600',
              Colors.secondaryText,
              'left',
              'none',
            )}>
            {Labels.recurrenceFrequency}
          </Text>
          <Text
            style={[
              HelperStyles.textView(
                14,
                '700',
                Theme.primaryText,
                'left',
                'capitalize',
              ),
              HelperStyles.justView('marginTop', 2),
            ]}>
            {recurrenceFrequency.toLowerCase() == Labels.others.toLowerCase()
              ? `${recurrenceFrequency} (${recurrenceFrequencyData.reccurenceTime} ${recurrenceFrequencyData.reccurenceTimeFrequency})`
              : recurrenceFrequency}
          </Text>
        </View>
      )
    );
  };

  const renderItems = () => {
    const itemsData = expenseData.items || null;

    return (
      Boolean(itemsData) &&
      Array.isArray(itemsData) &&
      itemsData.length != 0 && (
        <View style={HelperStyles.margin(0, 8)}>
          <Text
            style={HelperStyles.textView(
              12,
              '600',
              Colors.secondaryText,
              'left',
              'none',
            )}>
            {Labels.items}
          </Text>
          {itemsData.map((item, index) => (
            <View
              key={index}
              style={[
                HelperStyles.flexDirection('row'),
                HelperStyles.justView('justifyContent', 'space-between'),
                HelperStyles.justView('marginTop', 4),
              ]}>
              <View
                style={[
                  HelperStyles.flex(0.4875),
                  HelperStyles.justView('justifyContent', 'center'),
                ]}>
                <Text
                  style={HelperStyles.textView(
                    14,
                    '600',
                    Theme.primaryText,
                    'left',
                    'none',
                  )}>
                  {item.name}
                </Text>
              </View>
              <View
                style={[
                  HelperStyles.flex(0.4875),
                  HelperStyles.justView('justifyContent', 'center'),
                ]}>
                <Text
                  style={HelperStyles.textView(
                    14,
                    '600',
                    Colors.secondaryText,
                    'right',
                    'none',
                  )}>
                  {item.hasOwnProperty('priceUnit') && Boolean(item.priceUnit)
                    ? `${item.priceUnit} `
                    : null}
                  {item.hasOwnProperty('price') && Boolean(item.price)
                    ? parseFloat(item.price).toFixed(2)
                    : '0.00'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )
    );
  };

  const renderNotes = () => {
    const notesData = expenseData.info || null;

    const notes =
      Boolean(notesData) &&
      notesData.hasOwnProperty('note') &&
      Boolean(notesData.note)
        ? notesData.note
        : null;

    return (
      Boolean(notes) && (
        <View style={HelperStyles.margin(0, 8)}>
          <Text
            style={HelperStyles.textView(
              12,
              '600',
              Colors.secondaryText,
              'left',
              'none',
            )}>
            {Labels.notes}
          </Text>
          <Text
            style={[
              HelperStyles.textView(
                14,
                '600',
                Theme.primaryText,
                'left',
                'none',
              ),
              HelperStyles.justView('marginTop', 2),
            ]}>
            {notes}
          </Text>
        </View>
      )
    );
  };

  const renderAttachment = () => {
    const attachmentData = expenseData.info || null;

    const attachment =
      Boolean(attachmentData) &&
      attachmentData.hasOwnProperty('attachment') &&
      Boolean(attachmentData.attachment)
        ? attachmentData.attachment
        : null;

    return (
      Boolean(attachment) && (
        <View style={HelperStyles.margin(0, 8)}>
          <Text
            style={HelperStyles.textView(
              12,
              '600',
              Colors.secondaryText,
              'left',
              'none',
            )}>
            {Labels.attachment}
          </Text>
          <View style={Styles.attachmentViewContainer}>
            <Image
              onLoadStart={() => {
                setImageLoader(true);
              }}
              onLoadEnd={() => {
                setImageLoader(false);
              }}
              source={{
                uri: attachment,
              }}
              style={Styles.attachmentView}
            />
            {imageLoader && (
              <ActivityIndicator size={'large'} color={Colors.primary} />
            )}
          </View>
        </View>
      )
    );
  };

  const MadePaymentForSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <View
          style={[
            HelperStyles.flexDirection('row'),
            HelperStyles.justView('justifyContent', 'space-between'),
            HelperStyles.justView('marginTop', 4),
          ]}>
          <View
            style={[
              HelperStyles.flex(0.4875),
              HelperStyles.justView('justifyContent', 'center'),
            ]}>
            <SkeletonLabel
              width={Helpers.windowWidth * 0.375}
              style={[HelperStyles.justView('alignSelf', 'flex-start')]}
            />
            <SkeletonLabel
              height={17}
              width={Helpers.windowWidth * 0.25}
              style={[
                HelperStyles.justView('alignSelf', 'flex-start'),
                HelperStyles.justView('marginTop', 2),
              ]}
            />
          </View>
          <View
            style={[
              HelperStyles.flex(0.4875),
              HelperStyles.justView('justifyContent', 'center'),
            ]}>
            <SkeletonLabel
              width={Helpers.windowWidth * 0.375}
              style={[HelperStyles.justView('alignSelf', 'flex-start')]}
            />
            <SkeletonLabel
              height={17}
              width={Helpers.windowWidth * 0.25}
              style={[
                HelperStyles.justView('alignSelf', 'flex-start'),
                HelperStyles.justView('marginTop', 2),
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  const ClaimableSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <SkeletonLabel
          height={17}
          width={Helpers.windowWidth * 0.25}
          style={HelperStyles.justView('marginTop', 2)}
        />
      </View>
    );
  };

  const GroupSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <SkeletonLabel
          height={17}
          width={Helpers.windowWidth * 0.25}
          style={HelperStyles.justView('marginTop', 2)}
        />
      </View>
    );
  };

  const MadePaymentViaSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <SkeletonLabel
          height={17}
          width={Helpers.windowWidth * 0.25}
          style={HelperStyles.justView('marginTop', 2)}
        />
      </View>
    );
  };

  const ShopPayeeSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <SkeletonLabel
          height={17}
          width={Helpers.windowWidth * 0.25}
          style={HelperStyles.justView('marginTop', 2)}
        />
      </View>
    );
  };

  const TotalAmountSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <SkeletonLabel
          height={17}
          width={Helpers.windowWidth * 0.25}
          style={HelperStyles.justView('marginTop', 2)}
        />
      </View>
    );
  };

  const DateSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <SkeletonLabel
          height={17}
          width={Helpers.windowWidth * 0.25}
          style={HelperStyles.justView('marginTop', 2)}
        />
      </View>
    );
  };

  const RecurrenceSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <SkeletonLabel
          height={17}
          width={Helpers.windowWidth * 0.25}
          style={HelperStyles.justView('marginTop', 2)}
        />
      </View>
    );
  };

  const RecurrenceFrequencySkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <SkeletonLabel
          height={17}
          width={Helpers.windowWidth * 0.25}
          style={HelperStyles.justView('marginTop', 2)}
        />
      </View>
    );
  };

  const ItemSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <View
          style={[
            HelperStyles.flexDirection('row'),
            HelperStyles.justView('justifyContent', 'space-between'),
            HelperStyles.justView('marginTop', 4),
          ]}>
          <SkeletonLabel
            width={Helpers.windowWidth * 0.375}
            style={[HelperStyles.justView('alignSelf', 'flex-start')]}
          />
          <SkeletonLabel
            width={Helpers.windowWidth * 0.375}
            style={[HelperStyles.justView('alignSelf', 'flex-end')]}
          />
        </View>
      </View>
    );
  };

  const NotesSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <SkeletonLabel
          height={17}
          style={HelperStyles.justView('marginTop', 2)}
        />
      </View>
    );
  };

  const AttachmentSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
        <SkeletonLabel width={Helpers.windowWidth * 0.4375} />
        <SkeletonPlaceholder>
          <View style={Styles.skeletonAttachmentViewContainer} />
        </SkeletonPlaceholder>
      </View>
    );
  };

  const handleDelete = () => {
    showMessage({
      icon: 'auto',
      message: `${Labels.deleting}...`,
      position: 'bottom',
      type: 'default',
    });

    setDeleteModalStatus(!deleteModalStatus);

    props.expenseDelete(expenseId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('EXPENSE DELETE RESPONSE DATA::: ', response);

      props.navigation.goBack();
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
          <View style={HelperStyles.flex(1)}>
            {Boolean(expenseData) ? (
              Object.keys(expenseData).length != 0 ? (
                <View style={HelperStyles.margin(20, 8)}>
                  {renderMadePaymentFor()}
                  {renderClaimable()}
                  {renderGroup()}
                  {renderMadePaymentVia()}
                  {renderShopPayee()}
                  {renderTotalAmount()}
                  {renderDate()}
                  {renderRecurrence()}
                  {renderRecurrenceFrequency()}
                  {renderItems()}
                  {renderNotes()}
                  {renderAttachment()}
                </View>
              ) : (
                <NoResponse />
              )
            ) : (
              <View style={HelperStyles.margin(20, 8)}>
                <MadePaymentForSkeleton />
                <ClaimableSkeleton />
                <GroupSkeleton />
                <MadePaymentViaSkeleton />
                <ShopPayeeSkeleton />
                <TotalAmountSkeleton />
                <DateSkeleton />
                <RecurrenceSkeleton />
                <RecurrenceFrequencySkeleton />
                <ItemSkeleton />
                <NotesSkeleton />
                <AttachmentSkeleton />
              </View>
            )}
          </View>
        </ScrollView>

        <CustomModal
          message={Labels.deleteExpense}
          onNegative={() => {
            setDeleteModalStatus(!deleteModalStatus);
          }}
          onPositive={() => {
            handleDelete();
          }}
          onRequestClose={() => {
            setDeleteModalStatus(!deleteModalStatus);
          }}
          visible={deleteModalStatus}
        />
      </View>
    </Network>
  );
};

const mapStateToProps = state => {
  return {
    userDetails: state.auth.userDetails,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    expenseDelete: (expenseId, onResponse) => {
      dispatch(expenseDelete(expenseId, onResponse));
    },

    expenseView: (expenseId, onResponse) => {
      dispatch(expenseView(expenseId, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseView);
