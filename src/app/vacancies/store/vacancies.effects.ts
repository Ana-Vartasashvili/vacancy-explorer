import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  DocumentSnapshot,
  QuerySnapshot,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  catchError,
  concatMap,
  defaultIfEmpty,
  from,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { UserData } from 'src/app/auth/auth.types';
import { user } from 'src/app/auth/store/auth.selectors';
import { db } from 'src/app/firebase/firebase-config';
import { AppState } from 'src/app/store/app.reducer';
import { Vacancy } from '../vacancies.types';
import { VacanciesEffectsHelper } from './vacancies-effects.helper';
import * as VacanciesActions from './vacancies.actions';
import { clearAddVacancyMessage } from './vacancies.actions';
import { vacancies } from './vacancies.selectors';

@Injectable()
export class VacanciesEffects {
  firstDoc: DocumentSnapshot;
  lastDoc: DocumentSnapshot;
  constructor(private actions$: Actions, private store: Store<AppState>) {}

  addVacancy = createEffect(() =>
    this.actions$.pipe(
      ofType(VacanciesActions.startAddingVacancy),
      concatLatestFrom(() => this.store.select(user)),
      switchMap(([startAddingVacancyAction, currentUser]) => {
        const user = JSON.parse(localStorage.getItem('tokenData'));
        if (!user) {
          return of(
            VacanciesActions.addVacancyFailed({
              errorMessage: 'User is not authenticated!',
            })
          );
        }

        const newVacancyRef = doc(collection(db, 'vacancies'));
        const docId = newVacancyRef.id;
        const newVacancy = VacanciesEffectsHelper.getVacancyDataFromAction(
          startAddingVacancyAction,
          docId,
          user.userId,
          currentUser.role
        );

        return from(setDoc(doc(db, 'vacancies', docId), newVacancy)).pipe(
          map(() => {
            setTimeout(() => {
              this.store.dispatch(clearAddVacancyMessage());
            }, 3500);

            return VacanciesActions.addVacancySuccess({
              message:
                currentUser.role === 'admin'
                  ? 'Vacancy added successfully!'
                  : 'Your vacancy has been sent successfully.',
            });
          }),
          catchError((error) =>
            VacanciesEffectsHelper.handleError(
              this.store,
              VacanciesActions.addVacancyFailed,
              clearAddVacancyMessage,
              error.message
            )
          )
        );
      })
    )
  );

  fetchVacancies = createEffect(() =>
    this.actions$.pipe(
      ofType(VacanciesActions.startFetchingVacancies),
      concatLatestFrom(() => this.store.select(vacancies)),
      switchMap(([action, vacanciesState]) => {
        const queries = vacanciesState.queries.map((query) => {
          return where(query.queryFieldPath, query.operator, query.value);
        });
        const mainQuery = VacanciesEffectsHelper.generateMainQuery(
          action.page,
          queries,
          this.lastDoc,
          this.firstDoc,
          vacanciesState
        );
        const queryWithoutPageLimit =
          VacanciesEffectsHelper.generateQueryWithoutPageLimit(vacanciesState);

        return from(
          getCountFromServer(query(queryWithoutPageLimit, or(...queries)))
        ).pipe(
          tap((vacanciesSnaps) =>
            this.store.dispatch(
              VacanciesActions.setNumberOfFetchedVacancies({
                numberOfFetchedVacancies: vacanciesSnaps.data().count,
              })
            )
          ),
          switchMap(() => {
            return from(getDocs(mainQuery)).pipe(
              map((vacanciesDocsSnaps: QuerySnapshot<Vacancy>) => {
                this.lastDoc =
                  vacanciesDocsSnaps.docs[vacanciesDocsSnaps.docs.length - 1];
                this.firstDoc = vacanciesDocsSnaps.docs[0];

                let vacancies: Vacancy[] = [];
                vacanciesDocsSnaps.forEach((doc) => {
                  vacancies.push(doc.data());
                });

                return VacanciesActions.setVacancies({ vacancies });
              }),
              catchError((error) => {
                return VacanciesEffectsHelper.handleError(
                  this.store,
                  VacanciesActions.getVacanciesFailed,
                  VacanciesActions.clearVacanciesError,
                  error.message
                );
              })
            );
          }),
          catchError((error) => {
            return VacanciesEffectsHelper.handleError(
              this.store,
              VacanciesActions.getVacanciesFailed,
              VacanciesActions.clearVacanciesError,
              error.message
            );
          })
        );
      })
    )
  );

