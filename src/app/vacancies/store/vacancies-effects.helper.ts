import { ActionCreator, Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import {
  DocumentSnapshot,
  Query,
  QueryFieldFilterConstraint,
  QuerySnapshot,
  Timestamp,
  collection,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  or,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { catchError, from, map, of } from 'rxjs';
import { db } from 'src/app/firebase/firebase-config';
import { AppState } from 'src/app/store/app.reducer';
import { Vacancy } from '../vacancies.types';
import { VacanciesState } from './vacancies.reducer';

type ActionFail = ActionCreator<
  string,
  (props: { errorMessage: string }) => {
    errorMessage: string;
  } & TypedAction<string>
>;

type clearErrorAction = ActionCreator<string, () => TypedAction<string>>;

export class VacanciesEffectsHelper {
  static getVacancyDataFromAction(
    vacancyActionPayload: Vacancy,
    vacancyId: string,
    userId: string,
    currentUserRole: string
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
      status: currentUserRole === 'admin' ? 'active' : 'pending',
      createdAt: Timestamp.now(),
      id: vacancyId,
      userId,
    };
  }

  static handleFetchVacancies(
    store: Store<AppState>,
    query: Query,
    actionObjectKey: string,
    actionForSuccess: any,
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
        return VacanciesEffectsHelper.handleError(
          store,
          actionForFail,
          clearErrorAction,
          error.message
        );
      })
    );
  }

  static handleError(
    store: Store<AppState>,
    actionForFail: ActionFail,
    clearErrorAction: clearErrorAction,
    errorMsg: string
  ) {
    const errorMessage = errorMsg.split('.')[0].split(':')[0];
    setTimeout(() => {
      store.dispatch(clearErrorAction());
    }, 3500);

    return of(
      actionForFail({
        errorMessage,
      })
    );
  }

  static generateMainQuery(
    page: 'previous' | 'next' | null,
    queries: QueryFieldFilterConstraint[],
    lastDoc: DocumentSnapshot,
    firstDoc: DocumentSnapshot,
    vacanciesState: VacanciesState
  ) {
    const { vacanciesSearchInputValue, pageSize, vacanciesStatus } =
      vacanciesState;
    let baseQuery = query(
      collection(db, 'vacancies'),
      where('status', '==', vacanciesStatus),
      orderBy('createdAt', 'desc')
    );

    if (vacanciesSearchInputValue) {
      baseQuery = query(
        baseQuery,
        where('jobTitle', '==', vacanciesSearchInputValue)
      );
    }

    let combinedQuery: Query;
    switch (page) {
      case null:
        combinedQuery = query(baseQuery, limit(pageSize));
        break;
      case 'next':
        combinedQuery = query(baseQuery, startAfter(lastDoc), limit(pageSize));
        break;
      case 'previous':
        combinedQuery = query(
          baseQuery,
          endBefore(firstDoc),
          limitToLast(pageSize)
        );
        break;
    }

    return query(combinedQuery, or(...queries));
  }

  static generateQueryWithoutPageLimit(vacanciesState: VacanciesState) {
    const { vacanciesStatus, vacanciesSearchInputValue } = vacanciesState;
    let queryWithoutPageLimit = query(
      collection(db, 'vacancies'),
      where('status', '==', vacanciesStatus)
    );
    if (vacanciesSearchInputValue) {
      queryWithoutPageLimit = query(
        queryWithoutPageLimit,
        where('jobTitle', '==', vacanciesSearchInputValue)
      );
    }

    return queryWithoutPageLimit;
  }
}
