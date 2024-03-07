import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Intro from '../screens/authScreens/Intro';
import Onboard from '../screens/authScreens/Onboard';
import OTP from '../screens/authScreens/OTP';
import ResetPassword from '../screens/authScreens/ResetPassword';
import SignIn from '../screens/authScreens/SignIn';
import SignUp from '../screens/authScreens/SignUp';
import Splash from '../screens/authScreens/Splash';

const AuthNavigation = () => {
  // AuthNavigation Variables
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Group screenOptions={() => ({headerShown: false})}>
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Onboard" component={Onboard} />
      <Stack.Screen name="OTP" component={OTP} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Splash" component={Splash} />
    </Stack.Group>
  );
};

export default AuthNavigation;
