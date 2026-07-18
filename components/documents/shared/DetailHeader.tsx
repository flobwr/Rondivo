import { AppBar } from '@/components/ui/AppBar';

type Props = {
  title: string;
  onBack: () => void;
  onMenu?: () => void;
  /** Trailing "+" button instead of the "…" menu — for list screens that create a new item. */
  onAdd?: () => void;
};

/**
 * Compatibility shim — DetailHeader was the old design system's screen
 * header. Every call site now renders the DS `AppBar` (compact centered
 * title, circular icon wells, invisible bar). New screens should import
 * `AppBar` from `@/components/ui` directly.
 */
export function DetailHeader({ title, onBack, onMenu, onAdd }: Props) {
  return (
    <AppBar
      title={title}
      onBack={onBack}
      right={
        onAdd
          ? { icon: 'plus', onPress: onAdd, label: 'Ajouter' }
          : onMenu
            ? { icon: 'more-horizontal', onPress: onMenu, label: 'Plus d’options' }
            : undefined
      }
    />
  );
}
