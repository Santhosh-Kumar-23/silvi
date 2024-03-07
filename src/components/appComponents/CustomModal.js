import React, {useCallback, useState} from 'react';
import {
  Keyboard,
  Modal,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Button from './Button';
import Colors from '../../utils/Colors';
import Labels from '../../utils/Strings';
import Styles from '../../styles/otherStyles/CustomModal';
import * as Helpers from '../../utils/Helpers';
import * as HelperStyles from '../../utils/HelperStyles';

const CustomModal = ({
  animationType = 'fade',
  clearDefaultChildren = false,
  children,
  hint = null,
  hintTextStyle = {},
  isCancellable = false,
  message = Labels.defaultModalMessage,
  messageTextStyle = {},
  modalButtonContainerStyle = {},
  modalContainerStyle = {},
  modalItemContainerStyle = {},
  modalSubContainerStyle = {},
  negativeContainerStyle = {},
  negativeLabel = Labels.cancel,
  negativeLabelStyle = {},
  onNegative = () => {},
  onPositive = () => {},
  onRequestClose = () => {},
  positiveContainerStyle = {},
  positiveLabel = Labels.confirm,
  positiveLabelStyle = {},
  showDefaultChildren = true,
  transparent = true,
  visible = false,
}) => {
  // CustomModal Variables
  const [blinkStatus, setBlinkStatus] = useState(true);

  // Theme Variables
  const themeScheme = Helpers.getThemeScheme();
  const Theme = useTheme().colors;

  useFocusEffect(
    useCallback(() => {
      let isFocus = true;

      let blinkInterval;

      Boolean(hint) && [
        (blinkInterval = setInterval(() => {
          setBlinkStatus(blinkStatus => !blinkStatus);
        }, 1000)),
      ];

      return () => {
        isFocus = false;

        Boolean(hint) && clearInterval(blinkInterval);
      };
    }, []),
  );

  const handleTouchableWithoutFeedback = () => {
    Keyboard.dismiss();

    onRequestClose();
  };

  return (
    <Modal
      animationType={animationType}
      hardwareAccelerated={true}
      onRequestClose={() => {
        onRequestClose();
      }}
      statusBarTranslucent={false}
      transparent={transparent}
      visible={visible}>
      <TouchableWithoutFeedback
        disabled={!isCancellable}
        onPress={() => {
          handleTouchableWithoutFeedback();
        }}>
        <View
          style={[
            Styles.modalContainer,
            HelperStyles.justView(
              'backgroundColor',
              themeScheme == 'dark' ? Colors.white125 : Colors.black125,
            ),
            modalContainerStyle,
          ]}>
          {!clearDefaultChildren ? (
            <View
              style={[
                Styles.modalSubContainer,
                HelperStyles.justView('backgroundColor', Theme.background),
                modalSubContainerStyle,
              ]}>
              <View
                style={[Styles.modalItemContainer, modalItemContainerStyle]}>
                {showDefaultChildren ? (
                  <>
                    <Text
                      style={[
                        HelperStyles.textView(
                          14,
                          '600',
                          Theme.text,
                          'center',
                          'none',
                        ),
                        HelperStyles.justView('lineHeight', 16),
                        HelperStyles.margin(0, 16),
                        Boolean(hint) &&
                          HelperStyles.justView('marginBottom', 8),
                        messageTextStyle,
                      ]}>
                      {message}
                    </Text>
                    {Boolean(hint) && (
                      <Text
                        style={[
                          HelperStyles.textView(
                            12,
                            '600',
                            Colors.lightText,
                            'center',
                            'none',
                          ),
                          HelperStyles.justView('lineHeight', 16),
                          HelperStyles.justView('marginTop', 8),
                          HelperStyles.justView('marginBottom', 16),
                          hintTextStyle,
                        ]}>
                        <Text
                          style={HelperStyles.textView(
                            12,
                            '700',
                            Boolean(blinkStatus)
                              ? Colors.red
                              : Colors.lightText,
                            'center',
                            'none',
                          )}>
                          {Labels.hint}: {hint}
                        </Text>
                      </Text>
                    )}
                    <View
                      style={[
                        Styles.modalButtonContainer,
                        modalButtonContainerStyle,
                      ]}>
                      <Button
                        containerStyle={[
                          Styles.positiveContainer,
                          positiveContainerStyle,
                        ]}
                        label={positiveLabel}
                        loading={false}
                        textStyle={positiveLabelStyle}
                        onPress={() => {
                          onPositive();
                        }}
                      />
                      <Button
                        containerStyle={[
                          Styles.negativeContainer,
                          negativeContainerStyle,
                        ]}
                        label={negativeLabel}
                        loading={false}
                        textStyle={[
                          HelperStyles.justView('color', Colors.primaryText),
                          negativeLabelStyle,
                        ]}
                        onPress={() => {
                          onNegative();
                        }}
                      />
                    </View>
                  </>
                ) : (
                  children
                )}
              </View>
            </View>
          ) : (
            children
          )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomModal;
