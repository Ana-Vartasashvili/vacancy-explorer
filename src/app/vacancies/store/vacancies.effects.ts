import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator, Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import {
  Query,
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
import { db } from 'src/app/firebase/firebase-config';
import { AppState } from 'src/app/store/app.reducer';
import { Vacancy } from '../vacancies.types';
import * as VacanciesActions from './vacancies.actions';
import { clearAddVacancyMessage } from './vacancies.actions';

type ActionFail = ActionCreator<
  string,
  (props: { errorMessage: string }) => {
    errorMessage: string;
  } & TypedAction<string>
>;

type clearErrorAction = ActionCreator<string, () => TypedAction<string>>;

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
          catchError(() =>
            this.handleError(
              VacanciesActions.addVacancyFailed,
              clearAddVacancyMessage,
              'Could not add new vacancy'
            )
          )
        );
      })
    )
  );

  private getVacancyDataFromAction(
    vacancyActionPayload: Vacancy,
    vacancyId: string,
    userId: string
  ): Vacancy {
    return {
      jobTitle: vacancyActionPayload.jobTitle.trim(),
      companyName: vacancyActionPayload.companyName.trim(),
      category: vacancyActionPayload.category,
      city: vacancyActionPayload.city,
      employementType: vacancyActionPayload.employementType,
      experience: vacancyActionPayload.experience,
      jobDescription: vacancyActionPayload.jobDescription.trim(),
      workingType: vacancyActionPayload.workingType,
      salary: vacancyActionPayload.salary,
      status: 'pending',
      createdAt: Timestamp.now(),
      id: vacancyId,
      userId,
    };
  }

  private handleFetchVacancies(
    query: Query,
    actionObjectKey: string,
    actionForSuccess,
    actionForFail: ActionFail,
    clearErrorAction: clearErrorAction,
    errorMessage?: string
  ) {
    return from(getDocs(query)).pipe(
      map((resData: QuerySnapshot<Vacancy>) => {
        let vacancies: Vacancy[] = [];
        resData.forEach((doc) => {
          vacancies.push(doc.data());
        });

        return actionForSuccess({ [actionObjectKey]: vacancies });
      }),
      catchError(() =>
        this.handleError(actionForFail, clearErrorAction, errorMessage)
      )
    );
  }

  private handleError(
    actionForFail: ActionFail,
    clearErrorAction: clearErrorAction,
    errorMessage = 'Could not fetch vacancies.'
  ) {
    setTimeout(() => {
      this.store.dispatch(clearErrorAction());
    }, 3500);

    return of(
      actionForFail({
        errorMessage,
      })
    );
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

        return this.handleFetchVacancies(
          combinedQuery,
          'vacancies',
          VacanciesActions.setVacancies,
          VacanciesActions.getVacanciesFailed,
          VacanciesActions.clearVacanciesError
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
          limit(6)
        );

        return this.handleFetchVacancies(
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
          where('userId', '==', userId)
        );

        return this.handleFetchVacancies(
          q,
          'myVacancies',
          VacanciesActions.fetchMyVacanciesSuccess,
          VacanciesActions.fetchMyVacanciesFailed,
          VacanciesActions.clearMyVacanciesError
        );
      })
    )
  );
}
