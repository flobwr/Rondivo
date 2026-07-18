import { EmptyState } from '@/components/ui/EmptyState';

/**
 * Compatibility shim — Planning's load-failure state is the DS `EmptyState`
 * in its error tone.
 */
export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon="wifi-off"
      tone="error"
      title="Connexion perdue"
      subtitle="Impossible de charger le planning pour le moment."
      actionLabel="Réessayer"
      onAction={onRetry}
    />
  );
}
