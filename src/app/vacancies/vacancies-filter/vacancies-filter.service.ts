import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Filter, FormControls, FormGroups } from './vacancies-filter.types';

@Injectable({
  providedIn: 'root',
})
export class VacanciesFilterService {
  filtersForm: FormGroup;
  filters: Filter[] = [
    {
      filterName: 'Sphere',
      options: [
        { optionName: 'Sales', optionIdentifier: 'sales' },
        {
          optionName: 'Customer relations',
          optionIdentifier: 'customer-relations',
        },
        {
          optionName: 'Horeca',
          optionIdentifier: 'horeca',
        },
      ],
    },
    {
      filterName: 'Working Type',
      options: [
        { optionName: 'Office', optionIdentifier: 'office' },
        { optionName: 'Hybrid', optionIdentifier: 'hybrid' },
        { optionName: 'Remote', optionIdentifier: 'remote' },
      ],
    },
    {
      filterName: 'Employement Type',
      options: [
        { optionName: 'Full time', optionIdentifier: 'full-time' },
        { optionName: 'Part time', optionIdentifier: 'part-time' },
      ],
    },
  ];

  constructor() {
    this.filtersForm = this.createFiltersForm();
  }

  private createFiltersForm() {
    let formGroups: FormGroups = {};

    this.filters.forEach((filter: Filter) => {
      let controls: FormControls = {};

      filter.options.forEach((option) => {
        controls[option.optionIdentifier] = new FormControl('');
      });

      formGroups[filter.filterName] = new FormGroup(controls);
    });

    return new FormGroup(formGroups);
  }
}
