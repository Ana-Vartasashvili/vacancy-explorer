import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { startFetchingVacancies } from '../store/vacancies.actions';
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
  @Input() currentPageIndex: number;
  @Output() pageChanged = new EventEmitter();

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
    this.pageChanged.emit(event);
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
