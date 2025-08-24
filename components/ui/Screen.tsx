import React, { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

type ScreenProps = PropsWithChildren<{
  center?: boolean;
}>;

export default function Screen({ center, children }: ScreenProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[theme.gradient.start, theme.gradient.end]}
      style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View style={[styles.content, center && styles.center]}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  center: {
    justifyContent: 'center',
  },
});


