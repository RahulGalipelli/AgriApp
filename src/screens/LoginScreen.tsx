import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TextInput as RNTextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
} from "react-native";
import { TextInput, Text } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, typography, spacing, shadows } from "../theme";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

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

const API_BASE = "http://192.168.1.10:8002/auth";

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
  const [mobileNumber, setMobileNumber] = useState("");

  // Countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => {
      if (interval !== undefined) clearInterval(interval);
    };
  }, [otpSent, timer]);

  const sendOtp = async (data: FormData) => {
    if (data.mobileNumber.length !== 10) {
      Alert.alert("Error", "Enter a valid 10-digit mobile number");
      return;
    }
    setMobileNumber(data.mobileNumber);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: data.mobileNumber })
      });
      const result = await response.json();
      if (result.success) {
        setOtpSent(true);
        setTimer(60);
        otpInputRef.current?.focus();
      } else {
        Alert.alert("Error", result.message || "Failed to send OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Network error, try again later");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Enter a valid 6-digit OTP");
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber, otp }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        Alert.alert("Error", result.detail || "Invalid OTP");
        return;
      }
  
      await AsyncStorage.multiSet([
        ["accessToken", result.access_token],
        ["refreshToken", result.refresh_token],
        ["user", JSON.stringify(result.user)],
        ["isLoggedIn", "true"],
      ]);
  
      navigation.replace("Home");
    } catch (err) {
      Alert.alert("Error", "Network error, try again later");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber }),
      });
  
      const result = await response.json();
  
      if (response.ok && result.success) {
        setTimer(60);
        setOtp("");
        otpInputRef.current?.focus();
        Alert.alert("Success", "OTP resent successfully");
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🌾</Text>
          <Text style={styles.title}>Welcome to AgriCure</Text>
          <Text style={styles.subtitle}>
            {otpSent ? "Enter the OTP sent to your mobile" : "Enter your mobile number to continue"}
          </Text>
        </View>

        {/* Form Card */}
        <Card variant="elevated" style={styles.formCard}>
          {!otpSent ? (
            <>
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
                    onChangeText={onChange}
                    onBlur={onBlur}
                    style={styles.input}
                    error={!!errors.mobileNumber}
                    maxLength={10}
                    left={<TextInput.Icon icon="phone" />}
                    outlineColor={colors.border}
                    activeOutlineColor={colors.primary}
                  />
                )}
              />
              {errors.mobileNumber && (
                <Text style={styles.error}>Enter a valid 10-digit mobile number</Text>
              )}

              <Button
                title="Send OTP"
                onPress={handleSubmit(sendOtp)}
                loading={loading}
                disabled={loading}
                fullWidth
                style={styles.button}
              />
            </>
          ) : (
            <>
              <View style={styles.otpHeader}>
                <Text style={styles.otpTitle}>OTP Verification</Text>
                <Text style={styles.otpSubtitle}>
                  We sent a code to +91 {mobileNumber}
                </Text>
              </View>

              <TextInput
                label="Enter OTP"
                mode="outlined"
                keyboardType="numeric"
                value={otp}
                onChangeText={setOtp}
                maxLength={6}
                style={styles.input}
                ref={otpInputRef}
                textContentType="oneTimeCode"
                left={<TextInput.Icon icon="lock" />}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
              />

              <Button
                title="Verify OTP"
                onPress={verifyOtp}
                loading={loading}
                disabled={loading || otp.length !== 6}
                fullWidth
                style={styles.button}
              />

              <View style={styles.resendContainer}>
                <Button
                  title={timer > 0 ? `Resend OTP (${timer}s)` : "Resend OTP"}
                  onPress={resendOtp}
                  variant="ghost"
                  size="small"
                  disabled={timer > 0 || loading}
                />
                <Button
                  title="Change Number"
                  onPress={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                  variant="ghost"
                  size="small"
                  disabled={loading}
                />
              </View>
            </>
          )}
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
  formCard: {
    padding: spacing.xl,
    ...shadows.large,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundLight,
  },
  error: {
    ...typography.bodySmall,
    color: colors.error,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  button: {
    marginTop: spacing.md,
  },
  otpHeader: {
    marginBottom: spacing.lg,
    alignItems: "center",
  },
  otpTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  otpSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: "center",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: spacing.lg,
  },
});
