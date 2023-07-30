import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormControls, FormGroups, Options } from './vacancies-filter.types';

@Injectable({
  providedIn: 'root',
})
export class VacanciesFilterService {
  filtersForm: FormGroup;
  options: Options = {
    category: [
      'Sales',
      'Customer relations',
      'Horeca',
      'Banking and Finances',
      'Cook',
      'Distribution',
      'Warehouse and packaging',
      'Administration',
      'Retail',
      'Medical',
      'Waiter',
      'Logistics',
      'Delivery',
      'Gambling',
      'Security',
      'Information Technologies',
      'Management',
      'Marketing',
      'Accounting',
      'Auto industry',
      'Finances',
      'Pharmacy',
      'Construction',
      'Education',
      'Tourism',
      'Data analysis',
      'Engineering',
      'Human Resources',
      'Insurance',
      'Procurements',
      'Architecture',
      'Audit',
      'Consultation',
      'Digital marketing',
      'Media',
    ],

    employementType: [
      'Full time',
      'Part time',
      'Hourly',
      'Freelance',
      'Internship',
      'Shifts',
    ],

    workingType: ['Office', 'On-site', 'Remote ', 'Hybrid'],

    experience: [
      'Not required',
      'Less than a year',
      '1-2 years',
      '2-3 years',
      '3-5 years',
      '5+ years',
    ],

    city: ['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi'],
  };

  constructor() {
    this.filtersForm = this.createFiltersForm();
  }

  private createFiltersForm() {
    let formGroups: FormGroups = {};

    for (const filterName in this.options) {
      let controls: FormControls = {};

      this.options[filterName].forEach((option) => {
        controls[option] = new FormControl('');
      });

      formGroups[filterName] = new FormGroup(controls);
    }

    return new FormGroup(formGroups);
  }
}
