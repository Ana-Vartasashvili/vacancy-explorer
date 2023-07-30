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
  '[Vacancies] Start Fetching Vacancies',
  props<{ queries: Query[] }>()
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
