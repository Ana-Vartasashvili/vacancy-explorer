import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { auth } from 'src/app/firebase/firebase-config';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

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

const handleError = (errorResponse: any) => {
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

const handleAuthentication = (
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
  });
};

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions) {}

  signup = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupStart),
      switchMap((signupStartAction: any) => {
        return from(
          createUserWithEmailAndPassword(
            auth,
            signupStartAction.email,
            signupStartAction.password
          )
        ).pipe(
          map((response: AuthResponseData) => {
            const { expiresIn, email, idToken, localId } =
              response._tokenResponse;

            return handleAuthentication(+expiresIn, email, localId, idToken);
          }),
          catchError((error: any) => {
            return handleError(error.code);
          })
        );
      })
    )
  );

  login = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap((loginStartAction: any) => {
        return from(
          signInWithEmailAndPassword(
            auth,
            loginStartAction.email,
            loginStartAction.password
          )
        ).pipe(
          map((response: AuthResponseData) => {
            const { expiresIn, email, idToken, localId } =
              response._tokenResponse;

            return handleAuthentication(+expiresIn, email, localId, idToken);
          }),
          catchError((error: any) => {
            return handleError(error.code);
          })
        );
      })
    )
  );
}
