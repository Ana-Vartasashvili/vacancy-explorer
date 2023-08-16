import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { user } from '../auth/store/auth.selectors';
import { AppState } from '../store/app.reducer';
import {
  setPageSize,
  setVacanciesSearchInputValue,
  setVacanciesStatus,
  startFetchingVacancies,
} from './store/vacancies.actions';
import { vacancies } from './store/vacancies.selectors';
import { Vacancy } from './vacancies.types';

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
  currentPageSize: number;
  searchInputValue: string = '';
  error: string;
  userRole: string;
  userSub: Subscription;
  vacanciesStatus: string = 'active';
  currentPageIndex: number = 0;

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.vacanciesStoreSub = this.store
      .select(vacancies)
      .subscribe((vacanciesState) => {
        this.isLoading = vacanciesState.vacanciesLoading;
        this.searchInputValue = vacanciesState.vacanciesSearchInputValue;
        this.vacanciesStatus = vacanciesState.vacanciesStatus;
        this.currentPageSize = vacanciesState.pageSize;
        this.error = vacanciesState.vacanciesError;
        this.error = vacanciesState.savedVacanciesError;
      });
    this.cd.detectChanges();

    this.userSub = this.store.select(user).subscribe((user) => {
      this.userRole = user ? user.role : null;
    });
  }

  setFilterbarIsShown(isShown: boolean) {
    this.filterbarIsShown = isShown;
  }

  fetchVacancies(status: 'active' | 'pending') {
    this.store.dispatch(setVacanciesStatus({ status }));
    this.store.dispatch(startFetchingVacancies({ page: null }));
    this.vacanciesStatus = status;
    this.currentPageIndex = 0;
  }

  onPageChange(event: PageEvent) {
    const { pageIndex, pageSize, previousPageIndex } = event;
    let page: null | 'previous' | 'next';

    if (this.currentPageSize !== pageSize) {
      this.currentPageIndex = 0;
      this.currentPageSize = pageSize;
      page = null;
      this.store.dispatch(setPageSize({ pageSize: pageSize }));
    } else if (pageIndex > previousPageIndex) {
      this.currentPageIndex++;
      page = 'next';
    } else if (pageIndex < previousPageIndex) {
      this.currentPageIndex--;
      page = 'previous';
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    this.store.dispatch(startFetchingVacancies({ page }));
  }

  onSearchInputValueChange(e: KeyboardEvent) {
    const inputValue = (e.target as HTMLInputElement).value.trim();
    if (inputValue !== this.searchInputValue) {
      this.store.dispatch(setVacanciesSearchInputValue({ inputValue }));
      this.store.dispatch(startFetchingVacancies({ page: null }));
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(setVacanciesSearchInputValue({ inputValue: '' }));
    this.vacanciesStoreSub.unsubscribe();
  }
}
