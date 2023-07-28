import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { VacanciesState } from './vacancies.reducer';

export const vacancies = (state: AppState) => state.vacancies;

export const addVacancyError = createSelector(
  vacancies,
  (state: VacanciesState) => state.addVacancyError
);

export const addVacancySuccessMessage = createSelector(
  vacancies,
  (state: VacanciesState) => state.addVacancySuccessMessage
);

export const addVacancyLoading = createSelector(
  vacancies,
  (state: VacanciesState) => state.addVacancyloading
);
