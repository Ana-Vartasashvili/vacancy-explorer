import { UserCredential } from 'firebase/auth';
import { Vacancy } from '../vacancies/vacancies.types';

export interface AuthResponseData extends UserCredential {
  _tokenResponse: TokenResponseData;
}

export interface TokenResponseData {
  email: string;
  expiresIn: string;
  idToken: string;
  kind: string;
  localId: string;
  refreshToken: string;
}

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  role: string;
  expiresIn: number;
  token: string;
  savedVacancies: any[];
}

export interface UserResponseData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  savedVacancies: Vacancy[];
  userId: string;
}

export interface TokenData {
  userId: string;
  token: string;
  expirationDate: string;
}
