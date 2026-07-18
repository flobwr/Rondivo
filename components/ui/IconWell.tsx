import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/contexts/theme';
import { Radius, Size } from '@/theme';

export type IconName = ComponentProps<typeof Feather>['name'];

/**
 * Circular icon well — the DS's one shape for icon-only actions in chrome
 * (app bars, modal headers, inline row actions). A quiet disc pressed into
 * the paper: no shadow, no border, just a slightly deeper fill. Never used
 * for primary actions — those get a real Button.
 */
export function IconWell({
  icon,
  onPress,
  accessibilityLabel,
  size = Size.iconWell,
  iconSize = 19,
  tone = 'neutral',
}: {
  icon: IconName;
  onPress?: () => void;
  accessibilityLabel: string;
  size?: number;
  iconSize?: number;
  /** `accent` inks the glyph in Bleu Rondivo for the rare emphasized well. */
  tone?: 'neutral' | 'accent';
}) {
  const { palette } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      to={0.9}
      accessibilityLabel={accessibilityLabel}
      style={{
        width: size,
        height: size,
        borderRadius: Radius.pill,
        backgroundColor: palette.iconButtonBg,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Feather
        name={icon}
        size={iconSize}
        color={tone === 'accent' ? palette.blue : palette.textPrimary}
      />
    </PressableScale>
  );
}
