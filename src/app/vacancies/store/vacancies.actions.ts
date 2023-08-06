import { createAction, props } from '@ngrx/store';
import { Vacancy } from '../vacancies.types';
import { WhereFilterOp } from 'firebase/firestore';

export interface Query {
  queryFieldPath: string;
  value: string;
  operator: WhereFilterOp;
}

export const startAddingVacancy = createAction(
  '[Vacancies] Start Adding Vacancy',
  props<Vacancy>()
);

export const addVacancyFailed = createAction(
  '[Vacancies] Add Vacancy Failed',
  props<{ errorMessage: string }>()
);

export const addVacancySuccess = createAction(
  '[Vacancies] Add Vacancy Success'
);

export const clearAddVacancyMessage = createAction(
  '[Vacancies] Clear Add Vacancy Message'
);

export const startFetchingVacancies = createAction(
  '[Vacancies] Start Fetching Vacancies'
);

export const setVacancies = createAction(
  '[Vacancies] Set Vacancies',
  props<{ vacancies: Vacancy[] }>()
);

export const getVacanciesFailed = createAction(
  '[Vacancies] Get Vacancies Failed',
  props<{ errorMessage: string }>()
);

export const clearVacanciesError = createAction(
  '[Vacancies] Clear Vacancies Error'
);

export const startFetchingLatestVacancies = createAction(
  '[Vacancies] Start Fetching Latest Vacancies'
);

export const setLatestVacancies = createAction(
  '[Vacancies] Set Latest Vacancies',
  props<{ latestVacancies: Vacancy[] }>()
);

export const fetchLatestVacanciesFailed = createAction(
  '[Vacancies] Fetch Latest Vacancies Failed',
  props<{ errorMessage: string }>()
);

export const clearLatestVacanciesError = createAction(
  '[Vacancies] Clear Latest Vacancies Error'
);

export const startFetchingMyVacancies = createAction(
  '[Vacancies] Start Fetching My Vacancies'
);

export const fetchMyVacanciesSuccess = createAction(
  '[Vacancies] Fetch My Vacancies Success',
  props<{ myVacancies: Vacancy[] }>()
);

export const fetchMyVacanciesFailed = createAction(
  '[Vacancies] Fetch My Vacancies Failed',
  props<{ errorMessage: string }>()
);

export const clearMyVacanciesError = createAction(
  '[Vacancies] Clear My Vacancies Error'
);

export const startUpdatingSavedVacancies = createAction(
  '[Vacancies] Start Adding To Saved Vacancies',
  props<{ vacancyId: string; updateType: string }>()
);

export const updateSavedVacanciesSuccess = createAction(
  '[Vacancies] Add To Saved Vacancies Success',
  props<{ savedVacancies: Vacancy[] }>()
);

export const updateSavedVacanciesFailed = createAction(
  '[Vacancies] Add To Saved Vacancies Failed',
  props<{ errorMessage: string }>()
);

export const clearSavedVacanciesError = createAction(
  '[Vacancies] Clear Saved Vacancies Error'
);

export const setVacanciesSearchInputValue = createAction(
  '[Vacancies] Set Vacancies Search Input Value',
  props<{ inputValue: string }>()
);

export const setPageSize = createAction(
  '[Vacancies] Set Page Size',
  props<{ pageSize: number }>()
);

export const setQueries = createAction(
  '[Vacancies] Set Queries',
  props<{ queries: Query[] }>()
);

export const setNumberOfFetchedVacancies = createAction(
  '[Vacancies] Set Number Of Fetched Vacancies',
  props<{ numberOfFetchedVacancies: number }>()
);
