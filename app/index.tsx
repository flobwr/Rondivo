import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppointmentCard } from '@/components/home/appointment-card';
import { BottomNav } from '@/components/home/bottom-nav';
import { Header } from '@/components/home/header';
import { HeroCard } from '@/components/home/hero-card';
import { QuickActions } from '@/components/home/quick-actions';
import { RemindersCard } from '@/components/home/reminders-card';
import { ActionSheetMenu } from '@/components/documents/shared/ActionSheetMenu';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { useDocumentCreationMenu } from '@/components/documents/shared/useDocumentCreationMenu';
import { Intervention } from '@/components/intervention/types';
import { ScreenFadeInDuration } from '@/constants/animation';
import { FontSize, Radius, Spacing, type PaletteShape } from '@/constants/design';
import { useTheme } from '@/contexts/theme';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { useAsyncItem } from '@/hooks/use-async-item';
import { getAccount } from '@/services/plus/company';
import { HomeSchedule, getHomeSchedule } from '@/services/home-schedule';
import { getIntervention } from '@/services/interventions';
import { getUnreadNotificationCount } from '@/services/notifications';
import { getNextReminderTitle } from '@/services/reminders';

type HomeBundle = {
  schedule: HomeSchedule;
  accountName: string;
  accountRole: string;
  accountInitials: string;
  unreadCount: number;
  nextReminder: string | null;
  nextIntervention?: Intervention;
};

async function fetchHomeBundle(): Promise<HomeBundle> {
  const schedule = await getHomeSchedule();
  const [account, unreadCount, nextReminder, nextIntervention] = await Promise.all([
    getAccount(),
    getUnreadNotificationCount(),
    getNextReminderTitle(),
    schedule.hasNextIntervention ? getIntervention(schedule.nextInterventionId) : Promise.resolve(undefined),
  ]);

  return {
    schedule,
    accountName: account.name,
    accountRole: account.role,
    accountInitials: account.initials,
    unreadCount,
    nextReminder,
    nextIntervention,
  };
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function HomeSkeleton() {
  return (
    <>
      <View style={skStyles.headerRow}>
        <SkeletonBlock height={48} radius={24} style={{ width: 48 }} />
        <View style={{ flex: 1, gap: 6 }}>
          <SkeletonBlock height={16} radius={6} style={{ width: '55%' }} />
          <SkeletonBlock height={13} radius={6} style={{ width: '35%' }} />
        </View>
      </View>

      <SkeletonBlock height={168} radius={28} style={{ marginTop: Spacing.section }} />

      <View style={skStyles.quickRow}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={skStyles.quickItem}>
            <SkeletonBlock height={32} radius={11} style={{ width: 32 }} />
            <SkeletonBlock height={13} radius={6} style={{ width: '75%' }} />
            <SkeletonBlock height={13} radius={6} style={{ width: '50%' }} />
          </View>
        ))}
      </View>

      <SkeletonBlock height={64} radius={24} style={{ marginTop: Spacing.section }} />

      <SkeletonBlock
        height={18}
        radius={8}
        style={{ marginTop: Spacing.section, marginBottom: 12, width: '42%' }}
      />
      <SkeletonBlock height={90} radius={24} />
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
    gap: 10,
    marginTop: Spacing.section,
  },
  quickItem: {
    flex: 1,
    alignItems: 'center',
    gap: 7,
  },
});

// ── Screen ────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
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
            <View style={styles.section}>
              <HomeSkeleton />
            </View>
          ) : (
            <Animated.View style={{ opacity: fadeIn }}>
              <Header
                name={home.accountName}
                role={home.accountRole}
                initials={home.accountInitials}
                unreadNotificationCount={home.unreadCount}
                interventionsTodayCount={home.schedule.interventionsTodayCount}
                palette={palette}
              />

              <View style={styles.section}>
                <HeroCard isEmpty={!home.schedule.hasNextIntervention} intervention={home.nextIntervention} />
              </View>

              <View style={styles.section}>
                <QuickActions onNewDocument={creationMenu.open} palette={palette} />
              </View>

              <View style={styles.section}>
                <RemindersCard nextReminder={home.nextReminder} palette={palette} />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Le reste de la journée</Text>

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
    section: {
      marginTop: Spacing.section,
    },
    sectionTitle: {
      fontSize: FontSize.section,
      fontWeight: '700',
      color: Palette.textPrimary,
      letterSpacing: -0.4,
      marginBottom: 12,
    },
    appointmentList: {
      gap: 10,
    },
    emptyDay: {
      backgroundColor: Palette.card,
      borderRadius: Radius.card,
      paddingVertical: 22,
      paddingHorizontal: 18,
      alignItems: 'center',
    },
    emptyDayTitle: {
      fontSize: 15,
      fontWeight: '500',
      color: Palette.textSecondary,
      letterSpacing: -0.2,
    },
  });
}
