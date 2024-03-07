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
import Button from '../../../components/appComponents/Button';
import Colors from '../../../utils/Colors';
import Labels from '../../../utils/Strings';
import moment from 'moment';
import Network from '../../../containers/Network';
import NoResponse from '../../../components/appComponents/NoResponse';
import SkeletonCard from '../../../components/skeletonComponents/SkeletonCard';
import SkeletonLabel from '../../../components/skeletonComponents/SkeletonLabel';
import SkeletonPlaceholder from '../../../containers/SkeletonPlaceholder';
import Styles from '../../../styles/appStyles/community/UserProfile';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';
import SkeletonButton from '../../../components/skeletonComponents/SkeletonButton';

const UserProfile = props => {
  // Props Variables
  const userData = props.route.params.hasOwnProperty('userData')
    ? props.route.params.userData
    : null;

  // UserProfile Variables
  const [feeds, setFeeds] = useState(null);

  // Other Variables
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userImageLoader, setUserImageLoader] = useState(false);
  const [feedImageLoader, setFeedImageLoader] = useState(false);
  const feedList = [
    {
      createdOn: moment().subtract(Math.floor(Math.random() * 30), 'days'),
      description:
        'Here is an example of a description of the receipts shown above',
      image:
        'https://www.bluefintech.com/wp-content/uploads/2019/10/Breach-Cost-Receipt-PHI-3-1-650x1024.png',
      likes: Math.floor(Math.random() * 5000),
      views: Math.floor(Math.random() * 10000),
    },
    {
      createdOn: moment().subtract(Math.floor(Math.random() * 30), 'days'),
      description: null,
      image:
        'https://user-images.githubusercontent.com/23262259/44022744-c92c859a-9ee8-11e8-999c-60dbeae00255.jpg',
      likes: Math.floor(Math.random() * 5000),
      views: Math.floor(Math.random() * 10000),
    },
    {
      createdOn: moment().subtract(Math.floor(Math.random() * 30), 'days'),
      description:
        'Here is an example of a description of the receipts shown above',
      image:
        'https://media.istockphoto.com/photos/receipt-for-pig-food-1948-picture-id1362414342?b=1&k=20&m=1362414342&s=170667a&w=0&h=L5ICqBVE6H3g0FjeTPnV1XnCB10HpqZATFrTweyGZSE=',
      likes: Math.floor(Math.random() * 5000),
      views: Math.floor(Math.random() * 10000),
    },
    {
      createdOn: moment().subtract(Math.floor(Math.random() * 30), 'days'),
      description: null,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1U6SlSMPbol8LsXj87DjXTBMKazi01Sr-BQ&usqp=CAU',
      likes: Math.floor(Math.random() * 5000),
      views: Math.floor(Math.random() * 10000),
    },
  ];

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        setLoading(false);

        setFeeds(feedList);

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
    setFeeds(null);
  };

  const renderUser = () => {
    return (
      <View style={Styles.userContainer}>
        <View
          style={[
            HelperStyles.flex(0.1625),
            HelperStyles.justifyContentCenteredView('center'),
          ]}>
          <View style={Styles.userImageContainer}>
            <Image
              onLoadStart={() => {
                setUserImageLoader(true);
              }}
              onLoadEnd={() => {
                setUserImageLoader(false);
              }}
              resizeMode={'cover'}
              source={{
                uri: 'https://www.goodmorninghdloveimages.com/wp-content/uploads/2020/04/Latest-Whatsapp-Dp-Images-Hd.jpg',
              }}
              style={[
                HelperStyles.imageView(56, 56),
                HelperStyles.justView('borderRadius', 56 / 2),
              ]}
            />
            {userImageLoader && (
              <ActivityIndicator
                size={'small'}
                color={Colors.primary}
                style={Styles.imageLoader}
              />
            )}
          </View>
        </View>
        <View
          style={[
            HelperStyles.flex(0.825),
            HelperStyles.justView('justifyContent', 'center'),
            HelperStyles.padding(8, 8),
          ]}>
          <Text
            style={HelperStyles.textView(
              16,
              '700',
              Theme.primaryText,
              'left',
              'capitalize',
            )}>
            {userData.name}
          </Text>
          <View style={Styles.followerFollowingContainer}>
            <View style={HelperStyles.flex(0.4875)}>
              <Text
                style={HelperStyles.textView(
                  14,
                  '700',
                  Theme.primaryText,
                  'left',
                  'capitalize',
                )}>
                {Boolean(userData.followers)
                  ? Helpers.kFormatter(userData.followers)
                  : 0}
                <Text
                  style={HelperStyles.textView(
                    14,
                    '600',
                    Theme.primaryText,
                    'left',
                    'capitalize',
                  )}>{` ${Labels.followers}`}</Text>
              </Text>
            </View>
            <View style={HelperStyles.flex(0.4875)}>
              <Text
                style={HelperStyles.textView(
                  14,
                  '700',
                  Theme.primaryText,
                  'left',
                  'capitalize',
                )}>
                {Boolean(userData.followings)
                  ? Helpers.kFormatter(userData.followings)
                  : 0}
                <Text
                  style={HelperStyles.textView(
                    14,
                    '600',
                    Theme.primaryText,
                    'left',
                    'capitalize',
                  )}>{` ${Labels.followings}`}</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderFeed = feedData => {
    return (
      <View style={Styles.feedContainer}>
        {renderFeedUser()}
        {renderFeedImage(feedData)}
        {renderFeedLikesViews(feedData)}
        {Boolean(feedData) &&
          feedData.hasOwnProperty('description') &&
          Boolean(feedData.description) &&
          renderFeedDescription(feedData.description)}
      </View>
    );
  };

  const renderFeedUser = () => {
    return (
      <View style={Styles.feedUserContainer}>
        <View
          style={[
            HelperStyles.flex(0.125),
            HelperStyles.justifyContentCenteredView('center'),
          ]}>
          <View style={Styles.feedUserImageContainer}>
            <Image
              onLoadStart={() => {
                setUserImageLoader(true);
              }}
              onLoadEnd={() => {
                setUserImageLoader(false);
              }}
              resizeMode={'cover'}
              source={{
                uri: 'https://www.goodmorninghdloveimages.com/wp-content/uploads/2020/04/Latest-Whatsapp-Dp-Images-Hd.jpg',
              }}
              style={[
                HelperStyles.imageView(28, 28),
                HelperStyles.justView('borderRadius', 28 / 2),
              ]}
            />
            {userImageLoader && (
              <ActivityIndicator
                size={12}
                color={Colors.primary}
                style={Styles.imageLoader}
              />
            )}
          </View>
        </View>
        <View
          style={[
            HelperStyles.flex(0.875),
            HelperStyles.justView('justifyContent', 'center'),
          ]}>
          <Text
            style={HelperStyles.textView(
              14,
              '400',
              Colors.primaryText,
              'left',
              'capitalize',
            )}>
            {userData.name}
          </Text>
        </View>
      </View>
    );
  };

  const renderFeedImage = feedData => {
    return (
      <View style={Styles.feedImageContainer}>
        <Image
          onLoadStart={() => {
            setFeedImageLoader(true);
          }}
          onLoadEnd={() => {
            setFeedImageLoader(false);
          }}
          source={
            Boolean(feedData) &&
            feedData.hasOwnProperty('image') &&
            Boolean(feedData.image)
              ? {
                  uri: feedData.image,
                }
              : null
          }
          style={HelperStyles.imageView(160, '100%')}
        />
        {feedImageLoader && (
          <ActivityIndicator color={Theme.text} style={Styles.imageLoader} />
        )}
      </View>
    );
  };

  const renderFeedLikesViews = feedData => {
    return (
      <View style={Styles.feedLikeViewContainer}>
        <View style={Styles.feedLikeContainer}>
          <Image
            resizeMode={'contain'}
            source={Assets.like}
            style={[
              HelperStyles.imageView(16, 16),
              HelperStyles.justView('tintColor', Colors.darkElectricBlue),
            ]}
          />
          <Text
            style={[
              HelperStyles.textView(
                12,
                '400',
                Colors.darkElectricBlue,
                'left',
                'none',
              ),
              HelperStyles.padding(8, 0),
            ]}>
            {Boolean(feedData) &&
            feedData.hasOwnProperty('likes') &&
            Boolean(feedData.likes)
              ? Helpers.kFormatter(feedData.likes)
              : 0}
          </Text>
        </View>
        <View style={Styles.feedViewContainer}>
          <Image
            resizeMode={'contain'}
            source={Assets.view}
            style={[
              HelperStyles.imageView(20, 20),
              HelperStyles.justView('tintColor', Colors.darkElectricBlue),
            ]}
          />
          <Text
            style={[
              HelperStyles.textView(
                12,
                '400',
                Colors.darkElectricBlue,
                'left',
                'none',
              ),
              HelperStyles.padding(8, 0),
            ]}>
            {Boolean(feedData) &&
            feedData.hasOwnProperty('views') &&
            Boolean(feedData.views)
              ? Helpers.kFormatter(feedData.views)
              : 0}
          </Text>
        </View>
        <View style={Styles.feedDateContainer}>
          <Text
            style={HelperStyles.textView(
              12,
              '400',
              Colors.darkElectricBlue,
              'left',
              'none',
            )}>
            {Boolean(feedData) &&
            feedData.hasOwnProperty('createdOn') &&
            Boolean(feedData.createdOn)
              ? Helpers.formatDateTime(
                  feedData.createdOn,
                  null,
                  Labels.formatll,
                )
              : null}
          </Text>
        </View>
      </View>
    );
  };

  const renderFeedDescription = description => {
    return (
      <View
        style={[
          HelperStyles.padding(12, 8),
          HelperStyles.justView('paddingTop', 4),
        ]}>
        <Text
          style={[
            HelperStyles.textView(
              14,
              '400',
              Colors.primaryText,
              'left',
              'none',
            ),
            HelperStyles.justView('lineHeight', 20),
          ]}>
          {description}
        </Text>
      </View>
    );
  };

  const UserCardSkeleton = () => {
    return (
      <View style={Styles.skeletonUserContainer}>
        <View style={HelperStyles.justView('width', '15%')}>
          <SkeletonPlaceholder>
            <View style={Styles.skeletonUserImageContainer} />
          </SkeletonPlaceholder>
        </View>
        <View style={HelperStyles.justView('width', '82.5%')}>
          <LabelSkeleton
            height={18}
            style={HelperStyles.justView('width', '62.5%')}
          />
          <LabelSkeleton
            height={16}
            style={[
              HelperStyles.justView('width', '88.75%'),
              HelperStyles.justView('marginTop', 4),
            ]}
          />
        </View>
      </View>
    );
  };

  const LabelSkeleton = ({height = 18, style = {}}) => {
    return <SkeletonLabel height={height} style={style} />;
  };

  const ButtonSkeleton = ({height = 38, width = '42.5%'}) => {
    return (
      <SkeletonButton
        height={height}
        style={[
          HelperStyles.justView('alignSelf', 'center'),
          HelperStyles.justView('borderRadius', 10),
          HelperStyles.justView('elevation', 0),
        ]}
        width={width}
      />
    );
  };

  const FeedSkeleton = ({marginTop = 16}) => {
    return (
      <SkeletonCard
        height={Helpers.windowHeight * 0.4375}
        style={[
          HelperStyles.justView('marginTop', marginTop),
          HelperStyles.justView('borderRadius', 4),
        ]}
      />
    );
  };

  return (
    <Network>
      <View style={HelperStyles.screenContainer(Theme.background)}>
        <View style={[HelperStyles.flex(1), HelperStyles.margin(12, 24)]}>
          {!loading ? renderUser() : <UserCardSkeleton />}
          <View style={HelperStyles.margin(0, 16)}>
            {!loading ? (
              <Button
                containerStyle={Styles.followUnfollowButtonContainer}
                label={userData.isFollower ? Labels.unFollow : Labels.follow}
                mode={userData.isFollower ? 'light' : 'solid'}
              />
            ) : (
              <ButtonSkeleton />
            )}
          </View>
          {Boolean(feeds) ? (
            Array.isArray(feeds) && feeds.length != 0 ? (
              <ScrollView
                contentContainerStyle={HelperStyles.flexGrow(1)}
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
                {feeds.map((feedData, index) => (
                  <View
                    key={index}
                    style={[
                      HelperStyles.justView('marginTop', index != 0 ? 16 : 4),
                      HelperStyles.justView(
                        'marginBottom',
                        feeds.length == index + 1 ? 4 : 0,
                      ),
                    ]}>
                    {renderFeed(feedData)}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <NoResponse />
            )
          ) : (
            <View style={HelperStyles.margin(8, 0)}>
              <FeedSkeleton marginTop={4} />
              <FeedSkeleton />
            </View>
          )}
        </View>
      </View>
    </Network>
  );
};

export default UserProfile;
