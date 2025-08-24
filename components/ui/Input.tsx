import React from 'react';
import { TextInput, StyleSheet, TextInputProps, Platform, View, Text } from 'react-native';
import { useTheme } from '../../theme';

type Props = TextInputProps & {
  error?: string;
};

export default function Input({ style, error, ...rest }: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        placeholderTextColor={theme.colors.inputPlaceholder}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.inputBackground,
            color: '#000000', // Texte en noir pour être visible
            borderRadius: theme.radii.pill,
            ...(Platform.OS === 'android' ? { elevation: theme.shadows.input.elevation } : {}),
            ...theme.shadows.input,
            // Ombre jaune lumineuse
            shadowColor: theme.colors.accent,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          },
          style,
        ]}
        {...rest}
      />
      {error && (
        <Text style={[styles.errorText, { color: '#FF4444' }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
    marginLeft: 20,
  },
});


