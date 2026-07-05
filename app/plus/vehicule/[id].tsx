import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { IconTile, KeyValueRow, SectionCard, StatusPill } from '@/components/documents/shared/primitives';
import { FontSize, Palette, Spacing } from '@/constants/design';
import { formatLongDate } from '@/data/documents/date-utils';
import { getEmployeeById } from '@/data/plus/employees';
import { deleteVehicle, getVehicleById, VEHICLE_STATUS_META, VEHICLE_TYPE_LABEL } from '@/data/plus/vehicles';

export default function VehiculeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [menuOpen, setMenuOpen] = useState(false);
  const vehicle = getVehicleById(id);

  if (!vehicle) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Véhicule" onBack={() => router.back()} />
          <Text style={styles.notFound}>Véhicule introuvable.</Text>
        </SafeAreaView>
      </View>
    );
  }

  const statusMeta = VEHICLE_STATUS_META[vehicle.status];
  const assignedTo = vehicle.assignedToId ? getEmployeeById(vehicle.assignedToId) : undefined;

  const handleDelete = () => {
    Alert.alert('Supprimer le véhicule', `Supprimer définitivement ${vehicle.name} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => { deleteVehicle(vehicle.id); router.back(); } },
    ]);
  };

  const menuItems: ActionSheetItem[] = [
    { key: 'edit', icon: 'edit-2', label: 'Modifier', onPress: () => router.push(`/plus/vehicule/new?editId=${vehicle.id}` as never) },
    { key: 'delete', icon: 'trash-2', label: 'Supprimer', onPress: handleDelete, destructive: true },
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={vehicle.name} onBack={() => router.back()} onMenu={() => setMenuOpen(true)} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <IconTile icon="truck" color={Palette.blue} soft={Palette.blueSoft} size={64} iconSize={28} radius={20} />
            <Text style={styles.name}>{vehicle.name}</Text>
            <Text style={styles.plate}>{vehicle.plate}</Text>
            <View style={styles.statusWrap}>
              <StatusPill label={statusMeta.label} color={statusMeta.color} soft={statusMeta.soft} />
            </View>
          </View>

          <SectionCard icon="info" title="Informations">
            <KeyValueRow label="Type" value={VEHICLE_TYPE_LABEL[vehicle.type]} />
            <KeyValueRow label="Kilométrage" value={`${vehicle.mileage.toLocaleString('fr-FR')} km`} />
            <KeyValueRow label="Assigné à" value={assignedTo?.name ?? 'Non assigné'} />
            <KeyValueRow
              label="Prochain entretien"
              value={vehicle.nextServiceDate ? formatLongDate(vehicle.nextServiceDate) : 'Non planifié'}
            />
          </SectionCard>
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={4} />

      <ActionSheetMenu visible={menuOpen} title={vehicle.name} items={menuItems} onClose={() => setMenuOpen(false)} />
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
  },
  plate: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textSecondary,
    marginTop: 2,
    letterSpacing: 0.5,
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
});
