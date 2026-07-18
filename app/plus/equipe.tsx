import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TINT_COLORS } from '@/components/clients/types';
import { BottomDock } from '@/components/ui/BottomDock';
import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { FadeInItem } from '@/components/documents/shared/primitives';
import { EntityCard } from '@/components/plus/resource/EntityCard';
import { createThemedStyles, Palette, Spacing } from '@/theme';
import {
  EMPLOYEE_ROLE_META,
  EMPLOYEE_ROLE_ORDER,
  EMPLOYEES,
  Employee,
  EmployeeRole,
  updateEmployee,
} from '@/data/plus/employees';

const ROLE_TONE: Record<EmployeeRole, { color: string; soft: string; icon: 'shield' | 'briefcase' | 'tool' }> = {
  administrateur: { color: Palette.purple, soft: Palette.purpleSoft, icon: 'shield' },
  manager: { color: Palette.blue, soft: Palette.blueSoft, icon: 'briefcase' },
  technicien: { color: Palette.green, soft: Palette.greenSoft, icon: 'tool' },
};

export default function EquipeScreen() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>(() => [...EMPLOYEES]);
  const [target, setTarget] = useState<Employee | null>(null);

  const handleChangeRole = (role: EmployeeRole) => {
    if (!target) return;
    updateEmployee(target.id, { role });
    setEmployees([...EMPLOYEES]);
    setTarget(null);
  };

  const roleItems: ActionSheetItem[] = EMPLOYEE_ROLE_ORDER.map((role) => ({
    key: role,
    icon: ROLE_TONE[role].icon,
    label: EMPLOYEE_ROLE_META[role].label,
    onPress: () => handleChangeRole(role),
  }));

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Équipe" onBack={() => router.back()} />
        <Text style={styles.subtitle}>Gérez les rôles et les accès de votre équipe.</Text>

        <FlatList
          data={employees}
          keyExtractor={(e) => e.id}
          renderItem={({ item, index }) => {
            const tone = ROLE_TONE[item.role];
            return (
              <FadeInItem index={index}>
                <EntityCard
                  icon="user"
                  avatarInitials={item.initials}
                  avatarColor={TINT_COLORS[item.tint].color}
                  title={item.name}
                  subtitle={item.poste}
                  statusLabel={EMPLOYEE_ROLE_META[item.role].label}
                  statusColor={tone.color}
                  statusSoft={tone.soft}
                  onPress={() => setTarget(item)}
                />
              </FadeInItem>
            );
          }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <EmptyState icon="users" title="Aucun membre" subtitle="Ajoutez des employés pour composer votre équipe." />
          }
        />
      </SafeAreaView>

      <BottomDock activeIndex={4} />

      <ActionSheetMenu
        visible={!!target}
        title={target ? `Rôle de ${target.name}` : undefined}
        items={roleItems}
        onClose={() => setTarget(null)}
      />
    </View>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
    paddingHorizontal: Spacing.screen,
    marginTop: -6,
    marginBottom: Spacing.md,
  },
  list: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
    flexGrow: 1,
  },
  separator: {
    height: 8,
  },
}));
