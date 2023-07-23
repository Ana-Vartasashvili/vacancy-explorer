import { Component } from '@angular/core';
import { Filter } from './vacancies-filter.types';

@Component({
  selector: 'app-vacancies-filter',
  templateUrl: './vacancies-filter.component.html',
  styleUrls: ['./vacancies-filter.component.scss'],
})
export class VacanciesFilterComponent {
  filters: Filter[] = [
    {
      filterType: 'Sphere',
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
      filterType: 'Working Type',
      options: [
        { optionName: 'Office', optionIdentifier: 'office' },
        { optionName: 'Hybrid', optionIdentifier: 'hybrid' },
        { optionName: 'Remote', optionIdentifier: 'remote' },
      ],
    },
    {
      filterType: 'Employement Type',
      options: [
        { optionName: 'Full time', optionIdentifier: 'full-time' },
        { optionName: 'Part time', optionIdentifier: 'part-time' },
      ],
    },
  ];
}
