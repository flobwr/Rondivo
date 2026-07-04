import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { ActionRequiredCard } from '@/components/documents/ActionRequiredCard';
import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { DocumentsHeader } from '@/components/documents/DocumentsHeader';
import { ModuleCard } from '@/components/documents/ModuleCard';
import { SecondaryModulesCard } from '@/components/documents/SecondaryModulesCard';
import { ActionItem, DocumentModule } from '@/components/documents/types';
import { Palette, Spacing } from '@/constants/design';
import { formatAmount } from '@/data/documents/date-utils';
import { factureSummary } from '@/data/documents/factures';
import { devisSummary } from '@/data/documents/devis';
import { rapportSummary } from '@/data/documents/rapports';
import { contratSummary } from '@/data/documents/contrats';
import { getActionItems } from '@/data/documents/insights';
import { PHOTO_INTERVENTIONS } from '@/data/documents/photos';
import { MOCK_IMPORTS } from '@/data/documents/imports';

// Denser rhythm than the shared Spacing tokens — this screen favours a
// tighter, dashboard-like layout over the app's default section spacing.
const HEADER_GAP = 14; // header subtitle -> "à traiter" card
const SECTION_GAP = 18; // "à traiter" card -> module list
const CARD_GAP = 8; // between module cards

// ── Live stats — computed from the same mock data the sub-screens read ────────

const ACTION_ITEMS: ActionItem[] = getActionItems();

const factures = factureSummary();
const devis = devisSummary();
const rapports = rapportSummary();
const contrats = contratSummary();

const PRIMARY_MODULES: DocumentModule[] = [
  {
    id: 'factures',
    title: 'Factures',
    icon: 'file-text',
    stats: [
      ...(factures.overdueCount > 0
        ? [
            {
              text: `${factures.overdueCount} impayée${factures.overdueCount > 1 ? 's' : ''} · ${formatAmount(factures.overdueAmount)} en retard`,
              tone: 'red' as const,
            },
          ]
        : []),
      { text: `${formatAmount(factures.toCollect)} à encaisser` },
    ],
    route: '/factures',
  },
  {
    id: 'devis',
    title: 'Devis',
    icon: 'edit-3',
    stats: [
      ...(devis.toRelaunchCount > 0
        ? [{ text: `${devis.toRelaunchCount} devis à relancer`, tone: 'orange' as const }]
        : []),
      { text: `${formatAmount(devis.potentialAmount)} potentiels` },
      ...(devis.acceptanceRate !== null ? [{ text: `${devis.acceptanceRate} % acceptés` }] : []),
    ],
    route: '/devis',
  },
  {
    id: 'rapports',
    title: 'Rapports',
    icon: 'clipboard',
    stats: [
      ...(rapports.toCompleteCount > 0
        ? [{ text: `${rapports.toCompleteCount} à terminer`, tone: 'orange' as const }]
        : []),
      { text: `${rapports.pdfGeneratedCount} PDF générés` },
    ],
    route: '/rapports',
  },
  {
    id: 'contrats',
    title: 'Contrats',
    icon: 'briefcase',
    stats: [
      { text: `${contrats.activeCount} actif${contrats.activeCount > 1 ? 's' : ''}` },
      ...(contrats.expiringSoonCount > 0
        ? [{ text: `${contrats.expiringSoonCount} expire${contrats.expiringSoonCount > 1 ? 'nt' : ''} bientôt`, tone: 'orange' as const }]
        : contrats.pendingSignatureCount > 0
          ? [{ text: `${contrats.pendingSignatureCount} en attente de signature`, tone: 'orange' as const }]
          : []),
    ],
    route: '/contrats',
  },
];

const SECONDARY_MODULES: DocumentModule[] = [
  { id: 'photos', title: 'Photos', icon: 'camera', count: PHOTO_INTERVENTIONS.length, unit: 'interventions', route: '/photos' },
  { id: 'imports', title: 'Documents importés', icon: 'folder', count: MOCK_IMPORTS.length, unit: 'documents', route: '/documents-importes' },
];

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonBlock({ height, radius = 12, style }: { height: number; radius?: number; style?: object }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 950, useNativeDriver: false }),
        Animated.timing(shimmer, { toValue: 0, duration: 950, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const backgroundColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E8ECF2', '#CED4DE'],
  });

  return <Animated.View style={[{ height, borderRadius: radius, backgroundColor }, style]} />;
}

function DocumentsSkeleton() {
  return (
    <>
      <SkeletonBlock height={44} radius={16} style={{ width: '55%' }} />
      <SkeletonBlock height={148} radius={24} style={{ marginTop: HEADER_GAP }} />
      <View style={{ marginTop: SECTION_GAP, gap: CARD_GAP }}>
        {[0, 1, 2].map((i) => (
          <SkeletonBlock key={i} height={74} radius={24} />
        ))}
      </View>
      <SkeletonBlock height={160} radius={24} style={{ marginTop: SECTION_GAP }} />
    </>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

type Status = 'loading' | 'loaded';

const ALL_MODULES = [...PRIMARY_MODULES, ...SECONDARY_MODULES];

export default function DocumentsScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      setStatus('loaded');
      Animated.timing(fadeIn, { toValue: 1, duration: 260, useNativeDriver: true }).start();
    }, 750);
    return () => clearTimeout(t);
  }, [fadeIn]);

  const handleModulePress = (module: DocumentModule) => {
    if (!module.route) return; // module not built yet
    router.push(module.route as never);
  };

  const handleActionPress = (item: ActionItem) => {
    if (item.route) {
      router.push(item.route as never);
      return;
    }
    const module = ALL_MODULES.find((m) => m.id === item.moduleId);
    if (module) handleModulePress(module);
  };

  const handleAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAddMenuOpen(true);
  };

  const addMenuItems: ActionSheetItem[] = [
    { key: 'devis', icon: 'edit-3', label: 'Nouveau devis', onPress: () => router.push('/devis/new' as never) },
    { key: 'facture', icon: 'file-text', label: 'Nouvelle facture', onPress: () => router.push('/facture/new' as never) },
    { key: 'rapport', icon: 'clipboard', label: 'Nouveau rapport', onPress: () => router.push('/rapport/new' as never) },
    {
      key: 'import',
      icon: 'upload',
      label: 'Importer un document',
      onPress: () => router.push('/documents-importes' as never),
    },
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DocumentsHeader onSearch={() => router.push('/documents-search' as never)} onAdd={handleAddPress} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {status === 'loading' ? (
            <DocumentsSkeleton />
          ) : (
            <Animated.View style={{ opacity: fadeIn }}>
              <View style={{ marginTop: HEADER_GAP }}>
                <ActionRequiredCard items={ACTION_ITEMS} onItemPress={handleActionPress} />
              </View>

              <View style={[styles.moduleList, { marginTop: SECTION_GAP }]}>
                {PRIMARY_MODULES.map((module, index) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    index={index}
                    onPress={() => handleModulePress(module)}
                  />
                ))}
              </View>

              <View style={{ marginTop: SECTION_GAP }}>
                <SecondaryModulesCard modules={SECONDARY_MODULES} onModulePress={handleModulePress} />
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={3} />

      <ActionSheetMenu
        visible={addMenuOpen}
        title="Créer"
        items={addMenuItems}
        onClose={() => setAddMenuOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.screen,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
  },
  moduleList: {
    gap: CARD_GAP,
  },
});
