import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../../components/ui/Screen';
import { useTheme } from '../../theme';

export default function Search() {
  const { theme } = useTheme();
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.textPrimary, fontFamily: theme.fonts.heading }]}>Recherche</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginTop: 12,
    marginBottom: 8,
  },
});


