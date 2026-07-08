import * as TemplatesData from '@/data/plus/templates';

export type { DocumentTemplates, TemplateStyle } from '@/data/plus/templates';
export { TEMPLATE_STYLE_META, TEMPLATE_STYLE_ORDER } from '@/data/plus/templates';

export async function getDocumentTemplates(): Promise<TemplatesData.DocumentTemplates> {
  return { ...TemplatesData.DOCUMENT_TEMPLATES };
}

export async function updateDocumentTemplate(
  doc: keyof TemplatesData.DocumentTemplates,
  style: TemplatesData.TemplateStyle
): Promise<TemplatesData.DocumentTemplates> {
  TemplatesData.updateDocumentTemplate(doc, style);
  return { ...TemplatesData.DOCUMENT_TEMPLATES };
}
