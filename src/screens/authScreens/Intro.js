import React from 'react';
import {Image, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Assets from '../../assets/Index';
import Button from '../../components/appComponents/Button';
import Colors from '../../utils/Colors';
import Labels from '../../utils/Strings';
import Styles from '../../styles/authStyles/Intro';
import * as HelperStyles from '../../utils/HelperStyles';

const Intro = ({navigation}) => {
  // Intro Variables
  const slides = [
    {
      description: Labels.sliderDescription,
      image: Assets.picture,
      title: Labels.sliderTitle,
    },
    {
      description: Labels.sliderDescription,
      image: Assets.picture,
      title: Labels.sliderTitle,
    },
    {
      description: Labels.sliderDescription,
      image: Assets.picture,
      title: Labels.sliderTitle,
    },
  ];

  // Theme Variables
  const Theme = useTheme().colors;

  const renderSlider = item => {
    return (
      <View style={Styles.screenContainer}>
        <View style={Styles.imageContainer}>
          <Image
            resizeMode={'contain'}
            source={item.image}
            style={HelperStyles.imageView(80, 80)}
          />
        </View>
        <View style={HelperStyles.margin(48, 24)}>
          <Text
            style={[
              HelperStyles.textView(
                16,
                '700',
                Theme.primaryText,
                'center',
                'none',
              ),
              HelperStyles.justView('lineHeight', 24),
            ]}>
            {item.title}
          </Text>
          <Text
            style={[
              HelperStyles.textView(
                14,
                '400',
                Theme.primaryText,
                'center',
                'none',
              ),
              HelperStyles.justView('lineHeight', 18),
              HelperStyles.justView('marginTop', 4),
            ]}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  const renderButton = () => {
    return (
      <Button
        containerStyle={Styles.buttonContainer}
        label={Labels.getStarted}
        loading={false}
        onPress={() => {
          navigation.navigate('Onboard');
        }}
      />
    );
  };

  return (
    <View style={HelperStyles.screenContainer(Theme.background)}>
      <View style={[HelperStyles.flex(1), HelperStyles.screenSubContainer]}>
        <AppIntroSlider
          activeDotStyle={Styles.activeDotView}
          bottomButton={true}
          data={slides}
          dotStyle={Styles.dotView}
          renderDoneButton={() => renderButton()}
          renderItem={({item}) => renderSlider(item)}
          renderNextButton={() => renderButton()}
        />
      </View>
    </View>
  );
};
export default Intro;
