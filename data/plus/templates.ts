export type TemplateStyle = 'classique' | 'moderne' | 'minimaliste';

export const TEMPLATE_STYLE_META: Record<TemplateStyle, { label: string; description: string; accent: string }> = {
  classique: { label: 'Classique', description: 'Mise en page traditionnelle, sobre et professionnelle.', accent: '#2563EB' },
  moderne: { label: 'Moderne', description: 'Bandeau coloré et typographie affirmée.', accent: '#7C3AED' },
  minimaliste: { label: 'Minimaliste', description: 'Le strict nécessaire, sans fioritures.', accent: '#10B981' },
};

export const TEMPLATE_STYLE_ORDER: TemplateStyle[] = ['classique', 'moderne', 'minimaliste'];

export type DocumentTemplates = {
  devis: TemplateStyle;
  factures: TemplateStyle;
  contrats: TemplateStyle;
};

export const DOCUMENT_TEMPLATES: DocumentTemplates = {
  devis: 'moderne',
  factures: 'moderne',
  contrats: 'classique',
};

export function updateDocumentTemplate(doc: keyof DocumentTemplates, style: TemplateStyle) {
  DOCUMENT_TEMPLATES[doc] = style;
}
