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
import {incomeDelete, incomeView} from '../../../../redux/Root.Actions';
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
import Styles from '../../../../styles/appStyles/receiptScanning/addManually/IncomeView';
import * as ENV from '../../../../../env';
import * as Endpoints from '../../../../api/Endpoints';
import * as Helpers from '../../../../utils/Helpers';
import * as HelperStyles from '../../../../utils/HelperStyles';
import * as ShareContent from '../../../../utils/ShareContent';

const IncomeView = props => {
  // Props Variables
  const incomeId =
    props.route.params && props.route.params.hasOwnProperty('incomeId')
      ? props.route.params.incomeId
      : props.hasOwnProperty('incomeId')
      ? props.incomeId
      : null;

  // IncomeView Variables
  const [incomeData, setIncomeData] = useState(null);
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
            props.navigation.navigate('Income', {incomeId: incomeId});
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

    const fileName = `${Labels.income}${Boolean(userId) ? `_${userId}` : ''}`;

    let htmlTopdfOptions = {
      html: ShareContent.incomeShareContent(incomeData.info, incomeData.items),
      fileName: fileName,
      directory: 'Documents',
    };

    const fileData = await RNHTMLtoPDF.convert(htmlTopdfOptions);

    if (Boolean(fileData) && typeof fileData == 'object') {
      const shareOptions = {
        message: `Click the below link to view the income: \n ${ENV.deepLinkingHost}/${Endpoints.income}/${incomeId}`,
        subject: Labels.income,
        title: Labels.income,
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

      fetchIncome();

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const fetchIncome = () => {
    props.incomeView(incomeId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('INCOME VIEW RESPONSE DATA::: ', response);

      setIncomeData(response);

      setRefreshing(false);
    });
  };

  const onRefresh = () => {
    setRefreshing(true);

    setIncomeData(null);

    showMessage({
      icon: 'auto',
      message: Labels.fetchingData,
      position: 'bottom',
      type: 'default',
    });

    fetchIncome();
  };

  const renderReceivedPaymentFor = () => {
    const receivedPaymentForData = incomeData.info || null;
    const receivedPaymentForCategory =
      Boolean(receivedPaymentForData) &&
      receivedPaymentForData.hasOwnProperty('category') &&
      receivedPaymentForData.category.hasOwnProperty('name') &&
      Boolean(receivedPaymentForData.category.name)
        ? receivedPaymentForData.category.name
        : '-';
    const receivedPaymentForSubCategory =
      Boolean(receivedPaymentForData) &&
      receivedPaymentForData.hasOwnProperty('subcategory') &&
      receivedPaymentForData.subcategory.hasOwnProperty('name') &&
      Boolean(receivedPaymentForData.subcategory.name)
        ? receivedPaymentForData.subcategory.name
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
          {Labels.receivedPaymentFor}
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
              {receivedPaymentForCategory}
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
              {receivedPaymentForSubCategory.toLowerCase() ==
              Labels.others.toLowerCase()
                ? `${receivedPaymentForSubCategory} (${receivedPaymentForData.subcategoryOther})`
                : receivedPaymentForSubCategory}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderReceivedPaymentVia = () => {
    const receivedPaymentViaData = incomeData.info || null;
    const receivedPaymentViaBank =
      Boolean(receivedPaymentViaData) &&
      receivedPaymentViaData.hasOwnProperty('balance') &&
      Boolean(receivedPaymentViaData.balance) &&
      receivedPaymentViaData.balance.hasOwnProperty('bank') &&
      Boolean(receivedPaymentViaData.balance.bank) &&
      receivedPaymentViaData.balance.bank.hasOwnProperty('name') &&
      Boolean(receivedPaymentViaData.balance.bank.name)
        ? receivedPaymentViaData.balance.bank.name
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
          {Labels.receivedPaymentVia}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {receivedPaymentViaBank}
        </Text>
      </View>
    );
  };

  const renderPayer = () => {
    const payerData = incomeData.info || null;
    const payer =
      Boolean(payerData) &&
      payerData.hasOwnProperty('payer') &&
      Boolean(payerData.payer)
        ? payerData.payer
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
          {Labels.shop} / {Labels.payer}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {payer}
        </Text>
      </View>
    );
  };

  const renderTotalAmount = () => {
    const totalAmountData = incomeData.info || null;
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
    const dateData = incomeData.info || null;
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
    const recurrenceData = incomeData.info || null;
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
    const recurrenceFrequencyData = incomeData.info || null;
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
    const itemsData = incomeData.items || null;

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
    const notesData = incomeData.info || null;
    const notes =
      Boolean(notesData) &&
      notesData.hasOwnProperty('note') &&
      Boolean(notesData.note)
        ? notesData.note
        : '-';

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
    const attachmentData = incomeData.info || null;
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

  const ReceivedPaymentForSkeleton = () => {
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

  const ReceivedPaymentViaSkeleton = () => {
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

  const PayerSkeleton = () => {
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

    props.incomeDelete(incomeId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('INCOME DELETE RESPONSE DATA::: ', response);

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
            {Boolean(incomeData) ? (
              Object.keys(incomeData).length != 0 ? (
                <View style={HelperStyles.margin(20, 8)}>
                  {renderReceivedPaymentFor()}
                  {renderReceivedPaymentVia()}
                  {renderPayer()}
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
                <ReceivedPaymentForSkeleton />
                <ReceivedPaymentViaSkeleton />
                <PayerSkeleton />
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
          message={Labels.deleteIncome}
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
    incomeDelete: (incomeId, onResponse) => {
      dispatch(incomeDelete(incomeId, onResponse));
    },

    incomeView: (incomeId, onResponse) => {
      dispatch(incomeView(incomeId, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IncomeView);
