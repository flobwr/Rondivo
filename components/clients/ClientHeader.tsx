import { LargeTitleBar } from '@/components/ui/LargeTitleBar';
import { type PaletteShape } from '@/theme';

type ClientHeaderProps = {
  onAddPress?: () => void;
  /** Accepted for compatibility — the DS bar reads the theme itself. */
  palette?: PaletteShape;
};

/**
 * Compatibility shim — the Clients root header is the DS `LargeTitleBar`
 * (same vocabulary as Planning and Documents; no per-screen button styles).
 */
export function ClientHeader({ onAddPress }: ClientHeaderProps) {
  return (
    <LargeTitleBar
      title="Clients"
      subtitle="Tous vos clients, à portée de main."
      action={{ icon: 'plus', onPress: onAddPress, label: 'Nouveau client' }}
      padded={false}
    />
  );
}
