import { View, Text, StyleSheet, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { router } from 'expo-router';
import { authService } from '../services/auth/authService';
import Screen from '../components/ui/Screen';
import PrimaryButton from '../components/ui/PrimaryButton';
import { useTheme } from '../theme';

export default function Home() {
  const user = FIREBASE_AUTH.currentUser;
  const { theme } = useTheme();

  const handleLogout = async () => {
    try {
      await authService.logout();
      console.log('Déconnexion hybride réussie');
      Alert.alert('Succès', 'Déconnexion réussie !');
      // La navigation sera gérée par le listener Firebase dans index.tsx
    } catch (error: any) {
      console.error('Erreur de déconnexion hybride:', error);
      Alert.alert('Erreur', 'Erreur lors de la déconnexion');
    }
  };

  return (
    <Screen center>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.textPrimary, fontFamily: theme.fonts.heading }]}>Bienvenue !</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Vous êtes connecté en tant que : {user?.email}
        </Text>
        
        <View style={styles.buttonContainer}>
          <PrimaryButton 
            title="Se déconnecter" 
            onPress={handleLogout}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
});
