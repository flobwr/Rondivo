import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { ACTION_ITEMS } from '@/components/documents/mock-data';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

// ── Action Center ───────────────────────────────────────────────────────────────

const URGENCY_CONFIG = {
  high: { color: Palette.red, bg: Palette.redSoft },
  medium: { color: Palette.orange, bg: Palette.orangeSoft },
  low: { color: Palette.blue, bg: Palette.blueSoft },
} as const;

const ACTION_ICONS = {
  invoice: 'file-text' as const,
  quote: 'edit-3' as const,
  report: 'clipboard' as const,
  contract: 'briefcase' as const,
};

function ActionCenter() {
  return (
    <View style={styles.actionCard}>
      <View style={styles.actionHeader}>
        <Text style={styles.actionTitle}>À traiter</Text>
        <View style={styles.actionBadge}>
          <Text style={styles.actionBadgeText}>
            {ACTION_ITEMS.length}
          </Text>
        </View>
      </View>

      {ACTION_ITEMS.map((item, index) => {
        const config = URGENCY_CONFIG[item.urgency];
        return (
          <View key={item.id}>
            {index > 0 ? <View style={styles.separator} /> : null}
            <Pressable
              style={styles.actionRow}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}>
              <View style={[styles.actionIcon, { backgroundColor: config.bg }]}>
                <Feather name={ACTION_ICONS[item.type]} size={16} color={config.color} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionRowTitle}>{item.title}</Text>
                <Text style={styles.actionRowSubtitle}>{item.subtitle}</Text>
              </View>
              <Feather name="chevron-right" size={18} color={Palette.textTertiary} />
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

// ── Category Cards ──────────────────────────────────────────────────────────────

type CategoryData = {
  key: string;
  title: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  iconColor: string;
  iconBg: string;
  route: string;
  lines: { text: string; highlight?: boolean }[];
};

const CATEGORIES: CategoryData[] = [
  {
    key: 'factures',
    title: 'Factures',
    icon: 'file-text',
    iconColor: Palette.blue,
    iconBg: Palette.blueSoft,
    route: '/documents-factures',
    lines: [
      { text: '3 impayées', highlight: true },
      { text: '12 540 € à encaisser' },
    ],
  },
  {
    key: 'devis',
    title: 'Devis',
    icon: 'edit-3',
    iconColor: Palette.blue,
    iconBg: Palette.blueSoft,
    route: '/documents-devis',
    lines: [
      { text: '5 en attente', highlight: true },
      { text: '18 200 € potentiels' },
    ],
  },
  {
    key: 'rapports',
    title: 'Rapports',
    icon: 'clipboard',
    iconColor: Palette.blue,
    iconBg: Palette.blueSoft,
    route: '/documents-rapports',
    lines: [
      { text: '2 à terminer', highlight: true },
    ],
  },
];

const OTHER_CATEGORIES: { key: string; title: string; icon: React.ComponentProps<typeof Feather>['name']; count: string; route: string }[] = [
  { key: 'photos', title: 'Photos', icon: 'camera', count: '5 interventions', route: '/documents-photos' },
  { key: 'contrats', title: 'Contrats', icon: 'briefcase', count: '4 contrats', route: '/documents-contrats' },
  { key: 'importes', title: 'Documents importés', icon: 'folder', count: '7 documents', route: '/documents-importes' },
];

function CategoryCard({ category }: { category: CategoryData }) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 5,
      tension: 300,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 100,
    }).start();
  };

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(category.route as never);
      }}>
      <Animated.View style={[styles.categoryCard, { transform: [{ scale }] }]}>
        <View style={[styles.categoryIcon, { backgroundColor: category.iconBg }]}>
          <Feather name={category.icon} size={20} color={category.iconColor} />
        </View>
        <View style={styles.categoryContent}>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          {category.lines.map((line) => (
            <Text
              key={line.text}
              style={[
                styles.categoryLine,
                line.highlight && styles.categoryLineHighlight,
              ]}>
              {line.highlight ? '• ' : ''}
              {line.text}
            </Text>
          ))}
        </View>
        <Feather name="chevron-right" size={20} color={Palette.textTertiary} />
      </Animated.View>
    </Pressable>
  );
}

function OtherCategoryRow({ item }: { item: typeof OTHER_CATEGORIES[number] }) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.otherRow}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(item.route as never);
      }}>
      <View style={[styles.otherIcon, { backgroundColor: Palette.blueSoft }]}>
        <Feather name={item.icon} size={18} color={Palette.blue} />
      </View>
      <Text style={styles.otherTitle}>{item.title}</Text>
      <Text style={styles.otherCount}>{item.count}</Text>
      <Feather name="chevron-right" size={18} color={Palette.textTertiary} />
    </Pressable>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────────

export default function DocumentsScreen() {
  const router = useRouter();
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 280, useNativeDriver: true }).start();
  }, [fadeIn]);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <Animated.View style={[styles.flex, { opacity: fadeIn }]}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Documents</Text>
              <Text style={styles.headerSubtitle}>Tous vos documents</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable
                style={styles.headerButton}
                hitSlop={8}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/documents-search' as never);
                }}>
                <Feather name="search" size={20} color={Palette.textPrimary} />
              </Pressable>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}>
            <ActionCenter />

            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat.key} category={cat} />
            ))}

            <Text style={styles.sectionLabel}>AUTRES DOCUMENTS</Text>
            <View style={styles.otherCard}>
              {OTHER_CATEGORIES.map((item, index) => (
                <View key={item.key}>
                  {index > 0 ? <View style={styles.separator} /> : null}
                  <OtherCategoryRow item={item} />
                </View>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>

      <BottomNav activeIndex={3} />
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.screen,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: FontSize.label,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingTop: 4,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  scroll: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section * 2,
    gap: Spacing.md,
  },

  // Action center
  actionCard: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.cardPadding,
    marginBottom: Spacing.sm,
    ...cardShadow,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  actionTitle: {
    fontSize: FontSize.section,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  actionBadge: {
    backgroundColor: Palette.red,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.white,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  actionRowTitle: {
    fontSize: FontSize.cardLabel,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  actionRowSubtitle: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    marginTop: 1,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },

  // Category cards
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.cardPadding,
    ...cardShadow,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  categoryTitle: {
    fontSize: FontSize.section,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  categoryLine: {
    fontSize: FontSize.small,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  categoryLineHighlight: {
    color: '#B45309',
    fontWeight: '500',
  },

  // Other documents
  sectionLabel: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    color: Palette.textTertiary,
    letterSpacing: 0.5,
    marginTop: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  otherCard: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    ...cardShadow,
  },
  otherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  otherIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherTitle: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    marginLeft: Spacing.md,
  },
  otherCount: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    marginRight: Spacing.sm,
  },
});
