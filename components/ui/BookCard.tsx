import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../theme';
import { BookDto } from '../../types/book';

interface BookCardProps {
  book: BookDto;
  variant?: 'default' | 'featured' | 'compact';
  onPress?: (book: BookDto) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function BookCard({ book, variant = 'default', onPress }: BookCardProps) {
  const { theme } = useTheme();

  const handlePress = () => {
    onPress?.(book);
  };

  const getStatusText = (isCompleted: boolean) => {
    return isCompleted ? 'Complété' : 'En cours';
  };

  const getStatusColor = () => {
    return '#FFFFFF';
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

  if (variant === 'featured') {
    return (
      <TouchableOpacity
        style={[styles.featuredCard]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: book.imgUrl }}
          style={styles.featuredCover}
          resizeMode="cover"
        />
        <View style={styles.featuredOverlay}>
          <View style={styles.featuredInfo}>
            <Text style={[styles.featuredTitle, { color: theme.colors.textPrimary }]}>
              {getTitle()}
            </Text>
            <Text style={[styles.featuredVolumes, { color: theme.colors.textSecondary }]}>
              {getVolumeText()}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{getStatusText(book.completed || false)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'compact') {
    return (
      <TouchableOpacity
        style={styles.compactCard}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: book.imgUrl }}
          style={styles.compactCover}
          resizeMode="cover"
        />
        <View style={styles.compactInfo}>
          <Text style={[styles.compactTitle, { color: theme.colors.textPrimary }]} numberOfLines={2}>
            {getTitle()}
          </Text>
          <Text style={[styles.compactVolumes, { color: theme.colors.textSecondary }]}>
            {getVolumeText()}
          </Text>
          <Text style={[styles.compactStatus, { color: getStatusColor() }]}>
            {getStatusText(book.completed || false)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.defaultCard]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: book.imgUrl }}
        style={styles.defaultCover}
        resizeMode="cover"
      />
      <View style={styles.defaultInfo}>
        <Text style={[styles.defaultTitle, { color: theme.colors.textPrimary }]} numberOfLines={2}>
          {getTitle()}
        </Text>
        <Text style={[styles.defaultVolumes, { color: theme.colors.textSecondary }]}>
          {getVolumeText()}
        </Text>
        <Text style={[styles.compactStatus, { color: getStatusColor() }]}>
          {getStatusText(book.completed || false)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  featuredCard: {
    width: screenWidth - 32,
    height: 200,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredCover: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  featuredInfo: {
    alignItems: 'flex-start',
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuredVolumes: {
    fontSize: 16,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  compactCard: {
    width: 78,
    marginRight: 8,
    alignItems: 'center',
  },
  compactCover: {
    width: 78,
    height: 118,
    borderRadius: 6,
    marginBottom: 8,
  },
  compactInfo: {
    alignItems: 'flex-start',
    width: '100%',
  },
  compactTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 2,
    lineHeight: 18,
  },
  compactVolumes: {
    fontSize: 10,
    marginBottom: 1,
    textAlign: 'left',
  },
  compactStatus: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'left',
  },
  defaultCard: {
    width: 90,
    marginRight: 8,
    alignItems: 'center',
  },
  defaultCover: {
    width: 90,
    height: 130,
    borderRadius: 6,
    marginBottom: 12,
  },
  defaultInfo: {
    alignItems: 'flex-start',
    width: '100%',
  },
  defaultTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 6,
    lineHeight: 20,
  },
  defaultVolumes: {
    fontSize: 14,
    marginBottom: 6,
    textAlign: 'left',
  },
});
