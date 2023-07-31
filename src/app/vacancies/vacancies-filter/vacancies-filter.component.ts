import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import {
  ArrowRotateAnimation,
  FilterBlockAnimation,
} from '../../shared/animations/app-animations';
import { Query, startFetchingVacancies } from '../store/vacancies.actions';
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
  formGroupNames: string[];
  queries: Query[] = [];
  @Input() filterbarIsShown: boolean;

  constructor(
    private vacanciesFilterService: VacanciesFilterService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.filtersForm = this.vacanciesFilterService.filtersForm;
    this.filters = this.vacanciesFilterService.options;
    this.formGroupNames = Object.keys(this.filters);
    this.openedFilterBlocks = this.formGroupNames.map((optionName) =>
      optionName === 'category' ? '' : optionName
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

  onChange(formGroup: string, formControl: string) {
    const formControlValue = this.filtersForm
      .get(formGroup)
      .get(formControl).value;

    if (formControlValue) {
      const query: Query = {
        queryFieldPath: formGroup,
        operator: '==',
        value: formControl,
      };
      this.queries = [...this.queries, query];
    } else {
      this.queries = this.queries.filter(
        (query) => query.value !== formControl
      );
    }

    this.store.dispatch(startFetchingVacancies({ queries: this.queries }));
  }
}
