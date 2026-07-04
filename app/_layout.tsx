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
        <Stack.Screen name="documents" />
        <Stack.Screen name="documents-factures" />
        <Stack.Screen name="documents-devis" />
        <Stack.Screen name="documents-rapports" />
        <Stack.Screen name="documents-photos" />
        <Stack.Screen name="documents-photos-detail" />
        <Stack.Screen name="documents-contrats" />
        <Stack.Screen name="documents-importes" />
        <Stack.Screen name="documents-search" options={{ animation: 'fade' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
