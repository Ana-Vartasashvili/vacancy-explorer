import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { AuthValidationMethods } from '../auth-validation-methods';
import { AuthValidators } from '../auth-validators';
import * as AuthActions from '../store/auth.actions';
import { auth } from '../store/auth.selectors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent
  extends AuthValidationMethods
  implements OnInit, OnDestroy
{
  loginForm: FormGroup;
  storeSub: Subscription;
  isLoading = false;
  authError = null;

  constructor(private store: Store<AppState>) {
    super();
  }

  ngOnInit(): void {
    this.loginForm = this.initForm();
    this.storeSub = this.store.select(auth).subscribe((authState) => {
      this.isLoading = authState.loading;
      this.authError = authState.authError;
    });
  }

  initForm() {
    return new FormGroup({
      email: new FormControl('', [
        AuthValidators.required,
        AuthValidators.email,
      ]),
      password: new FormControl('', [AuthValidators.required]),
    });
  }

  onSubmit() {
    this.store.dispatch(AuthActions.loginStart(this.loginForm.value));
    this.loginForm.reset();
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
