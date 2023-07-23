import { Component, Input } from '@angular/core';
import {
  ArrowRotateAnimation,
  FilterBlockAnimation,
} from '../../vacancies.animation';
import { FilterOption } from '../vacancies-filter.types';

@Component({
  selector: 'app-vacancies-filter-block',
  templateUrl: './vacancies-filter-block.component.html',
  styleUrls: ['./vacancies-filter-block.component.scss'],
  animations: [FilterBlockAnimation, ArrowRotateAnimation],
})
export class VacanciesFilterBlockComponent {
  @Input() filterType: string = '';
  @Input() filterOptions: FilterOption[] = [];
  dropdownBlockIsShown = true;

  toggleDropdownBlock() {
    this.dropdownBlockIsShown = !this.dropdownBlockIsShown;
  }
}
