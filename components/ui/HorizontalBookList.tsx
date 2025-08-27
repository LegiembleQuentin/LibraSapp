import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { BookDto } from '../../types/book';
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
      snapToInterval={variant === 'compact' ? 98 : 98}
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
    paddingLeft: 20,
    paddingRight: 20,
  },
});
