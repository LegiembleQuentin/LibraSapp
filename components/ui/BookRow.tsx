import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { BookDto } from '../../types/book';

interface BookRowProps {
  book: BookDto;
  onPress?: (book: BookDto) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const COVER_WIDTH = 80;
const COVER_HEIGHT = 120;

export default function BookRow({ book, onPress }: BookRowProps) {
  const { theme } = useTheme();

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
            <Ionicons name="book" size={16} color="#FFE815" />
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
