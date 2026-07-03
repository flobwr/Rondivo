export type ImportFileType = 'pdf' | 'image' | 'doc';

export const IMPORT_TYPE_META: Record<ImportFileType, { label: string; icon: 'file-text' | 'image' | 'file' }> = {
  pdf: { label: 'PDF', icon: 'file-text' },
  image: { label: 'Image', icon: 'image' },
  doc: { label: 'Document', icon: 'file' },
};

export type ImportedFile = {
  id: string;
  name: string;
  type: ImportFileType;
  sizeKb: number;
  date: string; // ISO
  clientName?: string;
};

export const MOCK_IMPORTS: ImportedFile[] = [
  { id: 'im-1', name: 'Devis fournisseur - Chauffe-eau.pdf', type: 'pdf', sizeKb: 340, date: '2026-06-28', clientName: 'Camille Roux' },
  { id: 'im-2', name: 'Attestation assurance décennale.pdf', type: 'pdf', sizeKb: 512, date: '2026-06-20' },
  { id: 'im-3', name: 'Plan chaufferie.jpg', type: 'image', sizeKb: 1820, date: '2026-06-18', clientName: 'Julie Fontaine' },
  { id: 'im-4', name: 'Bon de garantie adoucisseur.pdf', type: 'pdf', sizeKb: 210, date: '2026-06-12', clientName: 'Thomas Lefevre' },
  { id: 'im-5', name: 'Notice technique BWT.doc', type: 'doc', sizeKb: 95, date: '2026-05-30' },
  { id: 'im-6', name: 'Photo compteur avant travaux.jpg', type: 'image', sizeKb: 980, date: '2026-05-22', clientName: 'Emilie Moreau' },
  { id: 'im-7', name: 'Devis signé - Copropriété.pdf', type: 'pdf', sizeKb: 460, date: '2026-05-10', clientName: 'Copropriété Les Tilleuls' },
];

export function formatFileSize(kb: number): string {
  if (kb < 1000) return `${kb} Ko`;
  return `${(kb / 1000).toFixed(1)} Mo`;
}
