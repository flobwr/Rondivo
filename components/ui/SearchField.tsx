import { Feather } from '@expo/vector-icons';
import { useRef } from 'react';
import { Animated, StyleSheet, TextInput, View } from 'react-native';

import { IconWell } from '@/components/ui/IconWell';
import { useTheme } from '@/contexts/theme';
import { Radius, SettleSpring, Spacing } from '@/theme';

// A touch shorter than the old Size.touchTarget (48) — reads lighter without
// dropping under the ~44pt minimum tap target.
const FIELD_HEIGHT = 44;

/**
 * Rondivo search field — an inset well, not a floating card.
 *
 * Search is furniture, not content: the field reads as a groove pressed
 * into the paper (`inset` fill, no shadow) and only speaks when focused —
 * a soft blue ring settles in with a spring. The optional filter well
 * carries a blue dot when filters are active.
 */
export function SearchField({
  value,
  onChangeText,
  placeholder,
  onFilterPress,
  filtersActive,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onFilterPress?: () => void;
  filtersActive?: boolean;
}) {
  const { palette } = useTheme();
  const focus = useRef(new Animated.Value(0)).current;

  const setFocus = (to: number) =>
    Animated.spring(focus, { toValue: to, useNativeDriver: false, ...SettleSpring }).start();

  const borderColor = focus.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', palette.blue],
  });

  return (
    <View style={styles.row}>
      <Animated.View style={[styles.well, { backgroundColor: palette.inset, borderColor }]}>
        <Feather name="search" size={18} color={palette.textTertiary} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.textTertiary}
          style={[styles.input, { color: palette.textPrimary }]}
          returnKeyType="search"
          clearButtonMode="while-editing"
          onFocus={() => setFocus(1)}
          onBlur={() => setFocus(0)}
        />
      </Animated.View>

      {onFilterPress ? (
        <View>
          <IconWell
            icon="sliders"
            size={FIELD_HEIGHT}
            onPress={onFilterPress}
            accessibilityLabel="Filtrer et trier"
          />
          {filtersActive ? (
            <View
              style={[styles.dot, { backgroundColor: palette.blue, borderColor: palette.screen }]}
              pointerEvents="none"
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
  },
  well: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.tile,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.lg,
    height: FIELD_HEIGHT,
    gap: Spacing.sm + 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    letterSpacing: -0.1,
    padding: 0,
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
});
