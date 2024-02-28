import { createStackNavigator } from "@react-navigation/stack";
import { WELCOMESTACKROUTES } from "../constants/const";
import LoginPage from "../auth/LoginPage";
import OtpVerify from "../auth/OtpVerify";
import React from "react";
const Stack = createStackNavigator();

function WelcomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={WELCOMESTACKROUTES.Login} component={LoginPage} />

      <Stack.Screen name={WELCOMESTACKROUTES.OtpVerify} component={OtpVerify} />
    </Stack.Navigator>
  );
}

export default WelcomeStack;
