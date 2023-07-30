import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppValidators } from 'src/app/shared/validators/app-validators';
import { AppState } from 'src/app/store/app.reducer';
import { signupStart } from '../store/auth.actions';
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
    });
  }

  initForm() {
    return new FormGroup({
      firstName: new FormControl('', [
        AppValidators.required,
        AppValidators.noWhiteSpaces,
        AppValidators.minLength(2),
        AppValidators.maxLength(15),
      ]),
      lastName: new FormControl('', [
        AppValidators.required,
        AppValidators.noWhiteSpaces,
        AppValidators.minLength(2),
        AppValidators.maxLength(30),
      ]),
      email: new FormControl('', [AppValidators.required, AppValidators.email]),
      password: new FormControl('', [
        AppValidators.required,
        AppValidators.minLength(8),
        AppValidators.passwordStrength,
      ]),
      confirmPassword: new FormControl(null, [
        AppValidators.required,
        AppValidators.matchValues('password'),
      ]),
    });
  }

  onSubmit() {
    if (!this.signupForm.valid) return;
    const { email, password, firstName, lastName } = this.signupForm.value;

    this.store.dispatch(signupStart({ email, password, firstName, lastName }));
    this.signupForm.reset();
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
