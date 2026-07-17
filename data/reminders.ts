import type { Tint } from '@/components/clients/types';

export type ReminderIconFamily = 'Feather' | 'Ionicons' | 'MaterialCommunityIcons';

export type ReminderItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: { family: ReminderIconFamily; name: string };
  tint: Tint;
  /** Expo Router path this reminder opens when tapped. */
  route: string;
};

export type ReminderSection = {
  title: string;
  items: ReminderItem[];
};

export const REMINDER_SECTIONS: ReminderSection[] = [
  {
    title: 'Tâches & rappels',
    items: [
      {
        id: 'r-1',
        title: 'Appeler M. Dupont à 14:00',
        subtitle: 'Confirmer le rendez-vous',
        icon: { family: 'Ionicons', name: 'notifications' },
        tint: 'purple',
        route: '/clients',
      },
      {
        id: 'r-2',
        title: 'Commander la pièce pour demain',
        subtitle: 'Chaudière — M. Dupont',
        icon: { family: 'Feather', name: 'package' },
        tint: 'purple',
        route: '/tasks',
      },
    ],
  },
  {
    title: 'Devis à traiter',
    items: [
      {
        id: 'r-3',
        title: 'Devis #1042 — Mme Bernard',
        subtitle: 'En attente depuis 2 jours',
        icon: { family: 'Feather', name: 'file-text' },
        tint: 'blue',
        route: '/devis',
      },
    ],
  },
  {
    title: 'Factures à envoyer',
    items: [
      {
        id: 'r-4',
        title: 'Facture #2087 — M. Leroy',
        subtitle: 'Intervention du 22 juin',
        icon: { family: 'Feather', name: 'file-text' },
        tint: 'orange',
        route: '/factures',
      },
    ],
  },
  {
    title: 'Paiements à relancer',
    items: [
      {
        id: 'r-5',
        title: 'Relancer M. Petit',
        subtitle: '320 € — échéance dépassée',
        icon: { family: 'MaterialCommunityIcons', name: 'cash-multiple' },
        tint: 'green',
        route: '/factures',
      },
    ],
  },
  {
    title: 'Administratif',
    items: [
      {
        id: 'r-6',
        title: 'Mettre à jour l’attestation d’assurance',
        subtitle: 'Expire le 30 juin',
        icon: { family: 'Feather', name: 'shield' },
        tint: 'blue',
        route: '/plus/entreprise',
      },
    ],
  },
  {
    title: 'Messages',
    items: [
      {
        id: 'r-7',
        title: 'Nouveau message de Mme Garnier',
        subtitle: 'Demande de devis climatisation',
        icon: { family: 'Feather', name: 'message-square' },
        tint: 'purple',
        route: '/notifications',
      },
    ],
  },
];

export function getNextReminderTitle(): string | null {
  for (const section of REMINDER_SECTIONS) {
    if (section.items.length > 0) return section.items[0].title;
  }
  return null;
}

export type ReminderSummary = {
  count: number;
  nextTitle: string | null;
};

export function getReminderSummary(): ReminderSummary {
  return {
    count: REMINDER_SECTIONS.reduce((total, section) => total + section.items.length, 0),
    nextTitle: getNextReminderTitle(),
  };
}
