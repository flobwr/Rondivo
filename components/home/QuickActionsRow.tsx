import { Feather } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
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

const DISC = 52;

/**
 * One premium tray, four gestures. The four round buttons belong to a
 * single sheet — same DS `Card` every other resting surface uses — instead
 * of four small cards competing for attention. Each disc lifts a hair off
 * the tray on its own whisper shadow, so the tray reads as one considered
 * object, not four buttons that happen to be near each other.
 */
export function QuickActionsRow({ onNewDocument }: { onNewDocument: () => void }) {
  const router = useRouter();
  const { palette, resolvedTheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const elevation = getElevation(resolvedTheme);

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        {ACTIONS.map((action) => (
          <PressableScale
            key={action.label}
            to={0.92}
            style={styles.item}
            onPress={() => (action.route ? router.push(action.route) : onNewDocument())}
            accessibilityLabel={action.accessibilityLabel}>
            <View style={[styles.disc, elevation.whisper]}>
              <Feather name={action.icon} size={20} color={palette.blue} />
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {action.label}
            </Text>
          </PressableScale>
        ))}
      </View>
    </Card>
  );
}

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    card: {
      paddingVertical: 20,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    item: {
      flex: 1,
      alignItems: 'center',
      gap: 9,
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
