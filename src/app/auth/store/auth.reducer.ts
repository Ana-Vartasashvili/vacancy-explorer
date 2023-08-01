import { createReducer, on } from '@ngrx/store';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  authError: string;
  loading: boolean;
}

export const initialState: AuthState = {
  user: null,
  authError: null,
  loading: false,
};

export const AuthReducer = createReducer(
  initialState,
  on(AuthActions.signupStart, (state) => ({
    ...state,
    authError: null,
    loading: true,
  })),

  on(AuthActions.loginStart, (state) => ({
    ...state,
    authError: null,
    loading: true,
  })),

  on(AuthActions.authSuccess, (state, action) => {
    const user = new User(
      action.firstName,
      action.lastName,
      action.role,
      action.email,
      action.userId,
      action.savedVacancies,
      action.token,
      action.expirationDate
    );

    return {
      ...state,
      user,
      authError: null,
      loading: false,
      redirect: action.redirect,
    };
  }),

  on(AuthActions.logout, (state) => ({ ...state, user: null })),

  on(AuthActions.autoLoginStart, (state) => ({
    ...state,
    loading: true,
    authError: null,
    user: null,
  })),

  on(AuthActions.autoLoginFail, (state) => ({
    ...state,
    user: null,
    loading: false,
    authError: null,
  })),

  on(AuthActions.authFail, (state, action) => ({
    ...state,
    authError: action.errorMessage,
    user: null,
    loading: false,
  })),

  on(AuthActions.clearAuthError, (state) => ({
    ...state,
    authError: null,
    loading: false,
  }))
);
