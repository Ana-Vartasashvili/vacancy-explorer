import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { AuthState } from './auth.reducer';

export const auth = (state: AppState) => state.auth;

export const user = createSelector(auth, (state: AuthState) => state.user);

export const authError = createSelector(
  auth,
  (state: AuthState) => state.authError
);

export const authLoading = createSelector(
  auth,
  (state: AuthState) => state.loading
);
