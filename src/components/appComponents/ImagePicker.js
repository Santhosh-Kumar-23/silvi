import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Assets from '../../assets/Index';
import Colors from '../../utils/Colors';
import Crashlytics from '@react-native-firebase/crashlytics';
import CustomModal from '../../components/appComponents/CustomModal';
import ImageCropPicker from 'react-native-image-crop-picker';
import Labels from '../../utils/Strings';
import Styles from '../../styles/otherStyles/ImagePicker';
import * as ENV from '../../../env';
import * as HelperStyles from '../../utils/HelperStyles';

const ImagePicker = ({
  cropperToolbarTitle = Labels.editPhoto,
  onChange = () => {},
  onRequestClose = () => {},
  visible = false,
}) => {
  // ImagePicker Variables

  // Theme Variables
  const Theme = useTheme().colors;

  // Config Variables
  const config = {
    cropperActiveWidgetColor: Colors.primary,
    cropping: true,
    cropperStatusBarColor: Colors.black,
    cropperToolbarColor: Colors.primary,
    cropperToolbarTitle: cropperToolbarTitle,
    freeStyleCropEnabled: true,
    mediaType: 'photo',
    enableRotationGesture: true,
  };

  const openCamera = () => {
    ImageCropPicker.openCamera(config)
      .then(response => {
        ENV.currentEnvironment == Labels.development &&
          console.log('CAMERA RESPONSE::: ', response);

        onChange(response);
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
        } else {
          ENV.currentEnvironment != Labels.production &&
            Crashlytics().setAttributes({
              error: JSON.stringify(error),
              label: Labels.imagePicker,
              type: 'catch',
            });
        }
      });
  };

  const openGallery = () => {
    ImageCropPicker.openPicker(config)
      .then(response => {
        ENV.currentEnvironment == Labels.development &&
          console.log('GALLERY RESPONSE::: ', response);

        onChange(response);
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
        } else {
          ENV.currentEnvironment != Labels.production &&
            Crashlytics().setAttributes({
              error: JSON.stringify(error),
              label: Labels.imagePicker,
              type: 'catch',
            });
        }
      });
  };

  return (
    <CustomModal
      showDefaultChildren={false}
      onRequestClose={() => {
        onRequestClose();
      }}
      visible={visible}>
      <Text
        style={[
          HelperStyles.textView(16, '700', Theme.text, 'center', 'none'),
          HelperStyles.justView('marginTop', 8),
          HelperStyles.justView('marginBottom', 16),
        ]}>
        {Labels.attachmentOptions}
      </Text>
      <View style={Styles.imagePickerModalConatiner}>
        <TouchableOpacity
          onPress={() => {
            onRequestClose();

            openCamera();
          }}
          style={[
            HelperStyles.flex(0.45),
            HelperStyles.justifyContentCenteredView('center'),
          ]}>
          <View
            style={[
              HelperStyles.imageView(40, 40),
              HelperStyles.justifyContentCenteredView('center'),
              HelperStyles.justView('backgroundColor', Colors.primary),
              HelperStyles.justView('borderRadius', 40 / 2),
            ]}>
            <Image
              resizeMode={'contain'}
              source={Assets.camera}
              style={[
                HelperStyles.imageView(20, 20),
                HelperStyles.justView('tintColor', Colors.white),
              ]}
            />
          </View>
          <Text
            style={[
              HelperStyles.textView(12, '700', Theme.text, 'center', 'none'),
              HelperStyles.justView('marginTop', 8),
            ]}>
            {Labels.takePhoto}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onRequestClose();

            openGallery();
          }}
          style={[
            HelperStyles.flex(0.45),
            HelperStyles.justifyContentCenteredView('center'),
          ]}>
          <View
            style={[
              HelperStyles.imageView(40, 40),
              HelperStyles.justifyContentCenteredView('center'),
              HelperStyles.justView('backgroundColor', Colors.primary),
              HelperStyles.justView('borderRadius', 40 / 2),
            ]}>
            <Image
              resizeMode={'contain'}
              source={Assets.gallery}
              style={[
                HelperStyles.imageView(20, 20),
                HelperStyles.justView('tintColor', Colors.white),
              ]}
            />
          </View>
          <Text
            style={[
              HelperStyles.textView(12, '700', Theme.text, 'center', 'none'),
              HelperStyles.justView('marginTop', 8),
            ]}>
            {Labels.uploadFromGallery}
          </Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

export default ImagePicker;
