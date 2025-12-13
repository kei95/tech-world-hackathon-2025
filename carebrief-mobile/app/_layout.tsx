import { Stack, Redirect, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { PatientProvider } from '@/constants/PatientContext';
import { AuthProvider, useAuth } from '@/constants/AuthContext';
import 'react-native-reanimated';

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();

  const inAuthGroup = segments[0] === 'login';

  const shouldRedirectToLogin = !isAuthenticated && !inAuthGroup;
  const shouldRedirectToHome = isAuthenticated && inAuthGroup;

  return (
    <>
      {shouldRedirectToLogin && <Redirect href="/login" />}
      {shouldRedirectToHome && <Redirect href="/" />}
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.backgroundElevated,
          },
          headerTintColor: Colors.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PatientProvider>
        <RootLayoutNav />
      </PatientProvider>
    </AuthProvider>
  );
}
