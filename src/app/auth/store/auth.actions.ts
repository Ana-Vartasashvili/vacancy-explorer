import { createAction, props } from '@ngrx/store';

export const signupStart = createAction(
  '[Auth] Signup Start',
  props<{ email: string; password: string }>()
);

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{ email: string; password: string }>()
);

export const authSuccess = createAction(
  '[Auth] Auth Success',
  props<{
    email: string;
    userId: string;
    token: string;
    expirationDate: Date;
  }>()
);

export const authFail = createAction(
  '[Auth] Auth Fail',
  props<{ errorMessage: string }>()
);

export const clearAuthError = createAction('[Auth] Auth Clear Error');
