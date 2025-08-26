import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../theme';
import { BookDto } from '../../types/book';

interface BookTagsProps {
  book: BookDto;
}

export default function BookTags({ book }: BookTagsProps) {
  const { theme } = useTheme();

  if (!book.tags || book.tags.size === 0) {
    return null;
  }

  const tags = Array.from(book.tags).map((tag: any) => tag.name);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagsContainer}
        decelerationRate="fast"
      >
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={[styles.tagText, { color: theme.colors.white }]}>
              {tag}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  tagsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Rubik',
    fontWeight: '500',
  },
});
