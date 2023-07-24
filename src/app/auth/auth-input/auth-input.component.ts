import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-input',
  templateUrl: './auth-input.component.html',
  styleUrls: ['./auth-input.component.scss'],
})
export class AuthInputComponent {
  @Input() inputIdentifier: string = '';
  @Input() inputPlaceholder: string = '';
}
