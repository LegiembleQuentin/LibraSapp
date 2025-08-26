import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../services/api/client';
import Screen from '../../components/ui/Screen';
import Header from '../../components/ui/Header';
import ForYouContent from '../../components/content/ForYouContent';
import ByTagContent from '../../components/content/ByTagContent';
import RecentContent from '../../components/content/RecentContent';
import { useTheme } from '../../theme';

const tabs = [
  { id: 'pour-vous', label: 'Pour vous' },
  { id: 'par-tag', label: 'Par tag' },
  { id: 'recent', label: 'Récent' },
];

export default function Discover() {
  const { theme } = useTheme();
  const { jwtToken, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('pour-vous');
  const [discoverData, setDiscoverData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && jwtToken) {
      fetchDiscoverData();
    }
  }, [isAuthenticated, jwtToken]);

  const fetchDiscoverData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiClient.getDiscoverPage(jwtToken!);
      
      setDiscoverData(data);
    } catch (err: any) {
      console.error('Erreur API:', err);
      setError(err.message || 'Erreur lors du chargement des données');
      Alert.alert('Erreur', 'Impossible de charger la page discover');
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = (book: any) => {
    router.push({
      pathname: '/(tabs)/book-details/[id]',
      params: { id: book.id.toString(), from: 'discover' }
    });
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  if (loading) {
    return (
      <Screen center>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={[styles.loadingText, { color: theme.colors.textPrimary }]}>
            Chargement des données...
          </Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen center>
        <View style={styles.errorContainer}>
          <Header showBackButton={false} />
          <View style={styles.errorContent}>
            <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
              {error}
            </Text>
          </View>
        </View>
      </Screen>
    );
  }

  if (!discoverData) {
    return (
      <Screen center>
        <View style={styles.emptyContainer}>
          <Header showBackButton={false} />
          <View style={styles.emptyContent}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              Aucune donnée disponible pour le moment
            </Text>
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header
        showBackButton={false}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Contenu de la page "Pour vous" */}
      {activeTab === 'pour-vous' && (
        <ForYouContent
          discoverData={discoverData}
          onBookPress={handleBookPress}
        />
      )}

      {/* TODO: Ajouter les composants pour "Par tag" et "Récent" */}
      {activeTab === 'par-tag' && (
        <ByTagContent
          jwtToken={jwtToken!}
          onBookPress={handleBookPress}
        />
      )}

                        {activeTab === 'recent' && (
                    <RecentContent
                      jwtToken={jwtToken!}
                      onBookPress={handleBookPress}
                    />
                  )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 22,
  },
  
});


