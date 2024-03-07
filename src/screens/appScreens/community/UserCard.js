import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Colors from '../../../utils/Colors';
import Labels from '../../../utils/Strings';
import Styles from '../../../styles/appStyles/community/UserCard';
import * as Helpers from '../../../utils/Helpers';
import * as HelperStyles from '../../../utils/HelperStyles';

const UserCard = ({data, navigation}) => {
  // UserCard Variables
  const [imageLoader, setImageLoader] = useState(false);

  // Theme Variables
  const Theme = useTheme().colors;

  const renderDescription = () => {
    let description;

    if (data.isFollower) {
      description = Labels.followsYou;
    } else if (data.isFollowing) {
      description = Labels.following;
    } else {
      description = Boolean(data.followers)
        ? `${Helpers.kFormatter(
            data.followers,
          )} ${Labels.followers.toLowerCase()}`
        : null;
    }

    return (
      Boolean(description) && (
        <Text
          style={[
            HelperStyles.textView(12, '600', Colors.lightText, 'left', 'none'),
            HelperStyles.justView('marginTop', 2),
          ]}>
          {description}
        </Text>
      )
    );
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('UserProfile', {userData: data});
      }}
      style={Styles.container}>
      <View style={Styles.imageContainer}>
        <Image
          onLoadStart={() => {
            setImageLoader(true);
          }}
          onLoadEnd={() => {
            setImageLoader(false);
          }}
          resizeMode={'cover'}
          source={{
            uri: data.image,
          }}
          style={[
            HelperStyles.imageView(44, 44),
            HelperStyles.justView('borderRadius', 44 / 2),
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
      <View style={Styles.textContainer}>
        <Text
          style={HelperStyles.textView(
            14,
            '700',
            Theme.primaryText,
            'left',
            'capitalize',
          )}>
          {data.name}
        </Text>
        {renderDescription(data)}
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;
