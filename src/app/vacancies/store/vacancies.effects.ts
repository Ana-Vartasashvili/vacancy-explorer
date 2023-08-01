import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  QuerySnapshot,
  Timestamp,
  collection,
  doc,
  getDocs,
  limit,
  or,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { user } from 'src/app/auth/store/auth.selectors';
import { db } from 'src/app/firebase/firebase-config';
import { AppState } from 'src/app/store/app.reducer';
import { Vacancy } from '../vacancies.types';
import * as VacanciesActions from './vacancies.actions';
import {
  clearAddVacancyMessage,
  clearLatestVacanciesError,
  clearMyVacanciesError,
  clearVacanciesError,
} from './vacancies.actions';

@Injectable()
export class VacanciesEffects {
  constructor(private actions$: Actions, private store: Store<AppState>) {}

  addVacancy = createEffect(() =>
    this.actions$.pipe(
      ofType(VacanciesActions.startAddingVacancy),

      switchMap((startAddingVacancyAction) => {
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
        const newVacancy = this.getVacancyDataFromAction(
          startAddingVacancyAction,
          docId,
          user.userId
        );

        return from(setDoc(doc(db, 'vacancies', docId), newVacancy)).pipe(
          map(() => {
            setTimeout(() => {
              this.store.dispatch(clearAddVacancyMessage());
            }, 3500);

            return VacanciesActions.addVacancySuccess();
          }),
          catchError(() => {
            setTimeout(() => {
              this.store.dispatch(clearAddVacancyMessage());
            }, 3500);

            return of(
              VacanciesActions.addVacancyFailed({
                errorMessage: 'Could not add new vacancy',
              })
            );
          })
        );
      })
    )
  );

  private getVacancyDataFromAction(
    action,
    vacancyId: string,
    userId: string
  ): Vacancy {
    return {
      jobTitle: action.jobTitle.trim(),
      companyName: action.companyName.trim(),
      category: action.category,
      city: action.city,
      employementType: action.employementType,
      experience: action.experience,
      jobDescription: action.jobDescription.trim(),
      workingType: action.workingType,
      salary: action.salary,
      status: 'pending',
      createdAt: Timestamp.now(),
      id: vacancyId,
      userId,
    };
  }

  fetchVacancies = createEffect(() =>
    this.actions$.pipe(
      ofType(VacanciesActions.startFetchingVacancies),
      switchMap((startFetchingAction) => {
        const queries = startFetchingAction.queries.map((query) => {
          return where(query.queryFieldPath, query.operator, query.value);
        });

        const baseQuery = query(
          collection(db, 'vacancies'),
          where('status', '==', 'active'),
          limit(10)
        );
        const combinedQuery = query(baseQuery, or(...queries));

        return from(getDocs(combinedQuery)).pipe(
          map((resData: QuerySnapshot<Vacancy>) => {
            let vacancies: Vacancy[] = [];

            resData.forEach((doc) => {
              vacancies.push(doc.data());
            });

            return VacanciesActions.setVacancies({ vacancies });
          }),
          catchError(() => {
            setTimeout(() => {
              this.store.dispatch(clearVacanciesError());
            }, 3500);

            return of(
              VacanciesActions.getVacanciesFailed({
                errorMessage: 'Could not fetch vacancies.',
              })
            );
          })
        );
      })
    )
  );

  fetchLatestVacancies = createEffect(() =>
    this.actions$.pipe(
      ofType(VacanciesActions.startFetchingLatestVacancies),
      switchMap((startFetchingAction) => {
        const q = query(
          collection(db, 'vacancies'),
          where('status', '==', 'active'),
          limit(6)
        );

        return from(getDocs(q)).pipe(
          map((resData: QuerySnapshot<Vacancy>) => {
            let latestVacancies: Vacancy[] = [];

            resData.forEach((doc) => {
              latestVacancies.push(doc.data());
            });

            return VacanciesActions.setLatestVacancies({ latestVacancies });
          }),
          catchError(() => {
            setTimeout(() => {
              this.store.dispatch(clearLatestVacanciesError());
            }, 3500);

            return of(
              VacanciesActions.fetchLatestVacanciesFailed({
                errorMessage: 'Could not fetch latest vacancies.',
              })
            );
          })
        );
      })
    )
  );

  fetchMyVacancies = createEffect(() =>
    this.actions$.pipe(
      ofType(VacanciesActions.startFetchingMyVacancies),
      switchMap((startFetchingAction) => {
        const userId = JSON.parse(localStorage.getItem('tokenData')).userId;

        const q = query(
          collection(db, 'vacancies'),
          where('userId', '==', userId)
        );

        return from(getDocs(q)).pipe(
          map((resData: QuerySnapshot<Vacancy>) => {
            let myVacancies: Vacancy[] = [];

            resData.forEach((doc) => {
              myVacancies.push(doc.data());
            });

            return VacanciesActions.fetchMyVacanciesSuccess({ myVacancies });
          }),
          catchError(() => {
            setTimeout(() => {
              this.store.dispatch(clearMyVacanciesError());
            }, 3500);

            return of(
              VacanciesActions.fetchMyVacanciesFailed({
                errorMessage: 'Could not fetch vacancies.',
              })
            );
          })
        );
      })
    )
  );
}
