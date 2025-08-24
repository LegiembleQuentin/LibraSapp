import { View, Text, StyleSheet, Alert } from 'react-native'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { router } from 'expo-router';
import Screen from '../../components/ui/Screen';
import Input from '../../components/ui/Input';
import PrimaryButton from '../../components/ui/PrimaryButton';
import LinkButton from '../../components/ui/LinkButton';
import { useTheme } from '../../theme';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const auth = FIREBASE_AUTH;

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 4 && password.length <= 30;
    };

    const handleRegister = async () => {
        // Reset errors
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');

        // Validation côté client
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

        if (!confirmPassword) {
            setConfirmPasswordError('Confirmation requise');
            return;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError('Les mots de passe ne correspondent pas');
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Utilisateur créé:', user.email);
            Alert.alert('Succès', 'Compte créé avec succès !', [
                {
                    text: 'OK',
                    onPress: () => router.replace('/home' as any)
                }
            ]);
        } catch (error: any) {
            console.error('Erreur d\'inscription:', error);
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setEmailError('Cet email est déjà utilisé');
                    break;
                case 'auth/invalid-email':
                    setEmailError('Email invalide');
                    break;
                case 'auth/weak-password':
                    setPasswordError('Le mot de passe est trop faible');
                    break;
                default:
                    setEmailError('Erreur lors de la création du compte');
            }
        } finally {
            setLoading(false);
        }
    }

    const goToLogin = () => {
        router.push('/(auth)/Login' as any);
    }

    const { theme } = useTheme();

    return (
        <Screen center>
            <View style={styles.container}>
                <Text style={[styles.title, { color: theme.colors.textPrimary, fontFamily: theme.fonts.heading }]}>Inscription</Text>
                
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
                        autoComplete="password-new"
                        error={passwordError}
                    />
                    <Input
                        placeholder="Confirmer le mot de passe"
                        secureTextEntry={true}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        autoComplete="password-new"
                        error={confirmPasswordError}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <PrimaryButton 
                        title={loading ? 'Création...' : 'Valider'} 
                        onPress={handleRegister} 
                        disabled={loading}
                    />
                    
                    <View style={styles.linkContainer}>
                        <Text style={[styles.linkText, { color: theme.colors.textPrimary }]}>Vous avez déjà un compte ?</Text>
                        <LinkButton title={'Se connecter'} onPress={goToLogin} />
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

export default Register
