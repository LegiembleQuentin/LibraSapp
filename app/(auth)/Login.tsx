import { View, Text, StyleSheet, Alert } from 'react-native'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { router } from 'expo-router';
import Screen from '../../components/ui/Screen';
import Input from '../../components/ui/Input';
import PrimaryButton from '../../components/ui/PrimaryButton';
import LinkButton from '../../components/ui/LinkButton';
import { useTheme } from '../../theme';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Utilisateur connecté:', user.email);
            Alert.alert('Succès', 'Connexion réussie !');
        } catch (error: any) {
            console.error('Erreur de connexion:', error);
            let errorMessage = 'Erreur de connexion';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Aucun utilisateur trouvé avec cet email';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Mot de passe incorrect';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email invalide';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Ce compte a été désactivé';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            Alert.alert('Erreur', errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const goToRegister = () => {
        router.push('/(auth)/Register' as any);
    }



  const { theme } = useTheme();

  return (
    <Screen center>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.textPrimary, fontFamily: theme.fonts.heading }]}>Connexion</Text>

        <View style={styles.inputContainer}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Input
            placeholder="Mot de passe"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            autoComplete="password"
          />
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={loading ? 'Connexion...' : 'Valider'}
            onPress={handleLogin}
            disabled={loading}
          />

          <View style={styles.linkContainer}>
            <Text style={[styles.linkText, { color: theme.colors.textPrimary }]}>Vous n'avez pas de compte ?</Text>
            <LinkButton title="S'inscrire" onPress={goToRegister} />
          </View>
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    inputContainer: {
        width: '100%',
        maxWidth: 300,
        marginBottom: 20,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
    },
    linkContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        marginBottom: 10,
        fontSize: 16,
    },
})

export default Login