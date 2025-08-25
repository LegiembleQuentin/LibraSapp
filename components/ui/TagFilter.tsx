import React, { memo } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Tag } from '../../types/book';

interface TagFilterProps {
  tags: Tag[];
  selectedTags: Tag[];
  onTagSelect: (tag: Tag) => void;
}

export default memo(({ tags, selectedTags, onTagSelect }: TagFilterProps) => {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      decelerationRate="fast"
    >
      {tags.map((tag) => {
        const isSelected = selectedTags.some(selectedTag => selectedTag.id === tag.id);
        return (
          <TouchableOpacity
            key={tag.id}
            style={styles.tag}
            onPress={() => onTagSelect(tag)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tagText,
                {
                  color: isSelected ? theme.colors.accent : 'rgba(255, 255, 255, 0.6)',
                  fontWeight: isSelected ? 'bold' : 'normal',
                }
              ]}
            >
              {tag.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
