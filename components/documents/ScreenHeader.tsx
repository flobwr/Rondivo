import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Spacing } from '@/constants/design';
import { iconButtonShadow } from '@/constants/shadow';

type Props = {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
};

const BUTTON = 44;

/** Back-chevron + centered title header used by every Documents sub-screen. */
export function ScreenHeader({ title, onBack, right }: Props) {
  const router = useRouter();

  return (
    <View style={styles.row}>
      <Pressable
        style={styles.button}
        hitSlop={8}
        onPress={onBack ?? (() => router.back())}>
        <Feather name="chevron-left" size={24} color={Palette.textPrimary} />
      </Pressable>

      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>

      {right ? <View style={styles.button}>{right}</View> : <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  button: {
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
  placeholder: {
    width: BUTTON,
    height: BUTTON,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
});