  fetchLatestVacancies = createEffect(() =>
    this.actions$.pipe(
      ofType(VacanciesActions.startFetchingLatestVacancies),
      switchMap(() => {
        const q = query(
          collection(db, 'vacancies'),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc'),
          limit(6)
        );

        return VacanciesEffectsHelper.handleFetchVacancies(
          this.store,
          q,
          'latestVacancies',
          VacanciesActions.setLatestVacancies,
          VacanciesActions.fetchLatestVacanciesFailed,
          VacanciesActions.clearLatestVacanciesError
        );
      })
    )
  );

  fetchMyVacancies = createEffect(() =>
    this.actions$.pipe(
      ofType(VacanciesActions.startFetchingMyVacancies),
      switchMap(() => {
        const userId = JSON.parse(localStorage.getItem('tokenData')).userId;
        const q = query(
          collection(db, 'vacancies'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );

        return VacanciesEffectsHelper.handleFetchVacancies(
          this.store,
          q,
          'myVacancies',
          VacanciesActions.fetchMyVacanciesSuccess,
          VacanciesActions.fetchMyVacanciesFailed,
          VacanciesActions.clearMyVacanciesError
        );
      })
    )
  );

  updateSavedVacancies = createEffect(() =>
    this.actions$.pipe(
      ofType(VacanciesActions.startUpdatingSavedVacancies),
      concatMap((startAddingAction) => {
        const userId = JSON.parse(localStorage.getItem('tokenData')).userId;
        const userRef = doc(db, 'users', userId);
        const vacancyDocRef = doc(db, 'vacancies', startAddingAction.vacancyId);
        let updatedSavedVacanciesField = {
          savedVacancies: arrayUnion(vacancyDocRef),
        };
        if (startAddingAction.updateType === 'remove') {
          updatedSavedVacanciesField = {
            savedVacancies: arrayRemove(vacancyDocRef),
          };
        }

        return from(updateDoc(userRef, updatedSavedVacanciesField)).pipe(
          concatMap(() => {
            return from(getDoc(userRef)).pipe(
              map((userDocSnap) => {
                if (userDocSnap.exists()) {
                  return userDocSnap.data();
                }
                return null;
              }),
              concatMap((userData: UserData) => {
                return VacanciesEffectsHelper.getSavedVacanciesDocSnaps(
                  userData.savedVacancies
                ).pipe(
                  defaultIfEmpty([]),
                  map((savedVacanciesDocSnaps: DocumentSnapshot<Vacancy>[]) => {
                    const savedVacancies =
                      VacanciesEffectsHelper.getVacanciesList(
                        savedVacanciesDocSnaps
                      );
                    return VacanciesActions.updateSavedVacanciesSuccess({
                      savedVacancies: savedVacancies,
                    });
                  })
                );
              })
            );
          }),
          catchError((error) => {
            return VacanciesEffectsHelper.handleError(
              this.store,
              VacanciesActions.updateSavedVacanciesFailed,
              VacanciesActions.clearSavedVacanciesError,
              error.message
            );
          })
        );
      })
    )
  );

  deleteVacancy = createEffect(() =>
    this.actions$.pipe(
      ofType(VacanciesActions.deleteVacancy),
      switchMap((action) => {
        return from(deleteDoc(doc(db, 'vacancies', action.vacancyId))).pipe(
          map(() => {
            return VacanciesActions.startFetchingVacancies({ page: null });
          }),
          catchError((error) => {
            return VacanciesEffectsHelper.handleError(
              this.store,
              VacanciesActions.updateSavedVacanciesFailed,
              VacanciesActions.clearSavedVacanciesError,
              error.message
            );
          })
        );
      })
    )
  );

  updateVacancy = createEffect(() =>
    this.actions$.pipe(
      ofType(VacanciesActions.updateVacancy),
      switchMap((action) => {
        const vacancyDocRef = doc(db, 'vacancies', action.vacancyId);

        return from(
          updateDoc(vacancyDocRef, { [action.fieldName]: action.updatedValue })
        ).pipe(
          map(() => VacanciesActions.startFetchingVacancies({ page: null })),
          catchError((error) => {
            return VacanciesEffectsHelper.handleError(
              this.store,
              VacanciesActions.updateSavedVacanciesFailed,
              VacanciesActions.clearSavedVacanciesError,
              error.message
            );
          })
        );
      })
    )
  );
}
