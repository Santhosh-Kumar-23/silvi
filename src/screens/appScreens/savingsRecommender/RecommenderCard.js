import React, {useState} from 'react';
import {ActivityIndicator, Image, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Assets from '../../../assets/Index';
import Card from '../../../containers/Card';
import Colors from '../../../utils/Colors';
import GradientText from '../../../components/appComponents/GradientText';
import Labels from '../../../utils/Strings';
import LinearGradient from 'react-native-linear-gradient';
import Styles from '../../../styles/appStyles/savingsRecommender/RecommenderCard';
import * as HelperStyles from '../../../utils/HelperStyles';

const RecommenderCard = ({data = null, navigation}) => {
  // RecommenderCard Variables
  const [imageLoader, setImageLoader] = useState(false);

  // Theme Variables
  const Theme = useTheme().colors;

  return (
    <Card
      containerStyle={Styles.cardContainer}
      disabled={false}
      onPress={() => {
        navigation.navigate('SavingsRecommenderPreviewBills');
      }}>
      <LinearGradient
        colors={Colors.gradientBorder}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}
        style={[
          HelperStyles.flex(0.3375),
          HelperStyles.justView('borderRadius', 4),
        ]}>
        <View
          style={[
            Styles.cardImageContainer,
            HelperStyles.justView('backgroundColor', Theme.background),
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
              uri: data.image,
            }}
            style={[
              HelperStyles.imageView(52, '100%'),
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
      </LinearGradient>
      <View style={[HelperStyles.flex(0.6625), HelperStyles.padding(8, 4)]}>
        <View style={Styles.cardTextSubContainerI}>
          <View style={Styles.cardTextNameContainer}>
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
          </View>
          <View style={Styles.cardTextRatingsContainer}>
            <Text
              style={[
                HelperStyles.textView(
                  12,
                  '600',
                  Theme.primaryText,
                  'center',
                  'none',
                ),
                HelperStyles.justView('top', 1),
              ]}>
              {data?.ratings ?? 0}
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
        <View style={Styles.cardTextSubContainerII}>
          <View style={Styles.cardTextVisitContainer}>
            <Text
              style={HelperStyles.textView(
                12,
                '400',
                Colors.darkElectricBlue,
                'center',
                'none',
              )}>
              {Labels.noOfVisits}: {data?.visits ?? 0}
            </Text>
          </View>
          <View style={Styles.cardTextReceiptsContainer}>
            <GradientText
              colors={Colors.gradientLightBlue}
              style={[
                HelperStyles.textView(12, '600', Theme.text, 'center', 'none'),
                HelperStyles.justView('textDecorationLine', 'underline'),
              ]}>
              {Labels.receipts}
            </GradientText>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default RecommenderCard;
