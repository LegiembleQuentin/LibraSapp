import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../../../theme';
import { BookDto } from '../../../types/book';
import { useAuth } from '../../../hooks/useAuth';
import { apiClient } from '../../../services/api/client';
import Screen from '../../../components/ui/Screen';
import Header from '../../../components/ui/Header';

export default function BookDetails() {
  const { theme } = useTheme();
  const { jwtToken } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [book, setBook] = useState<BookDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && jwtToken) {
      fetchBookDetails();
    }
  }, [id, jwtToken]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const bookData = await apiClient.getBookDetails(parseInt(id), jwtToken!) as BookDto;
      setBook(bookData);
    } catch (err: any) {
      console.error('Erreur lors du chargement des détails du livre:', err);
      setError(err.message || 'Erreur lors du chargement des détails');
      Alert.alert('Erreur', 'Impossible de charger les détails du livre');
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  if (loading) {
    return (
      <Screen center>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={[styles.loadingText, { color: theme.colors.textPrimary }]}>
            Chargement des détails...
          </Text>
        </View>
      </Screen>
    );
  }

  if (error || !book) {
    return (
      <Screen>
        <Header showBackButton onBackPress={handleBackPress} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
            {error || 'Livre non trouvé'}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header showBackButton onBackPress={handleBackPress} />
      
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {book.names && book.names.length > 0 ? book.names[0] : 'Sans titre'}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Orbitron',
    textAlign: 'center',
    marginBottom: 20,
  },
});
