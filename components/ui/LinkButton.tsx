import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

type Props = {
  title: string;
  onPress: () => void;
};

export default function LinkButton({ title, onPress }: Props) {
  const { theme } = useTheme();
  return (
    <Pressable onPress={onPress} style={styles.root}>
      <Text style={[styles.text, { color: theme.colors.textPrimary }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    marginTop: 12,
  },
  text: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});


