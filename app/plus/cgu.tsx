import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomDock, useBottomDockClearance } from '@/components/ui/BottomDock';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { LegalSections, type LegalSection } from '@/components/plus/resource/LegalSections';
import { createThemedStyles, Palette, Spacing } from '@/theme';

const SECTIONS: LegalSection[] = [
  {
    heading: '1. Objet',
    body: 'Les présentes conditions générales d’utilisation encadrent l’accès et l’utilisation de l’application Rondivo par les artisans et entreprises l’utilisant pour gérer leur activité (devis, factures, clients, planning).',
  },
  {
    heading: '2. Acceptation',
    body: 'En créant un compte ou en utilisant Rondivo, vous acceptez sans réserve les présentes conditions. Si vous ne les acceptez pas, vous ne devez pas utiliser l’application.',
  },
  {
    heading: '3. Utilisation du service',
    body: 'Vous vous engagez à utiliser Rondivo conformément à sa destination et à fournir des informations exactes sur votre entreprise, vos clients et vos documents.',
  },
  {
    heading: '4. Abonnement et facturation',
    body: 'L’accès à certaines fonctionnalités est soumis à un abonnement payant, renouvelé automatiquement sauf résiliation depuis Plus ▸ Mon compte.',
  },
  {
    heading: '5. Résiliation',
    body: 'Vous pouvez résilier votre abonnement à tout moment. Vos données restent accessibles pendant une période raisonnable après résiliation.',
  },
  {
    heading: '6. Responsabilité',
    body: 'Rondivo met tout en œuvre pour assurer la disponibilité du service, sans garantie de fonctionnement ininterrompu.',
  },
];

export default function CguScreen() {
  const router = useRouter();
  const dockClearance = useBottomDockClearance();

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Conditions d’utilisation" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: dockClearance }]} showsVerticalScrollIndicator={false}>
          <LegalSections sections={SECTIONS} />
        </ScrollView>
      </SafeAreaView>

      <BottomDock activeIndex={4} />
    </View>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.sm,
  },
}));
