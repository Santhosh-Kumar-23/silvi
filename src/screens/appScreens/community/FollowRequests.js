import React, {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, Text, View} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Button from '../../../components/appComponents/Button';
import Colors from '../../../utils/Colors';
import Labels from '../../../utils/Strings';
import Network from '../../../containers/Network';
import NoResponse from '../../../components/appComponents/NoResponse';
import Search from '../../../components/appComponents/Search';
import SkeletonButton from '../../../components/skeletonComponents/SkeletonButton';
import SkeletonCard from '../../../components/skeletonComponents/SkeletonCard';
import SkeletonLabel from '../../../components/skeletonComponents/SkeletonLabel';
import SkeletonPlaceholder from '../../../containers/SkeletonPlaceholder';
import Styles from '../../../styles/appStyles/community/FollowRequests';
import UserCard from './UserCard';
import * as ENV from '../../../../env';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';

const FollowRequests = props => {
  // FollowRequests Variables
  const [searchQuery, setSearchQuery] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState(null);
  const [followRequests, setFollowRequests] = useState(null);

  // Other Variables
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const followRequestsList = [
    {
      followers: Math.floor(Math.random() * 50),
      followings: Math.floor(Math.random() * 100),
      image:
        'https://www.goodmorninghdloveimages.com/wp-content/uploads/2020/04/Latest-Whatsapp-Dp-Images-Hd.jpg',
      isFollower: false,
      isFollowing: false,
      name: 'Alexandre Lim',
    },
    {
      followers: Math.floor(Math.random() * 250),
      followings: Math.floor(Math.random() * 500),
      image:
        'https://www.goodmorninghdloveimages.com/wp-content/uploads/2020/04/Latest-Whatsapp-Dp-Images-Hd.jpg',
      isFollower: false,
      isFollowing: false,
      name: 'Mushi Bun',
    },
  ];

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        setLoading(false);

        setFollowRequests(followRequestsList);

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
    setSearchQuery(null);
    setSearchSuggestions(null);
    setFollowRequests(null);
  };

  const SearchSkeleton = () => {
    return (
      <View style={HelperStyles.margin(0, 16)}>
        <SkeletonCard
          height={42}
          style={HelperStyles.justView('borderRadius', 4)}
        />
      </View>
    );
  };

  const UserCardSkeleton = ({marginTop = 4}) => {
    return (
      <View
        style={[
          HelperStyles.flexDirection('row'),
          HelperStyles.justifyContentCenteredView('space-between'),
          HelperStyles.justView('marginTop', marginTop),
        ]}>
        <View style={Styles.skeletonUserContainer}>
          <SkeletonPlaceholder>
            <View style={Styles.skeletonUserImageContainer} />
          </SkeletonPlaceholder>
          <View style={HelperStyles.margin(8, 0)}>
            <LabelSkeleton
              height={16}
              style={HelperStyles.justView(
                'width',
                Helpers.windowWidth * 0.2875,
              )}
            />
            <LabelSkeleton
              height={14}
              style={[
                HelperStyles.justView('width', Helpers.windowWidth * 0.1625),
                HelperStyles.justView('marginTop', 4),
              ]}
            />
          </View>
        </View>
        <View
          style={[
            HelperStyles.flex(0.525),
            HelperStyles.flexDirection('row'),
            HelperStyles.justifyContentCenteredView('space-evenly'),
          ]}>
          <ButtonSkeleton />
          <ButtonSkeleton />
        </View>
      </View>
    );
  };

  const ButtonSkeleton = ({
    height = 30,
    width = Helpers.windowWidth * 0.2125,
  }) => {
    return (
      <SkeletonButton
        height={height}
        style={HelperStyles.justView('elevation', 0)}
        width={width}
      />
    );
  };

  const LabelSkeleton = ({height = 18, style = {}}) => {
    return <SkeletonLabel height={height} style={style} />;
  };

  return (
    <Network>
      <View style={HelperStyles.screenContainer(Theme.background)}>
        <View style={[HelperStyles.flex(1), HelperStyles.margin(12, 24)]}>
          <View style={HelperStyles.margin(8, 0)}>
            {!loading ? (
              <Text
                style={HelperStyles.textView(
                  14,
                  '600',
                  Theme.primaryText,
                  'left',
                  'none',
                )}>
                You have 2 follow request(s)
              </Text>
            ) : (
              <LabelSkeleton height={16} />
            )}
            {!loading ? (
              <Search
                alterSearchIcon={true}
                cardContainerStyle={Styles.searchCardContainer}
                clearValue={searchQuery == null}
                onChangeText={txt => {
                  ENV.currentEnvironment == Labels.development &&
                    console.log('FOLLOW REQUESTS SEARCH QUERY VALUE::: ', txt);

                  setSearchQuery(txt);
                }}
                onClear={() => {
                  setSearchQuery(null);

                  setSearchSuggestions(null);
                }}
                placeholderLabel={`${
                  Labels.search
                } ${Labels.followrequests.toLowerCase()}`}
                placeholderTextColor={Colors.lightText}
                searchIconContainerStyle={Styles.searchIconContainer}
                textInputStyle={Styles.searchTextInput}
              />
            ) : (
              <SearchSkeleton />
            )}
          </View>
          {Boolean(followRequests) ? (
            Array.isArray(followRequests) && followRequests.length != 0 ? (
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
                {followRequests.map((followRequestData, index) => (
                  <View
                    key={index}
                    style={[
                      HelperStyles.flexDirection('row'),
                      HelperStyles.justifyContentCenteredView('space-between'),
                      HelperStyles.justView('marginTop', index != 0 ? 4 : 0),
                    ]}>
                    <View
                      style={[
                        HelperStyles.flex(0.5),
                        HelperStyles.justifyContentCenteredView('center'),
                      ]}>
                      <UserCard {...props} data={followRequestData} />
                    </View>
                    <View
                      style={[
                        HelperStyles.flex(0.5),
                        HelperStyles.flexDirection('row'),
                        HelperStyles.justifyContentCenteredView('space-evenly'),
                      ]}>
                      <Button
                        containerStyle={Styles.buttonContainer}
                        label={Labels.confirm}
                        textStyle={HelperStyles.textView(
                          12,
                          '600',
                          Colors.white,
                          'center',
                          'capitalize',
                        )}
                      />
                      <Button
                        containerStyle={Styles.buttonContainer}
                        label={Labels.delete}
                        mode={'light'}
                        textStyle={HelperStyles.textView(
                          12,
                          '600',
                          Colors.primaryText,
                          'center',
                          'capitalize',
                        )}
                      />
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <NoResponse />
            )
          ) : (
            <>
              <UserCardSkeleton marginTop={0} />
              <UserCardSkeleton />
              <UserCardSkeleton />
              <UserCardSkeleton />
              <UserCardSkeleton />
              <UserCardSkeleton />
              <UserCardSkeleton />
              <UserCardSkeleton />
              <UserCardSkeleton />
              <UserCardSkeleton />
              <UserCardSkeleton />
            </>
          )}
        </View>
      </View>
    </Network>
  );
};

export default FollowRequests;
