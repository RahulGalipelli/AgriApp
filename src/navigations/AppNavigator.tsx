import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import LanguageScreen from "../screens/LanguageScreen";
import SplashScreen from "../screens/SplashScreen";
import ScanPlantScreen from "../screens/ScanPlantScreen";
import ProcessingScreen from "../screens/ProcessingScreen";
import DetectionResultScreen from "../screens/DetectionResultScreen";
import RecommendationsScreen from "../screens/RecommendationsScreen";
import ProductsScreen from "../screens/ProductsScreen";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import OrderConfirmationScreen from "../screens/OrderConfirmationScreen";
import OrdersScreen from "../screens/OrdersScreen";
import TrackingScreen from "../screens/TrackingScreen";
import SupportScreen from "../screens/SupportScreen";
import CommunityScreen from "../screens/CommunityScreen";
import ProfileScreen from "../screens/ProfileScreen";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // Enable gesture-based back navigation on iOS
          gestureEnabled: true,
          animation: "slide_from_right",
        }}
      >
        {/* Screens without header */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        
        {/* Screens with back navigation */}
        <Stack.Screen 
          name="ScanPlant" 
          component={ScanPlantScreen}
          options={{
            gestureEnabled: true,
          }}
        />
        <Stack.Screen 
          name="Processing" 
          component={ProcessingScreen}
          options={{
            gestureEnabled: false, // Prevent going back during processing
          }}
        />
        <Stack.Screen 
          name="DetectionResult" 
          component={DetectionResultScreen}
        />
        <Stack.Screen 
          name="Recommendations" 
          component={RecommendationsScreen}
        />
        <Stack.Screen 
          name="Products" 
          component={ProductsScreen}
        />
        <Stack.Screen 
          name="Cart" 
          component={CartScreen}
        />
        <Stack.Screen 
          name="Checkout" 
          component={CheckoutScreen}
        />
        <Stack.Screen 
          name="OrderConfirmation" 
          component={OrderConfirmationScreen}
        />
        <Stack.Screen 
          name="Orders" 
          component={OrdersScreen}
        />
        <Stack.Screen 
          name="Tracking" 
          component={TrackingScreen}
        />
        <Stack.Screen 
          name="Support" 
          component={SupportScreen}
        />
        <Stack.Screen 
          name="Community" 
          component={CommunityScreen}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
