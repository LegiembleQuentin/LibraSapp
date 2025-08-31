import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { useTheme } from '../../theme';
import Screen from '../../components/ui/Screen';
import Header from '../../components/ui/Header';
import { router } from 'expo-router';

export default function MentionsLegales() {
  const { theme } = useTheme();

  const handleBackPress = () => {
    router.back();
  };

  const mailTo = (email: string) => Linking.openURL(`mailto:${email}`);
  const callTo = (tel: string) => Linking.openURL(`tel:${tel.replace(/\s+/g, '')}`);

  return (
    <Screen>
      <Header
        showBackButton
        title="Mentions Légales"
        onBackPress={handleBackPress}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            1. Informations Générales
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Propriétaire de l'application :{'\n'}
            Nom de la société : LibraS{'\n'}
            Adresse : 123 Rue de la Bande Dessinée, 75000 Paris, France{'\n'}
            Téléphone :{' '}
            <Text style={styles.link} onPress={() => callTo('+33 1 23 45 67 89')}>
              +33 1 23 45 67 89
            </Text>{'\n'}
            Email :{' '}
            <Text style={styles.link} onPress={() => mailTo('contact@libra-s.com')}>
              contact@libra-s.com
            </Text>{'\n'}
            Directeur de la publication : Jean Dupont{'\n'}
            Numéro SIRET : 123 456 789 00010{'\n'}
            {'\n'}
            Hébergeur :{'\n'}
            Nom de l'hébergeur : OVH{'\n'}
            Adresse : 2 Rue Kellermann, 59100 Roubaix, France{'\n'}
            Téléphone :{' '}
            <Text style={styles.link} onPress={() => callTo('+33 9 72 10 10 07')}>
              +33 9 72 10 10 07
            </Text>{'\n'}
            Email :{' '}
            <Text style={styles.link} onPress={() => mailTo('support@ovh.com')}>
              support@ovh.com
            </Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            2. Description des Services
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            L'application LibraS permet de gérer une bibliothèque virtuelle de bandes dessinées.
            Les utilisateurs peuvent scanner les couvertures de leurs bandes dessinées pour les
            ajouter à leur bibliothèque personnelle. Les images scannées seront temporairement
            rendues publiques sur internet, mais elles seront protégées par un token pour garantir
            leur sécurité.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            3. Conditions Générales d'Utilisation (CGU)
          </Text>

          <Text style={[styles.subTitle, { color: theme.colors.textPrimary }]}>
            3.1 Utilisation de l'application
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Vous devez utiliser l'application de manière responsable et légale. Vous ne devez pas
            utiliser l'application pour partager du contenu illégal, offensant ou portant atteinte
            aux droits d'autrui.
          </Text>

          <Text style={[styles.subTitle, { color: theme.colors.textPrimary }]}>
            3.2 Compte utilisateur
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Vous êtes responsable de la confidentialité de vos informations de connexion et de toutes
            les activités effectuées sous votre compte. Vous devez nous informer immédiatement de
            toute utilisation non autorisée de votre compte.
          </Text>

          <Text style={[styles.subTitle, { color: theme.colors.textPrimary }]}>
            3.3 Contenu utilisateur
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Vous conservez la propriété des droits d'auteur de tout contenu que vous téléchargez ou
            partagez via l'application. Cependant, en partageant du contenu, vous nous accordez une
            licence mondiale, non exclusive, gratuite et transférable pour utiliser, reproduire,
            distribuer et afficher ce contenu.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            4. Politique de Confidentialité
          </Text>

          <Text style={[styles.subTitle, { color: theme.colors.textPrimary }]}>
            4.1 Collecte des Informations
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Nous collectons les informations suivantes lorsque vous utilisez notre application :{'\n'}
            • Informations de compte : nom, adresse e-mail, mot de passe.{'\n'}
            • Informations de bibliothèque : détails des bandes dessinées scannées et ajoutées à votre
            bibliothèque.{'\n'}
            • Données de navigation : informations sur votre utilisation de l'application.
          </Text>

          <Text style={[styles.subTitle, { color: theme.colors.textPrimary }]}>
            4.2 Utilisation des Informations
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Nous utilisons les informations collectées pour :{'\n'}
            • Fournir et améliorer nos services.{'\n'}
            • Personnaliser votre expérience utilisateur.{'\n'}
            • Assurer la sécurité de vos données.
          </Text>

          <Text style={[styles.subTitle, { color: theme.colors.textPrimary }]}>
            4.3 Partage des Informations
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Nous ne partageons pas vos informations personnelles avec des tiers, sauf si nécessaire
            pour fournir nos services ou si la loi l'exige.{'\n'}
            Nous pouvons partager des informations agrégées et anonymisées avec des partenaires
            commerciaux à des fins d'analyse et de marketing.
          </Text>

          <Text style={[styles.subTitle, { color: theme.colors.textPrimary }]}>
            4.4 Protection des Informations
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Nous mettons en œuvre des mesures de sécurité pour protéger vos informations personnelles
            contre tout accès, modification, divulgation ou destruction non autorisés. Ces mesures
            comprennent des contrôles d'accès, des pare-feux et des protocoles de chiffrement.
          </Text>

          <Text style={[styles.subTitle, { color: theme.colors.textPrimary }]}>
            4.5 Droits des Utilisateurs
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Vous avez le droit d'accéder à vos informations personnelles, de les corriger, de les
            supprimer ou de limiter leur utilisation. Vous pouvez exercer ces droits en nous
            contactant via les coordonnées fournies dans l'application.
          </Text>

          <Text style={[styles.subTitle, { color: theme.colors.textPrimary }]}>
            4.6 Modifications de la Politique de Confidentialité
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous
            informerons de tout changement important en publiant la nouvelle politique sur notre
            application. Nous vous encourageons à consulter régulièrement cette page pour rester
            informé de nos pratiques en matière de confidentialité.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            5. Cookies
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            L'application LibraS utilise des cookies pour améliorer votre expérience utilisateur.
            Les cookies sont de petits fichiers texte stockés sur votre appareil qui nous aident à
            analyser l'utilisation de l'application et à personnaliser notre contenu. Vous pouvez
            gérer vos préférences en matière de cookies dans les paramètres de votre appareil.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            6. Contact
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Pour toute question ou préoccupation concernant cette politique de confidentialité,
            veuillez nous contacter à l'adresse suivante :{' '}
            <Text style={styles.link} onPress={() => mailTo('contact@libra-s.com')}>
              contact@libra-s.com
            </Text>
            .
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Orbitron',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  link: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
