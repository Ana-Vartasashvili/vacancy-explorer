import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../store/app.reducer';
import { startFetchingLatestVacancies } from '../vacancies/store/vacancies.actions';
import { vacancies } from '../vacancies/store/vacancies.selectors';
import { Vacancy } from '../vacancies/vacancies.types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  vacancies: Vacancy[];
  isLoading = false;
  vacanciesError: string;
  storeSub: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(startFetchingLatestVacancies());
    this.storeSub = this.store.select(vacancies).subscribe((vacanciesState) => {
      this.vacancies = vacanciesState.latestVacancies.slice(0, 6);
      this.isLoading = vacanciesState.latestVacanciesLoading;
      this.vacanciesError = vacanciesState.latestVacanciesError;
    });
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
