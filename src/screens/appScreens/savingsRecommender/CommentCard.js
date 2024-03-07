import React, {useState} from 'react';
import {ActivityIndicator, Image, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Card from '../../../containers/Card';
import Colors from '../../../utils/Colors';
import Labels from '../../../utils/Strings';
import Styles from '../../../styles/appStyles/savingsRecommender/CommentCard';
import * as HelperStyles from '../../../utils/HelperStyles';

const CommentCard = ({data = null}) => {
  // CommentCard Variables
  const [imageLoader, setImageLoader] = useState(false);

  // Theme Variables
  const Theme = useTheme().colors;

  return (
    <Card
      containerStyle={[
        Styles.cardContainer,
        HelperStyles.justView('backgroundColor', Theme.background),
      ]}>
      <View
        style={[
          HelperStyles.flex(0.2125),
          HelperStyles.justView('alignItems', 'center'),
        ]}>
        <View style={Styles.cardImageContainer}>
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
              HelperStyles.imageView(64, 64),
              HelperStyles.justView('borderRadius', 64 / 2),
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
      </View>
      <View style={[HelperStyles.flex(0.7875), HelperStyles.padding(4, 4)]}>
        <Text
          numberOfLines={1}
          style={HelperStyles.textView(
            14,
            '700',
            Theme.primaryText,
            'left',
            'none',
          )}>
          {data?.name ?? null}
        </Text>
        {Boolean(data?.designation ?? null) && (
          <Text
            style={HelperStyles.textView(
              12,
              '400',
              Colors.secondaryText,
              'left',
              'none',
            )}>
            {data.designation}
          </Text>
        )}
        <Text
          style={[
            HelperStyles.textView(
              12,
              '400',
              Colors.darkElectricBlue,
              'left',
              'none',
            ),
            HelperStyles.justView('marginTop', 4),
          ]}>
          {data?.description ?? null}
        </Text>
      </View>
    </Card>
  );
};

export default CommentCard;
