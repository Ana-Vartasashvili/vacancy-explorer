import { UserCredential } from 'firebase/auth';

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
}
