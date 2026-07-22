import { Feather } from '@expo/vector-icons';
import { StyleSheet, View, ViewProps } from 'react-native';

import { Accent, AccentName, IconSize, Radius } from '@/constants/design';

type Size = 'sm' | 'md' | 'lg';
type FeatherName = React.ComponentProps<typeof Feather>['name'];

export type AppIconTileProps = ViewProps & {
  icon: FeatherName;
  /** Accent family — sets both the soft background and the icon tint. */
  accent?: AccentName;
  size?: Size;
};

const SIZE: Record<Size, { box: number; icon: number; radius: number }> = {
  sm: { box: 32, icon: IconSize.md, radius: Radius.tile - 4 },
  md: { box: 38, icon: IconSize.lg, radius: Radius.tile - 4 },
  lg: { box: 40, icon: IconSize.lg, radius: Radius.tile },
};

/**
 * The rounded, soft-tinted icon square that fronts quick-actions, reminder
 * rows and list items. Pairing background + tint through an accent family keeps
 * "purple tile" meaning exactly one background and one icon colour everywhere.
 *
 * Not pressable by design — wrap it in AppListItem / PressableScale when needed.
 */
export function AppIconTile({ icon, accent = 'blue', size = 'md', style, ...rest }: AppIconTileProps) {
  const s = SIZE[size];
  const a = Accent[accent];

  return (
    <View
      style={[
        styles.tile,
        { width: s.box, height: s.box, borderRadius: s.radius, backgroundColor: a.soft },
        style,
      ]}
      {...rest}>
      <Feather name={icon} size={s.icon} color={a.solid} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
