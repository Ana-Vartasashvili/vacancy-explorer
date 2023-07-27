import { Component, OnInit } from '@angular/core';
import { VacanciesFilterService } from '../vacancies-filter/vacancies-filter.service';
import { Options } from '../vacancies-filter/vacancies-filter.types';

@Component({
  selector: 'app-add-vacancy',
  templateUrl: './add-vacancy.component.html',
  styleUrls: ['./add-vacancy.component.scss'],
})
export class AddVacancyComponent implements OnInit {
  options: Options;

  constructor(private vacanciesFiltersService: VacanciesFilterService) {}

  ngOnInit(): void {
    this.options = this.vacanciesFiltersService.options;
  }
}
