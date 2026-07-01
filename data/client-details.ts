import {
  type Client,
  type FeatherIconName,
  type Tint,
} from '@/components/clients/types';

/**
 * Rich "fiche client" data model.
 *
 * The list screen only needs the light {@link Client} shape. The detail screen
 * needs a lot more (contacts, equipment, documents, activity, stats…). Rather
 * than bloat every list row, that extra data lives here and is assembled by
 * {@link getClientDetail}. When a Supabase backend lands, only this file (and
 * the base {@link getClientById}) changes — every component keeps its props.
 */

export type ClientType = 'particulier' | 'entreprise';

export type StatsPeriod = '12m' | 'year' | 'all';

export type ContactPerson = {
  id: string;
  name: string;
  initials: string;
  role: string;
  phone: string;
  email?: string;
  tint: Tint;
  primary?: boolean;
};

export type Equipment = {
  id: string;
  name: string;
  detail?: string;
  installed?: string;
  warranty?: string;
  icon: FeatherIconName;
  tint: Tint;
};

export type DocumentCategory = 'Contrat' | 'Notice' | 'Photo' | 'Garantie' | 'Autre';

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  'Contrat',
  'Notice',
  'Photo',
  'Garantie',
  'Autre',
];

export type ClientDocument = {
  id: string;
  name: string;
  kind: string; // "Document PDF", "Photo"…
  size: string;
  category: DocumentCategory;
  icon: FeatherIconName;
  tint: Tint;
};

export type ActivityKind =
  | 'intervention'
  | 'devis'
  | 'facture'
  | 'paiement'
  | 'sms'
  | 'appel'
  | 'note'
  | 'client';

export type ActivityEntry = {
  id: string;
  kind: ActivityKind;
  title: string;
  subtitle?: string;
  date: string;
  time: string;
};

export type ClientStatsData = {
  revenue: number;
  totalPaid: number;
  totalUnpaid: number;
  interventions: number;
  avgInterventionTime: string;
  avgTravelTime: string;
  avgAmount: number;
  lastIntervention: string;
};

export type NextAppointment = {
  title: string;
  dateLabel: string;
  time: string;
  distanceKm: number;
  travelMinutes: number;
  recommendedDeparture: string;
} | null;

export type ClientAccess = {
  portail?: string;
  digicode?: string;
  etage?: string;
  batiment?: string;
};

export type FinanceItem = {
  id: string;
  reference: string;
  label: string;
  amount: number;
  status: string;
  statusTint: Tint;
  date: string;
};

export type ClientFinances = {
  quotes: FinanceItem[];
  invoices: FinanceItem[];
  payments: FinanceItem[];
};

export type InterventionItem = {
  id: string;
  title: string;
  dateLabel: string;
  time: string;
  status: string;
  statusTint: Tint;
  amount?: number;
};

export type ClientDetail = {
  type: ClientType;
  paymentMethod: string;
  tva?: string;
  access: ClientAccess;
  misc?: string;
  importantNotes: string[];
  contacts: ContactPerson[];
  equipment: Equipment[];
  documents: ClientDocument[];
  activity: ActivityEntry[];
  interventions: InterventionItem[];
  finances: ClientFinances;
  stats: Record<StatsPeriod, ClientStatsData>;
  nextAppointment: NextAppointment;
};

// ── Alerts ──────────────────────────────────────────────────────────────────
// Derived dynamically from the base client + detail. The alert card renders the
// most severe one prominently and lists the rest.

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type ClientAlert = {
  id: string;
  icon: FeatherIconName;
  title: string;
  subtitle?: string;
  severity: AlertSeverity;
};

const SEVERITY_RANK: Record<AlertSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

export function getClientAlerts(client: Client, detail: ClientDetail): ClientAlert[] {
  const alerts: ClientAlert[] = [];

  if (client.unpaidInvoices > 0) {
    alerts.push({
      id: 'unpaid',
      icon: 'alert-circle',
      title:
        client.unpaidInvoices > 1
          ? `${client.unpaidInvoices} factures impayées`
          : '1 facture impayée',
      subtitle: `Dernière facture : ${formatEuro(detail.stats['12m'].totalUnpaid)}`,
      severity: 'critical',
    });
  }

  if (client.quotesPending > 0) {
    alerts.push({
      id: 'quote',
      icon: 'file-text',
      title:
        client.quotesPending > 1
          ? `${client.quotesPending} devis à relancer`
          : '1 devis à relancer',
      subtitle: 'En attente de réponse du client',
      severity: 'warning',
    });
  }

  if (detail.nextAppointment && detail.nextAppointment.dateLabel.toLowerCase().includes("aujourd")) {
    alerts.push({
      id: 'today',
      icon: 'calendar',
      title: "Intervention aujourd'hui",
      subtitle: `${detail.nextAppointment.title} · ${detail.nextAppointment.time}`,
      severity: 'warning',
    });
  }

  const soonWarranty = detail.equipment.find((e) => {
    if (!e.warranty) return false;
    const year = Number(e.warranty.replace(/\D/g, ''));
    return year && year <= new Date().getFullYear() + 1;
  });
  if (soonWarranty) {
    alerts.push({
      id: 'warranty',
      icon: 'shield',
      title: 'Garantie bientôt échue',
      subtitle: `${soonWarranty.name} — ${soonWarranty.warranty}`,
      severity: 'info',
    });
  }

  return alerts.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
}

