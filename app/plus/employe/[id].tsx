import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TINT_COLORS } from '@/components/clients/types';
import { BottomDock } from '@/components/ui/BottomDock';
import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { KeyValueRow, SectionCard, StatusPill } from '@/components/documents/shared/primitives';
import { QuickActionsRow, type QuickAction } from '@/components/documents/shared/QuickActionsRow';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { FontSize, Palette, Spacing } from '@/theme';
import { useAsyncItem } from '@/hooks/use-async-item';
import { formatLongDate } from '@/data/documents/date-utils';
import { deleteEmployee, EMPLOYEE_ROLE_META, EMPLOYEE_STATUS_META, getEmployee } from '@/services/plus/employees';

const AVATAR = 64;

export default function EmployeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchEmployee = useCallback(() => getEmployee(id), [id]);
  const { data: employee, status, refresh } = useAsyncItem(fetchEmployee);

  if (status === 'loading') {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Employé" onBack={() => router.back()} />
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
          <DetailHeader title="Employé" onBack={() => router.back()} />
          <EmptyState icon="alert-circle" title="Impossible de charger" subtitle="Une erreur est survenue." actionLabel="Réessayer" onAction={refresh} />
        </SafeAreaView>
      </View>
    );
  }

  if (!employee) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Employé" onBack={() => router.back()} />
          <Text style={styles.notFound}>Employé introuvable.</Text>
        </SafeAreaView>
      </View>
    );
  }

  const tint = TINT_COLORS[employee.tint];
  const roleMeta = EMPLOYEE_ROLE_META[employee.role];
  const statusMeta = EMPLOYEE_STATUS_META[employee.status];

  const handleDelete = () => {
    Alert.alert('Supprimer l’employé', `Supprimer définitivement ${employee.name} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => { await deleteEmployee(employee.id); router.back(); } },
    ]);
  };

  const menuItems: ActionSheetItem[] = [
    { key: 'edit', icon: 'edit-2', label: 'Modifier', onPress: () => router.push(`/plus/employe/new?editId=${employee.id}` as never) },
    { key: 'delete', icon: 'trash-2', label: 'Supprimer', onPress: handleDelete, destructive: true },
  ];

  const quickActions: QuickAction[] = [
    { key: 'call', icon: 'phone', label: 'Appeler', onPress: () => Linking.openURL(`tel:${employee.phone.replace(/\s+/g, '')}`) },
    { key: 'email', icon: 'mail', label: 'Email', onPress: () => Linking.openURL(`mailto:${employee.email}`) },
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={employee.name} onBack={() => router.back()} onMenu={() => setMenuOpen(true)} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={[styles.avatar, { backgroundColor: tint.color }]}>
              <Text style={styles.avatarText}>{employee.initials}</Text>
            </View>
            <Text style={styles.name}>{employee.name}</Text>
            <Text style={styles.poste}>{employee.poste}</Text>
            <View style={styles.statusWrap}>
              <StatusPill label={statusMeta.label} color={statusMeta.color} soft={statusMeta.soft} />
            </View>
          </View>

          <View style={styles.actionsWrap}>
            <QuickActionsRow actions={quickActions} />
          </View>

          <SectionCard icon="shield" title="Informations">
            <KeyValueRow label="Rôle" value={roleMeta.label} />
            <KeyValueRow label="Téléphone" value={employee.phone} />
            <KeyValueRow label="Email" value={employee.email} />
            <KeyValueRow label="Date d’embauche" value={formatLongDate(employee.hireDate)} />
          </SectionCard>
        </ScrollView>
      </SafeAreaView>

      <BottomDock activeIndex={4} />

      <ActionSheetMenu visible={menuOpen} title={employee.name} items={menuItems} onClose={() => setMenuOpen(false)} />
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
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Palette.white,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  name: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
    marginTop: 12,
  },
  poste: {
    fontSize: FontSize.label,
    fontWeight: '400',
    color: Palette.textSecondary,
    marginTop: 2,
    letterSpacing: -0.1,
  },
  statusWrap: {
    marginTop: 10,
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
});
