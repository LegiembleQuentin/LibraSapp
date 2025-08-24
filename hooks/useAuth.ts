import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { authService } from '../services/auth/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Récupérer le token JWT si l'utilisateur est connecté
        const token = await authService.getJwtToken();
        setJwtToken(token);
      } else {
        setJwtToken(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAuthenticated = !loading && user !== null && jwtToken !== null;

  return {
    user,
    jwtToken,
    loading,
    isAuthenticated,
  };
};
