import { createAction, props } from '@ngrx/store';
import { Vacancy } from '../vacancies.types';

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

export const getVacancies = createAction(
  '[Vacancies] Get Vacancies',
  props<{ vacancies: Vacancy[] }>()
);

export const getVacanciesFailed = createAction(
  '[Vacancies] Get Vacancies Failed',
  props<{ errorMessage: string }>()
);

export const clearVacanciesError = createAction(
  '[Vacancies] Clear Vacancies Error'
);
