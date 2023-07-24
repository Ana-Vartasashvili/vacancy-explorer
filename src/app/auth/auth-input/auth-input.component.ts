import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-auth-input',
  templateUrl: './auth-input.component.html',
  styleUrls: ['./auth-input.component.scss'],
})
export class AuthInputComponent {
  @Input() controlName: string = '';
  @Input() inputPlaceholder: string = '';
  @Input() form: FormGroup;
  inputValue: string;

  updateFormControlValue() {
    this.form.get(this.controlName).setValue(this.inputValue);
  }
}
