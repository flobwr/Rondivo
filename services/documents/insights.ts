/**
 * Async facade over `data/documents/insights.ts` — aggregates across the
 * other documents services (never the raw `data/documents/*` arrays) to
 * build the "À traiter" action list on the Documents hub.
 */
import { ActionItem } from '@/components/documents/types';
import { daysSince, formatAmount } from '@/data/documents/date-utils';
import { expiringContrats } from './contrats';
import { expiringDevis } from './devis';
import { overdueFactures } from './factures';
import { rapportsToComplete } from './rapports';

export async function getActionItems(): Promise<ActionItem[]> {
  const items: ActionItem[] = [];

  const [overdue, devisExpiring, toComplete, contratsExpiring] = await Promise.all([
    overdueFactures(),
    expiringDevis(2),
    rapportsToComplete(),
    expiringContrats(14),
  ]);

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

  for (const d of devisExpiring) {
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

  for (const c of contratsExpiring) {
    const daysLeft = -daysSince(c.endDate!);
    const when = daysLeft <= 0 ? "aujourd'hui" : `dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}`;
    items.push({
      id: `expiring-contrat-${c.id}`,
      moduleId: 'contrats',
      icon: 'briefcase',
      tone: daysLeft <= 3 ? 'red' : 'orange',
      text: `"${c.title}" expire ${when}`,
      route: `/contrat/${c.id}`,
    });
  }

  return items.sort((a, b) => (a.tone === 'red' ? 0 : 1) - (b.tone === 'red' ? 0 : 1));
}
