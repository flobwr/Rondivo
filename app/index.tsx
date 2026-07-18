import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionSheetMenu } from '@/components/documents/shared/ActionSheetMenu';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { useDocumentCreationMenu } from '@/components/documents/shared/useDocumentCreationMenu';
import { BusinessPulse } from '@/components/home/BusinessPulse';
import { HomeHeader } from '@/components/home/HomeHeader';
import { NextInterventionCard } from '@/components/home/NextInterventionCard';
import { QuickActionsRow } from '@/components/home/QuickActionsRow';
import { RemindersCard } from '@/components/home/RemindersCard';
import { ScheduleCard } from '@/components/home/ScheduleCard';
import { SectionTitle } from '@/components/home/SectionTitle';
import { Intervention } from '@/components/intervention/types';
import { BottomDock } from '@/components/ui/BottomDock';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { useTheme } from '@/contexts/theme';
import { useAsyncItem } from '@/hooks/use-async-item';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { devisSummary, type DevisSummary } from '@/services/documents/devis';
import { factureSummary, type FactureSummary } from '@/services/documents/factures';
import { HomeSchedule, getHomeSchedule } from '@/services/home-schedule';
import { getIntervention } from '@/services/interventions';
import { getUnreadNotificationCount } from '@/services/notifications';
import { getAccount } from '@/services/plus/company';
import { getReminderSummary, type ReminderSummary } from '@/services/reminders';
import { Motion, Spacing, Type, type PaletteShape } from '@/theme';

type HomeBundle = {
  schedule: HomeSchedule;
  accountName: string;
  accountInitials: string;
  unreadCount: number;
  reminders: ReminderSummary;
  nextIntervention?: Intervention;
  factures: FactureSummary;
  devis: DevisSummary;
};

async function fetchHomeBundle(): Promise<HomeBundle> {
  const schedule = await getHomeSchedule();
  const [account, unreadCount, reminders, nextIntervention, factures, devis] = await Promise.all([
    getAccount(),
    getUnreadNotificationCount(),
    getReminderSummary(),
    schedule.hasNextIntervention ? getIntervention(schedule.nextInterventionId) : Promise.resolve(undefined),
    factureSummary(),
    devisSummary(),
  ]);

  return {
    schedule,
    accountName: account.name,
    accountInitials: account.initials,
    unreadCount,
    reminders,
    nextIntervention,
    factures,
    devis,
  };
}

/** "5 interventions aujourd'hui · 2 rappels" — the header's one-line day summary. */
function daySummary(interventionCount: number, reminderCount: number): string {
  const parts = [
    interventionCount > 0
      ? `${interventionCount} intervention${interventionCount > 1 ? 's' : ''} aujourd’hui`
      : 'Aucune intervention aujourd’hui',
  ];
  if (reminderCount > 0) parts.push(`${reminderCount} rappel${reminderCount > 1 ? 's' : ''}`);
  return parts.join('  ·  ');
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

      <View style={skStyles.pulseRow}>
        <SkeletonBlock height={86} radius={20} style={{ flex: 1 }} />
        <SkeletonBlock height={86} radius={20} style={{ flex: 1 }} />
      </View>
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
  pulseRow: {
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

  const fetchHome = useCallback(() => fetchHomeBundle(), []);
  const { data: home, status, refresh } = useAsyncItem(fetchHome);
  const isLoading = status === 'loading';
  const isError = status === 'error';

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
                  summary={daySummary(home.schedule.interventionsTodayCount, home.reminders.count)}
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

              <Animated.View entering={enter(4)} style={styles.section}>
                <SectionTitle
                  title="Le reste de la journée"
                  meta="Planning"
                  onMetaPress={() => router.push('/planning')}
                />

                {home.schedule.remainingAppointments.length > 0 ? (
                  <View style={styles.scheduleList}>
                    {home.schedule.remainingAppointments.map((apt) => (
                      <ScheduleCard key={apt.id} appointment={apt} />
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyDay}>
                    <Feather name="check-circle" size={15} color={palette.textTertiary} />
                    <Text style={styles.emptyDayText}>C’est tout pour aujourd’hui</Text>
                  </View>
                )}
              </Animated.View>

              <Animated.View entering={enter(5)} style={styles.section}>
                <SectionTitle
                  title="Activité"
                  meta="Documents"
                  onMetaPress={() => router.push('/documents')}
                />
                <BusinessPulse factures={home.factures} devis={home.devis} />
              </Animated.View>
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
