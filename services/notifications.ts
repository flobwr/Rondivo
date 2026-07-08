import * as NotificationsData from '@/data/notifications';

export type { NotificationBucket, NotificationItem } from '@/data/notifications';
export { bucketOf } from '@/data/notifications';

export async function listNotifications(): Promise<NotificationsData.NotificationItem[]> {
  return [...NotificationsData.NOTIFICATIONS];
}

export async function getUnreadNotificationCount(): Promise<number> {
  return NotificationsData.NOTIFICATIONS.filter((n) => !n.read).length;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  NotificationsData.markAsRead(id);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  NotificationsData.markAllAsRead();
}

export async function removeNotification(id: string): Promise<void> {
  NotificationsData.removeNotification(id);
}

export async function clearReadNotifications(): Promise<void> {
  NotificationsData.clearRead();
}
