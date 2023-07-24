import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-form-container',
  templateUrl: './auth-form-container.component.html',
  styleUrls: ['./auth-form-container.component.scss'],
})
export class AuthFormContainerComponent {
  @Input() authHeading: string = '';
}
