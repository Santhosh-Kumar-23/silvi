import React, {useLayoutEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {
  spendingDelete,
  spendingView,
} from '../../../../../../redux/Root.Actions';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../../../../assets/Index';
import Colors from '../../../../../../utils/Colors';
import CustomModal from '../../../../../../components/appComponents/CustomModal';
import Labels from '../../../../../../utils/Strings';
import Network from '../../../../../../containers/Network';
import NoResponse from '../../../../../../components/appComponents/NoResponse';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import SkeletonLabel from '../../../../../../components/skeletonComponents/SkeletonLabel';
import Styles from '../../../../../../styles/appStyles/balance/creditCard/rewards/points/SpendingView';
import * as Endpoints from '../../../../../../api/Endpoints';
import * as ENV from '../../../../../../../env';
import * as Helpers from '../../../../../../utils/Helpers';
import * as HelperStyles from '../../../../../../utils/HelperStyles';
import * as ShareContent from '../../../../../../utils/ShareContent';

const SpendingView = props => {
  // Props variables
  const spendingId =
    props.route.params && props.route.params.hasOwnProperty('spendingId')
      ? props.route.params.spendingId
      : null;

  // SpendingView Variables
  const [spendingData, setSpendingData] = useState(null);

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
            props.navigation.navigate(Labels.spending, {
              editData: spendingData,
            });
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

    const fileName = `${Labels.spending}${Boolean(userId) ? `_${userId}` : ''}`;

    let htmlTopdfOptions = {
      html: ShareContent.spendingShareContent(spendingData),
      fileName: fileName,
      directory: 'Documents',
    };

    const fileData = await RNHTMLtoPDF.convert(htmlTopdfOptions);

    if (Boolean(fileData) && typeof fileData == 'object') {
      const shareOptions = {
        message: `Click the below link to view the credit card: \n ${ENV.deepLinkingHost}/${Endpoints.spending}/${spendingId}`,
        subject: Labels.spending,
        title: Labels.spending,
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

      fetchSpending();

      return () => {
        isFocus = false;
      };
    }, []),
  );

  const fetchSpending = () => {
    props.spendingView(spendingId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('SPENDING VIEW RESPONSE DATA::: ', response);

      setSpendingData(response);

      setRefreshing(false);
    });
  };

  const onRefresh = () => {
    setRefreshing(true);

    setSpendingData(null);

    showMessage({
      icon: 'auto',
      message: Labels.fetchingData,
      position: 'bottom',
      type: 'default',
    });

    fetchSpending();
  };

  const renderSpentRewardPointsFor = () => {
    const spentRewardPointsForData = spendingData || null;

    const spentRewardPointsForCategory =
      Boolean(spentRewardPointsForData) &&
      spentRewardPointsForData.hasOwnProperty('category') &&
      spentRewardPointsForData.category.hasOwnProperty('name') &&
      Boolean(spentRewardPointsForData.category.name)
        ? spentRewardPointsForData.category.name
        : '-';

    const spentRewardPointsForSubCategory =
      Boolean(spentRewardPointsForData) &&
      spentRewardPointsForData.hasOwnProperty('subcategory') &&
      spentRewardPointsForData.subcategory.hasOwnProperty('name') &&
      Boolean(spentRewardPointsForData.subcategory.name)
        ? spentRewardPointsForData.subcategory.name
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
          {Labels.spendingFor}
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
              {spentRewardPointsForCategory}
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
              {spentRewardPointsForSubCategory.toLowerCase() ==
              Labels.others.toLowerCase()
                ? `${spentRewardPointsForSubCategory} (${spentRewardPointsForData.subcategoryOther})`
                : spentRewardPointsForSubCategory}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderCreditCard = () => {
    const creditCardData = spendingData || null;

    const creditCardBank =
      creditCardData.hasOwnProperty('creditcard') &&
      Boolean(creditCardData.creditcard) &&
      creditCardData.creditcard.hasOwnProperty('bank') &&
      Boolean(creditCardData.creditcard.bank) &&
      creditCardData.creditcard.bank.hasOwnProperty('name') &&
      Boolean(creditCardData.creditcard.bank.name)
        ? creditCardData.creditcard.bank.name
        : '-';

    const creditCardName =
      creditCardData.hasOwnProperty('creditcard') &&
      Boolean(creditCardData.creditcard) &&
      creditCardData.creditcard.hasOwnProperty('name')
        ? creditCardData.creditcard.name
        : null;

    const creditCardType =
      creditCardData.hasOwnProperty('creditcard') &&
      Boolean(creditCardData.creditcard) &&
      creditCardData.creditcard.hasOwnProperty('cardtype') &&
      creditCardData.creditcard.cardtype.hasOwnProperty('name')
        ? creditCardData.creditcard.cardtype.name
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
          {Labels.creditCard}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {creditCardBank}
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
    const shopPayeeData = spendingData || null;

    const shopPayee =
      Boolean(shopPayeeData) &&
      shopPayeeData.hasOwnProperty('name') &&
      Boolean(shopPayeeData.name)
        ? shopPayeeData.name
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

  const renderPoints = () => {
    const pointsData = spendingData || null;

    const points =
      Boolean(pointsData) &&
      pointsData.hasOwnProperty('points') &&
      Boolean(pointsData.points)
        ? pointsData.points
        : 0;

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
          {Labels.points}
        </Text>
        <Text
          style={[
            HelperStyles.textView(14, '700', Theme.primaryText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {points} {Labels.pts}
        </Text>
      </View>
    );
  };

  const renderDate = () => {
    const dateData = spendingData || null;

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

  const CategorySubCategorySkeleton = () => {
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

  const CreditCardSkeleton = () => {
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

  const PointsSkeleton = () => {
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

  const handleDelete = () => {
    showMessage({
      icon: 'auto',
      message: `${Labels.deleting}...`,
      position: 'bottom',
      type: 'default',
    });

    setDeleteModalStatus(!deleteModalStatus);

    props.spendingDelete(spendingId, res => {
      const response = res.resJson.data;

      ENV.currentEnvironment == Labels.development &&
        console.log('SPENDING DELETE RESPONSE DATA::: ', response);

      props.navigation.goBack();
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
          <View style={HelperStyles.flex(1)}>
            {Boolean(spendingData) ? (
              Object.keys(spendingData).length != 0 ? (
                <View style={HelperStyles.margin(20, 8)}>
                  {renderSpentRewardPointsFor()}
                  {renderCreditCard()}
                  {renderShopPayee()}
                  {renderPoints()}
                  {renderDate()}
                </View>
              ) : (
                <NoResponse />
              )
            ) : (
              <View style={HelperStyles.margin(20, 8)}>
                <CategorySubCategorySkeleton />
                <CreditCardSkeleton />
                <ShopPayeeSkeleton />
                <PointsSkeleton />
                <DateSkeleton />
              </View>
            )}
          </View>
        </ScrollView>

        <CustomModal
          message={Labels.deleteSpending}
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
    spendingDelete: (spendingId, onResponse) => {
      dispatch(spendingDelete(spendingId, onResponse));
    },

    spendingView: (spendingId, onResponse) => {
      dispatch(spendingView(spendingId, onResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SpendingView);
