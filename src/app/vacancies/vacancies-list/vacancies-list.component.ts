import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { vacancies } from '../store/vacancies.selectors';
import { Vacancy } from '../vacancies.types';

@Component({
  selector: 'app-vacancies-list',
  templateUrl: './vacancies-list.component.html',
  styleUrls: ['./vacancies-list.component.scss'],
})
export class VacanciesListComponent implements OnInit, OnDestroy {
  vacancies: Vacancy[];
  isLoading = false;
  vacanciesError: string;
  storeSub: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.storeSub = this.store.select(vacancies).subscribe((vacanciesState) => {
      this.vacancies = vacanciesState.vacancies;
      this.isLoading = vacanciesState.vacanciesLoading;
      this.vacanciesError = vacanciesState.vacanciesError;
    });
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
