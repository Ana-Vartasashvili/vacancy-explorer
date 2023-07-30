import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ArrowRotateAnimation,
  FilterBlockAnimation,
} from '../../shared/animations/app-animations';
import { VacanciesFilterService } from './vacancies-filter.service';
import { Options } from './vacancies-filter.types';

@Component({
  selector: 'app-vacancies-filter',
  templateUrl: './vacancies-filter.component.html',
  styleUrls: ['./vacancies-filter.component.scss'],
  animations: [ArrowRotateAnimation, FilterBlockAnimation],
})
export class VacanciesFilterComponent implements OnInit {
  filtersForm: FormGroup;
  filters: Options;
  openedFilterBlocks: string[] = [];
  filterOptionNames: string[];

  constructor(private vacanciesFilterService: VacanciesFilterService) {}

  ngOnInit(): void {
    this.filtersForm = this.vacanciesFilterService.filtersForm;
    this.filters = this.vacanciesFilterService.options;
    this.filterOptionNames = Object.keys(this.filters);
    this.openedFilterBlocks = this.filterOptionNames.map((optionName) =>
      optionName === 'Category' ? '' : optionName
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
