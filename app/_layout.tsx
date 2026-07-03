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
        <Stack.Screen name="client/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="appointment/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="intervention/[id]" />
        <Stack.Screen name="documents" />
        <Stack.Screen name="factures" />
        <Stack.Screen name="facture/[id]" />
        <Stack.Screen name="facture/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="devis" />
        <Stack.Screen name="devis/[id]" />
        <Stack.Screen name="devis/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="rapports" />
        <Stack.Screen name="rapport/[id]" />
        <Stack.Screen name="rapport/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="photos" />
        <Stack.Screen name="contrats" />
        <Stack.Screen name="contrat/[id]" />
        <Stack.Screen name="documents-importes" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
