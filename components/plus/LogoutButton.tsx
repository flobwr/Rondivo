import { Button } from '@/components/ui/Button';
import { type PaletteShape } from '@/theme';

/**
 * Compatibility shim — logout is a DS `danger` Button (quiet destructive:
 * sheet surface, muted danger ink, capsule like every other button).
 */
export function LogoutButton({ onPress }: { onPress: () => void; palette?: PaletteShape }) {
  return <Button label="Se déconnecter" icon="log-out" variant="danger" onPress={onPress} />;
}
