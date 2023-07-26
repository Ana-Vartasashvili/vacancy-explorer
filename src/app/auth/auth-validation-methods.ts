import { AbstractControl, FormGroup } from '@angular/forms';

export abstract class AuthValidationMethods {
  get(formControlName: string, form: FormGroup): AbstractControl {
    return form.get(formControlName);
  }

  isInvalidAndTouched(formControlName: string, form: FormGroup) {
    return (
      form.get(formControlName).invalid && form.get(formControlName).touched
    );
  }

  hasError(formControlName: string, form: FormGroup) {
    return !!form.get(formControlName).errors;
  }

  errorMessage(formControlName: string, form: FormGroup) {
    return Object.values(form.get(formControlName).errors)[0];
  }
}
