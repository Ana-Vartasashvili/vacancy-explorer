import { of } from 'rxjs';
import * as AuthActions from './store/auth.actions';
import { User } from './user.model';

export const handleError = (errorResponse: any) => {
  let errorMessage = 'An unknown error occurred!';

  switch (errorResponse) {
    case 'auth/email-already-in-use':
      errorMessage = 'This email already exists!';
      break;
    case 'auth/wrong-password':
      errorMessage = 'Invalid email or password!';
      break;
    case 'auth/too-many-requests':
      errorMessage = 'Too many failed login attempts, please try again later!';
      break;
    case 'auth/user-not-found':
      errorMessage = 'User with this email can not be found!';
      break;
  }

  return of(AuthActions.authFail({ errorMessage }));
};

export const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  return AuthActions.authSuccess({
    email,
    userId,
    expirationDate,
    token,
    redirect: true,
  });
};
