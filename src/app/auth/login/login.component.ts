import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { AuthValidators } from '../auth-validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.initForm();
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
}
