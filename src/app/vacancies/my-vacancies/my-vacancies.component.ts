import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { user } from 'src/app/auth/store/auth.selectors';
import { AppState } from 'src/app/store/app.reducer';
import { startFetchingMyVacancies } from '../store/vacancies.actions';
import { vacancies } from '../store/vacancies.selectors';
import { Vacancy } from '../vacancies.types';

@Component({
  selector: 'app-my-vacancies',
  templateUrl: './my-vacancies.component.html',
  styleUrls: ['./my-vacancies.component.scss'],
})
export class MyVacanciesComponent implements OnInit, OnDestroy {
  storeSub: Subscription;
  userSub: Subscription;
  myVacancies: Vacancy[];
  allMyVacancies: Vacancy[];
  isLoading = false;
  error: string;
  myVacanciesStatus: string = 'all';
  currentUserRole: string;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(startFetchingMyVacancies());
    this.storeSub = this.store.select(vacancies).subscribe((vacanciesState) => {
      this.isLoading = vacanciesState.myVacanciesLoading;
      this.myVacancies = vacanciesState.myVacancies;
      this.allMyVacancies = vacanciesState.myVacancies;
      this.error = vacanciesState.myVacanciesError;
    });
    this.userSub = this.store.select(user).subscribe((user) => {
      if (user) {
        this.currentUserRole = user.role;
      }
    });
  }

  getMyVacanciesWithStatus(vacancyStatus: string) {
    switch (vacancyStatus) {
      case 'all':
        this.myVacanciesStatus = 'all';
        this.myVacancies = this.allMyVacancies;
        break;
      case 'pending':
        this.myVacanciesStatus = 'pending';
        this.myVacancies = this.allMyVacancies.filter(
          (vacancy) => vacancy.status === 'pending'
        );
        break;
      case 'approved':
        this.myVacanciesStatus = 'approved';
        this.myVacancies = this.allMyVacancies.filter(
          (vacancy) => vacancy.status === 'active'
        );
        break;
    }
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
