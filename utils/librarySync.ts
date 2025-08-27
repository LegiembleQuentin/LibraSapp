import AsyncStorage from '@react-native-async-storage/async-storage';

const LIBRARY_CHANGES_KEY = 'library_changed_book_ids';

/**
 * Marque un livre comme ayant été modifié dans la bibliothèque
 * @param bookId - L'ID du livre modifié
 */
export async function markLibraryChanged(bookId: number) {
  try {
    const existingChanges = await AsyncStorage.getItem(LIBRARY_CHANGES_KEY);
    let changedIds: number[] = existingChanges ? JSON.parse(existingChanges) : [];
    
    if (!changedIds.includes(bookId)) {
      changedIds.push(bookId);
    }
    
    await AsyncStorage.setItem(LIBRARY_CHANGES_KEY, JSON.stringify(changedIds));
  } catch (error) {
    console.error('Erreur lors du marquage du changement de bibliothèque:', error);
  }
}

/**
 * Consomme et retourne la liste des IDs de livres modifiés, puis efface la liste
 * @returns Promise<number[]> - Liste des IDs de livres modifiés
 */
export async function consumeLibraryChanges(): Promise<number[]> {
  try {
    const existingChanges = await AsyncStorage.getItem(LIBRARY_CHANGES_KEY);
    
    if (existingChanges) {
      await AsyncStorage.removeItem(LIBRARY_CHANGES_KEY);
      return JSON.parse(existingChanges);
    }
    
    return [];
  } catch (error) {
    console.error('Erreur lors de la consommation des changements de bibliothèque:', error);
    return [];
  }
}

/**
 * Regarde la liste des IDs de livres modifiés sans l'effacer
 * @returns Promise<number[]> - Liste des IDs de livres modifiés
 */
export async function peekLibraryChanges(): Promise<number[]> {
  try {
    const existingChanges = await AsyncStorage.getItem(LIBRARY_CHANGES_KEY);
    return existingChanges ? JSON.parse(existingChanges) : [];
  } catch (error) {
    console.error('Erreur lors de la consultation des changements de bibliothèque:', error);
    return [];
  }
}
