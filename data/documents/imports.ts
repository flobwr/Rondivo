import { Palette } from '@/constants/design';

export type ImportFileType = 'pdf' | 'image' | 'doc';

export const IMPORT_TYPE_META: Record<
  ImportFileType,
  { label: string; icon: 'file-text' | 'image' | 'file'; color: string; soft: string }
> = {
  pdf: { label: 'PDF', icon: 'file-text', color: Palette.red, soft: Palette.redSoft },
  image: { label: 'Image', icon: 'image', color: Palette.blue, soft: Palette.blueSoft },
  doc: { label: 'Document', icon: 'file', color: Palette.purple, soft: Palette.purpleSoft },
};

export type ImportedFile = {
  id: string;
  name: string;
  type: ImportFileType;
  sizeKb: number;
  date: string; // ISO
  clientId?: string;
  clientName?: string;
  interventionId?: string;
  interventionLabel?: string;
};

export const MOCK_IMPORTS: ImportedFile[] = [
  { id: 'im-1', name: 'Devis fournisseur - Chauffe-eau.pdf', type: 'pdf', sizeKb: 340, date: '2026-06-28', clientId: '6', clientName: 'Camille Roux', interventionId: 'int-ra-1', interventionLabel: 'Remplacement chauffe-eau' },
  { id: 'im-2', name: 'Attestation assurance décennale.pdf', type: 'pdf', sizeKb: 512, date: '2026-06-20' },
  { id: 'im-3', name: 'Plan chaufferie.jpg', type: 'image', sizeKb: 1820, date: '2026-06-18', clientId: '8', clientName: 'Julie Fontaine' },
  { id: 'im-4', name: 'Bon de garantie adoucisseur.pdf', type: 'pdf', sizeKb: 210, date: '2026-06-12', clientId: '9', clientName: 'Thomas Lefevre', interventionId: 'int-ra-4', interventionLabel: 'Installation adoucisseur' },
  { id: 'im-5', name: 'Notice technique BWT.doc', type: 'doc', sizeKb: 95, date: '2026-05-30' },
  { id: 'im-6', name: 'Photo compteur avant travaux.jpg', type: 'image', sizeKb: 980, date: '2026-05-22', clientId: '10', clientName: 'Emilie Moreau' },
  { id: 'im-7', name: 'Devis signé - Copropriété.pdf', type: 'pdf', sizeKb: 460, date: '2026-05-10' },
];

export function formatFileSize(kb: number): string {
  if (kb < 1000) return `${kb} Ko`;
  return `${(kb / 1000).toFixed(1)} Mo`;
}
