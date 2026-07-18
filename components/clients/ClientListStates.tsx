import { EmptyState } from '@/components/ui/EmptyState';
import { type IconName } from '@/components/ui/IconWell';

export type EmptyMode = 'no-clients' | 'no-results' | 'no-filter-match';

const EMPTY_COPY: Record<EmptyMode, { icon: IconName; title: string; subtitle: string; reset: boolean }> = {
  'no-clients': {
    icon: 'users',
    title: 'Aucun client',
    subtitle: 'Ajoutez votre premier client pour le voir apparaître ici.',
    reset: false,
  },
  'no-results': {
    icon: 'search',
    title: 'Aucun résultat',
    subtitle: 'Aucun client ne correspond à votre recherche. Essayez un autre terme.',
    reset: true,
  },
  'no-filter-match': {
    icon: 'filter',
    title: 'Aucun client ici',
    subtitle: 'Aucun client dans cette catégorie pour le moment.',
    reset: true,
  },
};

/** Shown when the list is empty — the exact copy depends on why. */
export function ClientsEmptyState({ mode, onReset }: { mode: EmptyMode; onReset?: () => void }) {
  const copy = EMPTY_COPY[mode];
  return (
    <EmptyState
      icon={copy.icon}
      title={copy.title}
      subtitle={copy.subtitle}
      actionLabel={copy.reset && onReset ? 'Réinitialiser' : undefined}
      onAction={copy.reset ? onReset : undefined}
    />
  );
}

/** Shown when the initial load fails. */
export function ClientsErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon="wifi-off"
      tone="error"
      title="Connexion perdue"
      subtitle="Impossible de charger vos clients pour le moment."
      actionLabel="Réessayer"
      onAction={onRetry}
    />
  );
}
