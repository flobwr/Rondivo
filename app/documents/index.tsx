import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { CategoryCard, CategoryStat } from '@/components/documents/dashboard/CategoryCard';
import { OtherDocsSection } from '@/components/documents/dashboard/OtherDocsSection';
import { TodoCard } from '@/components/documents/dashboard/TodoCard';
import { CreateAction, CreateSheet } from '@/components/documents/CreateSheet';
import {
  ACTION_ITEMS,
  contractStats,
  invoiceStats,
  photoStats,
  importedDocStats,
  quoteStats,
  reportStats,
} from '@/constants/documents-data';
import { formatEuro } from '@/constants/format';
import { FontSize, Palette, Spacing } from '@/constants/design';
import { iconButtonShadow } from '@/constants/shadow';

const CREATE_ROUTES: Record<CreateAction, string> = {
  devis: '/documents/nouveau-devis',
  facture: '/documents/nouvelle-facture',
  rapport: '/documents/nouveau-rapport',
  import: '/documents/importes',
};

export default function DocumentsScreen() {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

  const facturesStats: CategoryStat[] = [
    {
      text: `${invoiceStats.overdueCount} impayées · ${formatEuro(invoiceStats.overdueAmount)} en retard`,
      tone: 'red',
    },
    { text: `${formatEuro(invoiceStats.outstanding)} à encaisser`, tone: 'grey' },
  ];

  const devisStats: CategoryStat[] = [
    { text: `${quoteStats.toFollowUp} devis à relancer`, tone: 'amber' },
    { text: `${formatEuro(quoteStats.potential)} potentiels`, tone: 'grey' },
    { text: `${quoteStats.acceptanceRate} % acceptés`, tone: 'grey' },
  ];

  const rapportsStats: CategoryStat[] = [
    { text: `${reportStats.toComplete} à terminer`, tone: 'amber' },
    { text: `${reportStats.pdfGenerated} PDF générés`, tone: 'grey' },
  ];

  const contratsStats: CategoryStat[] = [
    { text: `${contractStats.active} actifs`, tone: 'grey' },
    {
      text: `${contractStats.expiringSoon} ${contractStats.expiringSoon > 1 ? 'expirent' : 'expire'} bientôt`,
      tone: 'amber',
    },
  ];

  const handleCreateSelect = (action: CreateAction) => {
    setCreateOpen(false);
    router.push(CREATE_ROUTES[action] as never);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Documents</Text>
            <Text style={styles.subtitle}>Tous vos documents</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.headerButton} hitSlop={6}>
              <Feather name="search" size={19} color={Palette.textPrimary} />
            </Pressable>
            <Pressable style={styles.headerButton} hitSlop={6} onPress={() => setCreateOpen(true)}>
              <Feather name="plus" size={20} color={Palette.textPrimary} />
            </Pressable>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <TodoCard items={ACTION_ITEMS} />

          <View style={styles.section}>
            <CategoryCard
              icon="file-text"
              title="Factures"
              stats={facturesStats}
              onPress={() => router.push('/documents/factures')}
            />
          </View>
          <View style={styles.cardGap}>
            <CategoryCard
              icon="edit-3"
              title="Devis"
              stats={devisStats}
              onPress={() => router.push('/documents/devis')}
            />
          </View>
          <View style={styles.cardGap}>
            <CategoryCard
              icon="clipboard"
              title="Rapports"
              stats={rapportsStats}
              onPress={() => router.push('/documents/rapports')}
            />
          </View>
          <View style={styles.cardGap}>
            <CategoryCard
              icon="briefcase"
              title="Contrats"
              stats={contratsStats}
              onPress={() => router.push('/documents/contrats')}
            />
          </View>

          <View style={styles.section}>
            <OtherDocsSection
              rows={[
                {
                  icon: 'camera',
                  title: 'Photos',
                  subtitle: `${photoStats.interventions} interventions`,
                  onPress: () => router.push('/documents/photos'),
                },
                {
                  icon: 'folder',
                  title: 'Documents importés',
                  subtitle: `${importedDocStats.total} documents`,
                  onPress: () => router.push('/documents/importes'),
                },
              ]}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={3} />

      <CreateSheet
        visible={createOpen}
        onClose={() => setCreateOpen(false)}
        onSelect={handleCreateSelect}
      />
    </View>
  );
}

const BUTTON = 44;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.screen,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingTop: 14,
    paddingBottom: 4,
  },
  headerText: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: FontSize.label,
    color: Palette.textSecondary,
    marginTop: 4,
    letterSpacing: -0.1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  headerButton: {
    width: BUTTON,
    height: BUTTON,
    borderRadius: 14,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...iconButtonShadow,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.section,
  },
  section: {
    marginTop: Spacing.section,
  },
  cardGap: {
    marginTop: Spacing.md,
  },
});
