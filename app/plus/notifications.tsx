import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { SectionCard } from '@/components/documents/shared/primitives';
import { SwitchRow } from '@/components/plus/resource/SwitchRow';
import { Palette, Spacing } from '@/constants/design';
import { SETTINGS, updateSettings } from '@/data/plus/settings';

export default function NotificationsScreen() {
  const router = useRouter();
  const [reminders, setReminders] = useState(SETTINGS.notifyReminders);
  const [unpaid, setUnpaid] = useState(SETTINGS.notifyUnpaidInvoices);
  const [messages, setMessages] = useState(SETTINGS.notifyNewMessages);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Notifications" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <SectionCard icon="bell" title="Recevoir une notification pour">
            <SwitchRow
              label="Rappels et tâches"
              description="Vos rendez-vous et rappels du jour"
              value={reminders}
              onValueChange={(v) => { setReminders(v); updateSettings({ notifyReminders: v }); }}
            />
            <View style={styles.separator} />
            <SwitchRow
              label="Factures impayées"
              description="Échéances dépassées ou proches"
              value={unpaid}
              onValueChange={(v) => { setUnpaid(v); updateSettings({ notifyUnpaidInvoices: v }); }}
            />
            <View style={styles.separator} />
            <SwitchRow
              label="Nouveaux messages"
              description="Demandes et réponses de vos clients"
              value={messages}
              onValueChange={(v) => { setMessages(v); updateSettings({ notifyNewMessages: v }); }}
            />
          </SectionCard>
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.separator,
  },
});
