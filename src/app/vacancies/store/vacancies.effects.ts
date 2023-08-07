import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator, Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import {
  DocumentSnapshot,
  Query,
  QuerySnapshot,
  Timestamp,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  endBefore,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  or,
  orderBy,
  query,
  setDoc,
  startAfter,
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
import { db } from 'src/app/firebase/firebase-config';
import { AppState } from 'src/app/store/app.reducer';
import {
  getSavedVacanciesDocSnaps,
  getVacanciesList,
} from '../vacancies-helpers';
import { Vacancy } from '../vacancies.types';
import * as VacanciesActions from './vacancies.actions';
import { clearAddVacancyMessage } from './vacancies.actions';
import { vacancies } from './vacancies.selectors';

type ActionFail = ActionCreator<
  string,
  (props: { errorMessage: string }) => {
    errorMessage: string;
  } & TypedAction<string>
>;

type clearErrorAction = ActionCreator<string, () => TypedAction<string>>;

@Injectable()
export class VacanciesEffects {
  firstDoc: DocumentSnapshot;
  lastDoc: DocumentSnapshot;
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
          catchError((error) =>
            this.handleError(
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
      switchMap(([action, vacancies]) => {
        const queries = vacancies.queries.map((query) => {
          return where(query.queryFieldPath, query.operator, query.value);
        });

        let baseQuery: Query;

        if (action.page === null) {
          baseQuery = query(
            collection(db, 'vacancies'),
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc'),
            limit(vacancies.pageSize)
          );
        }

        if (action.page === 'next') {
          baseQuery = query(
            collection(db, 'vacancies'),
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc'),
            startAfter(this.lastDoc),
            limit(vacancies.pageSize)
          );
        }

        if (action.page === 'previous') {
          baseQuery = query(
            collection(db, 'vacancies'),
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc'),
            endBefore(this.firstDoc),
            limitToLast(vacancies.pageSize)
          );
        }

        const combinedQuery = query(baseQuery, or(...queries));

        const queryWithoutPageLimit = query(
          collection(db, 'vacancies'),
          where('status', '==', 'active')
        );

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
            return from(getDocs(combinedQuery)).pipe(
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
                console.log(error);
                return this.handleError(
                  VacanciesActions.getVacanciesFailed,
                  VacanciesActions.clearVacanciesError,
                  error.message
                );
              })
            );
          }),
          catchError((error) => {
            return this.handleError(
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
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
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
                return getSavedVacanciesDocSnaps(userData.savedVacancies).pipe(
                  defaultIfEmpty([]),
                  map((savedVacanciesDocSnaps: DocumentSnapshot<Vacancy>[]) => {
                    const savedVacancies = getVacanciesList(
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
            return this.handleError(
              VacanciesActions.updateSavedVacanciesFailed,
              VacanciesActions.clearSavedVacanciesError,
              error.message
            );
          })
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
    clearErrorAction: clearErrorAction
  ) {
    return from(getDocs(query)).pipe(
      map((resData: QuerySnapshot<Vacancy>) => {
        let vacancies: Vacancy[] = [];
        resData.forEach((doc) => {
          vacancies.push(doc.data());
        });

        return actionForSuccess({ [actionObjectKey]: vacancies });
      }),
      catchError((error) => {
        return this.handleError(actionForFail, clearErrorAction, error.message);
      })
    );
  }

  private handleError(
    actionForFail: ActionFail,
    clearErrorAction: clearErrorAction,
    errorMsg: string
  ) {
    const errorMessage = errorMsg.split('.')[0].split(':')[0];
    setTimeout(() => {
      this.store.dispatch(clearErrorAction());
    }, 3500);

    return of(
      actionForFail({
        errorMessage,
      })
    );
  }
}
