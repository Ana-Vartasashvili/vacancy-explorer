import { Component, Input, OnInit } from '@angular/core';
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
export class VacanciesFilterBlockComponent implements OnInit {
  @Input() filterType: string = '';
  @Input() filterOptions: FilterOption[] = [];
  dropdownBlockIsShown = true;

  ngOnInit(): void {
    this.dropdownBlockIsShown = this.filterType === 'Sphere' ? false : true;
  }

  toggleDropdownBlock() {
    this.dropdownBlockIsShown = !this.dropdownBlockIsShown;
  }
}
