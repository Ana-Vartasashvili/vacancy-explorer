import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { catchError, from, map, of, switchMap, tap } from 'rxjs';
import { auth } from 'src/app/firebase/firebase-config';
import { AppState } from 'src/app/store/app.reducer';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';
import { clearAuthError } from './auth.actions';
import { AuthService } from '../auth.service';

interface AuthResponseData extends UserCredential {
  _tokenResponse: TokenResponseData;
}

interface TokenResponseData {
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
    redirect: true,
  });
};

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private router: Router,
    private authService: AuthService
  ) {}

  signup = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupStart),
      switchMap((signupStartAction) => {
        return from(
          createUserWithEmailAndPassword(
            auth,
            signupStartAction.email,
            signupStartAction.password
          )
        ).pipe(
          tap((resData: AuthResponseData) => {
            this.authService.setLogoutTimer(
              +resData._tokenResponse.expiresIn * 1000
            );
          }),
          map((response: AuthResponseData) => {
            const { expiresIn, email, idToken, localId } =
              response._tokenResponse;

            return handleAuthentication(+expiresIn, email, localId, idToken);
          }),
          catchError((error: any) => {
            setTimeout(() => {
              this.store.dispatch(clearAuthError());
            }, 3500);
            return handleError(error.code);
          })
        );
      })
    )
  );

  login = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap((loginStartAction) => {
        return from(
          signInWithEmailAndPassword(
            auth,
            loginStartAction.email,
            loginStartAction.password
          )
        ).pipe(
          tap((resData: AuthResponseData) => {
            this.authService.setLogoutTimer(
              +resData._tokenResponse.expiresIn * 1000
            );
          }),
          map((response: AuthResponseData) => {
            const { expiresIn, email, idToken, localId } =
              response._tokenResponse;

            return handleAuthentication(+expiresIn, email, localId, idToken);
          }),
          catchError((error: any) => {
            setTimeout(() => {
              this.store.dispatch(clearAuthError());
            }, 3500);
            return handleError(error.code);
          })
        );
      })
    )
  );

  autoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
          return AuthActions.autoLoginFail();
        }

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);

          return AuthActions.authSuccess({
            email: loadedUser.email,
            token: loadedUser.token,
            userId: loadedUser.userId,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: true,
          });
        } else {
          return AuthActions.autoLoginFail();
        }
      })
    )
  );

  authRedirect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authSuccess),
        tap((authSuccessAction) => {
          console.log(authSuccessAction);
          if (authSuccessAction.redirect) {
            this.router.navigate(['/']);
          }
        })
      ),
    { dispatch: false }
  );

  autoLogout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );
}
