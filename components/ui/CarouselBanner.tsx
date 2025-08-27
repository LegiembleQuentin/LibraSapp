import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { BookDto } from '../../types/book';

interface CarouselBannerProps {
  books: BookDto[];
  onBookPress?: (book: BookDto) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 32;
const CARD_HEIGHT = 180;
const CARD_SPACING = 16;
const TOTAL_CARD_WIDTH = CARD_WIDTH + CARD_SPACING;

export default function CarouselBanner({ books, onBookPress }: CarouselBannerProps) {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / TOTAL_CARD_WIDTH);
    setActiveIndex(index);
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * TOTAL_CARD_WIDTH,
      animated: true,
    });
  };

  const getStatusText = (isCompleted: boolean) => {
    return isCompleted ? 'Complété' : 'En cours';
  };

  const getVolumeText = (book: BookDto) => {
    if (book.userCurrentVolume && book.userCurrentVolume > 0) {
      return `${book.userCurrentVolume} / ${book.nbVolume} vol`;
    }
    return `${book.nbVolume} vol`;
  };

  const getTitle = (book: BookDto) => {
    return book.names && book.names.length > 0 ? book.names[0] : 'Sans titre';
  };

  if (!books || books.length === 0) {
    return null;
  }

  // Prendre seulement les 3 premiers livres
  const displayBooks = books.slice(0, 3);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
                 snapToInterval={TOTAL_CARD_WIDTH}
        contentContainerStyle={styles.scrollContainer}
      >
        {displayBooks.map((book, index) => (
          <TouchableOpacity
            key={book.id}
            style={styles.card}
            onPress={() => onBookPress?.(book)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: book.imgUrl }}
              style={styles.cover}
              resizeMode="cover"
            />
                         <View style={styles.overlay}>
               <View style={styles.info}>
                 <Text style={styles.title}>{getTitle(book)}</Text>
                 <Text style={styles.volumes}>{getVolumeText(book)}</Text>
                 <Text style={styles.statusText}>{getStatusText(book.completed || false)}</Text>
               </View>
             </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {displayBooks.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              { backgroundColor: index === activeIndex ? theme.colors.accent : 'rgba(255, 255, 255, 0.3)' }
            ]}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingRight: 0,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    marginRight: CARD_SPACING,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    alignItems: 'flex-start',
  },
  info: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 2,
    fontFamily: 'Orbitron',
    textAlign: 'right',
  },
  volumes: {
    fontSize: 14,
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 2,
    opacity: 0.9,
    textAlign: 'right',
  },
  statusText: {
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
