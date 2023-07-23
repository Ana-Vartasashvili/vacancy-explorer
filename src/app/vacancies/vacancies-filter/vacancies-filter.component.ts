import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { VacanciesFilterService } from './vacancies-filter.service';
import { Filter } from './vacancies-filter.types';

@Component({
  selector: 'app-vacancies-filter',
  templateUrl: './vacancies-filter.component.html',
  styleUrls: ['./vacancies-filter.component.scss'],
})
export class VacanciesFilterComponent {
  filtersForm: FormGroup;
  filters: Filter[];

  constructor(private vacanciesFilterService: VacanciesFilterService) {
    this.filtersForm = this.vacanciesFilterService.filtersForm;
    this.filters = this.vacanciesFilterService.filters;
  }
}
