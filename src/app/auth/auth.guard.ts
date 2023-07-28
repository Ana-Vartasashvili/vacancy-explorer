import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store/app.reducer';
import { user } from './store/auth.selectors';
import { User } from './user.model';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  let currentUser: User;

  inject(Store<AppState>)
    .select(user)
    .subscribe((user) => (currentUser = user));

  if (currentUser) {
    return true;
  } else {
    return inject(Router).createUrlTree(['/auth', 'login']);
  }
};
