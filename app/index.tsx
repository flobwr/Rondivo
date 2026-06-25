import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppointmentCard } from '@/components/home/appointment-card';
import { BottomNav } from '@/components/home/bottom-nav';
import { Header } from '@/components/home/header';
import { HeroCard } from '@/components/home/hero-card';
import { QuickActions } from '@/components/home/quick-actions';
import { RemindersCard } from '@/components/home/reminders-card';
import { FontSize, Palette, Spacing } from '@/constants/design';

export default function HomeScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <Header />

          <View style={styles.section}>
            <HeroCard />
          </View>

          <View style={styles.section}>
            <QuickActions />
          </View>

          <View style={styles.section}>
            <RemindersCard />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prochains rendez-vous</Text>
            <AppointmentCard />
          </View>
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
    marginBottom: Spacing.lg,
  },
});
