// Types pour l'API LibraS
export interface LoginUserDto {
  email: string;
  password: string;
}

export interface RegisterUserDto {
  email: string;
  password: string;
  displayname: string;
}

export interface LoginResponseDto {
  token: string;
  expiresIn: number;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface AppUser {
  id: number;
  email: string;
  displayname: string;
  fname?: string;
  name?: string;
  img_url?: string;
  roles: string[];
  created_at: string;
  modified_at?: string;
}
