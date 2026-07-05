import { StyleSheet, View } from 'react-native';

type Props = {
  background: string;
  size?: number;
  radius?: number;
  children: React.ReactNode;
};

export function IconTile({ background, size = 40, radius = 14, children }: Props) {
  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: radius, backgroundColor: background },
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
