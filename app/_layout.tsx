import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="planning" />
        <Stack.Screen name="rappels" />
        <Stack.Screen name="clients" />
        <Stack.Screen name="client/[id]" />
        <Stack.Screen name="client/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="notes" />
        <Stack.Screen name="note/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="tasks" />
        <Stack.Screen name="task/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="notifications" />
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
        <Stack.Screen name="photos/[id]" />
        <Stack.Screen name="contrats" />
        <Stack.Screen name="contrat/[id]" />
        <Stack.Screen name="documents-importes" />
        <Stack.Screen name="documents-search" options={{ animation: 'fade' }} />
        <Stack.Screen name="plus" />
        <Stack.Screen name="plus/compte" />
        <Stack.Screen name="plus/entreprise" />
        <Stack.Screen name="plus/employes" />
        <Stack.Screen name="plus/employe/[id]" />
        <Stack.Screen name="plus/employe/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="plus/equipe" />
        <Stack.Screen name="plus/vehicules" />
        <Stack.Screen name="plus/vehicule/[id]" />
        <Stack.Screen name="plus/vehicule/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="plus/materiel" />
        <Stack.Screen name="plus/materiel/[id]" />
        <Stack.Screen name="plus/materiel/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="plus/tva" />
        <Stack.Screen name="plus/numerotation" />
        <Stack.Screen name="plus/paiements" />
        <Stack.Screen name="plus/signature" />
        <Stack.Screen name="plus/apparence" />
        <Stack.Screen name="plus/langue" />
        <Stack.Screen name="plus/notifications" />
        <Stack.Screen name="plus/relances" />
        <Stack.Screen name="plus/sauvegarde" />
        <Stack.Screen name="plus/fournisseurs" />
        <Stack.Screen name="plus/fournisseur/[id]" />
        <Stack.Screen name="plus/fournisseur/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="plus/prestations" />
        <Stack.Screen name="plus/prestation/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="plus/produits" />
        <Stack.Screen name="plus/produit/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="plus/modeles-devis" />
        <Stack.Screen name="plus/modeles-factures" />
        <Stack.Screen name="plus/modeles-contrats" />
        <Stack.Screen name="plus/aide" />
        <Stack.Screen name="plus/tutoriels" />
        <Stack.Screen name="plus/feedback/[type]" />
        <Stack.Screen name="plus/cgu" />
        <Stack.Screen name="plus/confidentialite" />
        <Stack.Screen name="plus/[slug]" />
      </Stack>
      <StatusBar style="dark" />
    </GestureHandlerRootView>
  );
}
