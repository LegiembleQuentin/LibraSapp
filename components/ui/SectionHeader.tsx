import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  variant?: 'default' | 'large';
}

export default function SectionHeader({ title, subtitle, variant = 'default' }: SectionHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={[styles.yellowBar, { backgroundColor: theme.colors.accent }]} />
        <Text style={[
          styles.title,
          { color: theme.colors.textPrimary, fontFamily: theme.fonts.heading },
          variant === 'large' && styles.titleLarge
        ]}>
          {title}
        </Text>
      </View>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  yellowBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  titleLarge: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginLeft: 16,
    opacity: 0.8,
  },
});
