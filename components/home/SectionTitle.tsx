import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/contexts/theme';
import { Type, type PaletteShape } from '@/theme';

/**
 * Home section title — a confident 20 pt headline with an optional inline
 * link on the right. One rhythm for every section on the screen.
 */
export function SectionTitle({
  title,
  meta,
  onMetaPress,
}: {
  title: string;
  /** Right-aligned link label — pressable when `onMetaPress` is set. */
  meta?: string;
  onMetaPress?: () => void;
}) {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <View style={styles.row}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {meta && onMetaPress ? (
        <PressableScale style={styles.meta} onPress={onMetaPress} accessibilityLabel={meta} haptic={false}>
          <Text style={styles.metaText} numberOfLines={1}>
            {meta}
          </Text>
          <Feather name="chevron-right" size={15} color={palette.blue} />
        </PressableScale>
      ) : null}
    </View>
  );
}

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 14,
    },
    title: {
      ...Type.title,
      fontSize: 20,
      lineHeight: 25,
      flexShrink: 1,
      color: palette.textPrimary,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 1,
    },
    metaText: {
      ...Type.footnote,
      fontWeight: '600',
      color: palette.blue,
    },
  });
}
