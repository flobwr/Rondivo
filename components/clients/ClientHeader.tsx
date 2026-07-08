import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, type PaletteShape } from '@/constants/design';
import { iconButtonShadow } from '@/constants/shadow';

type ClientHeaderProps = {
  onAddPress?: () => void;
  /** Defaults to the static light palette — pass `useTheme().palette` from screens that opted into dark mode. */
  palette?: PaletteShape;
};

// Matches the "+" button used by DocumentsHeader/PlanningHeader (44px,
// bordered tile) — was 48px with no border, the odd one out among the
// three main-screen header action buttons.
const BUTTON = 44;

export function ClientHeader({ onAddPress, palette = Palette }: ClientHeaderProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const styles = useMemo(() => createStyles(palette), [palette]);

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, friction: 5, tension: 300 }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        <Text style={styles.title}>Clients</Text>
        <Text style={styles.subtitle}>Tous vos clients, à portée de main.</Text>
      </View>

      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onAddPress}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Nouveau client">
        <Animated.View style={[styles.addButton, { transform: [{ scale }] }]}>
          <Feather name="plus" size={22} color={palette.blue} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    texts: {
      flex: 1,
      paddingRight: 12,
    },
    title: {
      fontSize: 30,
      fontWeight: '700',
      color: Palette.textPrimary,
      letterSpacing: -0.8,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: '400',
      color: Palette.textSecondary,
      marginTop: 4,
      letterSpacing: -0.1,
    },
    addButton: {
      width: BUTTON,
      height: BUTTON,
      borderRadius: 14,
      backgroundColor: Palette.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Palette.border,
      alignItems: 'center',
      justifyContent: 'center',
      ...iconButtonShadow,
    },
  });
}
