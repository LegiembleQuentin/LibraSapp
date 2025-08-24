# Intégration API LibraS - Guide de Configuration

## 🔄 Architecture Hybride Firebase + API

L'application utilise une approche hybride :
- **Firebase Auth** : Authentification côté client (UX simple)
- **API Spring Boot** : Backend avec JWT pour sécuriser les données
- **Synchronisation** : Les deux systèmes fonctionnent ensemble

## ⚙️ Configuration Requise

### 1. Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/api
EXPO_PUBLIC_API_KEY=YOUR_API_KEY_HERE
```

**OU** utilisez le fichier `config.ts` :

```bash
cp config.example.ts config.ts
# Puis éditez config.ts avec vos valeurs
```

### 2. API Spring Boot

Assurez-vous que votre API est démarrée :

```bash
cd ../api/libraS
docker-compose up --build
```

L'API sera disponible sur `http://localhost:8080`

## 🔐 Flux d'Authentification

### Connexion (Login)
1. **Validation côté client** : Email (regex) + mot de passe (4-30 chars)
2. **Firebase Auth** : `signInWithEmailAndPassword()`
3. **API Auth** : `POST /api/auth/login` → récupère JWT token
4. **Stockage sécurisé** : Token JWT dans AsyncStorage
5. **Navigation** : Redirection vers l'accueil

### Inscription (Register)
1. **Validation côté client** : Email + mots de passe + confirmation
2. **Firebase Auth** : `createUserWithEmailAndPassword()`
3. **API Auth** : `POST /api/auth/signup` → récupère JWT token
4. **Stockage sécurisé** : Token JWT dans AsyncStorage
5. **Rollback** : Si API échoue, supprime le compte Firebase

### Déconnexion (Logout)
1. **Firebase Auth** : `signOut()`
2. **Nettoyage local** : Supprime le token JWT
3. **Navigation** : Retour à la page de connexion

## 📡 Utilisation de l'API

### Service API Client

```typescript
import { apiClient } from './services/api/client';
import { authService } from './services/auth/authService';

// Récupérer le token JWT
const token = await authService.getJwtToken();

// Appeler une route protégée
const books = await apiClient.getBooks(token);
const discoverPage = await apiClient.getDiscoverPage(token);
```

### Hook d'authentification

```typescript
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { user, jwtToken, loading, isAuthenticated } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <LoginScreen />;
  
  // Utilisateur connecté avec token valide
  return <HomeScreen />;
}
```

## 🛡️ Sécurité

- **Tokens JWT** : Stockés de façon sécurisée avec AsyncStorage
- **Expiration** : Vérification automatique de l'expiration des tokens
- **API Key** : Requêtes sécurisées avec clé API dans les headers
- **Validation** : Côté client ET côté serveur
- **Rollback** : Nettoyage en cas d'erreur d'inscription

## 🔧 Endpoints API Disponibles

### Authentification
- `POST /api/auth/login` : Connexion
- `POST /api/auth/signup` : Inscription

### Livres (protégés par JWT)
- `GET /api/books` : Liste des livres
- `GET /api/books/discover` : Page découverte
- `GET /api/book-details/{id}` : Détails d'un livre
- `POST /api/books/by-tags` : Livres par tags
- `GET /api/books/recent` : Livres récents
- `GET /api/books/search/{search}` : Recherche

### Scan
- `POST /api/scan` : Scanner une couverture

### Tags
- `GET /api/tags` : Liste des tags

## 🚀 Prochaines étapes

1. **Configurer les variables d'environnement**
2. **Tester l'authentification** avec un utilisateur existant
3. **Implémenter les écrans de contenu** (liste des livres, etc.)
4. **Gérer les erreurs réseau** et la reconnexion automatique

## 🔍 Debugging

- **Logs Firebase** : Console → `Connexion hybride réussie`
- **Logs API** : Console → Token JWT et réponses API
- **AsyncStorage** : Vérifiez les tokens stockés
- **Réseau** : Inspectez les requêtes HTTP dans les dev tools
