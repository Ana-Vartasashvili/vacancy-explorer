import { Component } from '@angular/core';

@Component({
  selector: 'app-vacancies-filter-block',
  templateUrl: './vacancies-filter-block.component.html',
  styleUrls: ['./vacancies-filter-block.component.scss'],
})
export class VacanciesFilterBlockComponent {
  dropdownBlockIsShown = false;

  toggleDropdownBlock() {
    this.dropdownBlockIsShown = !this.dropdownBlockIsShown;
  }
}
