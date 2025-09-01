import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { BookDto } from '../../types/book';
import { apiClient } from '../../services/api/client';
import { useAuth } from '../../hooks/useAuth';
import { markLibraryChanged, consumeLibraryChanges } from '../../utils/librarySync';
import { useFocusEffect } from '@react-navigation/native';
import Screen from '../../components/ui/Screen';
import BookCard from '../../components/ui/BookCard';
import BookRow from '../../components/ui/BookRow';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - 48) / 4; // 4 colonnes avec marges

export default function Search() {
  const { theme } = useTheme();
  const { jwtToken, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<BookDto[]>([]);
  const [libraryIds, setLibraryIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.trim() && isAuthenticated && jwtToken) {
      performSearch(debouncedQuery);
    } else if (!debouncedQuery.trim()) {
      setBooks([]);
      setError(null);
    }
  }, [debouncedQuery, isAuthenticated, jwtToken]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const checkLibraryChanges = async () => {
        if (!isAuthenticated || !jwtToken || books.length === 0) return;

        try {
          const changedBookIds = await consumeLibraryChanges();
          
          if (changedBookIds.length > 0 && isActive) {
            await performSearch(debouncedQuery);
          }
        } catch (error) {
          console.error('Erreur lors de la vérification des changements:', error);
        }
      };

      checkLibraryChanges();

      return () => {
        isActive = false;
      };
    }, [isAuthenticated, jwtToken, books.length, debouncedQuery])
  );

  const performSearch = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.searchBooks(query, jwtToken!) as BookDto[];
      setBooks(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la recherche');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [jwtToken]);

  const handleBookPress = (book: BookDto) => {
    router.push({
      pathname: '/(tabs)/book-details/[id]',
      params: { id: book.id.toString(), from: 'search' }
    });
  };

  const handleLibraryChange = async (bookId: number, isInLibrary: boolean) => {
    try {
      await markLibraryChanged(bookId);
      
      setLibraryIds(prev => {
        const next = new Set(prev);
        if (isInLibrary) {
          next.add(bookId);
        } else {
          next.delete(bookId);
        }
        return next;
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la bibliothèque:', error);
    }
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  if (!isAuthenticated || !jwtToken) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
            Vous devez être connecté pour effectuer une recherche
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { 
              backgroundColor: theme.colors.white,
              color: 'black' 
            }]}
            placeholder="Rechercher un livre..."
            placeholderTextColor="rgba(0, 0, 0, 0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <View style={styles.viewToggleContainer}>
            <TouchableOpacity
              style={[
                styles.viewToggleButton,
                viewMode === 'grid' && styles.viewToggleButtonActive
              ]}
              onPress={() => setViewMode('grid')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="grid-outline"
                size={20}
                color={viewMode === 'grid' ? theme.colors.accent : theme.colors.white}
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.viewToggleButton,
                viewMode === 'list' && styles.viewToggleButtonActive
              ]}
              onPress={() => setViewMode('list')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="list-outline"
                size={20}
                color={viewMode === 'list' ? theme.colors.accent : theme.colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.accent} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Recherche en cours...
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
              {error}
            </Text>
          </View>
        )}

        {!loading && !error && searchQuery.trim() && books.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              Aucun livre trouvé pour "{searchQuery}"
            </Text>
          </View>
        )}

        {!loading && !error && books.length > 0 && (
          <ScrollView 
            style={styles.booksContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.booksContent}
          >
            {viewMode === 'grid' ? (
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
              <View style={styles.list}>
                                     {books.map((book) => (
                       <BookRow
                         key={book.id}
                         book={book}
                         onPress={handleBookPress}
                         onLibraryChange={handleLibraryChange}
                       />
                     ))}
              </View>
            )}
          </ScrollView>
        )}

        {!loading && !error && !searchQuery.trim() && (
          <View style={styles.initialContainer}>
            <Text style={[styles.initialText, { color: theme.colors.textSecondary }]}>
              Commencez à taper pour rechercher des livres
            </Text>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 30,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: 'Rubik',
    shadowColor: '#FFE815',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  viewToggleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  viewToggleButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewToggleButtonActive: {
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Rubik',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Rubik',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Rubik',
    textAlign: 'center',
  },
  initialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    fontSize: 16,
    fontFamily: 'Rubik',
    textAlign: 'center',
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
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    gap: 32,
  },
  cardContainer: {
    width: CARD_WIDTH,
    alignItems: 'center',
  },
  list: {
    gap: 16,
  },
});


