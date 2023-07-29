import { createAction, props } from '@ngrx/store';

export const signupStart = createAction(
  '[Auth] Signup Start',
  props<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }>()
);

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{ email: string; password: string }>()
);

export const authSuccess = createAction(
  '[Auth] Auth Success',
  props<{
    firstName: string;
    lastName: string;
    role: string;
    myVacancies: [];
    savedVacancies: [];
    email: string;
    userId: string;
    token: string;
    expirationDate: Date;
    redirect: boolean;
  }>()
);

export const logout = createAction('[Auth] Logout');

export const autoLoginStart = createAction('[Auth] Auto Login');

export const autoLoginFail = createAction('[Auth] Auto Login Fail');

export const authFail = createAction(
  '[Auth] Auth Fail',
  props<{ errorMessage: string }>()
);

export const clearAuthError = createAction('[Auth] Auth Clear Error');
