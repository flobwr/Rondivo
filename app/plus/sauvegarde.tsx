import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { KeyValueRow, PressableScale, SectionCard } from '@/components/documents/shared/primitives';
import { SwitchRow } from '@/components/plus/resource/SwitchRow';
import { cardShadow, FontSize, Palette, Radius, Spacing } from '@/theme';
import { COMPANY, updateCompany } from '@/data/plus/company';
import { SETTINGS, updateSettings } from '@/data/plus/settings';

export default function SauvegardeScreen() {
  const router = useRouter();
  const [autoBackup, setAutoBackup] = useState(SETTINGS.autoBackupEnabled);
  const [lastSync, setLastSync] = useState(COMPANY.lastSyncLabel);
  const [saving, setSaving] = useState(false);

  const handleBackupNow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSaving(true);
    setTimeout(() => {
      const label = 'À l’instant';
      updateCompany({ lastSyncLabel: label, synced: true });
      setLastSync(label);
      setSaving(false);
    }, 700);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Sauvegarde" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <SectionCard icon="cloud" title="État">
            <KeyValueRow label="Dernière sauvegarde" value={lastSync} />
            <KeyValueRow label="Statut" value={COMPANY.synced ? 'Synchronisé' : 'Non synchronisé'} />
          </SectionCard>

          <SectionCard style={styles.toggleCard}>
            <SwitchRow
              label="Sauvegarde automatique"
              description="Vos données sont sauvegardées en continu"
              value={autoBackup}
              onValueChange={(v) => { setAutoBackup(v); updateSettings({ autoBackupEnabled: v }); }}
            />
          </SectionCard>

          <PressableScale onPress={handleBackupNow} to={0.97} style={styles.backupButton} disabled={saving} accessibilityLabel="Sauvegarder maintenant">
            <Feather name={saving ? 'loader' : 'upload-cloud'} size={16} color={Palette.blue} />
            <Text style={styles.backupButtonText}>{saving ? 'Sauvegarde en cours…' : 'Sauvegarder maintenant'}</Text>
          </PressableScale>
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
  toggleCard: {
    marginTop: Spacing.section,
  },
  backupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 14,
    marginTop: Spacing.section,
    ...cardShadow,
  },
  backupButtonText: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: -0.1,
  },
});
