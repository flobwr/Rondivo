import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomDock } from '@/components/ui/BottomDock';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { AccordionList, type AccordionItem } from '@/components/plus/resource/AccordionList';
import { Palette, Spacing } from '@/theme';

const TUTORIELS: AccordionItem[] = [
  {
    key: 'planning',
    question: 'Organiser sa journée avec le Planning',
    answer: 'Le Planning affiche vos interventions du jour dans l’ordre, avec le temps de trajet estimé jusqu’à la prochaine intervention — utile pour partir à l’heure.',
  },
  {
    key: 'catalogue',
    question: 'Gagner du temps avec le catalogue',
    answer: 'Ajoutez vos prestations et produits récurrents dans Plus ▸ Prestations et Produits : ils seront proposés directement lors de la création d’un devis ou d’une facture.',
  },
  {
    key: 'signature',
    question: 'Ajouter votre signature aux documents',
    answer: 'Dans Plus ▸ Signature, renseignez votre nom : il sera ajouté automatiquement en bas de vos devis et factures.',
  },
  {
    key: 'equipe',
    question: 'Donner accès à votre équipe',
    answer: 'Chaque employé peut avoir un rôle différent (Administrateur, Manager, Technicien) depuis Plus ▸ Équipe, pour adapter ce qu’il peut voir et modifier.',
  },
];

export default function TutorielsScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Tutoriels" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <AccordionList items={TUTORIELS} />
        </ScrollView>
      </SafeAreaView>

      <BottomDock activeIndex={4} />
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
