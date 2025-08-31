import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { useTheme } from '../../theme';
import Screen from '../../components/ui/Screen';
import Header from '../../components/ui/Header';
import { router } from 'expo-router';

export default function CGU() {
  const { theme } = useTheme();

  const handleBackPress = () => {
    router.back();
  };

  const openEmail = () => {
    Linking.openURL('mailto:contact@libra-s.com');
  };

  return (
    <Screen>
      <Header
        showBackButton
        title=""
        onBackPress={handleBackPress}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Conditions Générales d&apos;Utilisation (CGU)
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            1. Introduction
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;utilisation
            de l&apos;application LibraS. En accédant à l&apos;application, vous acceptez de vous
            conformer aux présentes CGU. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas
            utiliser l&apos;application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            2. Description des Services
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            LibraS permet aux utilisateurs de gérer une bibliothèque virtuelle de bandes dessinées,
            incluant la possibilité de scanner les couvertures des bandes dessinées pour les ajouter
            à leur bibliothèque personnelle.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            3. Inscription et Compte Utilisateur
          </Text>

          <Text style={[styles.subTitle, { color: theme.colors.textPrimary }]}>
            3.1 Inscription
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Pour utiliser certains services de LibraS, vous devez créer un compte en fournissant des
            informations exactes et complètes. Vous êtes responsable de maintenir la confidentialité
            de vos identifiants de connexion et de toutes les activités réalisées sous votre compte.
          </Text>

          <Text style={[styles.subTitle, { color: theme.colors.textPrimary }]}>
            3.2 Sécurité du Compte
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte
            ou de toute autre violation de la sécurité. Nous ne serons pas responsables de toute
            perte ou dommage résultant de votre non-respect de cette obligation.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            4. Utilisation de l&apos;Application
          </Text>

          <Text style={[styles.subTitle, { color: theme.colors.textPrimary }]}>
            4.1 Restrictions
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Vous acceptez de ne pas utiliser l&apos;application pour :
            {'\n'}• Télécharger, publier ou transmettre tout contenu illégal, offensant, diffamatoire
            ou qui porte atteinte aux droits d&apos;autrui.
            {'\n'}• Usurper l&apos;identité d&apos;une personne ou d&apos;une entité ou déclarer
            faussement ou déformer votre affiliation avec une personne ou une entité.
            {'\n'}• Interférer avec ou perturber le fonctionnement de l&apos;application ou des
            serveurs ou réseaux connectés à l&apos;application.
          </Text>

          <Text style={[styles.subTitle, { color: theme.colors.textPrimary }]}>
            4.2 Contenu Utilisateur
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            En soumettant du contenu sur l&apos;application, vous accordez à LibraS une licence non
            exclusive, mondiale, gratuite et transférable pour utiliser, reproduire, distribuer et
            afficher ce contenu dans le cadre des services de l&apos;application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            5. Propriété Intellectuelle
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Le contenu et les services de l&apos;application LibraS, y compris mais sans s&apos;y
            limiter, les textes, graphiques, images, logos et logiciels, sont la propriété de LibraS
            et sont protégés par les lois sur la propriété intellectuelle. Vous ne devez pas
            reproduire, distribuer, modifier, créer des œuvres dérivées de, afficher publiquement,
            exécuter publiquement, republier, télécharger, stocker ou transmettre tout matériel de
            notre application, sauf dans les cas expressément autorisés par ces CGU.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            6. Limitation de Responsabilité
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            LibraS ne sera pas responsable de tout dommage indirect, accessoire, spécial ou
            consécutif résultant de l&apos;utilisation ou de l&apos;incapacité à utiliser notre
            application, même si nous avons été informés de la possibilité de tels dommages.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            7. Modification des CGU
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Nous nous réservons le droit de modifier les présentes CGU à tout moment. Toute
            modification prendra effet immédiatement après la publication des CGU révisées sur
            l&apos;application. Votre utilisation continue de l&apos;application après l&apos;affichage
            des CGU modifiées constitue votre acceptation de ces modifications.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            8. Droit Applicable
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Les présentes CGU sont régies et interprétées conformément aux lois de la France, sans
            tenir compte de ses dispositions en matière de conflit de lois. Tout litige découlant des
            présentes CGU ou de l&apos;utilisation de l&apos;application sera soumis à la juridiction
            exclusive des tribunaux compétents de Paris, France.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            9. Contact
          </Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            Pour toute question ou préoccupation concernant ces CGU, veuillez nous contacter à
            l&apos;adresse suivante :{' '}
            <Text style={styles.link} onPress={openEmail}>
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
