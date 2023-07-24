import {
  ArrowRotateAnimation,
  FilterBlockAnimation,
} from '../vacancies.animation';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { VacanciesFilterService } from './vacancies-filter.service';
import { Filter } from './vacancies-filter.types';

@Component({
  selector: 'app-vacancies-filter',
  templateUrl: './vacancies-filter.component.html',
  styleUrls: ['./vacancies-filter.component.scss'],
  animations: [ArrowRotateAnimation, FilterBlockAnimation],
})
export class VacanciesFilterComponent {
  filtersForm: FormGroup;
  filters: Filter[];
  openedFilterBlocks: string[] = [];

  constructor(private vacanciesFilterService: VacanciesFilterService) {
    this.filtersForm = this.vacanciesFilterService.filtersForm;
    this.filters = this.vacanciesFilterService.filters;
    this.openedFilterBlocks = this.filters.map((filter) =>
      filter.filterName === 'Sphere' ? '' : filter.filterName
    );
  }

  setFilterBlockIsOpen(filterBlockName: string) {
    if (this.openedFilterBlocks.includes(filterBlockName)) {
      this.openedFilterBlocks = this.openedFilterBlocks.filter((blockName) => {
        return blockName !== filterBlockName;
      });
    } else {
      this.openedFilterBlocks.push(filterBlockName);
    }
  }

  filterBlockIsOpen(filterBlockName: string) {
    return this.openedFilterBlocks.includes(filterBlockName);
  }
}
