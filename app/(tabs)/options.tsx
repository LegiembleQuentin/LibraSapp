import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import Screen from '../../components/ui/Screen';
import { useTheme } from '../../theme';
import PrimaryButton from '../../components/ui/PrimaryButton';
import OptionItem from '../../components/ui/OptionItem';
import { authService } from '../../services/auth/authService';
import { router } from 'expo-router';
import Header from '@/components/ui/Header';

export default function Options() {
  const { theme } = useTheme();
  
  const handleCGU = () => {
    router.push('/(options)/cgu');
  };

  const handleMentionsLegales = () => {
    router.push('/(options)/mentions-legales');
  };

  const handleUserEdit = () => {
    router.push('/(options)/user-edit');
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Header showBackButton={false} title="Paramètres" />
        
        <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
          <OptionItem
            title="Modifier mes informations"
            subtitle="Email, pays, âge et mot de passe"
            onPress={handleUserEdit}
          />

          <OptionItem
            title="Conditions Générales d'Utilisation"
            subtitle="Lire les CGU de l'application"
            onPress={handleCGU}
          />
          
          <OptionItem
            title="Mentions Légales"
            subtitle="Informations légales et réglementaires"
            onPress={handleMentionsLegales}
          />
          
          <OptionItem
            title="À propos"
            subtitle="Informations sur l'application"
            onPress={() => Alert.alert('À propos', 'LibraS v1.0.0')}
          />
        </ScrollView>
        
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
  optionsContainer: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
  },
  btns: {
    marginTop: 24,
    maxWidth: 300,
  },
});


