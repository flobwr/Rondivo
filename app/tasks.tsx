import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { PressableScale } from '@/components/documents/shared/primitives';
import { SearchBar } from '@/components/documents/shared/SearchBar';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { PRIORITY_CONFIG } from '@/components/intervention/priority';
import { cardShadow, FontSize, Palette, Radius, Spacing } from '@/theme';
import { useAsyncList } from '@/hooks/use-async-list';
import { formatTaskDue, listTasks, Task, toggleTaskCompleted } from '@/services/tasks';

function TaskRow({ task, onToggle, onPress }: { task: Task; onToggle: () => void; onPress: () => void }) {
  const priority = PRIORITY_CONFIG[task.priority];
  const due = formatTaskDue(task.dueDate);

  return (
    <PressableScale onPress={onPress} to={0.985} style={styles.row} accessibilityLabel={task.title}>
      <PressableScale
        onPress={onToggle}
        to={0.85}
        style={styles.toggle}
        hitSlop={{ top: 13, bottom: 13, left: 13, right: 13 }}
        accessibilityLabel={task.completed ? 'Marquer non terminée' : 'Marquer terminée'}>
        <Feather
          name={task.completed ? 'check-circle' : 'circle'}
          size={22}
          color={task.completed ? Palette.green : Palette.textTertiary}
        />
      </PressableScale>

      <View style={styles.info}>
        <Text style={[styles.title, task.completed && styles.titleDone]} numberOfLines={1} ellipsizeMode="tail">
          {task.title}
        </Text>
        {task.notes ? (
          <Text style={styles.notes} numberOfLines={1} ellipsizeMode="tail">
            {task.notes}
          </Text>
        ) : null}
        <View style={styles.badgeRow}>
          {!task.completed ? (
            <View style={[styles.pill, { backgroundColor: priority.background }]}>
              <Text style={[styles.pillText, { color: priority.color }]}>{priority.shortLabel}</Text>
            </View>
          ) : null}
          {due && !task.completed ? (
            <View style={[styles.pill, { backgroundColor: due.overdue ? Palette.redSoft : Palette.cardMuted }]}>
              <Text style={[styles.pillText, { color: due.overdue ? Palette.red : Palette.textSecondary }]}>{due.label}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </PressableScale>
  );
}

export default function TasksScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const fetchTasks = useCallback(() => listTasks(), []);
  const { data: tasks, status, refresh, setData: setTasks } = useAsyncList<Task>(fetchTasks);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => t.title.toLowerCase().includes(q) || t.notes?.toLowerCase().includes(q));
  }, [tasks, search]);

  const pending = useMemo(
    () => filtered.filter((t) => !t.completed).sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999')),
    [filtered]
  );
  const completed = useMemo(() => filtered.filter((t) => t.completed), [filtered]);

  const handleToggle = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    toggleTaskCompleted(id);
  };

  const editTask = (id: string) => router.push({ pathname: '/task/new', params: { editId: id } });

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Tâches" onBack={() => router.back()} onAdd={() => router.push('/task/new')} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Rechercher une tâche…" />

          {status === 'loading' ? (
            <View style={{ gap: Spacing.lg }}>
              <SkeletonBlock height={90} radius={24} />
              <SkeletonBlock height={90} radius={24} />
            </View>
          ) : status === 'error' ? (
            <EmptyState icon="alert-circle" title="Impossible de charger" subtitle="Une erreur est survenue." actionLabel="Réessayer" onAction={refresh} />
          ) : pending.length === 0 && completed.length === 0 ? (
            <EmptyState
              icon="check-square"
              title={search ? 'Aucun résultat' : 'Aucune tâche'}
              subtitle={search ? 'Aucune tâche ne correspond à votre recherche.' : 'Vos tâches à faire apparaîtront ici.'}
              actionLabel={search ? undefined : 'Créer une tâche'}
              onAction={search ? undefined : () => router.push('/task/new')}
            />
          ) : (
            <>
              {pending.length > 0 ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>À faire</Text>
                  <View style={styles.card}>
                    {pending.map((task, index) => (
                      <View key={task.id}>
                        {index > 0 ? <View style={styles.separator} /> : null}
                        <TaskRow task={task} onToggle={() => handleToggle(task.id)} onPress={() => editTask(task.id)} />
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {completed.length > 0 ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Terminées</Text>
                  <View style={styles.card}>
                    {completed.map((task, index) => (
                      <View key={task.id}>
                        {index > 0 ? <View style={styles.separator} /> : null}
                        <TaskRow task={task} onToggle={() => handleToggle(task.id)} onPress={() => editTask(task.id)} />
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={-1} />
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
    paddingBottom: Spacing.section,
    gap: Spacing.lg,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Palette.textTertiary,
    textTransform: 'uppercase',
    marginLeft: 3,
  },
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    ...cardShadow,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.separator,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 13,
    gap: Spacing.md,
  },
  toggle: {
    paddingTop: 1,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  titleDone: {
    fontWeight: '500',
    color: Palette.textTertiary,
    textDecorationLine: 'line-through',
  },
  notes: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textSecondary,
    marginTop: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 7,
  },
  pill: {
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: -0.05,
  },
});
