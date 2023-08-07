import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { user } from 'src/app/auth/store/auth.selectors';
import { AppState } from 'src/app/store/app.reducer';
import { startUpdatingSavedVacancies } from 'src/app/vacancies/store/vacancies.actions';
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
  userSub: Subscription;
  userRole: string;

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit(): void {
    this.storeSub = this.store
      .select(savedVacancies)
      .subscribe((savedVacancies) => {
        this.savedVacancies = savedVacancies;
        if (savedVacancies) {
          this.savedVacancyWithSameId = this.savedVacancies.find(
            (savedVacancy, index) => {
              this.savedVacancyIndex = index;
              return savedVacancy.id === this.vacancy.id;
            }
          );
        }
      });

    this.userSub = this.store.select(user).subscribe((user) => {
      if (user) {
        this.userRole = user.role;
      }
    });
  }

  addOrRemoveFromSavedVacancies(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const user = localStorage.getItem('tokenData');
    if (user) {
      this.store.dispatch(
        startUpdatingSavedVacancies({
          vacancyId: this.vacancy.id,
          updateType: this.savedVacancyWithSameId ? 'remove' : 'add',
        })
      );
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}
