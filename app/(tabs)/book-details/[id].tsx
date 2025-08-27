import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../../../theme';
import { BookDto } from '../../../types/book';
import { useAuth } from '../../../hooks/useAuth';
import { apiClient } from '../../../services/api/client';
import Screen from '../../../components/ui/Screen';
import Header from '../../../components/ui/Header';
import BookCoverAndMetadata from '../../../components/content/BookCoverAndMetadata';
import BookTags from '../../../components/content/BookTags';
import BookSynopsis from '../../../components/content/BookSynopsis';
import HorizontalBookList from '../../../components/ui/HorizontalBookList';
import SectionHeader from '../../../components/ui/SectionHeader';

export default function BookDetails() {
  const { theme } = useTheme();
  const { jwtToken } = useAuth();
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const [book, setBook] = useState<BookDto | null>(null);
  const [isInLibrary, setIsInLibrary] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
  
      const run = async () => {
        if (!id || !jwtToken) return;
  
        try {
          setLoading(true);
          setError(null);
  
          const bookData = await apiClient.getBookDetails(parseInt(id as string, 10), jwtToken) as BookDto;
  
          if (!isActive) return;
          setBook(bookData);
  
          const inLib = Boolean(bookData.userStatus || bookData.userCurrentVolume);
          setIsInLibrary(inLib);
        } catch (err: any) {
          if (!isActive) return;
          console.error('Erreur lors du chargement des détails du livre:', err);
          setError(err.message || 'Erreur lors du chargement des détails');
          Alert.alert('Erreur', 'Impossible de charger les détails du livre');
        } finally {
          if (isActive) setLoading(false);
        }
      };
  
      run();
  
      return () => {
        isActive = false;
      };
    }, [id, jwtToken])
  );
  

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const bookData = await apiClient.getBookDetails(parseInt(id), jwtToken!) as BookDto;
      const inLib = !!(bookData.userStatus || bookData.userCurrentVolume || 0);
      setIsInLibrary(!!inLib);
    } catch (err: any) {
      console.error('Erreur lors du chargement des détails du livre:', err);
      setError(err.message || 'Erreur lors du chargement des détails');
      Alert.alert('Erreur', 'Impossible de charger les détails du livre');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLibrary = async (bookId: number) => {
    if (!jwtToken) return;
    try {
      await apiClient.switchInUserLibrary(bookId, jwtToken);
      setIsInLibrary(prev => !prev);
    } catch (e) {
      
    }
  };

  const handleBackPress = () => {
    if (from) {
      switch (from) {
        case 'discover':
          router.replace('/(tabs)/discover');
          break;
        case 'library':
          router.replace('/(tabs)/library');
          break;
        case 'search':
          router.replace('/(tabs)/search');
          break;
        default:
          router.replace('/(tabs)/discover');
      }
    } else {
      router.replace('/(tabs)/discover');
    }
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
        <Header showBackButton title="Erreur" onBackPress={handleBackPress} />
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
      <Header 
        showBackButton 
        onBackPress={handleBackPress}
        title={book.names && book.names.length > 0 ? book.names[0] : 'Sans titre'}
      />
      
      <View style={styles.container}>
        <BookCoverAndMetadata book={book} isInLibrary={isInLibrary} onToggleLibrary={handleToggleLibrary} />
        <BookTags book={book} />
        <BookSynopsis book={book} />
        
        {book.sameAuthorBooks&& (
          <View style={styles.section}>
            <SectionHeader title="Du même auteur" />
            <HorizontalBookList 
              books={Array.from(book.sameAuthorBooks)} 
              onBookPress={(book) => router.push({
                pathname: '/(tabs)/book-details/[id]',
                params: { id: book.id.toString(), from: 'book-details' }
              })}
            />
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    marginTop: 10,
    marginBottom: 40,
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
