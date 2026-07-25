// The layout transition now lives in utils/layout-animation — one copy for the
// whole app. Re-exported so existing imports keep working.
export { easeLayout } from '@/utils/layout-animation';

export const PAYMENT_METHODS = ['Espèces', 'Carte bancaire', 'Virement', 'Chèque'];
