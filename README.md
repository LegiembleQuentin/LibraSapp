# LibraS — Application mobile Expo

LibraS est une application mobile construite avec Expo + React Native et Expo Router. Elle permet de découvrir, rechercher et gérer des livres, avec un scanner de couverture pour identifier rapidement un ouvrage via l’appareil photo.



## Aperçu
LibraS propose plusieurs volets:
- Découverte: onglets "Pour vous", "Par tag", "Récent" avec mise en avant de contenus.
- Bibliothèque: gestion des livres de l’utilisateur.
- Scan: capture d’une couverture via la caméra, recadrage, envoi au backend et redirection vers la fiche du livre.
- Recherche: recherche d'un livre en particulier par nom, description ou nom d'auteur.
- Paramètres: gestion des préférences (UI/thème), accès à l’aide, et actions de compte (ex: déconnexion).

## Fonctionnalités
- Expo Router (navigation à base de fichiers)
- Thème et UI cohérente (`Screen`, `Header`, `Navbar`, `TabSelector`)
- Découverte:
  - Pour vous (`ForYouContent`): sections statiques (populaire, mieux notés, nouveautés, etc.)
  - Par tag (`ByTagContent`): filtrage dynamique par tags
  - Récent (`RecentContent`): liste dynamique des nouveautés
- Scanner de couvertures (`scan.tsx`) avec:
  - Permissions caméra et gestion d’erreurs
  - Recadrage local avant envoi (expo-image-manipulator)
  - Envoi au backend en `FormData` et navigation vers la fiche livre
- Client API centralisé (`services/api/client.ts`) avec authentification Bearer
- Recherche (`search.tsx`) avec:
  - Recherche plein texte par titre, description et auteur (`apiClient.searchBooks`)
  - Affichage des résultats et navigation vers la fiche livre
- Bibliothèque utilisateur (`library.tsx`) avec:
  - Liste des livres de l’utilisateur (`apiClient.getUserBooks`)
  - Ajout/suppression depuis la bibliothèque via `apiClient.switchInUserLibrary`
  - Gestion d’état vide avec message d’aide


## Prérequis
- Node.js LTS et npm
- Expo CLI (ou `npx expo`)
- Un backend disponible (variables `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_API_KEY`)

## Installation
1. Installer les dépendances
   ```bash
   npm install
   ```

2. Créer un fichier `.env` (ou renseigner les variables dans votre environnement shell):
   ```bash
   EXPO_PUBLIC_API_BASE_URL=https://votre-backend.exemple
   EXPO_PUBLIC_API_KEY=cle-api-exemple
   ```

3. Démarrer l’application
   ```bash
   npx expo start
   ```

4. Lancer sur un device/simulateur
   - Android: appuyer sur "a" dans le terminal (ou ouvrir l’app Expo Go et scanner le qr code)
   - iOS: appuyer sur "i" (simulateur) ou ouvrir Expo Go
   - Web: appuyer sur "w" (si activé)

## Configuration des variables d’environnement
Ce projet lit certaines variables au runtime via Expo:
- `EXPO_PUBLIC_API_BASE_URL`: base URL du backend
- `EXPO_PUBLIC_API_KEY`: clé d’API  pour le backend

Notes:
- Vous pouvez utiliser un fichier `.env` à la racine du projet si vous utilisez Expo avec support des env (ou passer par `app.config.js/app.json` → `extra`).

## Configuration Firebase
Pour la configuration firebase suivez la documentation officielle:
- Guide Expo: [Using Firebase avec Expo](https://docs.expo.dev/guides/using-firebase/)
- Guide Firebase Web (SDK modulaire v9+): [Ajouter Firebase à votre application Web](https://firebase.google.com/docs/web/setup?hl=fr)


## Scripts utiles
- Démarrage Metro bundler: `npx expo start`
- Android (émulateur): `a` dans la console Expo
- iOS (simulateur): `i` dans la console Expo
- Nettoyer cache Metro: `npx expo start -c`

## Qualité, perfs et bonnes pratiques
- **Séparation des responsabilités**: pages conteneurs (`discover.tsx`, `scan.tsx`) vs composants d’affichage (`ForYouContent`, listes UI).
- **Rendu conditionnel robuste**: guards `?.` + `length > 0` pour éviter les erreurs et rendus inutiles.
- **Gestion d’état claire**: `loading` / `error` / `empty` nettement gérés côté pages.
- **Hooks de navigation**: `useFocusEffect` pour resynchroniser au retour sur l’écran.
- **Prévention des leaks**: drapeaux locaux (ex: `isActive`) avant `setState` après effets asynchrones.
- **Perf Scan**: recadrage local (expo-image-manipulator) avant upload, `isProcessing` pour éviter les doubles envois, suppression idempotente des fichiers temporaires.
- **Client API centralisé**: `services/api/client.ts` pour uniformiser headers, erreurs, endpoints.
- **Thème & UI cohérente**: `useTheme` pour éviter les couleurs en dur et faciliter le dark mode.

## Dépannage
- Caméra ne s’affiche pas:
  - Vérifiez les permissions (premier lancement) et redémarrez si nécessaire
  - Sur Android, assurez-vous que l’émulateur a une caméra virtuelle
- Erreurs réseau:
  - Vérifiez `EXPO_PUBLIC_API_BASE_URL` et `EXPO_PUBLIC_API_KEY`
  - Testez l’endpoint `/scan` manuellement si besoin
- Cache Metro:
  - Redémarrez avec `npx expo start -c`

---
