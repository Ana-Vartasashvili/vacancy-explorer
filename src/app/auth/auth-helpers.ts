import { of } from 'rxjs';
import { UserData } from './auth.types';
import * as AuthActions from './store/auth.actions';

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

export const handleAuthentication = ({
  expiresIn,
  email,
  userId,
  token,
  firstName,
  lastName,
  role,
  savedVacancies,
}: UserData) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

  localStorage.setItem(
    'tokenData',
    JSON.stringify({ token, expirationDate, userId })
  );

  return AuthActions.authSuccess({
    firstName,
    lastName,
    savedVacancies,
    role,
    email,
    userId,
    expirationDate,
    token,
    redirect: true,
  });
};
