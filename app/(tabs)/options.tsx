import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import Screen from '../../components/ui/Screen';
import { useTheme } from '../../theme';
import PrimaryButton from '../../components/ui/PrimaryButton';
import OptionItem from '../../components/ui/OptionItem';
import { authService } from '../../services/auth/authService';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Header from '@/components/ui/Header';

export default function Options() {
  const { theme } = useTheme();
  const [cacheSizeBytes, setCacheSizeBytes] = React.useState<number>(0);
  
  const handleCGU = () => {
    router.push('/(options)/cgu');
  };

  const handleMentionsLegales = () => {
    router.push('/(options)/mentions-legales');
  };

  const handleUserEdit = () => {
    router.push('/(options)/user-edit');
  };

  const formatBytes = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} Mo`;
  };

  const computeDirSize = async (dirUri: string): Promise<number> => {
    try {
      const entries = await FileSystem.readDirectoryAsync(dirUri);
      let total = 0;
      for (const name of entries) {
        const uri = dirUri.endsWith('/') ? `${dirUri}${name}` : `${dirUri}/${name}`;
        const info = await FileSystem.getInfoAsync(uri);
        if (info.exists) {
          if ((info as any).isDirectory) {
            total += await computeDirSize(uri);
          } else if (typeof info.size === 'number') {
            total += info.size;
          }
        }
      }
      return total;
    } catch {
      return 0;
    }
  };

  const refreshCacheSize = React.useCallback(async () => {
    const cacheDir = FileSystem.cacheDirectory ?? '';
    if (!cacheDir) {
      setCacheSizeBytes(0);
      return;
    }
    const size = await computeDirSize(cacheDir);
    setCacheSizeBytes(size);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      refreshCacheSize();
    }, [refreshCacheSize])
  );

  const clearCache = async () => {
    try {
      // 1) Supprimer le contenu du dossier de cache (fichiers expo-camera, manipulator, etc.)
      const cacheDir = FileSystem.cacheDirectory ?? '';
      if (cacheDir) {
        const entries = await FileSystem.readDirectoryAsync(cacheDir);
        for (const name of entries) {
          const uri = cacheDir.endsWith('/') ? `${cacheDir}${name}` : `${cacheDir}/${name}`;
          try {
            await FileSystem.deleteAsync(uri, { idempotent: true });
          } catch {}
        }
      }

      // 2) Supprimer les clés AsyncStorage non liées à l'auth
      const keysToRemove = [
        'library_changed_book_ids',
        '@libras_user_profile',
      ];
      await AsyncStorage.multiRemove(keysToRemove);

      await refreshCacheSize();
      Alert.alert('Succès', 'Cache supprimé.');
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de supprimer le cache.');
    }
  };

  const confirmClearCache = () => {
    Alert.alert(
      'Confirmation',
      'Supprimer le cache peut libérer de l\'espace. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: clearCache },
      ]
    );
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
            title={`Supprimer le cache (${formatBytes(cacheSizeBytes)})`}
            subtitle="Libérer l'espace et nettoyer les fichiers temporaires"
            onPress={confirmClearCache}
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
    maxWidth: 300,
  },
});


