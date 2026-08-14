import { Slot, useRouter, useSegments } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCredentials, setLoading } from '../src/store/slices/authSlice';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function InitialLayout() {
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const userStr = await AsyncStorage.getItem('auth_user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          store.dispatch(setCredentials({ user, accessToken: token }));
        }
      } catch (e) {
        console.error("Error loading auth:", e);
      } finally {
        store.dispatch(setLoading(false));
        setIsReady(true);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    const state = store.getState().auth;

    if (!state.isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (state.isAuthenticated && inAuthGroup) {
      // Redirect to app if authenticated
      router.replace('/(app)/dashboard');
    }
  }, [isReady, segments]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <InitialLayout />
      </SafeAreaProvider>
    </Provider>
  );
}
