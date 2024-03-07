import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../../assets/Index';
import Card from '../../../containers/Card';
import Colors from '../../../utils/Colors';
import CommentCard from './CommentCard';
import Labels from '../../../utils/Strings';
import Network from '../../../containers/Network';
import RecommenderCard from './RecommenderCard';
import SkeletonCard from '../../../components/skeletonComponents/SkeletonCard';
import SkeletonLabel from '../../../components/skeletonComponents/SkeletonLabel';
import Styles from '../../../styles/appStyles/savingsRecommender/SavingsRecommenderView';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';

const SavingsRecommenderView = props => {
  // Props variables
  const savingsRecommenderData =
    props.route.params &&
    props.route.params.hasOwnProperty('savingsRecommenderData')
      ? props.route.params.savingsRecommenderData
      : null;

  // SavingsRecommenderView Variables
  const [imageLoader, setImageLoader] = useState(false);
  const [savingsRecommender, setSavingsRecommender] = useState(null);
  const [recommenders, setRecommenders] = useState(null);
  const [comments, setComments] = useState(null);

  // Other Variables
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const recommenderList = [
    {
      image:
        'https://i.pinimg.com/474x/01/88/dc/0188dc41881e0e410b5375cdead5f49a.jpg',
      name: 'Tan Lark Sye',
      ratings: 4.5,
      visits: Math.floor(Math.random() * 500),
    },
    {
      image: 'https://wallpaperaccess.com/full/271965.jpg',
      name: 'Lee Kuan Yew',
      ratings: 3.5,
      visits: Math.floor(Math.random() * 250),
    },
    {
      image: 'https://wallpaperaccess.com/full/154009.jpg',
      name: 'S Rajaratnam',
      ratings: 4.0,
      visits: Math.floor(Math.random() * 625),
    },
  ];
  const commentList = [
    {
      designation: 'Manager',
      description:
        'It is a long established fact tha reader will be distracted by the readableconte of a page when.',
      image: 'https://wallpaperaccess.com/full/1505337.jpg',
      name: 'Alfred Wong',
    },
    {
      designation: 'Manager',
      description:
        'It is a long established fact tha reader will be distracted by the readableconte of a page when.',
      image: 'https://images3.alphacoders.com/246/246145.jpg',
      name: 'Choo Hoey',
    },
    {
      designation: 'Manager',
      description:
        'It is a long established fact tha reader will be distracted by the readableconte of a page when.',
      image: 'https://images4.alphacoders.com/747/thumb-1920-74728.jpg',
      name: 'Syed Isa bin Semait',
    },
  ];

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        setLoading(false);

        setSavingsRecommender(savingsRecommenderData);

        setRecommenders(recommenderList);

        setComments(commentList);

        setRefreshing(false);
      }, 1000);
    }, [refreshing == true]),
  );

  const onRefresh = () => {
    setRefreshing(true);

    handleReset();

    setLoading(true);
  };

  const handleReset = () => {
    setSavingsRecommender(null);

    setRecommenders(null);

    setComments(null);
  };

  const renderShopCard = () => {
    return (
      <Card
        containerStyle={Styles.cardContainer}
        disabled={false}
        onPress={() => {
          props.navigation.navigate('SavingsRecommenderPreviewBills');
        }}>
        <View
          style={[
            HelperStyles.flex(0.35),
            HelperStyles.justifyContentCenteredView('center'),
          ]}>
          <Image
            onLoadStart={() => {
              setImageLoader(true);
            }}
            onLoadEnd={() => {
              setImageLoader(false);
            }}
            resizeMode={'cover'}
            source={{
              uri: savingsRecommenderData.image,
            }}
            style={[
              HelperStyles.imageView(64, '100%'),
              HelperStyles.justView('borderRadius', 4),
            ]}
          />
          {imageLoader && (
            <ActivityIndicator
              size={'small'}
              color={Colors.primary}
              style={Styles.imageLoader}
            />
          )}
        </View>
        <View style={[HelperStyles.flex(0.65), HelperStyles.padding(8, 4)]}>
          <View style={Styles.cardTextSubContainerI}>
            <View style={Styles.cardTextNameContainer}>
              <Text
                numberOfLines={1}
                style={HelperStyles.textView(
                  14,
                  '700',
                  Colors.primaryText,
                  'left',
                  'none',
                )}>
                {savingsRecommenderData.name}
              </Text>
              <Text
                style={[
                  HelperStyles.textView(
                    18,
                    '900',
                    Colors.secondaryText,
                    'center',
                    'none',
                  ),
                  HelperStyles.justView('bottom', 4),
                ]}>
                {' | '}
              </Text>
              <Text
                style={HelperStyles.textView(
                  14,
                  '700',
                  Colors.primary,
                  'center',
                  'none',
                )}>
                {savingsRecommenderData.percentage}%
              </Text>
            </View>
            <View style={Styles.cardTextRatingsContainer}>
              <Text
                style={[
                  HelperStyles.textView(
                    12,
                    '600',
                    Colors.primaryText,
                    'center',
                    'none',
                  ),
                  HelperStyles.justView('top', 1),
                ]}>
                {savingsRecommenderData.ratings}
              </Text>
              <View style={HelperStyles.margin(2, 0)}>
                <Image
                  resizeMode={'contain'}
                  source={Assets.star}
                  style={HelperStyles.imageView(16, 16)}
                />
              </View>
            </View>
          </View>
          <View style={HelperStyles.justView('alignItems', 'flex-start')}>
            <Text
              style={HelperStyles.textView(
                12,
                '400',
                Colors.darkElectricBlue,
                'center',
                'none',
              )}>
              {savingsRecommenderData.views} view(s)
            </Text>
          </View>
          <View style={Styles.cardTextSubContainerII}>
            <Image
              resizeMode={'contain'}
              source={Assets.locationDot}
              style={HelperStyles.imageView(12, 12)}
            />
            <Text
              style={[
                HelperStyles.textView(
                  12,
                  '600',
                  Colors.darkElectricBlue,
                  'center',
                  'none',
                ),
                HelperStyles.justView('paddingLeft', 2),
                HelperStyles.justView('top', 1),
              ]}>
              Singapore 207704
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  const renderRecommenders = () => {
    return (
      <>
        {!loading ? (
          <Text
            style={HelperStyles.textView(
              16,
              '700',
              Theme.primaryText,
              'left',
              'none',
            )}>
            {Labels.recommenders}
          </Text>
        ) : (
          <LabelSkeleton height={20} />
        )}
        <View style={HelperStyles.margin(0, 4)}>
          {Boolean(recommenders) ? (
            Array.isArray(recommenders) && recommenders.length != 0 ? (
              recommenders.map((recommenderData, index) => (
                <RecommenderCard
                  {...props}
                  key={index}
                  data={recommenderData}
                />
              ))
            ) : (
              <View
                style={[
                  HelperStyles.justView('height', 84),
                  HelperStyles.justifyContentCenteredView('center'),
                  HelperStyles.margin(0, 8),
                  HelperStyles.padding(16, 16),
                ]}>
                <Text
                  style={HelperStyles.textView(
                    14,
                    '600',
                    Colors.secondaryText,
                    'center',
                    'none',
                  )}>
                  {Labels.noRecommendersFound}
                </Text>
              </View>
            )
          ) : (
            <>
              <CardSkeleton style={HelperStyles.margin(0, 8)} />
              <CardSkeleton style={HelperStyles.margin(0, 8)} />
              <CardSkeleton style={HelperStyles.margin(0, 8)} />
            </>
          )}
        </View>
      </>
    );
  };

  const renderComments = () => {
    return (
      <>
        <View style={HelperStyles.justView('marginTop', 8)}>
          {!loading ? (
            <Text
              style={HelperStyles.textView(
                16,
                '700',
                Theme.primaryText,
                'left',
                'none',
              )}>
              {Labels.comments}
            </Text>
          ) : (
            <LabelSkeleton height={20} />
          )}
        </View>
        <View style={HelperStyles.margin(0, 4)}>
          {Boolean(comments) ? (
            Array.isArray(comments) && comments.length != 0 ? (
              comments.map((comments, index) => (
                <CommentCard {...props} key={index} data={comments} />
              ))
            ) : (
              <View
                style={[
                  HelperStyles.justView('height', 80),
                  HelperStyles.justifyContentCenteredView('center'),
                  HelperStyles.margin(0, 8),
                  HelperStyles.padding(16, 16),
                ]}>
                <Text
                  style={HelperStyles.textView(
                    14,
                    '600',
                    Colors.secondaryText,
                    'center',
                    'none',
                  )}>
                  {Labels.noCommentsFound}
                </Text>
              </View>
            )
          ) : (
            <>
              <CardSkeleton style={HelperStyles.margin(0, 8)} />
              <CardSkeleton style={HelperStyles.margin(0, 8)} />
              <CardSkeleton style={HelperStyles.margin(0, 8)} />
            </>
          )}
        </View>
      </>
    );
  };

  const CardSkeleton = ({
    height = Helpers.windowHeight * 0.1225,
    style = {},
  }) => {
    return <SkeletonCard height={height} style={style} />;
  };

  const LabelSkeleton = ({height = 18, style = {}}) => {
    return <SkeletonLabel height={height} style={style} />;
  };

  return (
    <Network>
      <View style={HelperStyles.screenContainer(Theme.background)}>
        <View style={[HelperStyles.flex(1), HelperStyles.margin(20, 16)]}>
          {Boolean(savingsRecommender) ? (
            renderShopCard()
          ) : (
            <CardSkeleton height={Helpers.windowHeight * 0.12125} />
          )}
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
            showsVerticalScrollIndicator={false}
            style={HelperStyles.justView('marginTop', 16)}>
            {renderRecommenders()}
            {renderComments()}
          </ScrollView>
        </View>
      </View>
    </Network>
  );
};

export default SavingsRecommenderView;
