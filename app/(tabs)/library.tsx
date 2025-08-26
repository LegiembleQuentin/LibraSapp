import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../theme';
import { BookDto } from '../../types/book';
import { apiClient } from '../../services/api/client';
import Screen from '../../components/ui/Screen';
import Header from '../../components/ui/Header';
import BookCard from '../../components/ui/BookCard';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - 48) / 4; // 4 colonnes avec marges

export default function Library() {
  const { theme } = useTheme();
  const { jwtToken, isAuthenticated } = useAuth();
  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Charger la bibliothèque de l'utilisateur au montage du composant
    if (isAuthenticated && jwtToken) {
      fetchUserLibrary();
    }
  }, [isAuthenticated, jwtToken]);

  const fetchUserLibrary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.getUserBooks(jwtToken!) as BookDto[];
      setBooks(data);
    } catch (err: any) {
      console.error('Erreur lors du chargement de la bibliothèque:', err);
      setError(err.message || 'Erreur lors du chargement de la bibliothèque');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [jwtToken]);

  const handleBookPress = (book: BookDto) => {
    router.push({
      pathname: '/(tabs)/book-details/[id]',
      params: { id: book.id.toString() }
    });
  };

  if (!isAuthenticated || !jwtToken) {
    return (
      <Screen center>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
            Vous devez être connecté pour accéder à votre bibliothèque
          </Text>
        </View>
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen center>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={[styles.loadingText, { color: theme.colors.textPrimary }]}>
            Chargement de votre bibliothèque...
          </Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <Header showBackButton={false} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
            {error}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header showBackButton={true} title="Ma bibliothèque" onBackPress={() => router.back()}/>
      
      <ScrollView
        style={styles.booksContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksContent}
      >
        {books.length > 0 ? (
          <View style={styles.grid}>
            {books.map((book) => (
              <View key={book.id} style={styles.cardContainer}>
                <BookCard
                  book={book}
                  variant="compact"
                  onPress={handleBookPress}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              Votre bibliothèque est vide
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
              Ajoutez des livres depuis la page Discover
            </Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  booksContainer: {
    flex: 1,
  },
  booksContent: {
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    gap: 8,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginBottom: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
    fontFamily: 'Orbitron',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.7,
  },
});


