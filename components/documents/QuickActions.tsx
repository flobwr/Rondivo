import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Spacing } from '@/constants/design';

type QuickAction = {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  onPress?: () => void;
};

type Props = {
  actions: QuickAction[];
};

export function QuickActions({ actions }: Props) {
  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <Pressable
          key={action.label}
          style={styles.action}
          hitSlop={4}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            action.onPress?.();
          }}>
          <View style={styles.iconWrap}>
            <Feather name={action.icon} size={14} color={Palette.blue} />
          </View>
          <Text style={styles.label}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: Spacing.sm,
    gap: Spacing.xs,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Palette.blueSoft,
    gap: 4,
  },
  iconWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: FontSize.tiny,
    fontWeight: '500',
    color: Palette.blue,
  },
});
