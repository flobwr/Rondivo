import { useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Appointment, AppointmentCard } from '@/components/home/appointment-card';
import { Header } from '@/components/home/header';
import { HeroCard } from '@/components/home/hero-card';
import { QuickActions } from '@/components/home/quick-actions';
import { RemindersCard } from '@/components/home/reminders-card';
import { BottomNav, useBottomNavSpace } from '@/components/navigation/bottom-nav';
import { AppSkeleton } from '@/components/ui';
import { FontSize, LetterSpacing, Palette, Radius, Spacing } from '@/constants/design';
import { useFade } from '@/hooks/use-fade';

// ── Mock data — replace with real data source ─────────────────────────────────

const HAS_NEXT_INTERVENTION = true;

const REMAINING_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    time: '13:00',
    client: 'Sophie Bernard',
    type: 'Pose de radiateur',
    address: '8 rue Molière, 69003 Lyon',
    status: 'Confirmé',
  },
  {
    id: '2',
    time: '15:30',
    client: 'Marc Petit',
    type: 'Dépannage urgence',
    address: '42 cours Vitton, 69006 Lyon',
    status: 'Confirmé',
  },
];

// ── Skeleton ──────────────────────────────────────────────────────────────────

// Mirrors the real layout block for block, using the shared AppSkeleton so the
// whole app shimmers with one pulse.
function HomeSkeleton() {
  return (
    <>
      <AppSkeleton height={168} radius="hero" />

      <View style={skStyles.quickRow}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={skStyles.quickItem}>
            <AppSkeleton width={32} height={32} radius="sm" />
            <AppSkeleton width="75%" height={13} radius="sm" />
            <AppSkeleton width="50%" height={13} radius="sm" />
          </View>
        ))}
      </View>

      <AppSkeleton height={64} radius="card" style={skStyles.spaced} />

      <AppSkeleton width="42%" height={18} radius="sm" style={skStyles.sectionTitle} />
      <AppSkeleton height={90} radius="card" />
    </>
  );
}

const skStyles = StyleSheet.create({
  quickRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.section,
  },
  quickItem: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  spaced: {
    marginTop: Spacing.section,
  },
  sectionTitle: {
    marginTop: Spacing.section,
    marginBottom: Spacing.md,
  },
});

// ── Screen ────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const { style: fadeStyle } = useFade(!isLoading);
  const bottomNavSpace = useBottomNavSpace();

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: bottomNavSpace + Spacing.section },
          ]}>
          <Header />

          {isLoading ? (
            <View style={styles.section}>
              <HomeSkeleton />
            </View>
          ) : (
            <Animated.View style={fadeStyle}>
              <View style={styles.section}>
                <HeroCard isEmpty={!HAS_NEXT_INTERVENTION} />
              </View>

              <View style={styles.section}>
                <QuickActions />
              </View>

              <View style={styles.section}>
                <RemindersCard />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Le reste de la journée</Text>

                {REMAINING_APPOINTMENTS.length > 0 ? (
                  <View style={styles.appointmentList}>
                    {REMAINING_APPOINTMENTS.map((apt) => (
                      <AppointmentCard key={apt.id} appointment={apt} />
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

      <BottomNav activeIndex={0} />
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
    paddingTop: Spacing.lg,
  },
  section: {
    marginTop: Spacing.section,
  },
  sectionTitle: {
    fontSize: FontSize.section,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: LetterSpacing.tight,
    marginBottom: Spacing.md,
  },
  appointmentList: {
    gap: Spacing.md,
  },
  emptyDay: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  emptyDayTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Palette.textSecondary,
    letterSpacing: LetterSpacing.cozy,
  },
});
