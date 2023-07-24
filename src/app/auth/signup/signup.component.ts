import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthValidators } from '../auth-validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  ngOnInit(): void {
    this.signupForm = this.initForm();
  }

  initForm() {
    return new FormGroup({
      firstName: new FormControl('', [
        AuthValidators.required,
        AuthValidators.minLength(4),
        AuthValidators.maxLength(15),
      ]),
      lastName: new FormControl('', [
        AuthValidators.required,
        AuthValidators.minLength(4),
        AuthValidators.maxLength(30),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        AuthValidators.required,
        AuthValidators.minLength(8),
        AuthValidators.passwordStrength,
      ]),
      confirmPassword: new FormControl(null, [
        AuthValidators.required,
        AuthValidators.passwordStrength,
        AuthValidators.matchValues('password'),
      ]),
    });
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

  onSubmit() {
    console.log(this.errorMessage('firstName'));
    console.log(this.signupForm);
  }
}
