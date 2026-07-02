import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="planning" />
        <Stack.Screen name="rappels" />
        <Stack.Screen name="clients" />
        <Stack.Screen name="client/[id]" />
        <Stack.Screen name="appointment/new" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
