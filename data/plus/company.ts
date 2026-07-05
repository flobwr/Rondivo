export type Company = {
  name: string;
  legalForm: string;
  siret: string;
  vatNumber: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  initials: string;
  plan: string;
  planRenewalLabel: string;
  synced: boolean;
  lastSyncLabel: string;
  foundedYear: string;
  country: string;
};

export const COMPANY: Company = {
  name: 'Martin Chauffage',
  legalForm: 'EURL',
  siret: '812 345 678 00021',
  vatNumber: 'FR32 812345678',
  address: '14 rue des Artisans, 69003 Lyon',
  phone: '04 78 12 34 56',
  email: 'contact@martin-chauffage.fr',
  website: 'martin-chauffage.fr',
  initials: 'MC',
  plan: 'Formule Pro',
  planRenewalLabel: 'Renouvellement le 12 janvier 2027',
  synced: true,
  lastSyncLabel: 'Aujourd’hui à 09:12',
  foundedYear: '2021',
  country: 'France',
};

export function updateCompany(patch: Partial<Company>) {
  Object.assign(COMPANY, patch);
}

export type Account = {
  name: string;
  role: string;
  /** Short badge shown next to the name — e.g. "Gérant", "Employé". */
  roleBadge: string;
  email: string;
  phone: string;
  initials: string;
};

export const ACCOUNT: Account = {
  name: 'Florian Martin',
  role: 'Chauffagiste',
  roleBadge: 'Gérant',
  email: 'florian.martin@martin-chauffage.fr',
  phone: '06 12 34 56 78',
  initials: 'FM',
};

export function updateAccount(patch: Partial<Account>) {
  Object.assign(ACCOUNT, patch);
}
