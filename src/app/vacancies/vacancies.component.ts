import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../store/app.reducer';
import { setQueries, startFetchingVacancies } from './store/vacancies.actions';
import { vacancies } from './store/vacancies.selectors';
import { Vacancy } from './vacancies.types';
import { user } from '../auth/store/auth.selectors';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss'],
})
export class VacanciesComponent implements OnInit, OnDestroy {
  filterbarIsShown = false;
  searchForm: FormGroup;
  vacanciesStoreSub: Subscription;
  userStoreSub: Subscription;
  vacancies: Vacancy[];
  isLoading = false;
  searchInputValue: string = '';
  error: string;
  userRole: string;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.vacanciesStoreSub = this.store
      .select(vacancies)
      .subscribe((vacanciesState) => {
        this.isLoading = vacanciesState.vacanciesLoading;
        this.searchInputValue = vacanciesState.vacanciesSearchInputValue;
        this.error = vacanciesState.vacanciesError;
        this.error = vacanciesState.savedVacanciesError;
      });

    this.searchForm = new FormGroup({
      jobTitle: new FormControl(this.searchInputValue),
    });
  }

  setFilterbarIsShown(isShown: boolean) {
    this.filterbarIsShown = isShown;
  }

  onSubmit() {
    const jobTitle = this.searchForm.value.jobTitle.trim();
    if (jobTitle) {
      this.store.dispatch(
        setQueries({
          queries: [
            {
              queryFieldPath: 'jobTitle',
              operator: '==',
              value: jobTitle,
            },
          ],
        })
      );
      this.store.dispatch(startFetchingVacancies({ page: null }));
    }
  }

  fetchAllVacancies() {
    this.store.dispatch(setQueries({ queries: [] }));
    this.store.dispatch(startFetchingVacancies({ page: null }));
    this.searchForm.reset();
  }

  ngOnDestroy(): void {
    this.vacanciesStoreSub.unsubscribe();
  }
}
