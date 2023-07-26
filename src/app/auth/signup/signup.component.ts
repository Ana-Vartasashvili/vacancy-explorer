import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { AuthValidators } from '../auth-validators';
import { clearAuthError, signupStart } from '../store/auth.actions';
import { auth } from '../store/auth.selectors';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  storeSub: Subscription;
  isLoading = false;
  authError: string = null;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.signupForm = this.initForm();
    this.storeSub = this.store.select(auth).subscribe((authState) => {
      this.isLoading = authState.loading;
      this.authError = authState.authError;
      setTimeout(() => {
        this.authError = null;
        this.store.dispatch(clearAuthError());
      }, 3500);
    });
  }

  initForm() {
    return new FormGroup({
      firstName: new FormControl('', [
        AuthValidators.required,
        AuthValidators.minLength(2),
        AuthValidators.maxLength(15),
      ]),
      lastName: new FormControl('', [
        AuthValidators.required,
        AuthValidators.minLength(2),
        AuthValidators.maxLength(30),
      ]),
      email: new FormControl('', [
        AuthValidators.required,
        AuthValidators.email,
      ]),
      password: new FormControl('', [
        AuthValidators.required,
        AuthValidators.minLength(8),
        AuthValidators.passwordStrength,
      ]),
      confirmPassword: new FormControl(null, [
        AuthValidators.required,
        AuthValidators.matchValues('password'),
      ]),
    });
  }

  onSubmit() {
    if (!this.signupForm.valid) return;
    const { email, password } = this.signupForm.value;

    this.store.dispatch(signupStart({ email, password }));
  }

  get(formControlName: string): AbstractControl {
    return this.signupForm.get(formControlName);
  }

  isInvalidAndTouched(formControlName: string) {
    return (
      this.get(formControlName).invalid && this.get(formControlName).touched
    );
  }

  hasError(formControlName: string) {
    return !!this.signupForm.get(formControlName).errors;
  }

  errorMessage(formControlName: string) {
    return Object.values(this.signupForm.get(formControlName).errors)[0];
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
