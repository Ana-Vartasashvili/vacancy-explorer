import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  QuerySnapshot,
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { db } from 'src/app/firebase/firebase-config';
import { AppState } from 'src/app/store/app.reducer';
import { Vacancy } from '../vacancies.types';
import * as VacanciesActions from './vacancies.actions';
import {
  clearAddVacancyMessage,
  clearLatestVacanciesError,
  clearVacanciesError,
} from './vacancies.actions';

@Injectable()
export class VacanciesEffects {
  constructor(private actions$: Actions, private store: Store<AppState>) {}

  addVacancy = createEffect(() =>
    this.actions$.pipe(
      ofType(VacanciesActions.startAddingVacancy),
      switchMap((startAddingVacancyAction) => {
        const tokenData = localStorage.getItem('tokenData');
        if (!tokenData) {
          return of(
            VacanciesActions.addVacancyFailed({
              errorMessage: 'User is not authenticated!',
            })
          );
        }

        const newVacancyRef = doc(collection(db, 'vacancies'));
        const docId = newVacancyRef.id;

        return from(
          setDoc(
            doc(db, 'vacancies', docId),
            this.getVacancyDataFromAction(startAddingVacancyAction, docId)
          )
        ).pipe(
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

  private getVacancyDataFromAction(action, id: string) {
    return {
      jobTitle: action.jobTitle.trim(),
      companyName: action.companyName.trim(),
      category: action.category.trim(),
      city: action.city.trim(),
      employementType: action.employementType.trim(),
      experience: action.experience.trim(),
      jobDescription: action.jobDescription.trim(),
      workingType: action.workingType.trim(),
      salary: action.salary,
      status: 'pending',
      createdAt: serverTimestamp(),
      id,
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
        const combinedQuery = query(baseQuery, ...queries);

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
}
