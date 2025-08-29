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
import BookEditModal, { BookEditData, BookStatus } from '../../../components/ui/BookEditModal';

export default function BookDetails() {
  const { theme } = useTheme();
  const { jwtToken } = useAuth();
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const [book, setBook] = useState<BookDto | null>(null);
  const [isInLibrary, setIsInLibrary] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookEditModalVisible, setIsBookEditModalVisible] = useState(false);
  const [bookEditData, setBookEditData] = useState<BookEditData | null>(null);
  const [hasModifications, setHasModifications] = useState(false);
  const [modifiedBook, setModifiedBook] = useState<BookDto | null>(null);

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

  const openRatingModal = () => {
    if (!book) return;
    setBookEditData({
      type: 'rating',
      value: book.userRating || 0
    });
    setIsBookEditModalVisible(true);
  };

  const openStatusModal = () => {
    if (!book) return;
    setBookEditData({
      type: 'status',
      value: (book.userStatus as BookStatus) || 'TO_READ'
    });
    setIsBookEditModalVisible(true);
  };

  const openVolumeModal = () => {
    if (!book) return;
    setBookEditData({
      type: 'volume',
      value: book.userCurrentVolume || 0
    });
    setIsBookEditModalVisible(true);
  };

  const handleBookEditSave = (data: BookEditData) => {
    if (!book) return;

    let hasChanged = false;
    
    switch (data.type) {
      case 'rating':
        hasChanged = book.userRating !== data.value;
        break;
      case 'status':
        hasChanged = book.userStatus !== data.value;
        break;
      case 'volume':
        hasChanged = book.userCurrentVolume !== data.value;
        break;
    }

    if (!hasChanged) {
      return;
    }

    const updatedBook = { ...book };
    
    switch (data.type) {
      case 'rating':
        updatedBook.userRating = data.value as number;
        break;
      case 'status':
        updatedBook.userStatus = data.value as BookStatus;
        break;
      case 'volume':
        updatedBook.userCurrentVolume = data.value as number;
        break;
    }

    setModifiedBook(updatedBook);
    setHasModifications(true);
  };

  const closeBookEditModal = () => {
    setIsBookEditModalVisible(false);
    setBookEditData(null);
  };

  // Sauvegarder les modifications avant de quitter la page
  const saveModificationsBeforeLeaving = async () => {
    console.log('🔍 Vérification des modifications:', { hasModifications, modifiedBook: !!modifiedBook, jwtToken: !!jwtToken });
    
    if (!hasModifications || !modifiedBook || !jwtToken) {
      console.log('❌ Pas de modifications à sauvegarder');
      return;
    }

    // Vérifier si le livre a vraiment changé par rapport à l'original
    const hasRealChanges = 
      book?.userRating !== modifiedBook.userRating ||
      book?.userStatus !== modifiedBook.userStatus ||
      book?.userCurrentVolume !== modifiedBook.userCurrentVolume;

    if (!hasRealChanges) {
      console.log('❌ Aucun changement réel détecté');
      return;
    }

    console.log('✅ Sauvegarde des modifications:', {
      original: {
        rating: book?.userRating,
        status: book?.userStatus,
        volume: book?.userCurrentVolume
      },
      modified: {
        rating: modifiedBook.userRating,
        status: modifiedBook.userStatus,
        volume: modifiedBook.userCurrentVolume
      }
    });

    try {
      // Appel API en arrière-plan (ne pas attendre la réponse)
      apiClient.updateBook(modifiedBook, jwtToken).catch((error: any) => {
        console.error('❌ Erreur lors de la sauvegarde des modifications:', error);
      });
      console.log('🚀 Appel API de mise à jour envoyé');
    } catch (error: any) {
      console.error('❌ Erreur lors de la sauvegarde des modifications:', error);
    }
  };

  // Modifier handleBackPress pour sauvegarder avant de partir
  const handleBackPress = async () => {
    await saveModificationsBeforeLeaving();
    
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
        <BookCoverAndMetadata 
          book={book} 
          isInLibrary={isInLibrary} 
          onToggleLibrary={handleToggleLibrary}
          onEditRating={openRatingModal}
          onEditStatus={openStatusModal}
          onEditVolume={openVolumeModal}
        />
        <BookTags book={book} />
        <BookSynopsis book={book} />
        
        {book.sameAuthorBooks && book.sameAuthorBooks.size > 0 && (
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
      
      {bookEditData && (
        <BookEditModal
          visible={isBookEditModalVisible}
          onClose={closeBookEditModal}
          onSave={handleBookEditSave}
          type={bookEditData.type}
          currentValue={bookEditData.value}
          maxVolume={book.nbVolume}
        />
      )}
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
