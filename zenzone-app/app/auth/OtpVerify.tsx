import {AuthContext} from '@context/AuthContextProvider';
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  LogBox,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import OtpInputs from 'react-native-otp-inputs';
import {WIDTH} from '../constants/const';
import {MyText, SafeView} from '../elements/SharedElements';
import useStyle from '../hooks/useStyle';
import colors from '@constants/colors';

LogBox.ignoreLogs(['Warning: Cannot update a component (`OtpVerifyPage`)']);
const COUNTDOWN = 30;

const OtpVerify = ({route}: {route: any}) => {
  const {color} = useStyle();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [otp, setOtp] = useState('');
  const [wrongCode, setWrongCode] = useState(false);
  const {confirmCode, signInWithPhoneNumbers, error} = useContext(AuthContext);
  const [countdown, setCountdown] = useState(COUNTDOWN);

  const {phoneNumber} = route.params;

  useEffect(() => {
    signInWithPhoneNumber();
  }, []);

  const signInWithPhoneNumber = async () => {
    try {
      signInWithPhoneNumbers(phoneNumber);
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const handleResend = () => {
    if (otp.length < 6) {
      setWrongCode(true);
      setCountdown(COUNTDOWN - 1);
      return;
    }
    signInWithPhoneNumber();
  };

  const handleConfirm = async () => {
    if (otp.length < 6) {
      setWrongCode(true);
      setCountdown(COUNTDOWN - 1);
      return;
    }
    setIsSubmitted(true);
    confirmCode(otp).then(res => {
      if (res) {
        setWrongCode(false);
        setIsSubmitted(false);
      } else {
        setWrongCode(true);
        setIsSubmitted(false);
      }
    });
  };

  const handleChange = (code: string) => {
    setOtp(code);
  };

  useEffect(() => {
    if (wrongCode) {
      const interval = setInterval(() => {
        if (countdown > 0 && countdown <= COUNTDOWN - 1)
          setCountdown(prev => prev - 1);
      }, 1000);
      if (countdown === 0) {
        setCountdown(COUNTDOWN);
      }
      return () => clearInterval(interval);
    }
  }, [countdown, wrongCode]);

  useEffect(() => {
    if (otp.length === 6) {
      setIsSubmitted(true);
      confirmCode(otp).then(res => {
        if (res) {
          setWrongCode(false);
          setIsSubmitted(false);
        } else {
          setWrongCode(true);
          setIsSubmitted(false);
        }
      });
    }
  }, [otp]);

  return (
    <SafeView style={styles.container}>
      <View
        style={{
          padding: 20,
          width: WIDTH * 0.9,
        }}>
        <MyText style={styles.headerText}>Enter OTP</MyText>
        <Pressable
          style={{
            height: 50,
          }}>
          <OtpInputs
            handleChange={code => {
              handleChange(code);
            }}
            numberOfInputs={6}
            autofillFromClipboard={true}
            autoFocus={true}
            selectTextOnFocus={true}
            autofillListenerIntervalMS={1000}
            inputContainerStyles={{
              borderWidth: 1,
              borderColor: wrongCode ? colors.secondary : colors.primary,
              width: '15%',
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
            }}
            inputStyles={{
              color: color.inverse,
              fontSize: 28,
              textAlign: 'center',
            }}
            inputMode="numeric"
          />
        </Pressable>
        <ActivityIndicator
          size="large"
          color={color.inverse}
          animating={isSubmitted}
        />

        {wrongCode && (
          <View>
            <MyText
              style={{color: colors.secondary, marginTop: 10}}
              fontSize={14}>
              {error ? error : 'The OTP you entered is incorrect.'}
            </MyText>
            <MyText
              style={{color: colors.secondary, marginTop: 10}}
              fontSize={14}>
              The OTP you entered is incorrect. You can request a new OTP in{' '}
              {countdown} seconds.
            </MyText>
            <TouchableOpacity
              onPress={handleResend}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                backgroundColor:
                  countdown === COUNTDOWN ? colors.secondary : colors.grey,
                borderRadius: 5,
                height: 30,
                width: 100,
              }}
              disabled={countdown !== COUNTDOWN}>
              <MyText style={{color: '#fff'}} fontSize={12}>
                Resend OTP
              </MyText>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            backgroundColor: color.primary,
            padding: 15,
            borderRadius: 5,
          }}
          onPress={handleConfirm}
          disabled={isSubmitted}>
          <MyText style={{color: '#fff'}} bold>
            Verify OTP
          </MyText>
        </TouchableOpacity>
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    height: 50,
    width: '14%',
    borderColor: 'gray',
    padding: 10,
    marginVertical: 20,
    marginHorizontal: 5,
    borderBottomWidth: 1,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default OtpVerify;
