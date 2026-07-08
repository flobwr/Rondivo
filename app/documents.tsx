import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { ActionRequiredCard } from '@/components/documents/ActionRequiredCard';
import { ActionSheetMenu } from '@/components/documents/shared/ActionSheetMenu';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { useDocumentCreationMenu } from '@/components/documents/shared/useDocumentCreationMenu';
import { DocumentsHeader } from '@/components/documents/DocumentsHeader';
import { ModuleCard } from '@/components/documents/ModuleCard';
import { SecondaryModulesCard } from '@/components/documents/SecondaryModulesCard';
import { ActionItem, DocumentModule } from '@/components/documents/types';
import { ScreenFadeInDuration } from '@/constants/animation';
import { Spacing, type PaletteShape } from '@/constants/design';
import { useTheme } from '@/contexts/theme';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { useAsyncItem } from '@/hooks/use-async-item';
import { formatAmount } from '@/data/documents/date-utils';
import { factureSummary, FactureSummary } from '@/services/documents/factures';
import { devisSummary, DevisSummary } from '@/services/documents/devis';
import { rapportSummary, RapportSummary } from '@/services/documents/rapports';
import { contratSummary, ContratSummary } from '@/services/documents/contrats';
import { getActionItems } from '@/services/documents/insights';
import { listPhotoInterventions } from '@/services/documents/photos';
import { listImports } from '@/services/documents/imports';

// Denser rhythm than the shared Spacing tokens — this screen favours a
// tighter, dashboard-like layout over the app's default section spacing.
const HEADER_GAP = 14; // header subtitle -> "à traiter" card
const SECTION_GAP = 18; // "à traiter" card -> module list
const CARD_GAP = 8; // between module cards

// ── Live stats — one combined async fetch, mirroring `fetchHomeBundle` ───────

type DocumentsBundle = {
  actionItems: ActionItem[];
  factures: FactureSummary;
  devis: DevisSummary;
  rapports: RapportSummary;
  contrats: ContratSummary;
  photosCount: number;
  importsCount: number;
};

async function fetchDocumentsBundle(): Promise<DocumentsBundle> {
  const [actionItems, factures, devis, rapports, contrats, photoInterventions, imports] = await Promise.all([
    getActionItems(),
    factureSummary(),
    devisSummary(),
    rapportSummary(),
    contratSummary(),
    listPhotoInterventions(),
    listImports(),
  ]);

  return {
    actionItems,
    factures,
    devis,
    rapports,
    contrats,
    photosCount: photoInterventions.length,
    importsCount: imports.length,
  };
}

function buildModules(bundle: DocumentsBundle): { primary: DocumentModule[]; secondary: DocumentModule[] } {
  const { factures, devis, rapports, contrats } = bundle;

  const primary: DocumentModule[] = [
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

  const secondary: DocumentModule[] = [
    { id: 'photos', title: 'Photos', icon: 'camera', count: bundle.photosCount, unit: 'interventions', route: '/photos' },
    { id: 'imports', title: 'Documents importés', icon: 'folder', count: bundle.importsCount, unit: 'documents', route: '/documents-importes' },
  ];

  return { primary, secondary };
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

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

export default function DocumentsScreen() {
  const router = useRouter();
  const creationMenu = useDocumentCreationMenu();
  const fadeIn = useRef(new Animated.Value(0)).current;
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const fetchDocuments = useCallback(() => fetchDocumentsBundle(), []);
  const { data: bundle, status, refresh } = useAsyncItem(fetchDocuments);
  const isLoading = status === 'loading';

  const { primary: PRIMARY_MODULES, secondary: SECONDARY_MODULES } = bundle
    ? buildModules(bundle)
    : { primary: [], secondary: [] };
  const ALL_MODULES = [...PRIMARY_MODULES, ...SECONDARY_MODULES];

  useEffect(() => {
    if (status === 'success') {
      Animated.timing(fadeIn, { toValue: 1, duration: ScreenFadeInDuration, useNativeDriver: true }).start();
    }
  }, [status, fadeIn]);

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

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DocumentsHeader onSearch={() => router.push('/documents-search' as never)} onAdd={creationMenu.open} palette={palette} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {isLoading || !bundle ? (
            <DocumentsSkeleton />
          ) : status === 'error' ? (
            <EmptyState icon="alert-circle" title="Impossible de charger" subtitle="Une erreur est survenue." actionLabel="Réessayer" onAction={refresh} palette={palette} />
          ) : (
            <Animated.View style={{ opacity: fadeIn }}>
              <View style={{ marginTop: HEADER_GAP }}>
                <ActionRequiredCard items={bundle.actionItems} onItemPress={handleActionPress} palette={palette} />
              </View>

              <View style={[styles.moduleList, { marginTop: SECTION_GAP }]}>
                {PRIMARY_MODULES.map((module, index) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    index={index}
                    onPress={() => handleModulePress(module)}
                    palette={palette}
                  />
                ))}
              </View>

              <View style={{ marginTop: SECTION_GAP }}>
                <SecondaryModulesCard modules={SECONDARY_MODULES} onModulePress={handleModulePress} palette={palette} />
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={3} palette={palette} />

      <ActionSheetMenu
        visible={creationMenu.visible}
        title="Créer"
        items={creationMenu.items}
        onClose={creationMenu.close}
      />
    </View>
  );
}

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
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
}
