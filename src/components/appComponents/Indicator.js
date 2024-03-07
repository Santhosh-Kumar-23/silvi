import React from 'react';
import {Image, View} from 'react-native';
import Assets from '../../assets/Index';
import Colors from '../../utils/Colors';
import CustomModal from './CustomModal';
import * as Helpers from '../../utils/Helpers';
import * as HelperStyles from '../../utils/HelperStyles';

const Indicator = ({mode = 'normal', visible = false}) => {
  // Indicator Variables

  // Theme Variables
  const themeScheme = Helpers.getThemeScheme();

  const renderIndicator = () => {
    switch (mode) {
      case 'normal':
      default:
        return renderNormalIndicator();

      case 'modal':
        return renderModalIndicator();
    }
  };

  const renderNormalIndicator = () => {
    return (
      <View
        style={[
          HelperStyles.screenContainer(
            themeScheme == 'dark' ? Colors.black : Colors.white,
          ),
          HelperStyles.justifyContentCenteredView('center'),
        ]}>
        <Image
          resizeMode={'contain'}
          source={Assets.indicator}
          style={HelperStyles.imageView('25%', '25%')}
        />
      </View>
    );
  };

  const renderModalIndicator = () => {
    return (
      <CustomModal
        clearDefaultChildren={true}
        modalContainerStyle={HelperStyles.justView('justifyContent', 'center')}
        visible={visible}>
        <View
          style={[
            HelperStyles.justifyContentCenteredView('center'),
            HelperStyles.justView('borderRadius', 12),
            HelperStyles.padding(12, 12),
          ]}>
          <Image
            resizeMode={'contain'}
            source={Assets.indicator}
            style={HelperStyles.imageView('37.5%', '37.5%')}
          />
        </View>
      </CustomModal>
    );
  };

  return renderIndicator();
};

export default Indicator;
