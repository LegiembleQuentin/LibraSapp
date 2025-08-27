import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { BookDto, Tag } from '../../types/book';
import TagFilter from '../ui/TagFilter';
import BookRow from '../ui/BookRow';
import { apiClient } from '../../services/api/client';
import { consumeLibraryChanges } from '../../utils/librarySync';

interface ByTagContentProps {
  jwtToken: string;
  onBookPress: (book: BookDto) => void;
}

export default function ByTagContent({ jwtToken, onBookPress }: ByTagContentProps) {
  const { theme } = useTheme();
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    // Charger tous les livres au montage (aucun tag sélectionné)
    fetchBooksByTags([]);
  }, []);

  useEffect(() => {
    // Charger les livres quand les tags sélectionnés changent
    // L'API gère le cas où aucun tag n'est sélectionné
    fetchBooksByTags(selectedTags);
  }, [selectedTags]);

  // Vérifier les changements de bibliothèque à chaque focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const checkLibraryChanges = async () => {
        if (books.length === 0) return;

        try {
          const changedBookIds = await consumeLibraryChanges();
          
          // Si des changements ont été détectés, recharger les livres
          if (changedBookIds.length > 0 && isActive) {
            await fetchBooksByTags(selectedTags);
          }
        } catch (error) {
          console.error('Erreur lors de la vérification des changements:', error);
        }
      };

      checkLibraryChanges();

      return () => {
        isActive = false;
      };
    }, [books.length, selectedTags])
  );

  const fetchTags = useCallback(async () => {
    try {
      const tagsData = await apiClient.getTags(jwtToken) as Tag[];
      setTags(tagsData);
    } catch (err: any) {
      console.error('Erreur lors du chargement des tags:', err);
      setError('Impossible de charger les tags');
    }
  }, [jwtToken]);

  const fetchBooksByTags = useCallback(async (selectedTags: Tag[]) => {
    try {
      setLoading(true);
      setError(null);

      let data: BookDto[];
      data = await apiClient.getBooksByTags(jwtToken, selectedTags) as BookDto[];

      setBooks(data);
    } catch (err: any) {
      console.error('Erreur API:', err);
      setError(err.message || 'Erreur lors du chargement des livres');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [jwtToken]);

  const handleTagSelect = useCallback((tag: Tag) => {
    setSelectedTags(prev => {
      if (prev.some(t => t.id === tag.id)) {
        return prev.filter(t => t.id !== tag.id);
      } else {
        return [...prev, tag];
      }
    });
  }, []);

  const handleLibraryChange = async (bookId: number, isInLibrary: boolean) => {
    // TODO: a supprimer
  };

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
      <TagFilter
        tags={tags}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={[styles.loadingText, { color: theme.colors.textPrimary }]}>
            Chargement des livres...
          </Text>
        </View>
      )}

      {books.length > 0 && !loading && (
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
                    {selectedTags.length > 0 
                      ? `Aucun livre trouvé pour les tags sélectionnés`
                      : 'Aucun livre disponible pour le moment'
                    }
                  </Text>
                </View>
              )}
            </ScrollView>
      )}
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
