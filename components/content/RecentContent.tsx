import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { BookDto } from '../../types/book';
import BookRow from '../ui/BookRow';
import { apiClient } from '../../services/api/client';
import { consumeLibraryChanges } from '../../utils/librarySync';

interface RecentContentProps {
  jwtToken: string;
  onBookPress: (book: BookDto) => void;
}

export default function RecentContent({ jwtToken, onBookPress }: RecentContentProps) {
  const { theme } = useTheme();
  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const run = async () => {
        try {
          // Vérifier s'il y a eu des changements dans la bibliothèque
          const changedBookIds = await consumeLibraryChanges();
          
          // Si des changements ont été détectés ou pas de livres, recharger
          if (changedBookIds.length > 0 || books.length === 0) {
            if (isActive) {
              await fetchRecentBooks();
            }
          }
        } catch (error) {
          console.error('Erreur lors de la vérification des changements:', error);
          // En cas d'erreur, charger les livres par sécurité
          if (isActive && books.length === 0) {
            await fetchRecentBooks();
          }
        }
      };

      run();

      return () => {
        isActive = false;
      };
    }, [books.length])
  );

  const fetchRecentBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.getRecentBooks(jwtToken) as BookDto[];
      setBooks(data);
    } catch (err: any) {
      console.error('Erreur lors du chargement des livres récents:', err);
      setError(err.message || 'Erreur lors du chargement des livres récents');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [jwtToken]);

  const handleLibraryChange = async (bookId: number, isInLibrary: boolean) => {
    // Cette fonction sera appelée par BookRow quand l'utilisateur change le statut de la bibliothèque
    // Les données seront automatiquement rechargées via useFocusEffect
    console.log(`Livre ${bookId} ${isInLibrary ? 'ajouté à' : 'retiré de'} la bibliothèque`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={[styles.loadingText, { color: theme.colors.textPrimary }]}>
          Chargement des livres récents...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.booksContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksContent}
      >
        {books.length > 0 ? (
          books.map((book) => (
            <BookRow
              key={book.id}
              book={book}
              onPress={onBookPress}
              onLibraryChange={handleLibraryChange}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              Aucun livre récent disponible pour le moment
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  booksContainer: {
    flex: 1,
  },
  booksContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
