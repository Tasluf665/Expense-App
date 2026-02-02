import { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import * as Linking from 'expo-linking';
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { PaperProvider } from 'react-native-paper';
import { persistor, store } from "../utils/store";
import { supabase } from "../lib/supabase";

// Add Buffer shimming for URL token parsing
global.Buffer = require("buffer").Buffer;

/**
 * Parse Supabase URL (convert # to ? for token extraction)
 * Supabase sends tokens in fragment (#) but we need query params (?)
 */
const parseSupabaseUrl = (url) => {
  return url.includes("#") ? url.replace("#", "?") : url;
};

/**
 * Handle deep link when user clicks password reset email link
 */
const handleResetPasswordDeepLink = async (transformedUrl) => {
  try {
    const parsedUrl = Linking.parse(transformedUrl);
    const access_token = parsedUrl.queryParams?.access_token;
    const refresh_token = parsedUrl.queryParams?.refresh_token;

    if (access_token && refresh_token) {
      console.log('🔗 Deep link detected with tokens, setting session...');
      
      // Set the session using the tokens from the email link
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        console.error('❌ Failed to set session:', error);
        return;
      }

      console.log('✅ Session set successfully, user can now reset password');
    }
  } catch (error) {
    console.error('❌ Error parsing deep link:', error);
  }
};

/**
 * Deep linking configuration
 * Handles initial URL when app opens from deep link
 */
const linking = {
  prefixes: [
    // Custom scheme
    'spendwise://',
    // Expo development
    'exp+spendwise://',
    // Android app links
    'https://yourapp.com',
  ],
  config: {
    screens: {
      index: '',
      ResetPassword: '/ResetPassword',
      '(Authentication)': {
        SplashScreen: 'splash',
        SignUpScreen: 'signup',
        LoginScreen: 'login',
        OnboardingScreen: 'onboarding',
        ResetPasswordScreen: 'reset-password',
      },
      NotFound: '*',
    },
  },
};

/**
 * Get the initial URL when app is launched from deep link
 */
const getInitialURL = async () => {
  const url = await Linking.getInitialURL();
  
  if (url != null) {
    console.log('📱 App launched from deep link:', url);
    
    // Handle the URL
    const transformedUrl = parseSupabaseUrl(url);
    await handleResetPasswordDeepLink(transformedUrl);
    
    // Extract route path
    if (url.includes('/ResetPassword')) {
      return 'ResetPassword';
    }
  }
  
  return undefined;
};

/**
 * Subscribe to deep links while app is in foreground
 */
const subscribe = (listener) => {
  console.log('🎯 Deep link subscriber initialized');
  
  const onReceiveURL = async ({ url }) => {
    console.log('🔗 Deep link received in foreground:', url);
    
    const transformedUrl = parseSupabaseUrl(url);
    
    // Handle password reset flow
    if (url.includes('/ResetPassword') || url.includes('recovery')) {
      await handleResetPasswordDeepLink(transformedUrl);
    }
    
    // Let React Navigation handle the routing
    listener(transformedUrl);
  };

  // Listener for background to foreground transitions
  const subscription = Linking.addEventListener('url', onReceiveURL);

  return () => {
    subscription.remove();
  };
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <Stack 
            screenOptions={{ 
              headerShown: false,
              linking,
              getInitialURL,
              subscribe,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(Authentication)" />
            <Stack.Screen name="(Common)" />
          </Stack>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
