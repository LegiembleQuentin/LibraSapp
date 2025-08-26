import { LoginUserDto, RegisterUserDto, LoginResponseDto, ApiError } from './types';

// Configuration de l'API
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || '';
const API_KEY = process.env.EXPO_PUBLIC_API_KEY || '';

class ApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.apiKey = API_KEY;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'API-Key': this.apiKey,
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error ${response.status}: ${errorData}`);
      }

      // Vérifier le Content-Type de la réponse
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // Si ce n'est pas du JSON, retourner le texte
        const textResponse = await response.text();
        return textResponse as T;
      }
    } catch (error) {
      throw error;
    }
  }

  // Authentification
  async login(credentials: LoginUserDto): Promise<LoginResponseDto> {
    return this.makeRequest<LoginResponseDto>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData: RegisterUserDto): Promise<LoginResponseDto> {
    return this.makeRequest<LoginResponseDto>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Méthodes avec token JWT
  private async makeAuthenticatedRequest<T>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Méthode pour les endpoints qui retournent du texte simple
  private async makeAuthenticatedTextRequest(
    endpoint: string,
    token: string,
    options: RequestInit = {}
  ): Promise<string> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'API-Key': this.apiKey,
      'Authorization': `Bearer ${token}`,
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error ${response.status}: ${errorData}`);
      }

      return await response.text();
    } catch (error) {
      throw error;
    }
  }

  // Exemple d'endpoint protégé (pour plus tard)
  async getBooks(token: string) {
    return this.makeAuthenticatedRequest('/books', token);
  }

  async getDiscoverPage(token: string) {
    return this.makeAuthenticatedRequest('/books/discover', token);
  }

  async getTags(token: string) {
    return this.makeAuthenticatedRequest('/tags', token, {
      method: 'GET',
    });
  }

  async getBooksByTags(token: string, tags: any[]) {
    // L'API attend des objets TagDto complets avec id et name
    return this.makeAuthenticatedRequest('/books/by-tags', token, {
      method: 'POST',
      body: JSON.stringify(tags),
    });
  }

  async getBookDetails(bookId: number, token: string) {
    return this.makeAuthenticatedRequest(`/book-details/${bookId}`, token, {
      method: 'GET',
    });
  }

  async getRecentBooks(token: string) {
    return this.makeAuthenticatedRequest('/books/recent', token, {
      method: 'GET',
    });
  }

  async getUserBooks(token: string) {
    return this.makeAuthenticatedRequest('/book/by-user', token, {
      method: 'GET',
    });
  }

  async searchBooks(query: string, token: string) {
    return this.makeAuthenticatedRequest(`/books/search/${encodeURIComponent(query)}`, token, {
      method: 'GET',
    });
  }

  async switchInUserLibrary(bookId: number, token: string) {
    return this.makeAuthenticatedRequest(`/book/${bookId}/switch-in-user-library`, token, {
      method: 'POST',
    });
  }

}

export const apiClient = new ApiClient();
