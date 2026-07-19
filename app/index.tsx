import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionSheetMenu } from '@/components/documents/shared/ActionSheetMenu';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { useDocumentCreationMenu } from '@/components/documents/shared/useDocumentCreationMenu';
import { HomeHeader } from '@/components/home/HomeHeader';
import { NextInterventionCard } from '@/components/home/NextInterventionCard';
import { QuickActionsRow } from '@/components/home/QuickActionsRow';
import { RemindersCard } from '@/components/home/RemindersCard';
import { ScheduleCard } from '@/components/home/ScheduleCard';
import { SectionTitle } from '@/components/home/SectionTitle';
import { getHomeStatus } from '@/components/home/status';
import { useNowMinutes } from '@/components/home/time';
import { Intervention } from '@/components/intervention/types';
import { BottomDock } from '@/components/ui/BottomDock';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { useTheme } from '@/contexts/theme';
import { useAsyncItem } from '@/hooks/use-async-item';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { HomeSchedule, getHomeSchedule } from '@/services/home-schedule';
import { getIntervention } from '@/services/interventions';
import { getUnreadNotificationCount } from '@/services/notifications';
import { getAccount } from '@/services/plus/company';
import { getReminderSummary, type ReminderSummary } from '@/services/reminders';
import { Motion, Spacing, Type, type PaletteShape } from '@/theme';

/** The Home only ever shows the next two stops — "Voir le planning" is where the full day lives. */
const MAX_REMAINING_ON_HOME = 2;

type HomeBundle = {
  schedule: HomeSchedule;
  accountName: string;
  accountInitials: string;
  unreadCount: number;
  reminders: ReminderSummary;
  nextIntervention?: Intervention;
};

async function fetchHomeBundle(): Promise<HomeBundle> {
  const schedule = await getHomeSchedule();
  const [account, unreadCount, reminders, nextIntervention] = await Promise.all([
    getAccount(),
    getUnreadNotificationCount(),
    getReminderSummary(),
    schedule.hasNextIntervention ? getIntervention(schedule.nextInterventionId) : Promise.resolve(undefined),
  ]);

  return {
    schedule,
    accountName: account.name,
    accountInitials: account.initials,
    unreadCount,
    reminders,
    nextIntervention,
  };
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function HomeSkeleton() {
  return (
    <>
      <View style={skStyles.topRow}>
        <SkeletonBlock height={12} radius={6} style={{ width: '38%' }} />
        <View style={skStyles.wells}>
          <SkeletonBlock height={42} radius={21} style={{ width: 42 }} />
          <SkeletonBlock height={42} radius={21} style={{ width: 42 }} />
        </View>
      </View>
      <SkeletonBlock height={36} radius={10} style={{ marginTop: 16, width: '68%' }} />
      <SkeletonBlock height={15} radius={6} style={{ marginTop: 8, width: '52%' }} />

      <SkeletonBlock height={216} radius={26} style={{ marginTop: Spacing.section }} />

      <View style={skStyles.quickRow}>
        {[0, 1, 2, 3].map((i) => (
          <SkeletonBlock key={i} height={82} radius={18} style={{ flex: 1 }} />
        ))}
      </View>

      <SkeletonBlock height={68} radius={20} style={{ marginTop: Spacing.md }} />

      <SkeletonBlock height={20} radius={8} style={{ marginTop: Spacing.section, marginBottom: 14, width: '52%' }} />
      <SkeletonBlock height={88} radius={20} />
      <SkeletonBlock height={88} radius={20} style={{ marginTop: 10 }} />
    </>
  );
}

const skStyles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wells: {
    flexDirection: 'row',
    gap: 10,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: Spacing.section,
  },
});

// ── Screen ────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const creationMenu = useDocumentCreationMenu();
  const { palette } = useTheme();
  const reducedMotion = useReducedMotion();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const nowMin = useNowMinutes();

  const fetchHome = useCallback(() => fetchHomeBundle(), []);
  const { data: home, status, refresh } = useAsyncItem(fetchHome);
  const isLoading = status === 'loading';
  const isError = status === 'error';
  const upcoming = home?.schedule.remainingAppointments.slice(0, MAX_REMAINING_ON_HOME) ?? [];

  // Sections settle onto the paper one after the other — a quiet 40 ms
  // cascade, no motion at all when the system asks for none.
  const enter = (index: number) =>
    reducedMotion ? undefined : FadeInDown.duration(Motion.base).delay(index * 40);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {isError ? (
            <EmptyState
              icon="alert-circle"
              title="Impossible de charger l’accueil"
              subtitle="Vérifiez votre connexion et réessayez."
              actionLabel="Réessayer"
              onAction={refresh}
              palette={palette}
            />
          ) : isLoading || !home ? (
            <HomeSkeleton />
          ) : (
            <>
              <Animated.View entering={enter(0)}>
                <HomeHeader
                  name={home.accountName}
                  initials={home.accountInitials}
                  unreadNotificationCount={home.unreadCount}
                  status={getHomeStatus({
                    nowMin,
                    hasNextIntervention: home.schedule.hasNextIntervention,
                    nextIntervention: home.nextIntervention,
                    interventionsTodayCount: home.schedule.interventionsTodayCount,
                    reminderCount: home.reminders.count,
                  })}
                />
              </Animated.View>

              <Animated.View entering={enter(1)} style={styles.section}>
                <NextInterventionCard
                  intervention={home.schedule.hasNextIntervention ? home.nextIntervention : undefined}
                />
              </Animated.View>

              <Animated.View entering={enter(2)} style={styles.section}>
                <QuickActionsRow onNewDocument={creationMenu.open} />
              </Animated.View>

              <Animated.View entering={enter(3)} style={styles.sectionTight}>
                <RemindersCard nextReminder={home.reminders.nextTitle} count={home.reminders.count} />
              </Animated.View>

              {home.schedule.interventionsTodayCount > 0 ? (
                <Animated.View entering={enter(4)} style={styles.section}>
                  <SectionTitle
                    title="Le reste de la journée"
                    meta="Voir le planning"
                    onMetaPress={() => router.push('/planning')}
                  />

                  {upcoming.length > 0 ? (
                    <View style={styles.scheduleList}>
                      {upcoming.map((apt) => (
                        <ScheduleCard key={apt.id} appointment={apt} />
                      ))}
                    </View>
                  ) : (
                    <View style={styles.emptyDay}>
                      <Feather name="check-circle" size={15} color={palette.textTertiary} />
                      <Text style={styles.emptyDayText}>
                        {home.schedule.hasNextIntervention
                          ? 'Rien d’autre prévu après cette intervention.'
                          : 'Toutes les interventions du jour sont terminées.'}
                      </Text>
                    </View>
                  )}
                </Animated.View>
              ) : null}
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      <BottomDock activeIndex={0} />

      <ActionSheetMenu
        visible={creationMenu.visible}
        title="Créer"
        items={creationMenu.items}
        onClose={creationMenu.close}
      />
    </View>
  );
}

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: palette.screen,
    },
    safeArea: {
      flex: 1,
    },
    content: {
      paddingHorizontal: Spacing.screen,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.section,
    },
    section: {
      marginTop: Spacing.section,
    },
    sectionTight: {
      marginTop: Spacing.md,
    },
    scheduleList: {
      gap: 10,
    },
    emptyDay: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingVertical: 18,
    },
    emptyDayText: {
      ...Type.subhead,
      fontWeight: '500',
      color: palette.textTertiary,
    },
  });
}
