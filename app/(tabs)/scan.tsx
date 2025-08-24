import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Screen from '../../components/ui/Screen';
import { useTheme } from '../../theme';

export default function Scan() {
  const { theme } = useTheme();
  return (
    <Screen center>
      <View style={styles.container}>
        <Image source={require('../../assets/images/scan-icon.png')} style={{ width: 120, height: 120 }} />
        <Text style={[styles.title, { color: theme.colors.textPrimary, fontFamily: theme.fonts.heading }]}>Scanner</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginTop: 16,
  },
});


