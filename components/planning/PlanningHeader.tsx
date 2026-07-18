import { LargeTitleBar } from '@/components/ui/LargeTitleBar';

type Props = {
  monthLabel: string; // e.g. "JUIN 2025"
  onAdd?: () => void;
};

/**
 * Compatibility shim — the Planning root header is the DS `LargeTitleBar`:
 * month eyebrow, large title, one accent well for the add action.
 */
export function PlanningHeader({ monthLabel, onAdd }: Props) {
  return (
    <LargeTitleBar
      eyebrow={monthLabel}
      title="Planning"
      action={{ icon: 'plus', onPress: onAdd, label: 'Ajouter une intervention' }}
    />
  );
}
