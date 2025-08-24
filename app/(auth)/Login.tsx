import { View, Text, StyleSheet, Alert } from 'react-native'
import { useState } from 'react'
import { router } from 'expo-router';
import { authService } from '../../services/auth/authService';
import Screen from '../../components/ui/Screen';
import Input from '../../components/ui/Input';
import PrimaryButton from '../../components/ui/PrimaryButton';
import LinkButton from '../../components/ui/LinkButton';
import { useTheme } from '../../theme';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 4 && password.length <= 30;
    };

    const handleLogin = async () => {
        setEmailError('');
        setPasswordError('');

        if (!email) {
            setEmailError('Email requis');
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('Format d\'email invalide');
            return;
        }

        if (!password) {
            setPasswordError('Mot de passe requis');
            return;
        }

        if (!validatePassword(password)) {
            setPasswordError('Mot de passe entre 4 et 30 caractères');
            return;
        }

        setLoading(true);
        try {
            await authService.login(email, password);
            // Redirection immédiate vers les onglets et nettoyage de la stack
            setTimeout(() => {
                router.replace('/(tabs)/discover' as any);
            }, 100);
        } catch (error: any) {
            setPasswordError('Identifiants incorrects');
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
            error={emailError}
          />
          <Input
            placeholder="Mot de passe"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            autoComplete="password"
            error={passwordError}
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