import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { VacanciesFilterService } from '../vacancies-filter.service';
import { Options } from '../vacancies-filter.types';

@Component({
  selector: 'app-vacancies-filter-bar',
  templateUrl: './vacancies-filter-bar.component.html',
  styleUrls: ['./vacancies-filter-bar.component.scss'],
})
export class VacanciesFilterBarComponent {
  filters: Options = {};
  filtersForm: FormGroup;

  constructor(private vacanciesFilterService: VacanciesFilterService) {
    this.filtersForm = this.vacanciesFilterService.filtersForm;
    this.filters = this.vacanciesFilterService.options;
  }
}
