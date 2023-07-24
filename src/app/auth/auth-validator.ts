import { ValidationErrors, AbstractControl } from '@angular/forms';

export const passwordMatchValidator = (
  matchTo: string
): ((AbstractControl) => ValidationErrors | null) => {
  return (control: AbstractControl): ValidationErrors | null => {
    return !!control.parent &&
      !!control.parent.value &&
      control.value === control.parent.controls[matchTo].value
      ? undefined
      : { isMatching: 'Passwords do not match' };
  };
};
