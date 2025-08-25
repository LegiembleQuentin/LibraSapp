import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import TabSelector from './TabSelector';

interface HeaderProps {
  onBackPress?: () => void;
  showBackButton?: boolean;
  tabs?: Array<{ id: string; label: string }>;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function Header({ 
  onBackPress, 
  showBackButton = false, 
  tabs, 
  activeTab, 
  onTabChange 
}: HeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
      )}
      
      {tabs && activeTab && onTabChange && (
        <TabSelector
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
});
