import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vacancies-filter-option',
  templateUrl: './vacancies-filter-option.component.html',
  styleUrls: ['./vacancies-filter-option.component.scss'],
})
export class VacanciesFilterOptionComponent {
  @Input() optionTitle: string = '';
  @Input() optionIdentifier: string = '';
}
