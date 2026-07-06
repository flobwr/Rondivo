/**
 * Mocked notes dataset — a stand-in for a future notes API. The screen never
 * mutates this array directly (no create/edit yet, per scope), only reads it.
 */
export type Note = {
  id: string;
  title: string;
  preview: string;
  dateLabel: string;
};

export const NOTES: Note[] = [
  {
    id: '1',
    title: 'Accès chantier Mme Bernard',
    preview: 'Code portail 4521B, sonner chez le voisin si pas de réponse.',
    dateLabel: 'Aujourd’hui',
  },
  {
    id: '2',
    title: 'Fournisseur — délai de livraison',
    preview: 'Groupe de sécurité 7 bar en rupture, réassort prévu sous 5 jours.',
    dateLabel: 'Hier',
  },
  {
    id: '3',
    title: 'Idée — modèle de devis rénovation',
    preview: 'Regrouper main-d’œuvre et fournitures par pièce plutôt que par ligne.',
    dateLabel: 'Il y a 3 jours',
  },
];
