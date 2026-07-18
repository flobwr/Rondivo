import { Feather } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/contexts/theme';
import { getElevation, Radius, type PaletteShape } from '@/theme';

type Action = {
  label: string;
  /** Full action name for screen readers — the visible label is compacted. */
  accessibilityLabel: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  /** Omitted only for "Document", which opens the shared creation menu instead of navigating. */
  route?: Href;
};

const ACTIONS: Action[] = [
  { label: 'Document', accessibilityLabel: 'Nouveau document', icon: 'file-plus' },
  { label: 'Client', accessibilityLabel: 'Nouveau client', icon: 'user-plus', route: '/client/new' },
  { label: 'Notes', accessibilityLabel: 'Notes', icon: 'message-square', route: '/notes' },
  { label: 'Tâches', accessibilityLabel: 'Tâches', icon: 'check-square', route: '/tasks' },
];

const DISC = 38;

/**
 * Four equal sheets, one gesture each. The tile itself is quiet paper — the
 * signature blue lives only in the glyph disc, so the row reads as one calm
 * band of tools rather than four competing buttons.
 */
export function QuickActionsRow({ onNewDocument }: { onNewDocument: () => void }) {
  const router = useRouter();
  const { palette, scheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const elevation = getElevation(scheme);

  return (
    <View style={styles.row}>
      {ACTIONS.map((action) => (
        <PressableScale
          key={action.label}
          to={0.94}
          style={[styles.tile, elevation.whisper]}
          onPress={() => (action.route ? router.push(action.route) : onNewDocument())}
          accessibilityLabel={action.accessibilityLabel}>
          <View style={styles.disc}>
            <Feather name={action.icon} size={17} color={palette.blue} />
          </View>
          <Text style={styles.label} numberOfLines={1}>
            {action.label}
          </Text>
        </PressableScale>
      ))}
    </View>
  );
}

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: 10,
    },
    tile: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: palette.card,
      borderRadius: 18,
      paddingVertical: 14,
      gap: 8,
    },
    disc: {
      width: DISC,
      height: DISC,
      borderRadius: Radius.pill,
      backgroundColor: palette.blueSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: -0.1,
      color: palette.textSecondary,
    },
  });
}
