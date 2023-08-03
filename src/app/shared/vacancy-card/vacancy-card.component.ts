import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { startAddingToSavedVacancies } from 'src/app/vacancies/store/vacancies.actions';
import { Vacancy } from 'src/app/vacancies/vacancies.types';

@Component({
  selector: 'app-vacancy-card',
  templateUrl: './vacancy-card.component.html',
  styleUrls: ['./vacancy-card.component.scss'],
})
export class VacancyCardComponent {
  @Input() vacancy: Vacancy;

  constructor(private store: Store<AppState>) {}

  addToSavedVacancies(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.store.dispatch(startAddingToSavedVacancies({ vacancy: this.vacancy }));
  }
}
