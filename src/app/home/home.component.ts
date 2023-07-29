import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../store/app.reducer';
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
    this.storeSub = this.store.select(vacancies).subscribe((vacanciesState) => {
      this.vacancies = vacanciesState.vacancies.slice(0, 6);
      this.isLoading = vacanciesState.vacanciesLoading;
      this.vacanciesError = vacanciesState.vacanciesError;
    });
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
