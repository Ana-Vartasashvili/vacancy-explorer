import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';

export class AuthValidators extends Validators {
  static override minLength(length: number): any {
    return (control: AbstractControl) =>
      super.minLength(length)(control)
        ? { minLength: `Field length can not be less than ${length}.` }
        : undefined;
  }

  static override maxLength(length: number): any {
    return (control: AbstractControl) =>
      super.maxLength(length)(control)
        ? { maxLength: `Field length can not be more than ${length}.` }
        : undefined;
  }

  static override required(control: AbstractControl): any {
    return super.required(control)
      ? { required: 'Field is required' }
      : undefined;
  }

  static override email(control: AbstractControl) {
    return super.email(control)
      ? { required: 'Please enter a valid email.' }
      : undefined;
  }

  static matchValues(
    matchTo: string
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? undefined
        : { isMatching: 'Passwords do not match' };
    };
  }

  static passwordStrength = (): ((
    AbstractControl
  ) => ValidationErrors | null) => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const passwordIsStrong =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(
          control.value
        );

      return passwordIsStrong
        ? null
        : {
            isStrong:
              'Password must contain digits, special characters, lowercase and uppercase letters.',
          };
    };
  };
}
