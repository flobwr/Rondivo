/**
 * Async facade over `data/documents/imports.ts` — read-only (no CRUD exists
 * at the data layer for imported files yet). Screens should only import this,
 * never `@/data/documents/imports` directly.
 */
import * as ImportsData from '@/data/documents/imports';

export type { ImportedFile, ImportFileType } from '@/data/documents/imports';
export { IMPORT_TYPE_META, formatFileSize } from '@/data/documents/imports';

export async function listImports(): Promise<ImportsData.ImportedFile[]> {
  return [...ImportsData.MOCK_IMPORTS];
}
