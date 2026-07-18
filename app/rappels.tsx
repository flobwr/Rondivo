import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TINT_COLORS } from '@/components/clients/types';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { PressableScale } from '@/components/ui/PressableScale';
import { createThemedStyles, cardShadow, FontSize, Palette, Radius, Spacing } from '@/theme';
import { useAsyncList } from '@/hooks/use-async-list';
import { listReminderSections } from '@/services/reminders';
import type { ReminderIconFamily, ReminderItem, ReminderSection } from '@/services/reminders';

const ICON_FAMILIES: Record<ReminderIconFamily, typeof Feather> = {
  Feather,
  Ionicons: Ionicons as unknown as typeof Feather,
  MaterialCommunityIcons: MaterialCommunityIcons as unknown as typeof Feather,
};

function ActionRow({ item }: { item: ReminderItem }) {
  const router = useRouter();
  const tint = TINT_COLORS[item.tint];
  const IconComponent = ICON_FAMILIES[item.icon.family];

  return (
    <PressableScale style={styles.row} to={0.98} onPress={() => router.push(item.route as never)}>
      <View style={[styles.rowIcon, { backgroundColor: tint.soft }]}>
        <IconComponent name={item.icon.name as never} size={18} color={tint.color} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Text>
        <Text style={styles.rowSubtitle} numberOfLines={1} ellipsizeMode="tail">
          {item.subtitle}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color={Palette.textTertiary} />
    </PressableScale>
  );
}

function RappelsSkeleton() {
  return (
    <View style={{ gap: Spacing.lg }}>
      {[0, 1, 2].map((i) => (
        <SkeletonBlock key={i} height={70} radius={24} />
      ))}
    </View>
  );
}

export default function RappelsScreen() {
  const router = useRouter();
  const fetchSections = useCallback(() => listReminderSections(), []);
  const { data: sections, status, refresh } = useAsyncList<ReminderSection>(fetchSections);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <PressableScale style={styles.backButton} to={0.9} onPress={() => router.back()} accessibilityLabel="Retour">
            <Feather name="chevron-left" size={24} color={Palette.textPrimary} />
          </PressableScale>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Rappels</Text>
            <Text style={styles.headerSubtitle}>Tout ce qui nécessite votre attention</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {status === 'loading' ? (
            <RappelsSkeleton />
          ) : status === 'error' ? (
            <EmptyState icon="alert-circle" title="Impossible de charger" subtitle="Une erreur est survenue." actionLabel="Réessayer" onAction={refresh} />
          ) : sections.every((s) => s.items.length === 0) ? (
            <EmptyState icon="check-circle" title="Rien à signaler" subtitle="Vous êtes à jour sur tout." />
          ) : (
            sections.map((section) =>
              section.items.length > 0 ? (
                <View key={section.title} style={styles.section}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <View style={styles.card}>
                    {section.items.map((item, index) => (
                      <View key={item.id}>
                        {index > 0 ? <View style={styles.separator} /> : null}
                        <ActionRow item={item} />
                      </View>
                    ))}
                  </View>
                </View>
              ) : null
            )
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.screen,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.iconButtonBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSize.small,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textSecondary,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    ...cardShadow,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  rowTitle: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  rowSubtitle: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    marginTop: 2,
  },
}));
