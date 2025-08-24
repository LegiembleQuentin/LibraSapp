import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { router } from 'expo-router';

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



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      
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
          autoComplete="password"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title={loading ? "Connexion..." : "Se connecter"} 
          onPress={handleLogin} 
          disabled={loading}
        />
        
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Pas encore de compte ?</Text>
          <Button 
            title="Créer un compte" 
            onPress={goToRegister}
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

export default Login