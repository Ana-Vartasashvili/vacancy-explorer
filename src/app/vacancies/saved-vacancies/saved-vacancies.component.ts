import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { vacancies } from '../store/vacancies.selectors';
import { Vacancy } from '../vacancies.types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-saved-vacancies',
  templateUrl: './saved-vacancies.component.html',
  styleUrls: ['./saved-vacancies.component.scss'],
})
export class SavedVacanciesComponent implements OnInit, OnDestroy {
  savedVacancies: Vacancy[] = [];
  isLoading = false;
  error: string;
  storeSub: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.storeSub = this.store.select(vacancies).subscribe((vacanciesState) => {
      this.savedVacancies = [...vacanciesState.savedVacancies].reverse();
      this.isLoading = vacanciesState.savedVacanciesLoading;
      this.error = vacanciesState.savedVacanciesError;
    });
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
