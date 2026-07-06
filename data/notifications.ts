import type { Tint } from '@/components/clients/types';
import type { FeatherIconName } from '@/components/documents/types';

/**
 * Mocked notifications feed — a stand-in for a future push/backend-driven
 * notification store. The screen keeps its own local state for instant UI
 * feedback and calls these mutators in parallel to keep this array in sync,
 * the same pattern `data/plus/settings.ts` uses for `updateSettings`.
 */
export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  /** 0 = today, 1-7 = this week, >7 = older. Drives which section it appears in. */
  daysAgo: number;
  read: boolean;
  icon: FeatherIconName;
  tint: Tint;
};

export type NotificationBucket = 'today' | 'week' | 'older';

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Rendez-vous à 10:30',
    description: 'Entretien chaudière — Martin Dupont, 24 Av. Félix Faure.',
    time: '08:00',
    daysAgo: 0,
    read: false,
    icon: 'calendar',
    tint: 'blue',
  },
  {
    id: 'n-2',
    title: 'Devis #1042 accepté',
    description: 'Mme Bernard a accepté votre devis.',
    time: '09:15',
    daysAgo: 0,
    read: false,
    icon: 'check-circle',
    tint: 'green',
  },
  {
    id: 'n-3',
    title: 'Nouveau message',
    description: 'Mme Garnier — demande de devis climatisation.',
    time: '11:40',
    daysAgo: 0,
    read: true,
    icon: 'message-square',
    tint: 'purple',
  },
  {
    id: 'n-4',
    title: 'Facture #2087 en retard',
    description: 'M. Leroy — échéance dépassée de 3 jours.',
    time: 'Hier · 16:20',
    daysAgo: 1,
    read: false,
    icon: 'alert-circle',
    tint: 'red',
  },
  {
    id: 'n-5',
    title: 'Sauvegarde terminée',
    description: 'Vos données ont été sauvegardées avec succès.',
    time: 'Il y a 2 jours',
    daysAgo: 2,
    read: true,
    icon: 'cloud',
    tint: 'blue',
  },
  {
    id: 'n-6',
    title: 'Nouvel avis client',
    description: '5 étoiles laissées par M. Petit.',
    time: 'Il y a 4 jours',
    daysAgo: 4,
    read: true,
    icon: 'star',
    tint: 'orange',
  },
  {
    id: 'n-7',
    title: 'Mise à jour de l’application',
    description: 'Rondivo 1.0.0 — notes de version disponibles.',
    time: 'Il y a 12 jours',
    daysAgo: 12,
    read: true,
    icon: 'download',
    tint: 'blue',
  },
  {
    id: 'n-8',
    title: 'Rappel assurance',
    description: 'Attestation d’assurance à renouveler prochainement.',
    time: 'Il y a 20 jours',
    daysAgo: 20,
    read: true,
    icon: 'shield',
    tint: 'purple',
  },
];

export function bucketOf(notification: NotificationItem): NotificationBucket {
  if (notification.daysAgo <= 0) return 'today';
  if (notification.daysAgo <= 7) return 'week';
  return 'older';
}

export function markAsRead(id: string) {
  const item = NOTIFICATIONS.find((n) => n.id === id);
  if (item) item.read = true;
}

export function markAllAsRead() {
  NOTIFICATIONS.forEach((n) => { n.read = true; });
}

export function removeNotification(id: string) {
  const index = NOTIFICATIONS.findIndex((n) => n.id === id);
  if (index !== -1) NOTIFICATIONS.splice(index, 1);
}

export function clearRead() {
  for (let i = NOTIFICATIONS.length - 1; i >= 0; i -= 1) {
    if (NOTIFICATIONS[i].read) NOTIFICATIONS.splice(i, 1);
  }
}
