/** Everything under Plus ▸ Automatisations / Paramètres that isn't its own module — one small settings object rather than nine tiny data files. */

export type VatRate = 0 | 5.5 | 10 | 20;
/** The five papers, plus `auto` — follows the system's light/dark switch
 *  (resolves to Atelier in light, Midnight in dark). */
export type ThemeChoice = 'atelier' | 'arctic' | 'slate' | 'midnight' | 'amoled' | 'auto';
export type Language = 'fr' | 'en';

export type Settings = {
  defaultVatRate: VatRate;

  quotePrefix: string;
  quoteNextNumber: number;
  invoicePrefix: string;
  invoiceNextNumber: number;

  paymentMethods: string[];
  iban: string;

  hasSignature: boolean;
  signatureName: string;

  notifyReminders: boolean;
  notifyUnpaidInvoices: boolean;
  notifyNewMessages: boolean;

  autoRemindersEnabled: boolean;
  quoteReminderDays: number;
  invoiceReminderDays: number;

  autoBackupEnabled: boolean;

  theme: ThemeChoice;
  language: Language;
};

export const PAYMENT_METHOD_OPTIONS = ['Virement bancaire', 'Chèque', 'Espèces', 'Carte bancaire', 'Prélèvement'] as const;

export const VAT_RATE_OPTIONS: VatRate[] = [0, 5.5, 10, 20];

export const SETTINGS: Settings = {
  defaultVatRate: 20,

  quotePrefix: 'DE-2026-',
  quoteNextNumber: 33,
  invoicePrefix: 'FA-2026-',
  invoiceNextNumber: 88,

  paymentMethods: ['Virement bancaire', 'Carte bancaire'],
  iban: '',

  hasSignature: false,
  signatureName: '',

  notifyReminders: true,
  notifyUnpaidInvoices: true,
  notifyNewMessages: true,

  autoRemindersEnabled: true,
  quoteReminderDays: 5,
  invoiceReminderDays: 7,

  autoBackupEnabled: true,

  theme: 'atelier',
  language: 'fr',
};

export function updateSettings(patch: Partial<Settings>) {
  Object.assign(SETTINGS, patch);
}
