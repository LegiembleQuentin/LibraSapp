import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme';
import { BookDto, Tag } from '../../types/book';
import TagFilter from '../ui/TagFilter';
import BookRow from '../ui/BookRow';
import { apiClient } from '../../services/api/client';

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
    // Charger les tags au montage du composant
    fetchTags();
  }, []);

  useEffect(() => {
    // Charger les livres quand les tags sélectionnés changent
    if (selectedTags.length > 0) {
      fetchBooksByTags(selectedTags);
    } else {
      // Charger tous les livres si aucun tag n'est sélectionné
      fetchBooksByTags([]);
    }
  }, [selectedTags]);

  const fetchTags = async () => {
    try {
      const tagsData = await apiClient.getTags(jwtToken) as Tag[];
      setTags(tagsData);
    } catch (err: any) {
      console.error('Erreur lors du chargement des tags:', err);
      setError('Impossible de charger les tags');
    }
  };

  const fetchBooksByTags = async (selectedTags: Tag[]) => {
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
  };

  const handleTagSelect = (tag: Tag) => {
    setSelectedTags(prev => {
      if (prev.some(t => t.id === tag.id)) {
        // Retirer le tag s'il est déjà sélectionné
        return prev.filter(t => t.id !== tag.id);
      } else {
        // Ajouter le tag
        return [...prev, tag];
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={[styles.loadingText, { color: theme.colors.textPrimary }]}>
          Chargement des livres...
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
      {/* Filtre par tags */}
      <TagFilter
        tags={tags}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
      />

      {/* Liste des livres */}
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
