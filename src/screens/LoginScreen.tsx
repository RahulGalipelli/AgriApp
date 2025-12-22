import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Alert, TextInput as RNTextInput, Platform } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import SmsRetriever from 'react-native-sms-retriever'; // Android auto-read

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

type FormData = {
  mobileNumber: string;
};

const API_BASE = "http://192.168.1.10:8002";
const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { mobileNumber: "" }
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const otpInputRef = useRef<RNTextInput>(null);

  const [mobileNumber, setMobileNumber] = useState(""); // store mobile for API calls

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timer;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Android SMS auto-read
  useEffect(() => {
    if (otpSent && Platform.OS === 'android') {
      SmsRetriever.startSmsRetriever()
        .then(() => {
          SmsRetriever.addSmsListener(event => {
            const message = event.message;
            const code = message.match(/\d{6}/)?.[0]; // extract OTP
            if (code) setOtp(code);
            SmsRetriever.removeSmsListener();
          });
        })
        .catch(console.log);
    }
  }, [otpSent]);

  // Send OTP API placeholder
  const sendOtp = async (data: FormData) => {
    if (data.mobileNumber.length !== 10) {
      Alert.alert("Error", "Enter a valid 10-digit mobile number");
      return;
    }
    setMobileNumber(data.mobileNumber);
    setLoading(true);
    try {
      // Replace with your backend API
      const response = await fetch(`${API_BASE}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: data.mobileNumber })
      });
      const result = await response.json();
      if (result.success) {
        setOtpSent(true);
        setTimer(6);
        otpInputRef.current?.focus();
        Alert.alert("OTP Sent", `OTP sent to ${data.mobileNumber}`);
      } else {
        Alert.alert("Error", result.message || "Failed to send OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Network error, try again later");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP API placeholder
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, otp })
      });
      const result = await response.json();
      if (result.success) {
        navigation.replace("Home");
      } else {
        Alert.alert("Error", result.message || "Invalid OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Network error, try again later");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
      // Replace with your backend API
      const response = await fetch(`${API_BASE}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber })
      });
      const result = await response.json();
      if (result.success) {
        setTimer(60);
        setOtp("");
        otpInputRef.current?.focus();
        Alert.alert("OTP Sent", "OTP resent successfully");
      } else {
        Alert.alert("Error", result.message || "Failed to resend OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Network error, try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Controller
        control={control}
        name="mobileNumber"
        rules={{
          required: true,
          pattern: /^[0-9]{10}$/
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Mobile Number"
            mode="outlined"
            keyboardType="numeric"
            value={value}
            onChangeText={(text) => {
              onChange(text);
            }}
            onBlur={onBlur}
            style={styles.input}
            error={!!errors.mobileNumber}
            maxLength={10}
            disabled={otpSent}
          />
        )}
      />
      {errors.mobileNumber && (
        <Text style={styles.error}>Enter a valid 10-digit mobile number</Text>
      )}

      {!otpSent ? (
        <Button
          mode="contained"
          onPress={handleSubmit(sendOtp)}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Send OTP
        </Button>
      ) : (
        <>
          <TextInput
            label="Enter OTP"
            mode="outlined"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
            style={styles.input}
            ref={otpInputRef}
            textContentType="oneTimeCode" // iOS auto-fill
          />

          <Button
            mode="contained"
            onPress={verifyOtp}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Verify OTP
          </Button>

          <View style={styles.resendContainer}>
            <Button
              mode="text"
              onPress={resendOtp}
              disabled={timer > 0 || loading}
            >
              Resend OTP {timer > 0 ? `(${timer}s)` : ""}
            </Button>

            <Button
              mode="text"
              onPress={() => {
                setOtpSent(false);
                setOtp("");
              }}
              disabled={loading}
            >
              Change Mobile Number
            </Button>
          </View>
        </>
      )}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, alignSelf: "center" },
  input: { marginBottom: 10 },
  button: { marginTop: 20 },
  error: { color: "red", marginBottom: 10 },
  resendContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 }
});
