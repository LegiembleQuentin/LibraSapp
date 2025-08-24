import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { View, Text, ActivityIndicator } from "react-native";

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (user) {
    // L'utilisateur est connecté, rediriger vers l'accueil
    return <Redirect href={"/home" as any} />;
  } else {
    // L'utilisateur n'est pas connecté, rediriger vers la connexion
    return <Redirect href={"/(auth)/Login" as any} />;
  }
}
