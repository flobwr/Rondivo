import { EmptyState as DSEmptyState } from '@/components/ui/EmptyState';

/**
 * Compatibility shim — Planning's free-day state is the DS `EmptyState`.
 */
export function EmptyState({ onPlan }: { onPlan?: () => void }) {
  return (
    <DSEmptyState
      icon="calendar"
      title="Journée libre"
      subtitle="Aucune intervention planifiée ce jour."
      actionLabel="Planifier une intervention"
      onAction={onPlan}
    />
  );
}
