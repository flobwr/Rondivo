import { StyleSheet, View } from 'react-native';

import { Accent, StatusAccent, StatusName } from '@/constants/design';
import { AppText } from './app-text';

export type AppStatusProps = {
  /** Domain status. Mapped to an accent via constants/design → StatusAccent. */
  status: StatusName;
  /** Optional human label. Falls back to the status key. */
  label?: string;
  /** Show just the coloured dot, no text. */
  dotOnly?: boolean;
};

/**
 * Semantic status indicator: a coloured dot + label driven by the central
 * StatusAccent map. Use this so "urgent = orange" is decided in ONE place, not
 * re-hardcoded per screen (planning currently repeats that map three times).
 */
export function AppStatus({ status, label, dotOnly = false }: AppStatusProps) {
  const accent = Accent[StatusAccent[status]];

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: accent.solid }]} />
      {dotOnly ? null : (
        <AppText variant="caption" style={{ color: accent.solid }}>
          {label ?? status}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
