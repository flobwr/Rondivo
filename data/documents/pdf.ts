import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform, Share } from 'react-native';

import { formatAmount, formatLongDate } from './date-utils';
import { Facture } from './factures';
import { Devis } from './devis';
import { Contrat } from './contrats';
import { Rapport } from './rapports';
import { DocumentLine } from './lines';

export type PdfDocumentKind = 'facture' | 'devis' | 'contrat' | 'rapport';
type PdfSource = Facture | Devis | Contrat | Rapport;

function linesTableHtml(lines: DocumentLine[] | undefined, total: number): string {
  if (!lines || lines.length === 0) return '';
  const rows = lines
    .map((l) => `<tr><td>${l.label}</td><td class="amount">${formatAmount(l.amount)}</td></tr>`)
    .join('');
  return `<table class="lines">${rows}<tr class="total"><td>Total</td><td class="amount">${formatAmount(total)}</td></tr></table>`;
}

function baseHtml(title: string, clientName: string, meta: string, body: string): string {
  return `<!doctype html>
<html><head><meta charset="utf-8" />
<style>
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #0F1729; padding: 32px; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  .client { font-size: 16px; color: #2563EB; font-weight: 600; margin-bottom: 4px; }
  .meta { font-size: 13px; color: #6B7280; margin-bottom: 24px; }
  table.lines { width: 100%; border-collapse: collapse; margin-top: 16px; }
  table.lines td { padding: 8px 0; border-bottom: 1px solid #EEF0F3; font-size: 14px; }
  table.lines td.amount { text-align: right; }
  table.lines tr.total td { font-weight: 700; border-bottom: none; border-top: 2px solid #0F1729; padding-top: 12px; }
  .notes { margin-top: 20px; font-size: 13px; color: #6B7280; }
</style></head>
<body>
  <h1>${title}</h1>
  <div class="client">${clientName}</div>
  <div class="meta">${meta}</div>
  ${body}
</body></html>`;
}

export function buildDocumentHtml(kind: PdfDocumentKind, doc: PdfSource, clientName: string): string {
  switch (kind) {
    case 'facture': {
      const f = doc as Facture;
      const meta = `Facture ${f.number} · Émise le ${formatLongDate(f.issuedAt)} · Échéance ${formatLongDate(f.dueAt)}`;
      const body = linesTableHtml(f.lines, f.amount) + (f.notes ? `<div class="notes">${f.notes}</div>` : '');
      return baseHtml('Facture', clientName, meta, body);
    }
    case 'devis': {
      const d = doc as Devis;
      const meta = `Devis ${d.number} · Émis le ${formatLongDate(d.issuedAt)} · Valable jusqu’au ${formatLongDate(d.validUntil)}`;
      const body = linesTableHtml(d.lines, d.amount) + (d.notes ? `<div class="notes">${d.notes}</div>` : '');
      return baseHtml('Devis', clientName, meta, body);
    }
    case 'contrat': {
      const c = doc as Contrat;
      const meta = `Contrat ${c.number} · Depuis le ${formatLongDate(c.startDate)}`;
      return baseHtml(c.title, clientName, meta, '');
    }
    case 'rapport': {
      const r = doc as Rapport;
      const meta = `Rapport ${r.number} · ${formatLongDate(r.date)}`;
      const body = r.notes ? `<div class="notes">${r.notes}</div>` : '';
      return baseHtml(r.interventionLabel, clientName, meta, body);
    }
  }
}

/** Generates a real PDF file on device. Returns `null` on web, where
 * expo-print's file output isn't supported — callers fall back to a text
 * share via `shareDocumentPdf`. */
export async function generateDocumentPdf(
  kind: PdfDocumentKind,
  doc: PdfSource,
  clientName: string
): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  const html = buildDocumentHtml(kind, doc, clientName);
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  return uri;
}

export async function shareDocumentPdf(uri: string | null, fallbackText: string): Promise<void> {
  if (!uri) {
    await Share.share({ message: fallbackText });
    return;
  }
  const available = await Sharing.isAvailableAsync();
  if (!available) {
    await Share.share({ message: fallbackText });
    return;
  }
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: 'Partager le document' });
}
