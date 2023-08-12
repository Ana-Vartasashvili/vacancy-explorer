import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import {
  setPageSize,
  startFetchingVacancies,
} from '../store/vacancies.actions';
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
  currentPageSize: number;
  allVacanciesCount: number;
  currentPageIndex = 0;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.storeSub = this.store.select(vacancies).subscribe((vacanciesState) => {
      this.vacancies = vacanciesState.vacancies;
      this.isLoading = vacanciesState.vacanciesLoading;
      this.vacanciesError = vacanciesState.vacanciesError;
      this.currentPageSize = vacanciesState.pageSize;
      this.allVacanciesCount = vacanciesState.numberOfFetchedVacancies;
    });

    this.store.dispatch(startFetchingVacancies({ page: null }));
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

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
