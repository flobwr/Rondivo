import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { FontSize, Palette, type PaletteShape } from '@/constants/design';

type SectionHeaderProps = {
  title: string;
  /** Lighter inline text after the title — e.g. the date next to "Aujourd'hui". */
  subtitle?: string;
  /** Right-aligned action label; rendered pressable when `onMetaPress` is set. */
  meta?: string;
  onMetaPress?: () => void;
  /** Defaults to the static light palette — pass `useTheme().palette` from screens that opted into dark mode. */
  palette?: PaletteShape;
};

/** The one section title used on the Home screen — keeps every section's
 *  title/meta rhythm identical instead of hand-building each row. */
export function SectionHeader({ title, subtitle, meta, onMetaPress, palette = Palette }: SectionHeaderProps) {
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <View style={styles.row}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
        {subtitle ? <Text style={styles.subtitle}>{`  ${subtitle}`}</Text> : null}
      </Text>

      {meta ? (
        onMetaPress ? (
          <PressableScale style={styles.meta} onPress={onMetaPress} accessibilityLabel={meta} haptic={false}>
            <Text style={styles.metaText} numberOfLines={1}>
              {meta}
            </Text>
            <Feather name="chevron-right" size={14} color={palette.blue} />
          </PressableScale>
        ) : (
          <Text style={styles.metaPlain} numberOfLines={1}>
            {meta}
          </Text>
        )
      ) : null}
    </View>
  );
}

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 12,
    },
    title: {
      flexShrink: 1,
      fontSize: FontSize.section,
      fontWeight: '700',
      color: Palette.textPrimary,
      letterSpacing: -0.4,
    },
    subtitle: {
      fontSize: FontSize.label,
      fontWeight: '500',
      color: Palette.textTertiary,
      letterSpacing: -0.2,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 1,
    },
    metaText: {
      fontSize: FontSize.small,
      fontWeight: '600',
      color: Palette.blue,
      letterSpacing: -0.1,
    },
    metaPlain: {
      fontSize: FontSize.small,
      fontWeight: '500',
      color: Palette.textTertiary,
      letterSpacing: -0.1,
    },
  });
}
