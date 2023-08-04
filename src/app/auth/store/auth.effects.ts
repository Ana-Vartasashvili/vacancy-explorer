import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  catchError,
  concatMap,
  finalize,
  from,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { auth, db } from 'src/app/firebase/firebase-config';
import { AppState } from 'src/app/store/app.reducer';
import { addToSavedVacanciesSuccess } from 'src/app/vacancies/store/vacancies.actions';
import * as VacanciesActions from '../../vacancies/store/vacancies.actions';
import { handleAuthentication, handleError } from '../auth-helpers';
import { AuthService } from '../auth.service';
import { AuthResponseData, TokenData, UserData } from '../auth.types';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';
import { clearAuthError } from './auth.actions';

const CLEAR_ERROR_TIMEOUT_TIME = 3500;

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
      concatMap((signupStartAction) => {
        return from(
          createUserWithEmailAndPassword(
            auth,
            signupStartAction.email.trim(),
            signupStartAction.password.trim()
          )
        ).pipe(
          map((resData: AuthResponseData) => ({
            email: signupStartAction.email.trim(),
            firstName: signupStartAction.firstName.trim(),
            lastName: signupStartAction.lastName.trim(),
            expiresIn: +resData._tokenResponse.expiresIn,
            token: resData._tokenResponse.idToken,
            userId: resData._tokenResponse.localId,
            savedVacancies: [],
            role: 'user',
          })),
          concatMap((userData: UserData) =>
            from(
              setDoc(doc(db, 'users', userData.userId), {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                role: userData.role,
                userId: userData.userId,
                savedVacancies: userData.savedVacancies,
              })
            ).pipe(
              tap(() => {
                this.authService.setLogoutTimer(userData.expiresIn * 1000);
                this.store.dispatch(
                  VacanciesActions.addToSavedVacanciesSuccess({
                    savedVacancies: userData.savedVacancies,
                  })
                );
              }),
              map(() => handleAuthentication(userData)),
              catchError((error: any) => handleError(error.code))
            )
          ),
          catchError((error: any) => handleError(error.code))
        );
      }),
      finalize(() => {
        setTimeout(
          () => this.store.dispatch(AuthActions.clearAuthError()),
          CLEAR_ERROR_TIMEOUT_TIME
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
          mergeMap((response: AuthResponseData) => {
            const { expiresIn, email, idToken, localId } =
              response._tokenResponse;
            const docRef = doc(db, 'users', localId);

            return from(getDoc(docRef)).pipe(
              tap((docSnap) => {
                this.authService.setLogoutTimer(+expiresIn * 1000);
                if (docSnap.exists()) {
                  const userData: UserData = docSnap.data() as UserData;
                  this.store.dispatch(
                    addToSavedVacanciesSuccess({
                      savedVacancies: userData.savedVacancies,
                    })
                  );
                }
              }),
              mergeMap((docSnap) => {
                if (docSnap.exists()) {
                  const userDataResponse: UserData = docSnap.data() as UserData;
                  let userData: UserData = {
                    firstName: userDataResponse.firstName,
                    lastName: userDataResponse.lastName,
                    email,
                    userId: localId,
                    savedVacancies: userDataResponse.savedVacancies,
                    token: idToken,
                    expiresIn: +expiresIn,
                    role: userDataResponse.role,
                  };

                  return of(handleAuthentication(userData));
                }

                return of(
                  AuthActions.authFail({ errorMessage: 'Could not find user!' })
                );
              })
            );
          })
        );
      }),
      catchError((error: any) => {
        setTimeout(() => {
          this.store.dispatch(clearAuthError());
        }, CLEAR_ERROR_TIMEOUT_TIME);

        return handleError(error.code);
      })
    )
  );

  autoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLoginStart),
      switchMap(() => {
        const tokenData: TokenData = JSON.parse(
          localStorage.getItem('tokenData')
        );
        if (!tokenData) return of(AuthActions.autoLoginFail());
        const docRef = doc(db, 'users', tokenData.userId);

        return from(getDoc(docRef)).pipe(
          map((docSnap) => {
            if (docSnap.exists()) return docSnap.data() as UserData;

            return null;
          }),
          tap((userData: UserData) => {
            this.store.dispatch(
              addToSavedVacanciesSuccess({
                savedVacancies: userData.savedVacancies,
              })
            );
          }),
          mergeMap((userData: UserData) => {
            if (userData) {
              const loadedUser = new User(
                userData.firstName,
                userData.lastName,
                userData.role,
                userData.email,
                userData.userId,
                userData.savedVacancies,
                tokenData.token,
                new Date(tokenData.expirationDate)
              );

              if (loadedUser.token) {
                const expirationDuration =
                  loadedUser.tokenExpirationDate.getTime() -
                  new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration);

                return of(
                  AuthActions.authSuccess({
                    ...loadedUser,
                    token: loadedUser.token,
                    expirationDate: loadedUser.tokenExpirationDate,
                    redirect: false,
                  })
                );
              }
            }

            return of(AuthActions.autoLoginFail());
          }),
          catchError(() => of(AuthActions.autoLoginFail()))
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
