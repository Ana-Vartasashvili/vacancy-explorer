import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { catchError, from, map, of, switchMap, tap } from 'rxjs';
import { auth, db } from 'src/app/firebase/firebase-config';
import { AppState } from 'src/app/store/app.reducer';
import { handleAuthentication, handleError } from '../auth-helpers';
import { AuthService } from '../auth.service';
import { AuthResponseData, TokenData, UserData } from '../auth.types';
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

  signup = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupStart),
      switchMap((signupStartAction) => {
        let userData: UserData = {
          email: signupStartAction.email.trim(),
          firstName: signupStartAction.firstName.trim(),
          lastName: signupStartAction.lastName.trim(),
          savedVacancies: [],
          myVacancies: [],
          expiresIn: null,
          role: 'user',
          userId: '',
          token: '',
        };

        return from(
          createUserWithEmailAndPassword(
            auth,
            signupStartAction.email.trim(),
            signupStartAction.password.trim()
          )
        ).pipe(
          tap((resData: AuthResponseData) => {
            const { expiresIn, idToken, localId } = resData._tokenResponse;

            this.authService.setLogoutTimer(+expiresIn * 1000);

            userData.userId = localId;
            userData.expiresIn = +expiresIn;
            userData.token = idToken;

            setDoc(doc(db, 'users', localId), {
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              role: userData.role,
              userId: userData.userId,
              myVacancies: userData.myVacancies,
              savedVacancies: userData.savedVacancies,
            });
          }),
          map(() => {
            return handleAuthentication(userData);
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
          switchMap((response: AuthResponseData) => {
            const { expiresIn, email, idToken, localId } =
              response._tokenResponse;
            let userData: UserData = {
              expiresIn: +expiresIn,
              email,
              token: idToken,
              userId: localId,
              firstName: '',
              lastName: '',
              myVacancies: [],
              savedVacancies: [],
              role: '',
            };

            const docRef = doc(db, 'users', userData.userId);
            return from(getDoc(docRef)).pipe(
              switchMap((docSnap) => {
                if (docSnap.exists()) {
                  return of(docSnap.data()).pipe(
                    map((userDataResponse: UserData) => {
                      userData.firstName = userDataResponse.firstName;
                      userData.lastName = userDataResponse.lastName;
                      userData.myVacancies = userDataResponse.myVacancies;
                      userData.role = userDataResponse.role;
                      userData.savedVacancies = userDataResponse.savedVacancies;

                      return handleAuthentication(userData);
                    })
                  );
                }

                return of(
                  AuthActions.authFail({
                    errorMessage: 'Could not find user!',
                  })
                );
              })
            );
          })
        );
      }),

      catchError((error: any) => {
        setTimeout(() => {
          this.store.dispatch(clearAuthError());
        }, 3500);
        return handleError(error.code);
      })
    )
  );

  autoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      switchMap(() => {
        const tokenData: TokenData = JSON.parse(
          localStorage.getItem('tokenData')
        );

        if (!tokenData) return of(AuthActions.autoLoginFail());

        const docRef = doc(db, 'users', tokenData.userId);
        return from(getDoc(docRef)).pipe(
          switchMap((docSnap) => {
            if (docSnap.exists()) {
              return of(docSnap.data()).pipe(
                map((userData: UserData) => {
                  const loadedUser = new User(
                    userData.firstName,
                    userData.lastName,
                    userData.role,
                    userData.email,
                    userData.userId,
                    userData.myVacancies,
                    userData.savedVacancies,
                    tokenData.token,
                    new Date(tokenData.expirationDate)
                  );

                  if (loadedUser.token) {
                    const expirationDuration =
                      loadedUser.tokenExpirationDate.getTime() -
                      new Date().getTime();
                    this.authService.setLogoutTimer(expirationDuration);

                    return AuthActions.authSuccess({
                      ...loadedUser,
                      token: loadedUser.token,
                      expirationDate: loadedUser.tokenExpirationDate,
                      redirect: true,
                    });
                  }

                  return AuthActions.autoLoginFail();
                })
              );
            }

            return of(AuthActions.autoLoginFail());
          }),

          catchError(() => {
            return of(AuthActions.autoLoginFail());
          })
        );
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
          localStorage.removeItem('tokenData');
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );
}
