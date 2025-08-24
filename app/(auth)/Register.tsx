import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { router } from 'expo-router';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
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
            let errorMessage = 'Erreur lors de la création du compte';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Cet email est déjà utilisé';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email invalide';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Le mot de passe est trop faible';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            Alert.alert('Erreur', errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const goToLogin = () => {
        router.push('/(auth)/Login' as any);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Créer un compte</Text>
            
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                    autoComplete="password-new"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirmer le mot de passe"
                    secureTextEntry={true}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoComplete="password-new"
                />
            </View>

            <View style={styles.buttonContainer}>
                <Button 
                    title={loading ? "Création..." : "Créer un compte"} 
                    onPress={handleRegister} 
                    disabled={loading}
                />
                
                <View style={styles.linkContainer}>
                    <Text style={styles.linkText}>Déjà un compte ?</Text>
                    <Button 
                        title="Se connecter" 
                        onPress={goToLogin}
                        color="#007AFF"
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    inputContainer: {
        width: '100%',
        maxWidth: 300,
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
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
        color: '#666',
        fontSize: 16,
    },
})

export default Register
