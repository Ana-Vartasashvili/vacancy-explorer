import { Component, Input, forwardRef } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() form: FormGroup;
  @Input() formControlName: string;
  @Input() placeholder: string;
  @Input() inputType: string = 'text';
  value: string;
  onChange: (newValue: string) => void;
  onTouched: () => void;

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputChange(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.onChange(newValue);
  }

  onInputTouch() {
    this.onTouched();
  }

  getFormControl(): AbstractControl {
    return this.form.get(this.formControlName);
  }

  isInvalidAndTouched() {
    return this.getFormControl().invalid && this.getFormControl().touched;
  }

  hasError() {
    return !!this.getFormControl().errors;
  }

  errorMessage(): { [error: string]: string } {
    return Object.values(this.getFormControl().errors)[0];
  }
}
