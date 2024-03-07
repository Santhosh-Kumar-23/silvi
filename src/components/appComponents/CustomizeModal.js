import React, {useCallback, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Assets from '../../assets/Index';
import Button from '../../components/appComponents/Button';
import Card from '../../containers/Card';
import CustomModal from '../../components/appComponents/CustomModal';
import FloatingTextInput from '../../components/appComponents/FloatingTextInput';
import Labels from '../../utils/Strings';
import Styles from '../../styles/otherStyles/CustomizeModal';
import * as ENV from '../../../env';
import * as HelperStyles from '../../utils/HelperStyles';

const CustomizeModal = ({
  label = Labels.category,
  onBack = () => {},
  onConfirm = () => {},
  onRequestClose = () => {},
  visible = false,
}) => {
  // CustomizeModal Variables
  const [customize, setCustomize] = useState(null);

  // Error Variables
  const [customizeError, setCustomizeError] = useState(false);

  // Theme Variables
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      init();

      return () => {
        isFocus = false;

        handleErrorReset();
      };
    }, [visible]),
  );

  const init = () => {
    setCustomize(null);
  };

  const handleConfirm = () => {
    if (checkCustomizeModal()) {
      ENV.currentEnvironment == Labels.development &&
        console.log('CUSTOMIZE MODAL TXT::: ', customize);

      onConfirm(customize);

      onRequestClose();
    } else {
      handleErrorValidation();
    }
  };

  const checkCustomizeModal = () => {
    return Boolean(customize);
  };

  const handleErrorValidation = () => {
    setCustomizeError(Boolean(customize) ? false : true);
  };

  const handleErrorReset = () => {
    setCustomizeError(false);
  };

  return (
    <CustomModal
      clearDefaultChildren={true}
      modalContainerStyle={HelperStyles.justView('justifyContent', 'center')}
      onRequestClose={() => {
        onRequestClose();
      }}
      visible={visible}>
      <View
        style={[
          Styles.modalContainer,
          HelperStyles.justView('backgroundColor', Theme.background),
        ]}>
        <View style={HelperStyles.margin(20, 20)}>
          <View
            style={[
              HelperStyles.flexDirection('row'),
              HelperStyles.justifyContentCenteredView('center'),
            ]}>
            <TouchableOpacity
              onPress={() => {
                onBack();
              }}
              style={Styles.backIconContainer}>
              <Image
                resizeMode={'contain'}
                source={Assets.back}
                style={[
                  HelperStyles.imageView(24, 24),
                  HelperStyles.justView('tintColor', Theme.primaryText),
                ]}
              />
            </TouchableOpacity>
            <View style={HelperStyles.justifyContentCenteredView('center')}>
              <View style={Styles.customizeIconContainer}>
                <Image
                  resizeMode={'contain'}
                  source={Assets.customize}
                  style={[
                    HelperStyles.imageView(16, 16),
                    HelperStyles.justView('tintColor', Theme.primaryText),
                  ]}
                />
              </View>
              <Text
                style={[
                  HelperStyles.textView(
                    14,
                    '700',
                    Theme.primaryText,
                    'center',
                    'none',
                  ),
                  HelperStyles.justView('marginTop', 4),
                ]}>
                {Labels.custom} {label}
              </Text>
            </View>
          </View>
          <Card
            containerStyle={[
              Styles.floatingTextInputCardContainer,
              customizeError
                ? HelperStyles.justView('marginTop', 16)
                : HelperStyles.justView('marginVertical', 16),
            ]}>
            <FloatingTextInput
              autoCapitalize={'none'}
              keyboardType={'default'}
              textContentType={'none'}
              textInputContainerStyle={Styles.floatingTextInputContainer}
              textInputLabelStyle={Styles.floatingTextInputLabel}
              textInputStyle={Styles.floatingTextInput}
              title={`${Labels.addName}...`}
              updateMasterState={txt => {
                customizeError && setCustomizeError(false);
                setCustomize(txt);
              }}
              value={customize}
            />
          </Card>
          {customizeError && (
            <Text
              style={[
                HelperStyles.errorText,
                HelperStyles.justView('marginHorizontal', 12),
                HelperStyles.justView('marginVertical', 8),
              ]}>
              {Labels.fieldError}
            </Text>
          )}
          <Button
            containerStyle={Styles.buttonContainer}
            label={Labels.confirm}
            loading={false}
            onPress={() => {
              handleConfirm();
            }}
          />
        </View>
      </View>
    </CustomModal>
  );
};

export default CustomizeModal;