export function formatEuro(value: number): string {
  return `${value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

export function formatEuroShort(value: number): string {
  return `${value.toLocaleString('fr-FR')} €`;
}

// ── Overrides ───────────────────────────────────────────────────────────────
// Fully-authored detail for the flagship client (matches the mockup). Every
// other client falls back to sensible generated defaults.

const OVERRIDES: Record<string, Partial<ClientDetail>> = {
  '1': {
    type: 'particulier',
    paymentMethod: 'Virement',
    access: { digicode: 'Digicode portail', etage: '2ème étage' },
    misc: 'Interphone au nom "Dupont". Se garer sur la place visiteurs.',
    importantNotes: [
      'Le chien est dans le jardin',
      'Ne pas sonner après 18h',
      'Le compteur est à la cave',
    ],
    contacts: [
      {
        id: 'c1',
        name: 'Jean Dupont',
        initials: 'JD',
        role: 'Principal',
        phone: '06 12 34 56 78',
        email: 'jean.dupont@email.com',
        tint: 'blue',
        primary: true,
      },
      {
        id: 'c2',
        name: 'Pierre Martin',
        initials: 'PM',
        role: 'Responsable maintenance',
        phone: '06 98 76 54 32',
        tint: 'orange',
      },
    ],
    equipment: [
      {
        id: 'e1',
        name: 'Chaudière Vaillant EcoTEC Plus',
        installed: 'Installée en 2022',
        warranty: "Garantie jusqu'en 2027",
        icon: 'thermometer',
        tint: 'red',
      },
      {
        id: 'e2',
        name: 'Thermostat Vaillant VSMART',
        installed: 'Installé en 2022',
        warranty: "Garantie jusqu'en 2027",
        icon: 'sliders',
        tint: 'blue',
      },
      {
        id: 'e3',
        name: 'Pompe à chaleur aroTHERM',
        installed: 'Installée en 2023',
        warranty: "Garantie jusqu'en 2028",
        icon: 'wind',
        tint: 'green',
      },
    ],
    nextAppointment: {
      title: 'Entretien chaudière',
      dateLabel: 'Mercredi 18 juin 2025',
      time: '09:00',
      distanceKm: 14,
      travelMinutes: 25,
      recommendedDeparture: '08:20',
    },
  },
};

// ── Builder ─────────────────────────────────────────────────────────────────

function buildDefaults(client: Client): ClientDetail {
  const paid = Math.round(client.revenue * 0.82);
  const unpaid = client.revenue - paid;

  const stats: ClientStatsData = {
    revenue: client.revenue,
    totalPaid: paid,
    totalUnpaid: unpaid,
    interventions: client.interventionsCount,
    avgInterventionTime: '1h 45',
    avgTravelTime: '25 min',
    avgAmount: client.interventionsCount
      ? Math.round(client.revenue / client.interventionsCount)
      : 0,
    lastIntervention: client.lastInterventionLabel,
  };

  return {
    type: client.company ? 'entreprise' : 'particulier',
    paymentMethod: 'Virement',
    tva: client.company ? 'FR 32 123 456 789' : undefined,
    access: { digicode: 'Digicode à demander' },
    misc: '—',
    importantNotes: [],
    contacts: [
      {
        id: `${client.id}-primary`,
        name: client.name,
        initials: client.initials,
        role: 'Principal',
        phone: client.phone,
        email: client.email,
        tint: client.avatarTint,
        primary: true,
      },
    ],
    equipment: [],
    documents: [
      { id: 'd1', name: "Contrat d'entretien.pdf", kind: 'Document PDF', size: '320 Ko', category: 'Contrat', icon: 'file-text', tint: 'blue' },
      { id: 'd2', name: 'Notice chaudière.pdf', kind: 'Document PDF', size: '1,2 Mo', category: 'Notice', icon: 'file', tint: 'red' },
      { id: 'd3', name: 'Attestation garantie.pdf', kind: 'Document PDF', size: '210 Ko', category: 'Garantie', icon: 'shield', tint: 'green' },
      { id: 'd4', name: 'Photo installation.jpg', kind: 'Photo', size: '2,4 Mo', category: 'Photo', icon: 'image', tint: 'orange' },
      { id: 'd5', name: 'Plan installation.pdf', kind: 'Document PDF', size: '540 Ko', category: 'Autre', icon: 'file', tint: 'purple' },
    ],
    activity: buildActivity(client),
    interventions: buildInterventions(client),
    finances: buildFinances(client),
    stats: {
      '12m': stats,
      year: { ...stats, revenue: Math.round(stats.revenue * 0.7), totalPaid: Math.round(paid * 0.7), interventions: Math.max(1, Math.round(client.interventionsCount * 0.6)) },
      all: { ...stats, revenue: Math.round(stats.revenue * 1.6), totalPaid: Math.round(paid * 1.6), interventions: client.interventionsCount + 4 },
    },
    nextAppointment:
      client.status === 'new'
        ? null
        : {
            title: 'Entretien annuel',
            dateLabel: 'Mercredi 18 juin 2025',
            time: '09:00',
            distanceKm: 14,
            travelMinutes: 25,
            recommendedDeparture: '08:20',
          },
  };
}

function buildActivity(client: Client): ActivityEntry[] {
  const entries: ActivityEntry[] = [
    {
      id: 'a1',
      kind: 'intervention',
      title: 'Intervention terminée',
      subtitle: 'Entretien chaudière',
      date: '6 juin 2025',
      time: '14:30',
    },
    {
      id: 'a2',
      kind: 'devis',
      title: 'Devis envoyé',
      subtitle: 'DEV-2025-0450',
      date: '28 mai 2025',
      time: '11:15',
    },
  ];
  if (client.unpaidInvoices > 0) {
    entries.push({
      id: 'a3',
      kind: 'facture',
      title: 'Facture impayée',
      subtitle: 'FAC-2025-0387',
      date: '15 mai 2025',
      time: '09:20',
    });
  } else {
    entries.push({
      id: 'a3',
      kind: 'paiement',
      title: 'Paiement reçu',
      subtitle: 'FAC-2025-0387',
      date: '15 mai 2025',
      time: '09:20',
    });
  }
  entries.push({
    id: 'a4',
    kind: 'client',
    title: 'Client ajouté',
    subtitle: `Depuis ${client.clientSince}`,
    date: client.createdAt,
    time: '10:00',
  });
  return entries;
}

function buildInterventions(client: Client): InterventionItem[] {
  const base: InterventionItem[] = [
    {
      id: 'i0',
      title: 'Entretien chaudière',
      dateLabel: '18 juin 2025',
      time: '09:00',
      status: 'Planifiée',
      statusTint: 'blue',
    },
    {
      id: 'i1',
      title: 'Entretien chaudière',
      dateLabel: '6 juin 2025',
      time: '14:30',
      status: 'Terminée',
      statusTint: 'green',
      amount: 120,
    },
    {
      id: 'i2',
      title: 'Dépannage fuite',
      dateLabel: '2 avril 2025',
      time: '10:00',
      status: 'Terminée',
      statusTint: 'green',
      amount: 180,
    },
    {
      id: 'i3',
      title: 'Remplacement thermostat',
      dateLabel: '12 février 2025',
      time: '11:15',
      status: 'Terminée',
      statusTint: 'green',
      amount: 95,
    },
  ];
  if (client.status === 'new') return [];
  return base;
}

function buildFinances(client: Client): ClientFinances {
  const quotes: FinanceItem[] =
    client.quotesPending > 0
      ? [
          {
            id: 'q1',
            reference: 'DEV-2025-0450',
            label: 'Remplacement circulateur',
            amount: 640,
            status: 'En attente',
            statusTint: 'orange',
            date: '28 mai 2025',
          },
        ]
      : [];

  const invoices: FinanceItem[] = [
    {
      id: 'f1',
      reference: 'FAC-2025-0387',
      label: 'Entretien chaudière',
      amount: 480,
      status: client.unpaidInvoices > 0 ? 'Impayée' : 'Payée',
      statusTint: client.unpaidInvoices > 0 ? 'red' : 'green',
      date: '15 mai 2025',
    },
    {
      id: 'f2',
      reference: 'FAC-2025-0201',
      label: 'Dépannage fuite',
      amount: 280,
      status: 'Payée',
      statusTint: 'green',
      date: '2 avril 2025',
    },
  ];

  const payments: FinanceItem[] = [
    {
      id: 'p1',
      reference: 'FAC-2025-0201',
      label: 'Virement reçu',
      amount: 280,
      status: 'Encaissé',
      statusTint: 'green',
      date: '5 avril 2025',
    },
  ];

  return { quotes, invoices, payments };
}

export function getClientDetail(client: Client): ClientDetail {
  const defaults = buildDefaults(client);
  const override = OVERRIDES[client.id];
  if (!override) return defaults;
  return {
    ...defaults,
    ...override,
    access: { ...defaults.access, ...(override.access ?? {}) },
    stats: { ...defaults.stats, ...(override.stats ?? {}) },
    finances: { ...defaults.finances, ...(override.finances ?? {}) },
  };
}
