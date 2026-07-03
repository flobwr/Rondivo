import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { ActionRequiredCard } from '@/components/documents/ActionRequiredCard';
import { DocumentsHeader } from '@/components/documents/DocumentsHeader';
import { ModuleCard } from '@/components/documents/ModuleCard';
import { ActionItem, DocumentModule } from '@/components/documents/types';
import { Palette, Spacing } from '@/constants/design';

// Denser rhythm than the shared Spacing tokens — this screen favours a
// tighter, dashboard-like layout over the app's default section spacing.
const HEADER_GAP = 14; // header subtitle -> "à traiter" card
const SECTION_GAP = 18; // "à traiter" card -> module list
const CARD_GAP = 10; // between module cards

// ── Mock data — replace with real data source ─────────────────────────────────

const ACTION_ITEMS: ActionItem[] = [
  { id: 'act-1', moduleId: 'factures', icon: 'file-text', text: '3 factures impayées', tone: 'red' },
  { id: 'act-2', moduleId: 'devis', icon: 'edit-3', text: '2 devis à relancer', tone: 'orange' },
  { id: 'act-3', moduleId: 'rapports', icon: 'clipboard', text: '1 rapport à terminer', tone: 'orange' },
];

const MODULES: DocumentModule[] = [
  {
    id: 'factures',
    title: 'Factures',
    icon: 'file-text',
    count: 148,
    unit: 'documents',
    highlight: { text: '3 impayées', tone: 'red' },
    secondary: '12 540 € en attente',
  },
  {
    id: 'devis',
    title: 'Devis',
    icon: 'edit-3',
    count: 32,
    unit: 'documents',
    highlight: { text: '5 en attente', tone: 'orange' },
    secondary: '18 200 € potentiels',
  },
  {
    id: 'rapports',
    title: 'Rapports',
    icon: 'clipboard',
    count: 84,
    unit: 'rapports',
    highlight: { text: '2 à terminer', tone: 'orange' },
  },
  {
    id: 'photos',
    title: 'Photos',
    icon: 'camera',
    count: 426,
    unit: 'photos',
  },
  {
    id: 'contrats',
    title: 'Contrats',
    icon: 'briefcase',
    count: 14,
    unit: 'contrats',
  },
  {
    id: 'imports',
    title: 'Documents importés',
    icon: 'folder',
    count: 58,
    unit: 'documents',
  },
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
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <SkeletonBlock key={i} height={74} radius={24} />
        ))}
      </View>
    </>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

type Status = 'loading' | 'loaded';

export default function DocumentsScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');
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
    const module = MODULES.find((m) => m.id === item.moduleId);
    if (module) handleModulePress(module);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DocumentsHeader />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {status === 'loading' ? (
            <DocumentsSkeleton />
          ) : (
            <Animated.View style={{ opacity: fadeIn }}>
              <View style={{ marginTop: HEADER_GAP }}>
                <ActionRequiredCard items={ACTION_ITEMS} onItemPress={handleActionPress} />
              </View>

              <View style={[styles.moduleList, { marginTop: SECTION_GAP }]}>
                {MODULES.map((module, index) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    index={index}
                    onPress={() => handleModulePress(module)}
                  />
                ))}
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={3} />
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
