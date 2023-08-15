import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { DocumentSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';
import {
  catchError,
  concatMap,
  defaultIfEmpty,
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
import { VacanciesEffectsHelper } from 'src/app/vacancies/store/vacancies-effects.helper';
import { updateSavedVacanciesSuccess } from 'src/app/vacancies/store/vacancies.actions';
import { Vacancy } from 'src/app/vacancies/vacancies.types';
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
        const { email, firstName, lastName, password } = signupStartAction;
        return from(
          createUserWithEmailAndPassword(auth, email.trim(), password.trim())
        ).pipe(
          map((resData: AuthResponseData) => ({
            email: email.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
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
                savedVacancies: [],
              })
            ).pipe(
              tap(() => {
                this.authService.setLogoutTimer(userData.expiresIn * 1000);
              }),
              map(() => handleAuthentication(userData)),
              catchError((error: any) => {
                this.clearErrorAfterTimeout(clearAuthError);
                return handleError(error.code);
              })
            )
          ),
          catchError((error: any) => {
            this.clearErrorAfterTimeout(clearAuthError);
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
          mergeMap((authResponse: AuthResponseData) => {
            const { expiresIn, localId } = authResponse._tokenResponse;

            return from(getDoc(doc(db, 'users', localId))).pipe(
              map((userDocSnap) => {
                return userDocSnap.exists()
                  ? (userDocSnap.data() as UserData)
                  : null;
              }),
              mergeMap((userResData: UserData) => {
                if (userResData) {
                  let userData: UserData = this.createUserDataObject(
                    userResData,
                    authResponse
                  );

                  return VacanciesEffectsHelper.getSavedVacanciesDocSnaps(
                    userData.savedVacancies
                  ).pipe(
                    defaultIfEmpty([]),
                    map((vacanciesDocSnaps: DocumentSnapshot<Vacancy>[]) => {
                      return VacanciesEffectsHelper.getVacanciesList(
                        vacanciesDocSnaps
                      );
                    }),
                    tap((vacancies: Vacancy[]) => {
                      userData.savedVacancies = vacancies;
                      this.store.dispatch(
                        updateSavedVacanciesSuccess({
                          savedVacancies: vacancies,
                        })
                      );
                      this.authService.setLogoutTimer(+expiresIn * 1000);
                    }),
                    map(() => handleAuthentication(userData))
                  );
                }
                return of(
                  AuthActions.authFail({ errorMessage: 'Could not find user!' })
                );
              })
            );
          }),
          catchError((error) => {
            this.clearErrorAfterTimeout(clearAuthError);
            return handleError(error.code);
          })
        );
      }),
      catchError((error: any) => {
        this.clearErrorAfterTimeout(clearAuthError);
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

        return from(getDoc(doc(db, 'users', tokenData.userId))).pipe(
          map((userDocSnap) => {
            return userDocSnap.exists()
              ? (userDocSnap.data() as UserData)
              : null;
          }),
          mergeMap((userData: UserData) => {
            if (userData) {
              return VacanciesEffectsHelper.getSavedVacanciesDocSnaps(
                userData.savedVacancies
              ).pipe(
                defaultIfEmpty([]),
                map((vacanciesDocSnaps: DocumentSnapshot<Vacancy>[]) => {
                  return VacanciesEffectsHelper.getVacanciesList(
                    vacanciesDocSnaps
                  );
                }),
                tap((vacancies: Vacancy[]) => {
                  this.store.dispatch(
                    updateSavedVacanciesSuccess({ savedVacancies: vacancies })
                  );
                }),
                map((vacancies: Vacancy[]) => {
                  const loadedUser = this.createNewUserObject(
                    userData,
                    tokenData,
                    vacancies
                  );

                  return this.checkTokenValidityAndFinishAuth(loadedUser);
                })
              );
            } else {
              return of(AuthActions.autoLoginFail());
            }
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

  clearErrorAfterTimeout(action) {
    setTimeout(() => {
      this.store.dispatch(action());
    }, CLEAR_ERROR_TIMEOUT_TIME);
  }

  createUserDataObject(userResData: UserData, authResData: AuthResponseData) {
    const { email, expiresIn, idToken, localId } = authResData._tokenResponse;
    const { firstName, lastName, savedVacancies, role } = userResData;
    return {
      firstName,
      lastName,
      email,
      userId: localId,
      savedVacancies,
      token: idToken,
      expiresIn: +expiresIn,
      role,
    };
  }

  createNewUserObject(
    userData: UserData,
    tokenData: TokenData,
    savedVacancies: Vacancy[]
  ) {
    return new User(
      userData.firstName,
      userData.lastName,
      userData.role,
      userData.email,
      userData.userId,
      savedVacancies,
      tokenData.token,
      new Date(tokenData.expirationDate)
    );
  }

  startLogoutTimer(user: User) {
    const expirationDuration =
      user.tokenExpirationDate.getTime() - new Date().getTime();
    this.authService.setLogoutTimer(expirationDuration);
  }

  checkTokenValidityAndFinishAuth(loadedUser: User) {
    if (loadedUser.token) {
      this.startLogoutTimer(loadedUser);

      return AuthActions.authSuccess({
        ...loadedUser,
        token: loadedUser.token,
        expirationDate: loadedUser.tokenExpirationDate,
        redirect: false,
      });
    } else {
      localStorage.removeItem('tokenData');
      return AuthActions.autoLoginFail();
    }
  }
}
