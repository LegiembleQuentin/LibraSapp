import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { apiClient } from '../api/client';
import { LoginUserDto, RegisterUserDto, LoginResponseDto } from '../api/types';

const JWT_TOKEN_KEY = '@libras_jwt_token';
const JWT_EXPIRES_KEY = '@libras_jwt_expires';
const USER_PROFILE_KEY = '@libras_user_profile';

export class AuthService {
  // Connexion hybride : Firebase + API
  async login(email: string, password: string): Promise<{ firebaseUser: any; apiToken: string }> {
    try {
      // 1. Authentification Firebase
      const firebaseCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const firebaseUser = firebaseCredential.user;

      // 2. Authentification API avec JWT
      const loginData: LoginUserDto = { email, password };
      const apiResponse: LoginResponseDto = await apiClient.login(loginData);

      // 3. Stocker le token JWT
      await this.storeJwtToken(apiResponse.token, apiResponse.expiresIn);

      // 4. Stocker l'email utilisateur (local)
      await this.storeUserEmail(email);

      return {
        firebaseUser,
        apiToken: apiResponse.token,
      };
    } catch (error) {
      console.error('Erreur de connexion hybride:', error);
      throw error;
    }
  }

  // Inscription hybride : Firebase + API
  async register(email: string, password: string, displayname: string): Promise<{ firebaseUser: any; apiToken: string }> {
    try {
      // 1. Créer compte Firebase
      const firebaseCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const firebaseUser = firebaseCredential.user;

      // 2. Créer compte API avec JWT
      const registerData: RegisterUserDto = { email, password, displayname };
      const apiResponse: LoginResponseDto = await apiClient.signup(registerData);

      // 3. Stocker le token JWT
      await this.storeJwtToken(apiResponse.token, apiResponse.expiresIn);

      // 4. Stocker l'email utilisateur (local)
      await this.storeUserEmail(email);

      return {
        firebaseUser,
        apiToken: apiResponse.token,
      };
    } catch (error) {
      console.error('Erreur d\'inscription hybride:', error);
      // Si l'API échoue mais Firebase réussit, on nettoie Firebase
      if (FIREBASE_AUTH.currentUser) {
        await signOut(FIREBASE_AUTH);
      }
      throw error;
    }
  }

  // Déconnexion hybride
  async logout(): Promise<void> {
    try {
      // 1. Déconnexion Firebase
      await signOut(FIREBASE_AUTH);
      
      // 2. Supprimer le token JWT
      await this.removeJwtToken();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw error;
    }
  }

  // Gestion du token JWT
  private async storeJwtToken(token: string, expiresIn: number): Promise<void> {
    const expirationTime = Date.now() + expiresIn;
    await AsyncStorage.multiSet([
      [JWT_TOKEN_KEY, token],
      [JWT_EXPIRES_KEY, expirationTime.toString()],
    ]);
  }

  // Sauvegarde (ou mise à jour) de l'email utilisateur dans le profil local
  private async storeUserEmail(email: string): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(USER_PROFILE_KEY);
      const existing = raw ? JSON.parse(raw) : {};
      const updated = { ...existing, email };
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
    } catch (e) {
      // En cas d'erreur de stockage, on ne bloque pas le flux d'authentification
      console.warn('Impossible de stocker l\'email utilisateur localement');
    }
  }

  async getJwtToken(): Promise<string | null> {
    try {
      const [[, token], [, expires]] = await AsyncStorage.multiGet([
        JWT_TOKEN_KEY,
        JWT_EXPIRES_KEY,
      ]);

      if (!token || !expires) {
        return null;
      }

      // Vérifier l'expiration
      const expirationTime = parseInt(expires, 10);
      if (Date.now() >= expirationTime) {
        await this.removeJwtToken();
        return null;
      }

      return token;
    } catch (error) {
      console.error('Erreur lors de la récupération du token JWT:', error);
      return null;
    }
  }

  private async removeJwtToken(): Promise<void> {
    await AsyncStorage.multiRemove([JWT_TOKEN_KEY, JWT_EXPIRES_KEY]);
  }

  // Vérifier si l'utilisateur est connecté (Firebase + JWT valide)
  async isAuthenticated(): Promise<boolean> {
    const firebaseUser = FIREBASE_AUTH.currentUser;
    const jwtToken = await this.getJwtToken();
    return !!(firebaseUser && jwtToken);
  }
}

export const authService = new AuthService();
