import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { BookDto } from '../../types/book';

const { width: screenWidth } = Dimensions.get('window');
const COVER_WIDTH = (screenWidth - 48) * 0.5;
const COVER_HEIGHT = COVER_WIDTH * 1.412;

interface BookCoverAndMetadataProps {
  book: BookDto;
}

export default function BookCoverAndMetadata({ book }: BookCoverAndMetadataProps) {
  const { theme } = useTheme();

  const getTitle = () => {
    return book.names && book.names.length > 0 ? book.names[0] : 'Sans titre';
  };

  const getAuthor = () => {
    if (book.authors && book.authors.length > 0) {
      return Array.from(book.authors).map((author: any) => author.name).join(', ');
    }
    return 'Auteur inconnu';
  };

  const getPublicationYears = () => {
    if (book.dateStart) {
      const startYear = new Date(book.dateStart).getFullYear();
      if (book.dateEnd) {
        const endYear = new Date(book.dateEnd).getFullYear();
        return `${startYear} - ${endYear}`;
      }
      return startYear.toString();
    }
    return 'Année inconnue';
  };

  const getGlobalRating = () => {
    return book.note ? book.note.toFixed(2) : 'N/A';
  };

  const getUserStatus = () => {
    if (book.userStatus) {
      switch (book.userStatus) {
        case 'COMPLETED':
          return 'Complété';
        case 'IN_PROGRESS':
          return 'En cours';
        case 'PLANNED':
          return 'Prévu';
        case 'DROPPED':
          return 'Abandonné';
        default:
          return 'Non défini';
      }
    }
    return book.isCompleted ? 'Complété' : 'Non défini';
  };

  return (
    <View style={styles.container}>
      {/* Couverture du livre */}
      <View style={styles.coverContainer}>
        <Image 
          source={{ uri: book.imgUrl }} 
          style={styles.cover}
          resizeMode="cover"
        />
      </View>

      {/* Métadonnées */}
      <View style={styles.metadataContainer}>
        {/* Ligne: Label + icône */}
        <View style={styles.topRow}>
          <Text style={[styles.topLabel, { color: theme.colors.white }]}>Vous correspond à :</Text>
          <Ionicons name="book" size={28} color={theme.colors.accent} />
        </View>
        {/* Valeur en dessous en grand */}
        <Text style={[styles.matchValue, { color: theme.colors.accent }]}>
          {book.userMatch ? `${book.userMatch}%` : 'N/A'}
        </Text>

        {/* Ma note / Status / Volume actuel */}
        <View style={styles.rowItem}>
          <Text style={[styles.rowLabel, { color: theme.colors.white }]}>Ma note :</Text>
          <View style={styles.rowValue}>
            <Text style={[styles.rowValueText, { color: theme.colors.accent }]}>{book.userRating || '-'}</Text>
          </View>
        </View>
        <View style={styles.rowItem}>
          <Text style={[styles.rowLabel, { color: theme.colors.white }]}>Status :</Text>
          <View style={styles.rowValue}>
            <Text style={[styles.rowValueText, { color: theme.colors.accent }]}>{getUserStatus()}</Text>
          </View>
        </View>
        <View style={styles.rowItem}>
          <Text style={[styles.rowLabel, { color: theme.colors.white }]}>Volume actuel :</Text>
          <View style={styles.rowValue}>
            <Text style={[styles.rowValueText, { color: theme.colors.accent }]}>{book.userCurrentVolume || '-'}</Text>
          </View>
        </View>

        {/* Séparateur fin de bloc */}
        <View style={[styles.separator, { borderColor: 'rgba(255,255,255,0.3)' }]} />

        {/* Note globale alignée à gauche, votes à droite */}
        <View style={styles.ratingRow}>
          <Text style={[styles.globalRating, { color: theme.colors.accent }]}>{getGlobalRating()}</Text>
          <Text style={[styles.voteCount, { color: theme.colors.white }]}>(56 256 votes)</Text>
        </View>

        {/* Auteur, années, volumes */}
        <Text style={[styles.author, { color: theme.colors.white }]}>{getAuthor()}</Text>
        <Text style={[styles.publicationYears, { color: theme.colors.white }]}>{getPublicationYears()}</Text>
        <Text style={[styles.volumes, { color: theme.colors.white }]}>{book.nbVolume} vol</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 6,
    marginBottom: 24,
  },
  coverContainer: {
    marginRight: 6,
  },
  cover: {
    width: COVER_WIDTH,
    height: COVER_HEIGHT,
  },
  metadataContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topLabel: {
    fontSize: 14,
    fontFamily: 'Rubik',
    fontWeight: '500',
  },
  matchValue: {
    fontSize: 14,
    fontFamily: 'Orbitron',
    marginBottom: 10,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  rowLabel: {
    fontSize: 14,
    fontFamily: 'Rubik',
  },
  rowValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValueText: {
    fontSize: 14,
    fontFamily: 'Orbitron',
  },
  separator: {
    borderBottomWidth: 1,
    marginTop: 6,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  globalRating: {
    fontSize: 16,
    fontFamily: 'Orbitron',
  },
  voteCount: {
    fontSize: 10,
    fontFamily: 'Rubik',
    marginLeft: 8,
  },
  author: {
    fontSize: 12,
    fontFamily: 'Rubik',
    marginBottom: 2,
  },
  publicationYears: {
    fontSize: 12,
    fontFamily: 'Rubik',
    marginBottom: 2,
  },
  volumes: {
    fontSize: 12,
    fontFamily: 'Rubik',
  },
});
