import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { PressableScale } from '@/components/documents/shared/primitives';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { cardShadow, FontSize, Palette, Radius, Spacing } from '@/theme';
import { useAsyncList } from '@/hooks/use-async-list';
import {
  bucketOf,
  clearReadNotifications,
  listNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  NotificationBucket,
  NotificationItem,
  removeNotification,
} from '@/services/notifications';
import { NotificationRow } from '@/components/notifications/NotificationRow';

const SECTION_META: Record<NotificationBucket, string> = {
  today: "Aujourd'hui",
  week: 'Cette semaine',
  older: 'Plus anciennes',
};

const SECTION_ORDER: NotificationBucket[] = ['today', 'week', 'older'];

export default function NotificationsScreen() {
  const router = useRouter();
  const fetchNotifications = useCallback(() => listNotifications(), []);
  const { data: items, status, refresh, setData: setItems } = useAsyncList<NotificationItem>(fetchNotifications);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);
  const readCount = useMemo(() => items.filter((n) => n.read).length, [items]);

  const sections = useMemo(() => {
    return SECTION_ORDER.map((bucket) => ({
      bucket,
      label: SECTION_META[bucket],
      data: items.filter((n) => bucketOf(n) === bucket),
    })).filter((section) => section.data.length > 0);
  }, [items]);

  const handleMarkRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    markNotificationAsRead(id);
  };

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    markAllNotificationsAsRead();
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    removeNotification(id);
  };

  const handleClearRead = () => {
    setItems((prev) => prev.filter((n) => !n.read));
    clearReadNotifications();
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Notifications" onBack={() => router.back()} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {status === 'loading' ? (
            <View style={{ gap: Spacing.lg }}>
              <SkeletonBlock height={72} radius={24} />
              <SkeletonBlock height={72} radius={24} />
            </View>
          ) : status === 'error' ? (
            <EmptyState icon="alert-circle" title="Impossible de charger" subtitle="Une erreur est survenue." actionLabel="Réessayer" onAction={refresh} />
          ) : items.length > 0 ? (
            <>
              <View style={styles.toolbar}>
                <Text style={styles.toolbarText}>
                  {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est lu'}
                </Text>
                {unreadCount > 0 ? (
                  <PressableScale onPress={handleMarkAllRead} to={0.96} accessibilityLabel="Tout marquer comme lu">
                    <Text style={styles.toolbarAction}>Tout marquer comme lu</Text>
                  </PressableScale>
                ) : null}
              </View>

              {sections.map((section) => (
                <View key={section.bucket} style={styles.section}>
                  <Text style={styles.sectionTitle}>{section.label}</Text>
                  <View style={styles.card}>
                    {section.data.map((notification, index) => (
                      <View key={notification.id}>
                        {index > 0 ? <View style={styles.separator} /> : null}
                        <NotificationRow
                          notification={notification}
                          onPress={() => handleMarkRead(notification.id)}
                          onDelete={() => handleDelete(notification.id)}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              ))}

              {readCount > 0 ? (
                <PressableScale onPress={handleClearRead} to={0.98} style={styles.clearButton} accessibilityLabel="Vider les notifications lues">
                  <Feather name="trash-2" size={15} color={Palette.textSecondary} />
                  <Text style={styles.clearButtonText}>Vider les notifications lues</Text>
                </PressableScale>
              ) : null}
            </>
          ) : (
            <EmptyState
              icon="bell"
              title="Aucune notification"
              subtitle="Vous êtes à jour. Vos prochaines notifications apparaîtront ici."
            />
          )}
        </ScrollView>
      </SafeAreaView>
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
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  toolbarText: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  toolbarAction: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.blue,
  },
  section: {
    marginBottom: Spacing.section - 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Palette.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 10,
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
  clearButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 12,
    marginTop: 4,
    ...cardShadow,
  },
  clearButtonText: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
});
