import { createReducer, on } from '@ngrx/store';
import * as VacanciesActions from './vacancies.actions';
import { Vacancy } from '../vacancies.types';

export interface VacanciesState {
  addVacancyloading: boolean;
  addVacancyError: string;
  addVacancySuccessMessage: string;
  vacancies: Vacancy[];
  vacanciesError: string;
  vacanciesLoading: boolean;
  latestVacancies: Vacancy[];
  latestVacanciesError: string;
  latestVacanciesLoading: boolean;
}

const initialState: VacanciesState = {
  addVacancyError: null,
  addVacancyloading: false,
  addVacancySuccessMessage: null,
  vacancies: [],
  vacanciesError: null,
  vacanciesLoading: false,
  latestVacancies: [],
  latestVacanciesError: null,
  latestVacanciesLoading: false,
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
  })),

  on(VacanciesActions.clearAddVacancyMessage, (state) => ({
    ...state,
    addVacancyError: null,
    addVacancySuccessMessage: null,
    addVacancyloading: false,
  })),

  on(VacanciesActions.startFetchingVacancies, (state) => ({
    ...state,
    vacanciesError: null,
    vacanciesLoading: true,
  })),

  on(VacanciesActions.setVacancies, (state, action) => ({
    ...state,
    vacancies: action.vacancies,
    vacanciesError: null,
    vacanciesLoading: false,
  })),

  on(VacanciesActions.getVacanciesFailed, (state, action) => ({
    ...state,
    vacancies: [],
    vacanciesError: action.errorMessage,
    vacanciesLoading: false,
  })),

  on(VacanciesActions.clearVacanciesError, (state) => ({
    ...state,
    vacanciesError: null,
    vacanciesLoading: false,
  })),

  on(VacanciesActions.startFetchingLatestVacancies, (state) => ({
    ...state,
    latestVacancies: [],
    latestVacanciesLoading: true,
    latestVacanciesError: null,
  })),

  on(VacanciesActions.setLatestVacancies, (state, action) => ({
    ...state,
    latestVacancies: action.latestVacancies,
    latestVacanciesLoading: false,
    latestVacanciesError: null,
  })),

  on(VacanciesActions.fetchLatestVacanciesFailed, (state, action) => ({
    ...state,
    latestVacancies: [],
    latestVacanciesLoading: false,
    latestVacanciesError: action.errorMessage,
  })),

  on(VacanciesActions.clearLatestVacanciesError, (state) => ({
    ...state,
    latestVacanciesLoading: false,
    latestVacanciesError: null,
  }))
);
