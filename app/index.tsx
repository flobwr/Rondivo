import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AppointmentCard } from '@/components/home/appointment-card';
import { BottomNav } from '@/components/home/bottom-nav';
import { Header } from '@/components/home/header';
import { HeroCard } from '@/components/home/hero-card';
import { QuickActions } from '@/components/home/quick-actions';
import { RemindersCard } from '@/components/home/reminders-card';
import { SectionHeader } from '@/components/home/section-header';
import { ActionSheetMenu } from '@/components/documents/shared/ActionSheetMenu';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { useDocumentCreationMenu } from '@/components/documents/shared/useDocumentCreationMenu';
import { Intervention } from '@/components/intervention/types';
import { FontSize, Radius, ScreenFadeInDuration, Spacing, type PaletteShape } from '@/theme';
import { useTheme } from '@/contexts/theme';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { useAsyncItem } from '@/hooks/use-async-item';
import { getAccount } from '@/services/plus/company';
import { HomeSchedule, getHomeSchedule } from '@/services/home-schedule';
import { getIntervention } from '@/services/interventions';
import { getUnreadNotificationCount } from '@/services/notifications';
import { getReminderSummary, type ReminderSummary } from '@/services/reminders';

type HomeBundle = {
  schedule: HomeSchedule;
  accountName: string;
  accountRole: string;
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
    accountRole: account.role,
    accountInitials: account.initials,
    unreadCount,
    reminders,
    nextIntervention,
  };
}

/** "ven. 17 juil." — the light inline date next to "Aujourd'hui". Short forms
 *  so the line never truncates next to the interventions counter on 360px. */
function todayLabel(): string {
  return new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function HomeSkeleton() {
  return (
    <>
      <View style={skStyles.headerRow}>
        <SkeletonBlock height={46} radius={23} style={{ width: 46 }} />
        <View style={{ flex: 1, gap: 6 }}>
          <SkeletonBlock height={16} radius={6} style={{ width: '55%' }} />
          <SkeletonBlock height={13} radius={6} style={{ width: '35%' }} />
        </View>
        <SkeletonBlock height={44} radius={22} style={{ width: 44 }} />
      </View>

      <SkeletonBlock height={18} radius={8} style={{ marginTop: Spacing.section, width: '48%' }} />
      <SkeletonBlock height={248} radius={28} style={{ marginTop: 12 }} />

      <View style={skStyles.quickRow}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={skStyles.quickItem}>
            <SkeletonBlock height={54} radius={27} style={{ width: 54 }} />
            <SkeletonBlock height={12} radius={6} style={{ width: 48 }} />
          </View>
        ))}
      </View>

      <SkeletonBlock height={64} radius={24} style={{ marginTop: Spacing.lg }} />

      <SkeletonBlock
        height={18}
        radius={8}
        style={{ marginTop: Spacing.section, marginBottom: 12, width: '42%' }}
      />
      <SkeletonBlock height={92} radius={24} />
      <SkeletonBlock height={92} radius={24} style={{ marginTop: 10 }} />
    </>
  );
}

const skStyles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: Spacing.xl,
  },
  quickItem: {
    alignItems: 'center',
    gap: 6,
  },
});

// ── Screen ────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const fadeIn = useRef(new Animated.Value(0)).current;
  const creationMenu = useDocumentCreationMenu();
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const fetchHome = useCallback(() => fetchHomeBundle(), []);
  const { data: home, status, refresh } = useAsyncItem(fetchHome);
  const isLoading = status === 'loading';
  const isError = status === 'error';

  useEffect(() => {
    if (status === 'success') {
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: ScreenFadeInDuration,
        useNativeDriver: true,
      }).start();
    }
  }, [status, fadeIn]);

  const todayCount = home?.schedule.interventionsTodayCount ?? 0;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
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
            <Animated.View style={{ opacity: fadeIn }}>
              <Header
                name={home.accountName}
                role={home.accountRole}
                initials={home.accountInitials}
                unreadNotificationCount={home.unreadCount}
                palette={palette}
              />

              <View style={styles.sectionMain}>
                <SectionHeader
                  title="Aujourd’hui"
                  subtitle={todayLabel()}
                  meta={
                    todayCount > 0
                      ? `${todayCount} intervention${todayCount > 1 ? 's' : ''}`
                      : undefined
                  }
                  onMetaPress={() => router.push('/planning')}
                  palette={palette}
                />
                <HeroCard
                  isEmpty={!home.schedule.hasNextIntervention}
                  intervention={home.nextIntervention}
                  palette={palette}
                />
              </View>

              <View style={styles.sectionCompact}>
                <QuickActions onNewDocument={creationMenu.open} palette={palette} />
              </View>

              <View style={styles.sectionTight}>
                <RemindersCard
                  nextReminder={home.reminders.nextTitle}
                  count={home.reminders.count}
                  palette={palette}
                />
              </View>

              <View style={styles.sectionMain}>
                <SectionHeader
                  title="Le reste de la journée"
                  meta="Planning"
                  onMetaPress={() => router.push('/planning')}
                  palette={palette}
                />

                {home.schedule.remainingAppointments.length > 0 ? (
                  <View style={styles.appointmentList}>
                    {home.schedule.remainingAppointments.map((apt) => (
                      <AppointmentCard key={apt.id} appointment={apt} palette={palette} />
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyDay}>
                    <Text style={styles.emptyDayTitle}>C&apos;est tout pour aujourd&apos;hui.</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={0} palette={palette} />

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
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.section,
    },
    sectionMain: {
      marginTop: Spacing.section,
    },
    sectionCompact: {
      marginTop: Spacing.xl,
    },
    sectionTight: {
      marginTop: Spacing.lg,
    },
    appointmentList: {
      gap: 10,
    },
    emptyDay: {
      backgroundColor: Palette.card,
      borderRadius: Radius.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Palette.border,
      paddingVertical: 22,
      paddingHorizontal: 18,
      alignItems: 'center',
    },
    emptyDayTitle: {
      fontSize: FontSize.cardLabel,
      fontWeight: '500',
      color: Palette.textSecondary,
      letterSpacing: -0.2,
    },
  });
}
