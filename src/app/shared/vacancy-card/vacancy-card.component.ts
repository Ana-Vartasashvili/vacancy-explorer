import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { startAddingToSavedVacancies } from 'src/app/vacancies/store/vacancies.actions';
import { savedVacancies } from 'src/app/vacancies/store/vacancies.selectors';
import { Vacancy } from 'src/app/vacancies/vacancies.types';

@Component({
  selector: 'app-vacancy-card',
  templateUrl: './vacancy-card.component.html',
  styleUrls: ['./vacancy-card.component.scss'],
})
export class VacancyCardComponent implements OnInit, OnDestroy {
  @Input() vacancy: Vacancy;
  savedVacancies: Vacancy[];
  savedVacancyIndex: number;
  vacancyIsSaved: boolean;
  savedVacancyWithSameId: Vacancy;
  storeSub: Subscription;

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit(): void {
    this.storeSub = this.store
      .select(savedVacancies)
      .subscribe((savedVacancies) => {
        this.savedVacancies = savedVacancies;
        this.savedVacancyWithSameId = this.savedVacancies.find(
          (savedVacancy, index) => {
            this.savedVacancyIndex = index;
            return savedVacancy.id === this.vacancy.id;
          }
        );
      });
  }

  addOrRemoveFromSavedVacancies(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const user = localStorage.getItem('tokenData');
    if (user) {
      let updatedSavedVacancies: Vacancy[];

      if (this.savedVacancyWithSameId) {
        const savedVacancies = [...this.savedVacancies];
        savedVacancies.splice(this.savedVacancyIndex, 1);
        updatedSavedVacancies = [...savedVacancies];
      } else {
        updatedSavedVacancies = [...this.savedVacancies, this.vacancy];
      }

      this.store.dispatch(
        startAddingToSavedVacancies({
          savedVacancies: updatedSavedVacancies,
        })
      );
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
