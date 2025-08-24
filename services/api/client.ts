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

    console.log(url);
    
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'API-KEY': this.apiKey,
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

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
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

  // Exemple d'endpoint protégé (pour plus tard)
  async getBooks(token: string) {
    return this.makeAuthenticatedRequest('/books', token);
  }

  async getDiscoverPage(token: string) {
    return this.makeAuthenticatedRequest('/books/discover', token);
  }
}

export const apiClient = new ApiClient();
