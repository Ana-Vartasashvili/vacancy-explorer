import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { vacancies } from '../store/vacancies.selectors';

@Component({
  selector: 'app-saved-vacancies',
  templateUrl: './saved-vacancies.component.html',
  styleUrls: ['./saved-vacancies.component.scss'],
})
export class SavedVacanciesComponent implements OnInit {
  savedVacancies = [];
  isLoading = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select(vacancies).subscribe((vacanciesState) => {
      this.savedVacancies = vacanciesState.savedVacancies;
      console.log(this.savedVacancies);
    });
  }
}
