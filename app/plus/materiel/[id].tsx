import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomDock } from '@/components/ui/BottomDock';
import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { IconTile, KeyValueRow, SectionCard, StatusPill } from '@/components/documents/shared/primitives';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { createThemedStyles, FontSize, Palette, Spacing } from '@/theme';
import { formatLongDate } from '@/data/documents/date-utils';
import { useAsyncItem } from '@/hooks/use-async-item';
import {
  deleteMateriel,
  getMateriel,
  MATERIEL_CATEGORY_LABEL,
  MATERIEL_CONDITION_META,
} from '@/services/plus/materiel';

const CATEGORY_ICON = {
  'outillage-electroportatif': 'tool',
  mesure: 'activity',
  securite: 'shield',
  levage: 'arrow-up',
  autre: 'box',
} as const;

export default function MaterielDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchItem = useCallback(() => getMateriel(id), [id]);
  const { data: item, status, refresh } = useAsyncItem(fetchItem);

  if (status === 'loading') {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Matériel" onBack={() => router.back()} />
          <View style={styles.content}>
            <SkeletonBlock height={140} radius={24} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Matériel" onBack={() => router.back()} />
          <EmptyState icon="alert-circle" title="Impossible de charger" subtitle="Une erreur est survenue." actionLabel="Réessayer" onAction={refresh} />
        </SafeAreaView>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Matériel" onBack={() => router.back()} />
          <Text style={styles.notFound}>Élément introuvable.</Text>
        </SafeAreaView>
      </View>
    );
  }

  const conditionMeta = MATERIEL_CONDITION_META[item.condition];

  const handleDelete = () => {
    Alert.alert('Supprimer cet élément', `Supprimer définitivement ${item.name} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => { await deleteMateriel(item.id); router.back(); } },
    ]);
  };

  const menuItems: ActionSheetItem[] = [
    { key: 'edit', icon: 'edit-2', label: 'Modifier', onPress: () => router.push(`/plus/materiel/new?editId=${item.id}` as never) },
    { key: 'delete', icon: 'trash-2', label: 'Supprimer', onPress: handleDelete, destructive: true },
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={item.name} onBack={() => router.back()} onMenu={() => setMenuOpen(true)} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <IconTile icon={CATEGORY_ICON[item.category]} color={Palette.blue} soft={Palette.blueSoft} size={64} iconSize={28} radius={20} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>{MATERIEL_CATEGORY_LABEL[item.category]}</Text>
            <View style={styles.statusWrap}>
              <StatusPill label={conditionMeta.label} color={conditionMeta.color} soft={conditionMeta.soft} />
            </View>
          </View>

          <SectionCard icon="info" title="Informations">
            <KeyValueRow label="Emplacement" value={item.location} />
            <KeyValueRow label="Date d’achat" value={item.purchaseDate ? formatLongDate(item.purchaseDate) : 'Non renseignée'} />
            <KeyValueRow label="N° de série" value={item.serialNumber ?? 'Non renseigné'} />
          </SectionCard>
        </ScrollView>
      </SafeAreaView>

      <BottomDock activeIndex={4} />

      <ActionSheetMenu visible={menuOpen} title={item.name} items={menuItems} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  name: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: Spacing.screen,
  },
  category: {
    fontSize: FontSize.label,
    fontWeight: '400',
    color: Palette.textSecondary,
    marginTop: 2,
    letterSpacing: -0.1,
  },
  statusWrap: {
    marginTop: 10,
  },
  notFound: {
    textAlign: 'center',
    marginTop: 40,
    color: Palette.textSecondary,
    fontSize: 15,
  },
}));
