import { ActionItem } from '@/components/documents/types';
import { daysSince, formatAmount } from './date-utils';
import { overdueFactures } from './factures';
import { expiringDevis } from './devis';
import { rapportsToComplete } from './rapports';
import { expiringContrats } from './contrats';

/**
 * Every recommendation below comes from a plain, checkable business rule
 * (an overdue date, a missing status) — no AI, no scoring model. This is the
 * one place that decides what the artisan sees under "À traiter", and it
 * always points at the exact document responsible, not just its module.
 */
export function getActionItems(): ActionItem[] {
  const items: ActionItem[] = [];

  const overdue = overdueFactures();
  if (overdue.length === 1) {
    const f = overdue[0];
    const days = daysSince(f.dueAt);
    items.push({
      id: `overdue-${f.id}`,
      moduleId: 'factures',
      icon: 'file-text',
      tone: 'red',
      text: `Facture ${f.number} en retard depuis ${days} jour${days > 1 ? 's' : ''}`,
      route: `/facture/${f.id}`,
    });
  } else if (overdue.length > 1) {
    const total = overdue.reduce((sum, f) => sum + f.amount, 0);
    items.push({
      id: 'overdue-multi',
      moduleId: 'factures',
      icon: 'file-text',
      tone: 'red',
      text: `${overdue.length} factures impayées · ${formatAmount(total)} en retard`,
      route: '/factures',
    });
  }

  for (const d of expiringDevis(2)) {
    const daysLeft = -daysSince(d.validUntil);
    const when = daysLeft <= 0 ? "aujourd'hui" : daysLeft === 1 ? 'demain' : `dans ${daysLeft} jours`;
    items.push({
      id: `expiring-devis-${d.id}`,
      moduleId: 'devis',
      icon: 'edit-3',
      tone: daysLeft <= 1 ? 'red' : 'orange',
      text: `Devis ${d.number} expire ${when}`,
      route: `/devis/${d.id}`,
    });
  }

  const toComplete = rapportsToComplete();
  if (toComplete.length === 1) {
    const r = toComplete[0];
    items.push({
      id: `rapport-${r.id}`,
      moduleId: 'rapports',
      icon: 'clipboard',
      tone: 'orange',
      text: `Rapport "${r.interventionLabel}" à terminer`,
      route: `/rapport/${r.id}`,
    });
  } else if (toComplete.length > 1) {
    items.push({
      id: 'rapports-multi',
      moduleId: 'rapports',
      icon: 'clipboard',
      tone: 'orange',
      text: `${toComplete.length} rapports à terminer`,
      route: '/rapports',
    });
  }

  for (const c of expiringContrats(14)) {
    const daysLeft = -daysSince(c.endDate!);
    const when = daysLeft <= 0 ? "aujourd'hui" : `dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}`;
    items.push({
      id: `expiring-contrat-${c.id}`,
      moduleId: 'contrats',
      icon: 'briefcase',
      tone: daysLeft <= 3 ? 'red' : 'orange',
      text: `Contrat "${c.title}" expire ${when}`,
      route: `/contrat/${c.id}`,
    });
  }

  return items.sort((a, b) => (a.tone === 'red' ? 0 : 1) - (b.tone === 'red' ? 0 : 1));
}
