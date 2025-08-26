import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { BookDto } from '../../types/book';
import { apiClient } from '../../services/api/client';
import { useAuth } from '../../hooks/useAuth';
import { markLibraryChanged } from '../../utils/librarySync';

interface BookRowProps {
  book: BookDto;
  onPress?: (book: BookDto) => void;
  onLibraryChange?: (bookId: number, isInLibrary: boolean) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const COVER_WIDTH = 80;
const COVER_HEIGHT = 120;

export default function BookRow({ book, onPress, onLibraryChange }: BookRowProps) {
  const { theme } = useTheme();
  const { jwtToken } = useAuth();

  const getStatusText = (isCompleted: boolean) => {
    return isCompleted ? 'Complété' : 'En cours';
  };

  const getVolumeText = () => {
    if (book.userCurrentVolume && book.userCurrentVolume > 0) {
      return `${book.userCurrentVolume} / ${book.nbVolume} vol`;
    }
    return `${book.nbVolume} vol`;
  };

  const getTitle = () => {
    return book.names && book.names.length > 0 ? book.names[0] : 'Sans titre';
  };

  const getRating = () => {
    if (book.note) {
      return book.note.toFixed(2);
    }
    return 'N/A';
  };

  const handleLibraryToggle = async () => {
    if (!jwtToken) return;
    
    try {
      await apiClient.switchInUserLibrary(book.id, jwtToken);
      
      // Marquer le changement pour la synchronisation
      await markLibraryChanged(book.id);
      
      // Mettre à jour l'état local immédiatement pour une réponse UI instantanée
      if (onLibraryChange) {
        onLibraryChange(book.id, !book.isInUserLibrary);
      }
    } catch (error) {
      console.error('Erreur lors du switch de la bibliothèque:', error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(book)}
      activeOpacity={0.8}
    >
      {/* Couverture du livre */}
      <Image
        source={{ uri: book.imgUrl }}
        style={styles.cover}
        resizeMode="cover"
      />

      {/* Informations du livre */}
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {getTitle()}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{getRating()}</Text>
            <TouchableOpacity 
              onPress={handleLibraryToggle}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              style={styles.bookIconContainer}
            >
              <Ionicons 
                name={book.isInUserLibrary ? 'book' : 'book-outline'} 
                size={16} 
                color="#FFE815" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.volumes}>{getVolumeText()}</Text>
        <Text style={styles.status}>{getStatusText(book.isCompleted || false)}</Text>
        
        <Text style={styles.description} numberOfLines={3}>
          {book.synopsis || 'Aucune description disponible'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingVertical: 8,
    marginHorizontal: 10,
  },
  cover: {
    width: COVER_WIDTH,
    height: COVER_HEIGHT,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Orbitron',
    flex: 1,
    marginRight: 12,
    lineHeight: 22,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFE815',
    fontFamily: 'Orbitron',
  },
  bookIconContainer: {
    padding: 2,
  },

  volumes: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 0,
    fontFamily: 'Rubik',
  },
  status: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 2,
    fontFamily: 'Rubik',
  },
  description: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.7,
    lineHeight: 18,
    fontFamily: 'Rubik',
  },
});
