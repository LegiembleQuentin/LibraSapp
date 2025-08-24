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
      // Petit délai pour laisser Firebase se synchroniser
      setTimeout(() => {
        router.replace("/(auth)/Login");
      }, 100);
    } catch (error: any) {

      Alert.alert('Erreur', 'Erreur lors de la déconnexion');
    }
  };

  return (
    <Screen center>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.textPrimary, fontFamily: theme.fonts.heading }]}>Bonjour</Text>
        
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
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
});
