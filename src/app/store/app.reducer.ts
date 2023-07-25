import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import { AuthState } from '../auth/store/auth.reducer';

export interface AppState {
  auth: AuthState;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.AuthReducer,
};
