import { Component } from '@angular/core';

@Component({
  selector: 'app-add-vacancy',
  templateUrl: './add-vacancy.component.html',
  styleUrls: ['./add-vacancy.component.scss'],
})
export class AddVacancyComponent {
  selectorName: string = 'Category';
  categories = [
    'Horeca',
    'Customer Relations',
    'IT',
    'dummy',
    'dummy',
    'dummy',
  ];
}
