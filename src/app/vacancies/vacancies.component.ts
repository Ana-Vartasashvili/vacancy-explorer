import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../store/app.reducer';
import { startFetchingVacancies } from './store/vacancies.actions';
import { vacancies } from './store/vacancies.selectors';
import { Vacancy } from './vacancies.types';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss'],
})
export class VacanciesComponent implements OnInit {
  filterbarIsShown = false;
  searchForm: FormGroup;
  storeSub: Subscription;
  vacancies: Vacancy[];
  isLoading = false;

  constructor(private store: Store<AppState>) {}

  setFilterbarIsShown(isShown: boolean) {
    this.filterbarIsShown = isShown;
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      jobTitle: new FormControl(''),
    });

    this.storeSub = this.store.select(vacancies).subscribe((vacanciesState) => {
      this.vacancies = vacanciesState.vacancies;
      this.isLoading = vacanciesState.vacanciesLoading;
    });
  }

  onSubmit() {
    const jobTitle = this.searchForm.value.jobTitle.trim();
    if (jobTitle) {
      this.store.dispatch(
        startFetchingVacancies({
          queries: [
            {
              queryFieldPath: 'jobTitle',
              operator: '==',
              value: jobTitle,
            },
          ],
        })
      );
    }
  }

  fetchAllVacancies() {
    this.store.dispatch(
      startFetchingVacancies({
        queries: [],
      })
    );

    this.searchForm.reset();
  }
}
