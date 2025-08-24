import React from 'react';
import { TextInput, StyleSheet, TextInputProps, Platform } from 'react-native';
import { useTheme } from '../../theme';

type Props = TextInputProps & {
  error?: string;
};

export default function Input({ style, error, ...rest }: Props) {
  const { theme } = useTheme();

  return (
    <TextInput
      placeholderTextColor={theme.colors.inputPlaceholder}
      style={[
        styles.input,
        {
          backgroundColor: theme.colors.inputBackground,
          color: theme.colors.textPrimary,
          borderRadius: theme.radii.pill,
          ...(Platform.OS === 'android' ? { elevation: theme.shadows.input.elevation } : {}),
          ...theme.shadows.input,
        },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    marginBottom: 16,
  },
});


