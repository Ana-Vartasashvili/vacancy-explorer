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

export const vacanciesList = createSelector(
  vacancies,
  (state: VacanciesState) => state.vacancies
);

export const vacanciesError = createSelector(
  vacancies,
  (state: VacanciesState) => state.vacanciesError
);

export const vacanciesLoading = createSelector(
  vacancies,
  (state: VacanciesState) => state.vacanciesLoading
);

export const latestVacanciesList = createSelector(
  vacancies,
  (state: VacanciesState) => state.latestVacancies
);

export const latestVacanciesError = createSelector(
  vacancies,
  (state: VacanciesState) => state.latestVacanciesError
);

export const latestVacanciesLoading = createSelector(
  vacancies,
  (state: VacanciesState) => state.latestVacanciesLoading
);

export const savedVacancies = createSelector(
  vacancies,
  (state: VacanciesState) => state.savedVacancies
);

export const savedVacanciesError = createSelector(
  vacancies,
  (state: VacanciesState) => state.savedVacanciesError
);

export const savedVacanciesLoading = createSelector(
  vacancies,
  (state: VacanciesState) => state.savedVacanciesLoading
);
