import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { vacancies } from '../store/vacancies.selectors';
import { Vacancy } from '../vacancies.types';
import { startFetchingMyVacancies } from '../store/vacancies.actions';

@Component({
  selector: 'app-my-vacancies',
  templateUrl: './my-vacancies.component.html',
  styleUrls: ['./my-vacancies.component.scss'],
})
export class MyVacanciesComponent implements OnInit, OnDestroy {
  storeSub: Subscription;
  myVacancies: Vacancy[];
  isLoading = false;
  error: string;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(startFetchingMyVacancies());
    this.storeSub = this.store.select(vacancies).subscribe((vacanciesState) => {
      this.isLoading = vacanciesState.myVacanciesLoading;
      this.myVacancies = vacanciesState.myVacancies;
      this.error = vacanciesState.myVacanciesError;
    });
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
