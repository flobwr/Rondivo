import { FeatherIconName } from '@/components/documents/types';

/**
 * Every destination reachable from the "Plus" menu. Centralised here so the
 * menu list and the generic placeholder screen (`app/plus/[slug].tsx`) share
 * one source of truth for title/icon/copy — adding a real screen later is
 * just adding a `route` override, no menu changes needed.
 */
export type PlusItemId =
  | 'entreprise'
  | 'employes'
  | 'equipe'
  | 'vehicules'
  | 'materiel'
  | 'fournisseurs'
  | 'prestations'
  | 'produits'
  | 'modeles-devis'
  | 'modeles-factures'
  | 'modeles-contrats'
  | 'relances'
  | 'rappels'
  | 'notifications'
  | 'sauvegarde'
  | 'apparence'
  | 'langue'
  | 'tva'
  | 'numerotation'
  | 'paiements'
  | 'signature'
  | 'coordonnees'
  | 'aide'
  | 'tutoriels'
  | 'contact-support'
  | 'signaler-bug'
  | 'suggestion'
  | 'cgu'
  | 'confidentialite';

export type PlusItemMeta = {
  title: string;
  icon: FeatherIconName;
  /** Shown on the placeholder screen while the real screen doesn't exist yet. */
  description: string;
  /** Existing route to open instead of the placeholder, once a screen is built. */
  route?: string;
  /** Static default shown under the row title — only when a sensible one exists. Never invented per-item data. */
  subtitle?: string;
};

export const PLUS_ITEMS: Record<PlusItemId, PlusItemMeta> = {
  entreprise: { title: 'Entreprise', icon: 'briefcase', description: 'Nom, logo, adresse et informations légales de votre entreprise.', route: '/plus/entreprise' },
  employes: { title: 'Employés', icon: 'users', description: 'Gérez la liste et les fiches de vos employés.', route: '/plus/employes' },
  equipe: { title: 'Équipe', icon: 'user-check', description: 'Rôles, permissions et accès de votre équipe.', route: '/plus/equipe' },
  vehicules: { title: 'Véhicules', icon: 'truck', description: 'Suivez les véhicules utilisés par votre entreprise.', route: '/plus/vehicules' },
  materiel: { title: 'Matériel', icon: 'tool', description: 'Gérez votre parc de matériel et d’outillage.', route: '/plus/materiel' },
  fournisseurs: { title: 'Fournisseurs', icon: 'package', description: 'Retrouvez vos fournisseurs et leurs coordonnées.', route: '/plus/fournisseurs' },

  prestations: { title: 'Prestations', icon: 'layers', description: 'Votre catalogue de prestations et leurs tarifs.', route: '/plus/prestations' },
  produits: { title: 'Produits', icon: 'box', description: 'Gérez les produits que vous facturez à vos clients.', route: '/plus/produits' },
  'modeles-devis': { title: 'Modèles de devis', icon: 'copy', description: 'Personnalisez la présentation de vos devis.', route: '/plus/modeles-devis' },
  'modeles-factures': { title: 'Modèles de factures', icon: 'file', description: 'Personnalisez la présentation de vos factures.', route: '/plus/modeles-factures' },
  'modeles-contrats': { title: 'Contrats', icon: 'file-plus', description: 'Vos modèles de contrats types.', route: '/plus/modeles-contrats' },

  // Automatisations — ordered by frequency: Rappels is used daily, Sauvegarde almost never.
  rappels: { title: 'Rappels', icon: 'check-square', description: '', route: '/rappels' },
  notifications: { title: 'Notifications', icon: 'bell', description: 'Choisissez les notifications que vous souhaitez recevoir.', route: '/plus/notifications' },
  relances: { title: 'Relances automatiques', icon: 'send', description: 'Automatisez les relances de devis et factures impayées.', route: '/plus/relances' },
  sauvegarde: { title: 'Sauvegarde', icon: 'cloud', description: 'Sauvegardez et restaurez les données de votre entreprise.', route: '/plus/sauvegarde' },

  // Paramètres — business/document settings first (what artisans touch to get invoicing right),
  // app preferences (apparence, langue) last since they're cosmetic and rarely revisited.
  // "Coordonnées" opens Entreprise directly — same fields, one place to edit them.
  coordonnees: { title: 'Coordonnées', icon: 'map-pin', description: 'Téléphone, e-mail et adresse affichés à vos clients.', route: '/plus/entreprise' },
  tva: { title: 'TVA par défaut', icon: 'percent', description: 'Définissez le taux de TVA appliqué par défaut.', route: '/plus/tva' },
  numerotation: { title: 'Numérotation', icon: 'hash', description: 'Personnalisez la numérotation de vos devis et factures.', route: '/plus/numerotation' },
  paiements: { title: 'Paiements', icon: 'credit-card', description: 'Moyens de paiement acceptés et coordonnées bancaires.', route: '/plus/paiements' },
  signature: { title: 'Signature', icon: 'edit-2', description: 'Votre signature utilisée sur les documents.', route: '/plus/signature' },
  apparence: { title: 'Apparence', icon: 'moon', description: 'Clair, sombre ou automatique.', route: '/plus/apparence' },
  langue: { title: 'Langue', icon: 'globe', description: 'Choisissez la langue de l’application.', route: '/plus/langue' },

  // Support — "get help now" before "learn" before "give feedback".
  aide: { title: 'Centre d’aide', icon: 'help-circle', description: 'Trouvez des réponses à vos questions.', route: '/plus/aide' },
  'contact-support': { title: 'Contacter le support', icon: 'message-circle', description: 'Une question ? Notre équipe vous répond.', route: '/plus/feedback/contact' },
  tutoriels: { title: 'Tutoriels', icon: 'play-circle', description: 'Apprenez à tirer le meilleur parti de Rondivo.', route: '/plus/tutoriels' },
  'signaler-bug': { title: 'Signaler un bug', icon: 'alert-triangle', description: 'Décrivez le problème rencontré, nous nous en occupons.', route: '/plus/feedback/bug' },
  suggestion: { title: 'Proposer une fonctionnalité', icon: 'star', description: 'Vos idées nous aident à améliorer Rondivo.', route: '/plus/feedback/suggestion' },

  cgu: { title: 'Conditions d’utilisation', icon: 'file-text', description: 'Les conditions générales d’utilisation de Rondivo.', route: '/plus/cgu' },
  confidentialite: { title: 'Politique de confidentialité', icon: 'lock', description: 'Comment vos données sont protégées et utilisées.', route: '/plus/confidentialite' },
};

export type PlusSection = { label: string; items: PlusItemId[] };

export const PLUS_SECTIONS: PlusSection[] = [
  { label: 'Gestion', items: ['entreprise', 'employes', 'equipe', 'vehicules', 'materiel', 'fournisseurs'] },
  { label: 'Catalogue', items: ['prestations', 'produits', 'modeles-devis', 'modeles-factures', 'modeles-contrats'] },
  { label: 'Automatisations', items: ['rappels', 'notifications', 'relances', 'sauvegarde'] },
  { label: 'Paramètres', items: ['coordonnees', 'tva', 'numerotation', 'paiements', 'signature', 'apparence', 'langue'] },
  { label: 'Support', items: ['aide', 'contact-support', 'tutoriels', 'signaler-bug', 'suggestion'] },
];

export const PLUS_ABOUT_ITEMS: PlusItemId[] = ['cgu', 'confidentialite'];
