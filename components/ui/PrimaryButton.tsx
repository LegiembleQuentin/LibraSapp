import React from 'react';
import { Pressable, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { useTheme } from '../../theme';

type Props = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

export default function PrimaryButton({ title, onPress, disabled }: Props) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.root,
        { opacity: disabled ? 0.5 : pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={[styles.label, { color: theme.colors.accent, fontFamily: theme.fonts.heading }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 20,
    letterSpacing: 0.5,
  },
});


