import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { LegalSections, type LegalSection } from '@/components/plus/resource/LegalSections';
import { Palette, Spacing } from '@/constants/design';

const SECTIONS: LegalSection[] = [
  {
    heading: '1. Données collectées',
    body: 'Rondivo traite les informations que vous saisissez sur votre entreprise, vos employés, vos clients et vos documents, uniquement pour le fonctionnement de l’application.',
  },
  {
    heading: '2. Utilisation des données',
    body: 'Vos données servent exclusivement à générer vos devis, factures, plannings et rapports. Elles ne sont jamais revendues à des tiers.',
  },
  {
    heading: '3. Sauvegarde et sécurité',
    body: 'Vos données sont sauvegardées automatiquement si vous l’activez dans Plus ▸ Sauvegarde, et protégées par des mécanismes de sécurité standards du secteur.',
  },
  {
    heading: '4. Vos droits',
    body: 'Vous pouvez à tout moment consulter, corriger ou demander la suppression de vos données depuis Plus ▸ Mon compte, ou en contactant le support.',
  },
  {
    heading: '5. Conservation',
    body: 'Vos données sont conservées le temps de votre utilisation de Rondivo, puis supprimées dans un délai raisonnable après résiliation de votre compte.',
  },
];

export default function ConfidentialiteScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Politique de confidentialité" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <LegalSections sections={SECTIONS} />
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.section,
  },
});
