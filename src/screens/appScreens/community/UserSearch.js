import React, {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Colors from '../../../utils/Colors';
import Labels from '../../../utils/Strings';
import Network from '../../../containers/Network';
import NoResponse from '../../../components/appComponents/NoResponse';
import Search from '../../../components/appComponents/Search';
import SkeletonCard from '../../../components/skeletonComponents/SkeletonCard';
import SkeletonLabel from '../../../components/skeletonComponents/SkeletonLabel';
import SkeletonPlaceholder from '../../../containers/SkeletonPlaceholder';
import Styles from '../../../styles/appStyles/community/UserSearch';
import UserCard from './UserCard';
import * as ENV from '../../../../env';
import * as HelperStyles from '../../../utils/HelperStyles';

const UserSearch = props => {
  // UserSearch Variables
  const [searchQuery, setSearchQuery] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState(null);
  const [users, setUsers] = useState(null);

  // Other Variables
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const usersList = [
    {
      followers: Math.floor(Math.random() * 50),
      followings: Math.floor(Math.random() * 100),
      image:
        'https://www.goodmorninghdloveimages.com/wp-content/uploads/2020/04/Latest-Whatsapp-Dp-Images-Hd.jpg',
      isFollower: true,
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
    {
      followers: Math.floor(Math.random() * 1200),
      followings: Math.floor(Math.random() * 2400),
      image:
        'https://www.goodmorninghdloveimages.com/wp-content/uploads/2020/04/Latest-Whatsapp-Dp-Images-Hd.jpg',
      isFollower: false,
      isFollowing: false,
      name: 'Dora Dennis',
    },
    {
      followers: Math.floor(Math.random() * 100),
      followings: Math.floor(Math.random() * 200),
      image:
        'https://www.goodmorninghdloveimages.com/wp-content/uploads/2020/04/Latest-Whatsapp-Dp-Images-Hd.jpg',
      isFollower: false,
      isFollowing: true,
      name: 'Manny Ahn',
    },
    {
      followers: Math.floor(Math.random() * 500),
      followings: Math.floor(Math.random() * 1000),
      image:
        'https://www.goodmorninghdloveimages.com/wp-content/uploads/2020/04/Latest-Whatsapp-Dp-Images-Hd.jpg',
      isFollower: true,
      isFollowing: false,
      name: 'Jamaica Lauren',
    },
    {
      followers: Math.floor(Math.random() * 25),
      followings: Math.floor(Math.random() * 50),
      image:
        'https://www.goodmorninghdloveimages.com/wp-content/uploads/2020/04/Latest-Whatsapp-Dp-Images-Hd.jpg',
      isFollower: false,
      isFollowing: false,
      name: 'Bobby Chong',
    },
  ];

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        setLoading(false);

        setUsers(usersList);

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
    setUsers(null);
  };

  const SearchSkeleton = () => {
    return (
      <SkeletonCard
        height={42}
        style={HelperStyles.justView('borderRadius', 4)}
      />
    );
  };

  const UserCardSkeleton = ({marginTop = 4}) => {
    return (
      <View
        style={[
          Styles.skeletonUserContainer,
          HelperStyles.justView('marginTop', marginTop),
        ]}>
        <View style={HelperStyles.justView('width', '12.5%')}>
          <SkeletonPlaceholder>
            <View style={Styles.skeletonUserImageContainer} />
          </SkeletonPlaceholder>
        </View>
        <View style={HelperStyles.justView('width', '86.25%')}>
          <LabelSkeleton
            height={16}
            style={HelperStyles.justView('width', '50%')}
          />
          <LabelSkeleton
            height={14}
            style={[
              HelperStyles.justView('width', '25%'),
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

  return (
    <Network>
      <View style={HelperStyles.screenContainer(Theme.background)}>
        <View style={[HelperStyles.flex(1), HelperStyles.margin(12, 24)]}>
          <View style={HelperStyles.margin(8, 0)}>
            {!loading ? (
              <Search
                alterSearchIcon={true}
                cardContainerStyle={Styles.searchCardContainer}
                clearValue={searchQuery == null}
                onChangeText={txt => {
                  ENV.currentEnvironment == Labels.development &&
                    console.log('USER SEARCH SEARCH QUERY VALUE::: ', txt);

                  setSearchQuery(txt);
                }}
                onClear={() => {
                  setSearchQuery(null);

                  setSearchSuggestions(null);
                }}
                placeholderLabel={`${
                  Labels.search
                } ${Labels.userName.toLowerCase()}`}
                placeholderTextColor={Colors.lightText}
                searchIconContainerStyle={Styles.searchIconContainer}
                textInputStyle={Styles.searchTextInput}
              />
            ) : (
              <SearchSkeleton />
            )}
          </View>
          {Boolean(users) ? (
            Array.isArray(users) && users.length != 0 ? (
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
                {users.map((userData, index) => (
                  <View
                    key={index}
                    style={HelperStyles.justView(
                      'marginTop',
                      index != 0 ? 4 : 0,
                    )}>
                    <UserCard {...props} data={userData} />
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

export default UserSearch;
