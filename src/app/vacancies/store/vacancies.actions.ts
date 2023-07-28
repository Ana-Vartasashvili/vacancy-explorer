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
