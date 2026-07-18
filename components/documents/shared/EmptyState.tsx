import { EmptyState as DSEmptyState } from '@/components/ui/EmptyState';
import { type PaletteShape } from '@/theme';
import { FeatherIconName } from '../types';

/**
 * Compatibility shim — every call site now renders the DS `EmptyState`
 * (theme-aware by itself; the old `palette` prop is accepted and ignored).
 * New screens should import `EmptyState` from `@/components/ui` directly.
 */
export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  icon: FeatherIconName;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  palette?: PaletteShape;
}) {
  return (
    <DSEmptyState
      icon={icon}
      title={title}
      subtitle={subtitle}
      actionLabel={actionLabel}
      onAction={onAction}
    />
  );
}
