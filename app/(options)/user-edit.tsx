import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Switch } from 'react-native';
import Screen from '../../components/ui/Screen';
import Input from '../../components/ui/Input';
import PrimaryButton from '../../components/ui/PrimaryButton';
import LinkButton from '../../components/ui/LinkButton';
import { useTheme } from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, updatePassword } from 'firebase/auth';
import Header from '../../components/ui/Header';
import { router, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';

const USER_PROFILE_KEY = '@libras_user_profile';

type Mode = 'profile' | 'changePassword' | 'forgotPassword';

export default function UserEdit() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ mode?: string; from?: string; email?: string }>();
  const [fromLogin, setFromLogin] = useState(false);

  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [age, setAge] = useState('');
  const [useLocationForCountry, setUseLocationForCountry] = useState(false);
  const [locating, setLocating] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [ageError, setAgeError] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');

  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');

  const [mode, setMode] = useState<Mode>('profile');
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePassword = (value: string): boolean => {
    return value.length >= 4 && value.length <= 30;
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const raw = await AsyncStorage.getItem(USER_PROFILE_KEY);
        if (raw) {
          const data = JSON.parse(raw) as { email?: string; country?: string; age?: string | number };
          if (data.email) setEmail(String(data.email));
          if (data.country) setCountry(String(data.country));
          if (data.age !== undefined && data.age !== null) setAge(String(data.age));
        }
      } catch (e) {
        // ignore load error
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    const initialMode = typeof params.mode === 'string' ? params.mode : undefined;
    const initialFrom = typeof params.from === 'string' ? params.from : undefined;
    const initialEmail = typeof params.email === 'string' ? params.email : undefined;
    if (initialMode === 'forgotPassword') {
      setMode('forgotPassword');
    }
    if (initialFrom === 'login') {
      setFromLogin(true);
    }
    if (initialEmail) {
      setResetEmail(initialEmail);
    }
  }, [params]);

  const detectCountryFromLocation = async (): Promise<string | null> => {
    try {
      setLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', "L'accès à la localisation est nécessaire pour détecter le pays.");
        return null;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const results = await Location.reverseGeocodeAsync({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      if (results && results.length > 0) {
        const first = results[0] as any;
        const detected = first?.country || first?.isoCountryCode || '';
        return detected || null;
      }
      return null;
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de détecter votre pays.');
      return null;
    } finally {
      setLocating(false);
    }
  };

  const handleToggleUseLocation = async (value: boolean) => {
    if (value) {
      const detected = await detectCountryFromLocation();
      if (!detected) {
        setUseLocationForCountry(false);
        return;
      }
      Alert.alert(
        'Confirmer',
        `Pays détecté: ${detected}. Voulez-vous utiliser ce pays ?`,
        [
          { text: 'Annuler', style: 'cancel', onPress: () => setUseLocationForCountry(false) },
          { text: 'Oui', style: 'default', onPress: () => { setCountry(detected); setUseLocationForCountry(true); } },
        ]
      );
    } else {
      setUseLocationForCountry(false);
    }
  };

  const handleSaveProfile = async () => {
    setEmailError('');
    setAgeError('');

    if (!email) {
      setEmailError('Email requis');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Format d'email invalide");
      return;
    }

    if (age) {
      const num = Number(age);
      if (Number.isNaN(num) || num <= 0 || num > 120) {
        setAgeError('Âge invalide');
        return;
      }
    }

    try {
      setLoading(true);
      const payload = { email, country, age };
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(payload));
      Alert.alert('Succès', 'Profil mis à jour localement.');
    } catch (e) {
      Alert.alert('Erreur', "Impossible d'enregistrer le profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setOldPasswordError('');
    setNewPasswordError('');
    setConfirmNewPasswordError('');

    if (!oldPassword) {
      setOldPasswordError('Ancien mot de passe requis');
      return;
    }

    if (!newPassword) {
      setNewPasswordError('Nouveau mot de passe requis');
      return;
    }

    if (!validatePassword(newPassword)) {
      setNewPasswordError('Mot de passe entre 4 et 30 caractères');
      return;
    }

    if (!confirmNewPassword) {
      setConfirmNewPasswordError('Confirmation requise');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    const user = FIREBASE_AUTH.currentUser;
    if (!user || !user.email) {
      Alert.alert('Erreur', 'Utilisateur non connecté.');
      return;
    }

    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      Alert.alert('Succès', 'Mot de passe mis à jour.');
      setMode('profile');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      const message = error?.message || '';
      if (message.includes('auth/wrong-password')) {
        setOldPasswordError('Ancien mot de passe incorrect');
      } else if (message.includes('weak-password')) {
        setNewPasswordError('Le mot de passe est trop faible');
      } else {
        Alert.alert('Erreur', 'Impossible de changer le mot de passe.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setResetEmailError('');

    if (!resetEmail) {
      setResetEmailError('Email requis');
      return;
    }
    if (!validateEmail(resetEmail)) {
      setResetEmailError("Format d'email invalide");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(FIREBASE_AUTH, resetEmail);
      Alert.alert('Succès', 'Email de réinitialisation envoyé.');
      setMode('changePassword');
    } catch (e) {
      Alert.alert('Erreur', 'Impossible d\'envoyer l\'email de réinitialisation.');
    } finally {
      setLoading(false);
    }
  };

  const renderProfile = () => (
    <>
      <Text style={[styles.title, { color: theme.colors.textPrimary, fontFamily: theme.fonts.heading }]}>Mon profil</Text>
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
          placeholder="Âge"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          error={ageError}
        />
        <View style={styles.countryRow}>
          <View style={styles.countryTextContainer}>
            <Text style={[styles.countryLabel, { color: theme.colors.textPrimary }]}>Pays</Text>
            <Text style={{ color: theme.colors.textSecondary }}>{country || 'Non détecté'}</Text>
          </View>
          <Switch
            value={useLocationForCountry}
            onValueChange={handleToggleUseLocation}
            disabled={locating}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton title={loading ? 'Enregistrement...' : 'Enregistrer'} onPress={handleSaveProfile} disabled={loading} />
        <LinkButton title={'Changer de mot de passe'} onPress={() => { setResetEmail(email); setMode('changePassword'); }} />
      </View>
    </>
  );

  const renderChangePassword = () => (
    <>
      <Text style={[styles.title, { color: theme.colors.textPrimary, fontFamily: theme.fonts.heading }]}>Changer le mot de passe</Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Ancien mot de passe"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
          autoComplete="password"
          error={oldPasswordError}
        />
        <Input
          placeholder="Nouveau mot de passe"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          autoComplete="password-new"
          error={newPasswordError}
        />
        <Input
          placeholder="Confirmer le nouveau mot de passe"
          secureTextEntry
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          autoComplete="password-new"
          error={confirmNewPasswordError}
        />
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton title={loading ? 'Mise à jour...' : 'Valider'} onPress={handleChangePassword} disabled={loading} />
        <LinkButton title={'Mot de passe oublié ?'} onPress={() => setMode('forgotPassword')} />
        <LinkButton title={'Retour au profil'} onPress={() => setMode('profile')} />
      </View>
    </>
  );

  const renderForgotPassword = () => (
    <>
      <Text style={[styles.title, { color: theme.colors.textPrimary, fontFamily: theme.fonts.heading }]}>Mot de passe oublié</Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          value={resetEmail}
          onChangeText={setResetEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={resetEmailError}
        />
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton title={loading ? 'Envoi...' : 'Envoyer le lien'} onPress={handleForgotPassword} disabled={loading} />
        {!fromLogin && (
          <LinkButton title={'Retour'} onPress={() => setMode('changePassword')} />
        )}
      </View>
    </>
  );

  return (
    <Screen>
      <Header showBackButton onBackPress={() => router.back()} />
      <View style={styles.container}>
        {mode === 'profile' && renderProfile()}
        {mode === 'changePassword' && renderChangePassword()}
        {mode === 'forgotPassword' && renderForgotPassword()}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    flexGrow: 1,
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
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  countryTextContainer: {
    flexShrink: 1,
    paddingRight: 12,
  },
  countryLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  buttonContainer: {
    textAlign: 'center',
    width: '100%',
    maxWidth: 300,
  },
}); 