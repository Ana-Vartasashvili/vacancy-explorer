import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export class AppValidators extends Validators {
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
      ? { required: 'Field is required.' }
      : undefined;
  }

  static override email(control: AbstractControl) {
    return super.email(control)
      ? { required: 'Please enter a valid email.' }
      : undefined;
  }

  static onlyNumbers(control: AbstractControl) {
    if (control.value == null) return null;
    const regexNumbersOnly = /^[0-9]+$/;
    return regexNumbersOnly.test(control.value)
      ? null
      : { onlyNumbers: 'Field can contain only numbers.' };
  }

  static noWhiteSpaces(control: AbstractControl) {
    if (control.value == null) return null;
    return control.value.trim().length
      ? null
      : { whiteSpace: 'Field can not contain only white spaces.' };
  }

  static matchValues(
    matchTo: string
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? undefined
        : { isMatching: 'Passwords do not match.' };
    };
  }

  static passwordStrength(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const regexLowerCase = /^(?=.*[a-z])/;
    const regexUpperCase = /^(?=.*[A-Z])/;
    const regexDigits = /^(?=.*[0-9])/;
    const regexSpecialChars = /^(?=.*[!@#$%^&*])/;

    if (!value) return null;

    if (!regexLowerCase.test(value)) {
      return { isStrong: 'Password must contain lowercase letters.' };
    }

    if (!regexUpperCase.test(value)) {
      return { isStrong: 'Password must contain uppercase letters.' };
    }

    if (!regexDigits.test(value)) {
      return { isStrong: 'Password must contain digits.' };
    }

    if (!regexSpecialChars.test(value)) {
      return {
        isStrong: 'Password must contain special characters.',
      };
    }

    return null;
  }
}
