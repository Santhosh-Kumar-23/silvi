import React, {useCallback, useRef, useState} from 'react';
import {Animated, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Colors from '../../utils/Colors';
import Styles from '../../styles/otherStyles/ProgressCard';

const ProgressCard = ({animationPercent = 0, children, contentStyles}) => {
  const [progressStatus, setProgressStatus] = useState(0);

  const progress = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      progress.addListener(({value}) => {
        setProgressStatus(parseInt(value, 10));
      });

      Boolean(animationPercent) &&
        Animated.timing(progress, {
          toValue: animationPercent,
          duration: 1500,
          useNativeDriver: true,
        }).start();
    }, [animationPercent]),
  );

  const progressColor = () => {
    if (progressStatus >= 0 && progressStatus <= 80) {
      return Colors.progressCardGreen;
    } else if (progressStatus >= 81 && progressStatus <= 100) {
      return Colors.progressCardOrange;
    } else if (progressStatus > 100) {
      return Colors.primary;
    } else {
      return null;
    }
  };

  return (
    <View style={[Styles.container, contentStyles]}>
      <Animated.View
        style={[
          Styles.inner,
          {width: progressStatus + '%', backgroundColor: progressColor()},
        ]}
      />
      <View style={Styles.label}>{children}</View>
    </View>
  );
};

export default ProgressCard;
