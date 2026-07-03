import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { DocumentHero } from '@/components/documents/shared/DocumentHero';
import { HistoryCard } from '@/components/documents/shared/HistoryCard';
import { KeyValueRow, PressableScale, SectionCard } from '@/components/documents/shared/primitives';
import { QuickActionsRow, type QuickAction } from '@/components/documents/shared/QuickActionsRow';
import { Palette, Spacing } from '@/constants/design';
import { formatAmount, formatLongDate } from '@/data/documents/date-utils';
import { DEVIS_STATUS_META, MOCK_DEVIS } from '@/data/documents/devis';

export default function DevisDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const source = useMemo(() => MOCK_DEVIS.find((d) => d.id === id), [id]);

  const [status, setStatus] = useState(source?.status);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!source || !status) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Devis" onBack={() => router.back()} />
          <Text style={styles.notFound}>Devis introuvable.</Text>
        </SafeAreaView>
      </View>
    );
  }

  const devis = { ...source, status };
  const meta = DEVIS_STATUS_META[status];
  const soon = (feature: string) => Alert.alert(feature, 'Cette action sera bientôt disponible.', [{ text: 'OK' }]);

  const handleSign = () => {
    Alert.alert('Marquer comme accepté', `Confirmer la signature de ${devis.clientName} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Confirmer', onPress: () => setStatus('accepte') },
    ]);
  };

  const handleConvert = () => {
    Alert.alert('Convertir en facture', `Créer une facture de ${formatAmount(devis.amount)} pour ${devis.clientName} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Convertir', onPress: () => router.push('/facture/new') },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Supprimer le devis', `Supprimer définitivement ${devis.number} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  const canSign = status === 'envoye' || status === 'vu';
  const canConvert = status === 'accepte';

  const quickActions: QuickAction[] = [
    { key: 'send', icon: 'send', label: 'Envoyer', onPress: () => soon('Envoyer le devis') },
    {
      key: 'share',
      icon: 'share',
      label: 'Partager',
      onPress: () => Share.share({ message: `Devis ${devis.number} — ${devis.clientName} — ${formatAmount(devis.amount)}` }),
    },
    canSign
      ? { key: 'sign', icon: 'edit-3', label: 'Signer', onPress: handleSign }
      : canConvert
        ? { key: 'convert', icon: 'file-text', label: 'Convertir', onPress: handleConvert }
        : { key: 'reminder', icon: 'bell', label: 'Rappel', onPress: () => router.push('/rappels') },
  ];
  if (canSign) {
    quickActions.push({ key: 'reminder', icon: 'bell', label: 'Rappel', onPress: () => router.push('/rappels') });
  }

  const menuItems: ActionSheetItem[] = [
    { key: 'edit', icon: 'edit-2', label: 'Modifier', onPress: () => router.push('/devis/new') },
    { key: 'duplicate', icon: 'copy', label: 'Dupliquer', onPress: () => soon('Dupliquer le devis') },
    { key: 'delete', icon: 'trash-2', label: 'Supprimer', onPress: handleDelete, destructive: true },
  ];

  const history = [
    { id: 'h-1', icon: 'file-plus' as const, label: 'Devis créé', date: formatLongDate(devis.issuedAt) },
    ...(status !== 'brouillon'
      ? [{ id: 'h-2', icon: 'send' as const, label: 'Envoyé au client', date: formatLongDate(devis.issuedAt) }]
      : []),
    ...(status === 'accepte' ? [{ id: 'h-3', icon: 'check' as const, label: 'Accepté par le client', date: formatLongDate(devis.validUntil) }] : []),
    ...(status === 'refuse' ? [{ id: 'h-4', icon: 'x' as const, label: 'Refusé par le client', date: formatLongDate(devis.validUntil) }] : []),
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={devis.number} onBack={() => router.back()} onMenu={() => setMenuOpen(true)} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <DocumentHero
            clientName={devis.clientName}
            onOpenClient={() => router.push(`/client/${devis.clientId}`)}
            amount={formatAmount(devis.amount)}
            statusLabel={meta.label}
            statusColor={meta.color}
            statusSoft={meta.soft}
            dates={[
              { label: 'Émis le', value: formatLongDate(devis.issuedAt) },
              { label: 'Valable jusqu’au', value: formatLongDate(devis.validUntil) },
            ]}
          />

          <View style={styles.actionsWrap}>
            <QuickActionsRow actions={quickActions} />
          </View>

          <SectionCard icon="info" title="Informations">
            <KeyValueRow label="Numéro" value={devis.number} />
            <KeyValueRow label="Statut" value={meta.label} valueColor={meta.color} />
            {devis.interventionId ? (
              <PressableScale
                onPress={() => router.push(`/intervention/${devis.interventionId}`)}
                to={0.98}
                accessibilityLabel="Ouvrir l’intervention liée">
                <KeyValueRow label="Intervention liée" value="Voir le détail" valueColor={Palette.blue} />
              </PressableScale>
            ) : null}
          </SectionCard>

          <View style={styles.section}>
            <HistoryCard entries={history} />
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={3} />

      <ActionSheetMenu visible={menuOpen} title={devis.number} items={menuItems} onClose={() => setMenuOpen(false)} />
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
  section: {
    marginTop: Spacing.md,
  },
  notFound: {
    textAlign: 'center',
    marginTop: 40,
    color: Palette.textSecondary,
    fontSize: 15,
  },
});
