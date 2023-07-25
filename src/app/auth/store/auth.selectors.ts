import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { AuthState } from './auth.reducer';

export const selectAuth = (state: AppState) => state.auth;

export const user = createSelector(
  selectAuth,
  (state: AuthState) => state.user
);

export const authError = createSelector(
  selectAuth,
  (state: AuthState) => state.authError
);

export const authLoading = createSelector(
  selectAuth,
  (state: AuthState) => state.loading
);
