import { Linking } from 'react-native';

import { formatAmount, formatLongDate, daysSince } from './date-utils';
import { Facture } from './factures';
import { Devis } from './devis';
import { Contrat } from './contrats';

// Only "email" is wired today. The shape is kept open on purpose — the
// product spec asks for SMS/WhatsApp relance later without a rewrite here.
export type RelaunchChannel = 'email';

export type ComposedMessage = { subject: string; body: string };

export function buildRelaunchMessage(
  kind: 'facture' | 'devis',
  doc: Facture | Devis,
  clientName: string
): ComposedMessage {
  if (kind === 'facture') {
    const facture = doc as Facture;
    const days = daysSince(facture.dueAt);
    return {
      subject: `Relance — Facture ${facture.number}`,
      body: `Bonjour ${clientName},\n\nSauf erreur de notre part, la facture ${facture.number} d’un montant de ${formatAmount(facture.amount)} est toujours impayée, avec une échéance dépassée depuis ${days} jour${days > 1 ? 's' : ''} (échéance du ${formatLongDate(facture.dueAt)}).\n\nPourriez-vous procéder au règlement dans les meilleurs délais ? N’hésitez pas à me contacter pour toute question.\n\nCordialement.`,
    };
  }
  const devis = doc as Devis;
  return {
    subject: `Relance — Devis ${devis.number}`,
    body: `Bonjour ${clientName},\n\nJe me permets de revenir vers vous au sujet du devis ${devis.number} d’un montant de ${formatAmount(devis.amount)}, valable jusqu’au ${formatLongDate(devis.validUntil)}.\n\nSouhaitez-vous que nous en discutions ou avez-vous besoin d’ajustements ?\n\nCordialement.`,
  };
}

export function buildSendMessage(
  kind: 'devis' | 'facture' | 'contrat',
  doc: Devis | Facture | Contrat,
  clientName: string
): ComposedMessage {
  if (kind === 'devis') {
    const devis = doc as Devis;
    return {
      subject: `Devis ${devis.number}`,
      body: `Bonjour ${clientName},\n\nVeuillez trouver ci-joint le devis ${devis.number} d’un montant de ${formatAmount(devis.amount)}, valable jusqu’au ${formatLongDate(devis.validUntil)}.\n\nN’hésitez pas à me contacter pour toute question.\n\nCordialement.`,
    };
  }
  if (kind === 'facture') {
    const facture = doc as Facture;
    return {
      subject: `Facture ${facture.number}`,
      body: `Bonjour ${clientName},\n\nVeuillez trouver ci-joint la facture ${facture.number} d’un montant de ${formatAmount(facture.amount)}, à régler avant le ${formatLongDate(facture.dueAt)}.\n\nCordialement.`,
    };
  }
  const contrat = doc as Contrat;
  return {
    subject: `Contrat ${contrat.number}`,
    body: `Bonjour ${clientName},\n\nVeuillez trouver ci-joint le contrat "${contrat.title}".\n\nCordialement.`,
  };
}

export function openMailto({ to, subject, body }: { to: string; subject: string; body: string }) {
  const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return Linking.openURL(url);
}
