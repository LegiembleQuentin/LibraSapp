import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { BookDto } from '../../types/book';

interface BookSynopsisProps {
  book: BookDto;
}

export default function BookSynopsis({ book }: BookSynopsisProps) {
  const { theme } = useTheme();

  if (!book.synopsis) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.synopsis, { color: theme.colors.white }]}>
        {book.synopsis}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  synopsis: {
    fontSize: 16,
    fontFamily: 'Rubik',
    lineHeight: 24,
    textAlign: 'justify',
  },
});
