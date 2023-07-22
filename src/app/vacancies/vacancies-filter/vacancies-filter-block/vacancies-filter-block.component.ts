import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-vacancies-filter-block',
  templateUrl: './vacancies-filter-block.component.html',
  styleUrls: ['./vacancies-filter-block.component.scss'],
  animations: [
    trigger('fade', [
      transition('void=>*', [style({ opacity: 0 }), animate(300)]),
      transition('*=>void', [animate(200, style({ opacity: 0 }))]),
    ]),
    trigger('openClose', [
      state('open', style({ rotate: '180deg' })),
      transition('open => close', [animate('0.25s')]),
      transition('close => open', [animate('0.25s')]),
    ]),
  ],
})
export class VacanciesFilterBlockComponent {
  dropdownBlockIsShown = false;

  toggleDropdownBlock() {
    this.dropdownBlockIsShown = !this.dropdownBlockIsShown;
  }
}
