import { createReducer, on } from '@ngrx/store';
import * as VacanciesActions from './vacancies.actions';

export interface VacanciesState {
  addVacancyloading: boolean;
  addVacancyError: string;
  addVacancySuccessMessage: string;
}

const initialState: VacanciesState = {
  addVacancyError: null,
  addVacancyloading: false,
  addVacancySuccessMessage: null,
};

export const VacanciesReducer = createReducer(
  initialState,

  on(VacanciesActions.startAddingVacancy, (state) => ({
    ...state,
    addVacancyLoading: true,
    addVacancyError: null,
    addVacancySuccessMessage: null,
  })),

  on(VacanciesActions.addVacancyFailed, (state, action) => ({
    ...state,
    addVacancyError: action.errorMessage,
    addVacancyloading: false,
    addVacancySuccessMessage: null,
  })),

  on(VacanciesActions.addVacancySuccess, (state) => ({
    ...state,
    addVacancyloading: false,
    addVacancyError: null,
    addVacancySuccessMessage: 'Your vacancy has been sent successfully.',
  }))
);
