import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { AccordionList, type AccordionItem } from '@/components/plus/resource/AccordionList';
import { Palette, Spacing } from '@/constants/design';

const FAQ: AccordionItem[] = [
  {
    key: 'devis',
    question: 'Comment créer un devis ?',
    answer: 'Depuis Documents, appuyez sur "+" puis "Nouveau devis". Choisissez un client, ajoutez vos lignes de prestations ou produits, et envoyez-le directement par e-mail ou en PDF.',
  },
  {
    key: 'relance',
    question: 'Comment relancer un client ?',
    answer: 'Activez les relances automatiques dans Plus ▸ Relances automatiques : Rondivo relance vos devis en attente et vos factures impayées selon les délais que vous choisissez.',
  },
  {
    key: 'facture',
    question: 'Comment transformer un devis en facture ?',
    answer: 'Ouvrez le devis accepté, puis utilisez l’action "Convertir en facture" — les lignes, le client et les montants sont repris automatiquement.',
  },
  {
    key: 'employes',
    question: 'Comment ajouter un employé ?',
    answer: 'Rendez-vous dans Plus ▸ Employés, puis appuyez sur "+". Vous pourrez ensuite lui attribuer un rôle depuis Plus ▸ Équipe.',
  },
  {
    key: 'sauvegarde',
    question: 'Mes données sont-elles sauvegardées ?',
    answer: 'Oui. Si la sauvegarde automatique est activée (Plus ▸ Sauvegarde), vos données sont synchronisées en continu.',
  },
];

export default function AideScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Centre d’aide" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <AccordionList items={FAQ} />
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
