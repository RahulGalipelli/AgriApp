import React, { useEffect } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../theme";

export default function SplashScreen({ navigation }: any) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const bootstrap = async () => {
      const onboardingDone = await AsyncStorage.getItem("onboardingDone");
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");

      if (onboardingDone !== "true") {
        navigation.replace("Language");
        return;
      }

      if (isLoggedIn === "true") {
        navigation.replace("Home");
      } else {
        navigation.replace("Login");
      }
    };

    const timeoutId = setTimeout(bootstrap, 1500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/logo.png")}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 270,
    height: 270,
  },
});
