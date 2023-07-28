import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { catchError, from, map, switchMap, tap } from 'rxjs';
import { auth, db } from 'src/app/firebase/firebase-config';
import { AppState } from 'src/app/store/app.reducer';
import { handleAuthentication, handleError } from '../auth-helpers';
import { AuthService } from '../auth.service';
import { AuthResponseData, UserData } from '../auth.types';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';
import { clearAuthError } from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private router: Router,
    private authService: AuthService
  ) {}

  userData: UserData = {
    firstName: '',
    lastName: '',
    email: '',
    userId: '',
  };

  signup = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupStart),
      switchMap((signupStartAction) => {
        (this.userData.firstName = signupStartAction.firstName),
          (this.userData.lastName = signupStartAction.lastName),
          (this.userData.email = signupStartAction.email);

        return from(
          createUserWithEmailAndPassword(
            auth,
            signupStartAction.email.trim(),
            signupStartAction.password.trim()
          )
        ).pipe(
          tap((resData: AuthResponseData) => {
            this.authService.setLogoutTimer(
              +resData._tokenResponse.expiresIn * 1000
            );
          }),
          map((resData: AuthResponseData) => {
            const { expiresIn, email, idToken, localId } =
              resData._tokenResponse;

            this.userData.userId = localId;
            setDoc(doc(db, 'users', localId), {
              firstName: this.userData.firstName,
              lastName: this.userData.lastName,
              email: this.userData.email,
              role: 'user',
              userId: this.userData.userId,
              myVacancies: [],
              savedVacancies: [],
            });

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
            loginStartAction.email.trim(),
            loginStartAction.password.trim()
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
