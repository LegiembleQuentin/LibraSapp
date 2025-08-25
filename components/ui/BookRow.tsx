import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
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
    // TODO: Ajouter la note depuis l'API quand elle sera disponible
    return '9.98'; // Placeholder pour l'instant
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
            <View style={styles.ratingIcon}>
              {/* TODO: Ajouter l'icône de note */}
            </View>
          </View>
        </View>

        <Text style={styles.volumes}>{getVolumeText()}</Text>
        <Text style={styles.status}>{getStatusText(book.isCompleted || false)}</Text>
        
        <Text style={styles.description} numberOfLines={3}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    marginBottom: 8,
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
  ratingIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#FFE815',
    borderRadius: 2,
  },
  volumes: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
    fontFamily: 'Rubik',
  },
  status: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
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
