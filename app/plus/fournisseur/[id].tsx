import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomDock, useBottomDockClearance } from '@/components/ui/BottomDock';
import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { IconTile, KeyValueRow, SectionCard } from '@/components/documents/shared/primitives';
import { QuickActionsRow, type QuickAction } from '@/components/documents/shared/QuickActionsRow';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { createThemedStyles, FontSize, Palette, Spacing } from '@/theme';
import { useAsyncItem } from '@/hooks/use-async-item';
import { deleteSupplier, getSupplier, SUPPLIER_CATEGORY_LABEL } from '@/services/plus/suppliers';

export default function FournisseurDetailScreen() {
  const router = useRouter();
  const dockClearance = useBottomDockClearance();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchSupplier = useCallback(() => getSupplier(id), [id]);
  const { data: supplier, status, refresh } = useAsyncItem(fetchSupplier);

  if (status === 'loading') {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Fournisseur" onBack={() => router.back()} />
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
          <DetailHeader title="Fournisseur" onBack={() => router.back()} />
          <EmptyState icon="alert-circle" title="Impossible de charger" subtitle="Une erreur est survenue." actionLabel="Réessayer" onAction={refresh} />
        </SafeAreaView>
      </View>
    );
  }

  if (!supplier) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Fournisseur" onBack={() => router.back()} />
          <Text style={styles.notFound}>Fournisseur introuvable.</Text>
        </SafeAreaView>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Supprimer ce fournisseur', `Supprimer définitivement ${supplier.name} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => { await deleteSupplier(supplier.id); router.back(); } },
    ]);
  };

  const menuItems: ActionSheetItem[] = [
    { key: 'edit', icon: 'edit-2', label: 'Modifier', onPress: () => router.push(`/plus/fournisseur/new?editId=${supplier.id}` as never) },
    { key: 'delete', icon: 'trash-2', label: 'Supprimer', onPress: handleDelete, destructive: true },
  ];

  const quickActions: QuickAction[] = [
    { key: 'call', icon: 'phone', label: 'Appeler', onPress: () => Linking.openURL(`tel:${supplier.phone.replace(/\s+/g, '')}`) },
    { key: 'email', icon: 'mail', label: 'Email', onPress: () => Linking.openURL(`mailto:${supplier.email}`) },
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={supplier.name} onBack={() => router.back()} onMenu={() => setMenuOpen(true)} />

        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: dockClearance }]} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <IconTile icon="package" color={Palette.blue} soft={Palette.blueSoft} size={64} iconSize={28} radius={20} />
            <Text style={styles.name}>{supplier.name}</Text>
            <Text style={styles.category}>{SUPPLIER_CATEGORY_LABEL[supplier.category]}</Text>
          </View>

          <View style={styles.actionsWrap}>
            <QuickActionsRow actions={quickActions} />
          </View>

          <SectionCard icon="info" title="Informations">
            <KeyValueRow label="Téléphone" value={supplier.phone} />
            <KeyValueRow label="Email" value={supplier.email} />
            <KeyValueRow label="Adresse" value={supplier.address} />
          </SectionCard>
        </ScrollView>
      </SafeAreaView>

      <BottomDock activeIndex={4} />

      <ActionSheetMenu visible={menuOpen} title={supplier.name} items={menuItems} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.screen,
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
  actionsWrap: {
    marginBottom: Spacing.section,
  },
  notFound: {
    textAlign: 'center',
    marginTop: 40,
    color: Palette.textSecondary,
    fontSize: 15,
  },
}));
