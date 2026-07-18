import { View } from 'react-native';

import { IconWell } from '@/components/ui/IconWell';
import { LargeTitleBar } from '@/components/ui/LargeTitleBar';
import { Spacing, type PaletteShape } from '@/theme';

type Props = {
  onSearch?: () => void;
  onAdd?: () => void;
  /** Accepted for compatibility — the DS bar reads the theme itself. */
  palette?: PaletteShape;
};

/**
 * Documents root header — the DS `LargeTitleBar` with the module's two
 * actions as icon wells: quiet search, accent add. The only root screen
 * with two wells, because search spans every sub-module here.
 */
export function DocumentsHeader({ onSearch, onAdd }: Props) {
  return (
    <LargeTitleBar
      title="Documents"
      subtitle="Tous vos documents"
      trailing={
        <View style={{ flexDirection: 'row', gap: Spacing.sm + 2 }}>
          <IconWell icon="search" size={44} iconSize={20} onPress={onSearch} accessibilityLabel="Rechercher" />
          <IconWell icon="plus" size={44} iconSize={21} tone="accent" onPress={onAdd} accessibilityLabel="Créer un document" />
        </View>
      }
    />
  );
}
