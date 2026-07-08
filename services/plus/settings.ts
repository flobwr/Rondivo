import * as SettingsData from '@/data/plus/settings';

export type { Appearance, Language, Settings, VatRate } from '@/data/plus/settings';
export { PAYMENT_METHOD_OPTIONS, VAT_RATE_OPTIONS } from '@/data/plus/settings';

export async function getSettings(): Promise<SettingsData.Settings> {
  return { ...SettingsData.SETTINGS };
}

export async function updateSettings(patch: Partial<SettingsData.Settings>): Promise<SettingsData.Settings> {
  SettingsData.updateSettings(patch);
  return { ...SettingsData.SETTINGS };
}
