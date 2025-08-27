import React from 'react';
import { View, StyleSheet } from 'react-native';
import CarouselBanner from '../ui/CarouselBanner';
import SectionHeader from '../ui/SectionHeader';
import HorizontalBookList from '../ui/HorizontalBookList';
import { BookDto } from '../../types/book';

interface ForYouContentProps {
  discoverData: any;
  onBookPress: (book: BookDto) => void;
}

export default function ForYouContent({ discoverData, onBookPress }: ForYouContentProps) {
  return (
    <View style={styles.container}>
      {discoverData?.popular && discoverData.popular.length > 0 && (
        <CarouselBanner
          books={discoverData.popular}
          onBookPress={onBookPress}
        />
      )}

      {discoverData?.popular && discoverData.popular.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Populaire" />
          <HorizontalBookList
            books={discoverData.popular}
            variant="compact"
            onBookPress={onBookPress}
          />
        </View>
      )}

      {discoverData?.bestRated && discoverData.bestRated.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Les mieux notés" />
          <HorizontalBookList
            books={discoverData.bestRated}
            variant="compact"
            onBookPress={onBookPress}
          />
        </View>
      )}

      {discoverData?.newBooks && discoverData.newBooks.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Nouveautés" />
          <HorizontalBookList
            books={discoverData.newBooks}
            variant="compact"
            onBookPress={onBookPress}
          />
        </View>
      )}

      {discoverData?.recommended && discoverData.recommended.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Recommandations" />
          <HorizontalBookList
            books={discoverData.recommended}
            variant="compact"
            onBookPress={onBookPress}
          />
        </View>
      )}

      {discoverData?.completed && discoverData.completed.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Complétés" />
          <HorizontalBookList
            books={discoverData.completed}
            variant="compact"
            onBookPress={onBookPress}
          />
        </View>
      )}

      {discoverData?.userInProgress && discoverData.userInProgress.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="En cours" />
          <HorizontalBookList
            books={discoverData.userInProgress}
            variant="compact"
            onBookPress={onBookPress}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 22,
  },
});
