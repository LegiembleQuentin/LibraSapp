import React, { PropsWithChildren } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

type ScreenProps = PropsWithChildren<{
  center?: boolean;
}>;

export default function Screen({ center, children }: ScreenProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[theme.gradient.start, theme.gradient.end]}
      style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <StatusBar style="light" translucent={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
        keyboardVerticalOffset={24}
      >
        {center ? (
          <View style={[styles.content, styles.center]}>{children}</View>
        ) : (
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {children}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  center: {
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
});


