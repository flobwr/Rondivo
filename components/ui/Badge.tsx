import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/contexts/theme';
import { Radius } from '@/theme';

export type BadgeTone = 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'teal' | 'neutral';

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
  const { palette, statusInk } = useTheme();

  const { wash, ink, vivid } = {
    blue: { wash: palette.blueSoft, ink: statusInk.blue, vivid: palette.blue },
    green: { wash: palette.greenSoft, ink: statusInk.green, vivid: palette.green },
    orange: { wash: palette.orangeSoft, ink: statusInk.orange, vivid: palette.orange },
    red: { wash: palette.redSoft, ink: statusInk.red, vivid: palette.red },
    purple: { wash: palette.purpleSoft, ink: statusInk.purple, vivid: palette.purple },
    teal: { wash: palette.tealSoft, ink: palette.teal, vivid: palette.teal },
    neutral: { wash: palette.inset, ink: palette.textSecondary, vivid: palette.textTertiary },
  }[tone];

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
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  text: {
    fontSize: 12,
    letterSpacing: -0.05,
  },
});
