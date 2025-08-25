import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../services/api/client';
import Screen from '../../components/ui/Screen';
import Header from '../../components/ui/Header';
import BookCard from '../../components/ui/BookCard';
import SectionHeader from '../../components/ui/SectionHeader';
import HorizontalBookList from '../../components/ui/HorizontalBookList';
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
    Alert.alert('Livre sélectionné', `Vous avez sélectionné : ${book.title}`);
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
          <SectionHeader title="Erreur" />
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
          <SectionHeader title="Aucune donnée" />
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

      {/* Livre mis en avant (carroussel) */}
      {discoverData?.carrousselBooks && discoverData.carrousselBooks.length > 0 && (
        <BookCard
          book={discoverData.carrousselBooks[0]}
          variant="featured"
          onPress={() => handleBookPress(discoverData.carrousselBooks[0])}
        />
      )}

      {/* Section Populaire */}
      {discoverData?.popular && discoverData.popular.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Populaire" />
          <HorizontalBookList
            books={discoverData.popular}
            variant="compact"
            onBookPress={handleBookPress}
          />
        </View>
      )}

      {/* Section Les mieux notés */}
      {discoverData?.bestRated && discoverData.bestRated.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Les mieux notés" />
          <HorizontalBookList
            books={discoverData.bestRated}
            variant="compact"
            onBookPress={handleBookPress}
          />
        </View>
      )}

      {/* Section Nouveautés */}
      {discoverData?.newBooks && discoverData.newBooks.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Nouveautés" />
          <HorizontalBookList
            books={discoverData.newBooks}
            variant="compact"
            onBookPress={handleBookPress}
          />
        </View>
      )}

      {/* Section Recommandations */}
      {discoverData?.recommended && discoverData.recommended.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Recommandations" />
          <HorizontalBookList
            books={discoverData.recommended}
            variant="compact"
            onBookPress={handleBookPress}
          />
        </View>
      )}

      {/* Section Complétés */}
      {discoverData?.completed && discoverData.completed.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Complétés" />
          <HorizontalBookList
            books={discoverData.completed}
            variant="compact"
            onBookPress={handleBookPress}
          />
        </View>
      )}

      {/* Section En cours utilisateur */}
      {discoverData?.userInProgress && discoverData.userInProgress.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="En cours" />
          <HorizontalBookList
            books={discoverData.userInProgress}
            variant="compact"
            onBookPress={handleBookPress}
          />
        </View>
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


