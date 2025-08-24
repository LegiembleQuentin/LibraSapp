import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Screen from '../../components/ui/Screen';
import { useTheme } from '../../theme';
import PrimaryButton from '../../components/ui/PrimaryButton';
import { authService } from '../../services/auth/authService';
import { router } from 'expo-router';

export default function Options() {
  const { theme } = useTheme();
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.textPrimary, fontFamily: theme.fonts.heading }]}>Options</Text>
        <View style={styles.btns}>
          <PrimaryButton
            title={'Se déconnecter'}
            onPress={async () => {
              try {
                await authService.logout();
                router.replace('/(auth)/Login' as any);
              } catch (e) {
                Alert.alert('Erreur', 'Impossible de se déconnecter.');
              }
            }}
          />
        </View>
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
  btns: {
    marginTop: 24,
    maxWidth: 300,
  },
});


