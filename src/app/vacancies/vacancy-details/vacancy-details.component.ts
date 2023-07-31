import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { vacanciesList } from '../store/vacancies.selectors';
import { Vacancy } from '../vacancies.types';

@Component({
  selector: 'app-vacancy-details',
  templateUrl: './vacancy-details.component.html',
  styleUrls: ['./vacancy-details.component.scss'],
})
export class VacancyDetailsComponent implements OnInit, OnDestroy {
  vacancyId: string;
  storeSub: Subscription;
  vacancy: Vacancy;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.vacancyId = this.route.snapshot.params['vacancyId'];
    this.storeSub = this.store.select(vacanciesList).subscribe((vacancies) => {
      this.vacancy = vacancies.find((vacancy) => {
        return vacancy.id === this.vacancyId;
      });
    });
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
