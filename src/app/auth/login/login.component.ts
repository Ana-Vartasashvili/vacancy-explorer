import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { AuthValidators } from '../auth-validators';
import * as AuthActions from '../store/auth.actions';
import { auth } from '../store/auth.selectors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  storeSub: Subscription;
  isLoading = false;
  authError = null;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.loginForm = this.initForm();
    this.storeSub = this.store.select(auth).subscribe((authState) => {
      this.isLoading = authState.loading;
      this.authError = authState.authError;
      setTimeout(() => {
        this.authError = null;
      }, 3500);
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
  }

  get(formControlName: string): AbstractControl {
    return this.loginForm.get(formControlName);
  }

  isInvalidAndTouched(formControlName: string) {
    return (
      this.get(formControlName).invalid && this.get(formControlName).touched
    );
  }

  hasError(formControlName: string) {
    return !!this.loginForm.get(formControlName).errors;
  }

  errorMessage(formControlName: string) {
    return Object.values(this.loginForm.get(formControlName).errors)[0];
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
