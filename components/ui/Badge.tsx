import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/contexts/theme';
import { getStatusSurface, Radius, type ColorTone } from '@/theme';

export type BadgeTone = ColorTone;

/**
 * Rondivo status badge — ink on wash, named by tone, never by raw colour.
 *
 * The wash comes from the palette's `…Soft` family and the text is ALWAYS
 * the matching text-safe ink (`…Ink`), never the vivid dot colour — vivid
 * accents fail AA as text on their own wash. The dot alone carries the
 * vivid value. `critical` adds a hairline ring for statuses with real
 * financial or urgency weight (Impayée, En retard, Refusé).
 */
export function Badge({
  label,
  tone = 'neutral',
  critical = false,
  dot = true,
}: {
  label: string;
  tone?: BadgeTone;
  critical?: boolean;
  dot?: boolean;
}) {
  const { palette } = useTheme();
  const { wash, ink, vivid } = getStatusSurface(palette, tone);

  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: wash },
        critical && { borderWidth: 1, borderColor: vivid },
      ]}>
      {dot ? <View style={[styles.dot, { backgroundColor: vivid }]} /> : null}
      <Text
        numberOfLines={1}
        style={[styles.text, { color: ink, fontWeight: critical ? '700' : '600' }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: Radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  text: {
    fontSize: 11.5,
    letterSpacing: -0.1,
  },
});
