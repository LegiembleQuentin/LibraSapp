import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import TabSelector from './TabSelector';

interface HeaderProps {
  onBackPress?: () => void;
  showBackButton?: boolean;
  title?: string;
  tabs?: Array<{ id: string; label: string }>;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function Header({ 
  onBackPress, 
  showBackButton = false, 
  title,
  tabs, 
  activeTab, 
  onTabChange 
}: HeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
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
        
        {title && (
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              {title}
            </Text>
          </View>
        )}
      </View>
      
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
    paddingHorizontal: 8,
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    //marginBottom: 16,
    position: 'relative',
  },
  titleContainer: {
    textAlign: 'center',
    paddingVertical: 16,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Orbitron',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});
