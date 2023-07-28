import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import { AuthState } from '../auth/store/auth.reducer';
import * as fromVacancies from '../vacancies/store/vacancies.reducer';
import { VacanciesState } from '../vacancies/store/vacancies.reducer';

export interface AppState {
  auth: AuthState;
  vacancies: VacanciesState;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.AuthReducer,
  vacancies: fromVacancies.VacanciesReducer,
};
