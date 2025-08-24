import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { BookDto } from '../../services/api/types';
import BookCard from './BookCard';

interface HorizontalBookListProps {
  books: BookDto[];
  variant?: 'default' | 'compact';
  onBookPress?: (book: BookDto) => void;
  contentContainerStyle?: any;
}

export default function HorizontalBookList({ 
  books, 
  variant = 'default', 
  onBookPress,
  contentContainerStyle 
}: HorizontalBookListProps) {
  const handleBookPress = (book: BookDto) => {
    if (onBookPress) {
      onBookPress(book);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        contentContainerStyle
      ]}
      decelerationRate="fast"
      snapToInterval={variant === 'compact' ? 136 : 156} // 120 + 16 ou 140 + 16
    >
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          variant={variant}
          onPress={() => handleBookPress(book)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
  },
});
