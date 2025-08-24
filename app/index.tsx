import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../hooks/useAuth";

export default function Index() {
  const { user, jwtToken, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        // L'utilisateur est connecté avec Firebase ET a un token JWT valide
        console.log('🔄 Redirection vers /home');
        router.replace("/home");
      } else {
        // L'utilisateur n'est pas connecté ou n'a pas de token JWT valide
        console.log('🔄 Redirection vers /(auth)/Login');
        router.replace("/(auth)/Login");
      }
    }
  }, [loading, isAuthenticated]);

  // Écran de chargement pendant la vérification de l'authentification
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <ActivityIndicator size="large" color="#FFE815" />
      <Text style={{ color: '#FFF', marginTop: 10 }}>Chargement...</Text>
    </View>
  );
}
