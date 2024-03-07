import React, {useLayoutEffect, useState, useCallback} from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {billingDelete, billingView} from '../../../redux/Root.Actions';
import {connect} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../assets/Index';
import Colors from '../../../utils/Colors';
import CustomModal from '../../../components/appComponents/CustomModal';
import Labels from '../../../utils/Strings';
import Network from '../../../containers/Network';
import NoResponse from '../../../components/appComponents/NoResponse';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import SkeletonLabel from '../../../components/skeletonComponents/SkeletonLabel';
import Styles from '../../../styles/appStyles/billing/BillingView';
import * as Endpoints from '../../../api/Endpoints';
import * as ENV from '../../../../env';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';
import * as ShareContent from '../../../utils/ShareContent';

const BillingView = props => {
  // Props Variables
  const billingId =
    props.route.params && props.route.params.hasOwnProperty('billingId')
      ? props.route.params.billingId
      : props.hasOwnProperty('billingId')
      ? props.billingId
      : null;

  // BillingView Variables
  const [billingData, setBillingData] = useState(null);

  // Other Variables
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);

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
            if (!Boolean(billingData.isSettled)) {
              props.navigation.navigate('CreateBilling', {
                billingId: billingId,
              });
            } else {
              showMessage({
                icon: 'auto',
                message: Labels.billEditWarning,
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

    const fileName = `${Labels.bill}${Boolean(userId) ? `_${userId}` : ''}`;

    let htmlTopdfOptions = {
      html: ShareContent.billShareContent(billingData),
      fileName: fileName,
      directory: 'Documents',
    };

    const fileData = await RNHTMLtoPDF.convert(htmlTopdfOptions);

    if (Boolean(fileData) && typeof fileData == 'object') {
      const shareOptions = {
        message: `Click the below link to view the bill: \n ${ENV.deepLinkingHost}/${Endpoints.billing}/${billingId}`,
        subject: Labels.billing,
        title: Labels.billing,
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

  const handleDelete = () => {
    showMessage({
      icon: 'auto',
      message: `${Labels.deleting}...`,
      position: 'bottom',
      type: 'default',
    });

    setDeleteModalStatus(!deleteModalStatus);

    props.billingDelete(billingId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('BILLING DELETE RESPONSE DATA::: ', response);

      props.navigation.goBack();
    });
  };

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      fetchBilling();

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);

    setBillingData(null);

    showMessage({
      icon: 'auto',
      message: Labels.fetchingData,
      position: 'bottom',
      type: 'default',
    });

    fetchBilling();
  };

  const fetchBilling = () => {
    props.billingView(billingId, res => {
      const response = res.resJson.data.info;

      ENV.currentEnvironment == Labels.development &&
        console.log('BILLING VIEW RESPONSE DATA::: ', response);

      setBillingData(response);

      setRefreshing(false);
    });
  };

  const renderCategorySubCategory = () => {
    const categorySubCategoryData = billingData || null;

    const category =
      Boolean(categorySubCategoryData) &&
      categorySubCategoryData.hasOwnProperty('category') &&
      categorySubCategoryData.category.hasOwnProperty('name') &&
      Boolean(categorySubCategoryData.category.name)
        ? categorySubCategoryData.category.name
        : '-';

    const subCategory =
      Boolean(categorySubCategoryData) &&
      categorySubCategoryData.hasOwnProperty('subcategory') &&
      categorySubCategoryData.subcategory.hasOwnProperty('name') &&
      Boolean(categorySubCategoryData.subcategory.name)
        ? categorySubCategoryData.subcategory.name
        : '-';

    return (
      <View style={HelperStyles.margin(0, 8)}>
        <View
          style={[
            HelperStyles.flexDirection('row'),
            HelperStyles.justView('justifyContent', 'space-between'),
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
              {category}
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
              {subCategory.toLowerCase() == Labels.others.toLowerCase()
                ? `${subCategory} (${categorySubCategoryData.subcategoryOther})`
                : subCategory}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderGroup = () => {
    const group =
      Boolean(billingData) &&
      billingData.hasOwnProperty('group') &&
      billingData.group.hasOwnProperty('name') &&
      Boolean(billingData.group.name)
        ? billingData.group.name
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
          {Labels.group}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {group}
        </Text>
      </View>
    );
  };

  const renderShopPayee = () => {
    const shopPayee =
      Boolean(billingData) &&
      billingData.hasOwnProperty('payee') &&
      Boolean(billingData.payee)
        ? billingData.payee
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

  const renderCurrency = () => {
    const currency =
      Boolean(billingData) &&
      billingData.hasOwnProperty('currency') &&
      Boolean(billingData.currency)
        ? billingData.currency
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
          {Labels.currency}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {currency}
        </Text>
      </View>
    );
  };

  const renderTotalAmount = () => {
    const totalAmount =
      Boolean(billingData) &&
      billingData.hasOwnProperty('amount') &&
      Boolean(billingData.amount)
        ? parseFloat(billingData.amount).toFixed(2)
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
    const date =
      Boolean(billingData) &&
      billingData.hasOwnProperty('datedOn') &&
      Boolean(billingData.datedOn)
        ? Helpers.formatDateTime(billingData.datedOn, null, Labels.formatll)
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
    const recurrence =
      Boolean(billingData) &&
      billingData.hasOwnProperty('isReccurening') &&
      Boolean(billingData.isReccurening)
        ? billingData.isReccurening
          ? Labels.yes
          : Labels.no
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
    const recurrence =
      Boolean(billingData) &&
      billingData.hasOwnProperty('isReccurening') &&
      Boolean(billingData.isReccurening)
        ? billingData.isReccurening
          ? Labels.yes
          : Labels.no
        : null;

    const recurrenceFrequency =
      Boolean(billingData) &&
      billingData.hasOwnProperty('reccurenceFrequency') &&
      Boolean(billingData.reccurenceFrequency)
        ? billingData.reccurenceFrequency
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
              ? `${recurrenceFrequency} (${billingData.reccurenceTime} ${billingData.reccurenceTimeFrequency})`
              : recurrenceFrequency}
          </Text>
        </View>
      )
    );
  };

  const renderNotification = () => {
    const notification =
      Boolean(billingData) &&
      billingData.hasOwnProperty('notify') &&
      billingData.notify
        ? Labels.enabled
        : Labels.disabled;

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
          {Labels.notification}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {notification}
        </Text>
      </View>
    );
  };

  const CategorySubCategorySkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 8)}>
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

  const CurrencySkeleton = () => {
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

  const NotificationSkeleton = () => {
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
          <View style={HelperStyles.flex(1)}>
            {Boolean(billingData) ? (
              Object.keys(billingData).length != 0 ? (
                <View style={HelperStyles.margin(20, 8)}>
                  {renderCategorySubCategory()}
                  {renderGroup()}
                  {renderShopPayee()}
                  {renderCurrency()}
                  {renderTotalAmount()}
                  {renderDate()}
                  {renderRecurrence()}
                  {renderRecurrenceFrequency()}
                  {renderNotification()}
                </View>
              ) : (
                <NoResponse />
              )
            ) : (
              <View style={HelperStyles.margin(20, 8)}>
                <CategorySubCategorySkeleton />
                <GroupSkeleton />
                <ShopPayeeSkeleton />
                <CurrencySkeleton />
                <TotalAmountSkeleton />
                <DateSkeleton />
                <RecurrenceSkeleton />
                <RecurrenceFrequencySkeleton />
                <NotificationSkeleton />
              </View>
            )}
          </View>
        </ScrollView>

        <CustomModal
          message={Labels.deleteBilling}
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
    billingDelete: (billingId, onResponse) => {
      dispatch(billingDelete(billingId, onResponse));
    },

    billingView: (billingId, onResponse) => {
      dispatch(billingView(billingId, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BillingView);
