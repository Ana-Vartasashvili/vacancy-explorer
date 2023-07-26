import { createReducer, on } from '@ngrx/store';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';
import { authError } from './auth.selectors';

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
    const { email, expirationDate, token, userId } = action;
    const user = new User(email, userId, token, expirationDate);
    console.log(user);

    return {
      ...state,
      user,
      authError: null,
      loading: false,
    };
  }),

  on(AuthActions.authFail, (state, action) => ({
    ...state,
    authError: action.errorMessage,
    user: null,
    loading: false,
  })),

  on(AuthActions.clearAuthError, (state) => ({
    ...state,
    authError: null,
  }))
);
