import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../theme';

interface BookDto {
  id: number;
  names: string[];
  imgUrl: string;
  nbVolume: number;
  userCurrentVolume?: number;
  userStatus?: string;
  authors?: any[];
}

interface BookCardProps {
  book: BookDto;
  variant?: 'default' | 'featured' | 'compact';
  onPress?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function BookCard({ book, variant = 'default', onPress }: BookCardProps) {
  const { theme } = useTheme();

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Complété';
      case 'IN_PROGRESS':
        return 'En cours';
      case 'NOT_STARTED':
        return 'Non commencé';
      default:
        return status || 'Non commencé';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return '#4CAF50';
      case 'IN_PROGRESS':
        return '#FF9800';
      case 'NOT_STARTED':
        return '#9E9E9E';
      default:
        return theme.colors.textSecondary;
    }
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
        style={[styles.featuredCard, { backgroundColor: theme.colors.card }]}
        onPress={onPress}
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
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(book.userStatus || '') }]}>
              <Text style={styles.statusText}>{getStatusText(book.userStatus || '')}</Text>
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
        onPress={onPress}
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
          <Text style={[styles.compactStatus, { color: getStatusColor(book.userStatus || '') }]}>
            {getStatusText(book.userStatus || '')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.defaultCard, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
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
        <Text style={[styles.compactStatus, { color: getStatusColor(book.userStatus || '') }]}>
          {getStatusText(book.userStatus || '')}
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
    width: 120,
    marginRight: 16,
    alignItems: 'center',
  },
  compactCover: {
    width: 120,
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  compactInfo: {
    alignItems: 'center',
    width: '100%',
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 18,
  },
  compactVolumes: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  compactStatus: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  defaultCard: {
    width: 140,
    marginRight: 16,
    alignItems: 'center',
  },
  defaultCover: {
    width: 140,
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  defaultInfo: {
    alignItems: 'center',
    width: '100%',
  },
  defaultTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 20,
  },
  defaultVolumes: {
    fontSize: 14,
    marginBottom: 6,
    textAlign: 'center',
  },
});
