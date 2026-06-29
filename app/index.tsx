import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Appointment, AppointmentCard } from '@/components/home/appointment-card';
import { BottomNav } from '@/components/home/bottom-nav';
import { Header } from '@/components/home/header';
import { HeroCard } from '@/components/home/hero-card';
import { QuickActions } from '@/components/home/quick-actions';
import { RemindersCard } from '@/components/home/reminders-card';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';

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

  const bgColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E8ECF2', '#CED4DE'],
  });

  return <Animated.View style={[{ height, borderRadius: radius, backgroundColor: bgColor }, style]} />;
}

function HomeSkeleton() {
  return (
    <>
      <SkeletonBlock height={168} radius={28} />

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
  const [isLoading, setIsLoading] = useState(true);
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading(false);
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }, 1200);
    return () => clearTimeout(t);
  }, [fadeIn]);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <Header />

          {isLoading ? (
            <View style={styles.section}>
              <HomeSkeleton />
            </View>
          ) : (
            <Animated.View style={{ opacity: fadeIn }}>
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
                    <Text style={styles.emptyDayTitle}>C'est tout pour aujourd'hui.</Text>
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
