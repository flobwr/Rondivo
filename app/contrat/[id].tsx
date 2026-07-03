import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { DocumentHero } from '@/components/documents/shared/DocumentHero';
import { IconTile, SectionCard } from '@/components/documents/shared/primitives';
import { QuickActionsRow, type QuickAction } from '@/components/documents/shared/QuickActionsRow';
import { FontSize, Palette, Spacing } from '@/constants/design';
import { formatLongDate } from '@/data/documents/date-utils';
import { CONTRAT_STATUS_META, MOCK_CONTRATS } from '@/data/documents/contrats';

export default function ContratDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const source = useMemo(() => MOCK_CONTRATS.find((c) => c.id === id), [id]);

  const [status, setStatus] = useState(source?.status);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!source || !status) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Contrat" onBack={() => router.back()} />
          <Text style={styles.notFound}>Contrat introuvable.</Text>
        </SafeAreaView>
      </View>
    );
  }

  const contrat = { ...source, status };
  const meta = CONTRAT_STATUS_META[status];
  const soon = (feature: string) => Alert.alert(feature, 'Cette action sera bientôt disponible.', [{ text: 'OK' }]);

  const handleSign = () => {
    Alert.alert('Signature électronique', `Confirmer la signature de ${contrat.clientName} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Confirmer', onPress: () => setStatus('signe') },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Supprimer le contrat', `Supprimer définitivement ${contrat.number} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  const quickActions: QuickAction[] = [
    status !== 'signe'
      ? { key: 'sign', icon: 'edit-3', label: 'Signer', onPress: handleSign }
      : { key: 'signed', icon: 'check-circle', label: 'Signé', onPress: () => {} },
    {
      key: 'pdf',
      icon: 'file-text',
      label: 'PDF',
      onPress: () => Share.share({ message: `Contrat ${contrat.number} — ${contrat.title} — ${contrat.clientName}` }),
    },
    { key: 'send', icon: 'send', label: 'Envoyer', onPress: () => soon('Envoyer le contrat') },
  ];

  const menuItems: ActionSheetItem[] = [
    { key: 'edit', icon: 'edit-2', label: 'Modifier', onPress: () => soon('Modifier le contrat') },
    { key: 'delete', icon: 'trash-2', label: 'Supprimer', onPress: handleDelete, destructive: true },
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={contrat.number} onBack={() => router.back()} onMenu={() => setMenuOpen(true)} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <DocumentHero
            clientName={contrat.clientName}
            onOpenClient={() => router.push(`/client/${contrat.clientId}`)}
            title={contrat.title}
            statusLabel={meta.label}
            statusColor={meta.color}
            statusSoft={meta.soft}
            dates={[
              { label: 'Début', value: formatLongDate(contrat.startDate) },
              ...(contrat.endDate ? [{ label: 'Fin', value: formatLongDate(contrat.endDate) }] : []),
            ]}
          />

          <View style={styles.actionsWrap}>
            <QuickActionsRow actions={quickActions} />
          </View>

          <SectionCard icon="edit-3" title="Signature">
            {status === 'signe' ? (
              <View style={styles.signedRow}>
                <IconTile icon="check" color={Palette.green} soft={Palette.greenSoft} size={32} iconSize={14} />
                <Text style={styles.signedText}>Signé par {contrat.clientName}</Text>
              </View>
            ) : (
              <Text style={styles.pending}>En attente de la signature du client.</Text>
            )}
          </SectionCard>
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={3} />

      <ActionSheetMenu visible={menuOpen} title={contrat.number} items={menuItems} onClose={() => setMenuOpen(false)} />
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
  actionsWrap: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.section,
  },
  signedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  signedText: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  pending: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
  notFound: {
    textAlign: 'center',
    marginTop: 40,
    color: Palette.textSecondary,
    fontSize: 15,
  },
});
