import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { VacanciesService } from '../vacancies.service';
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
  isLoading = false;
  errorMessage: string;
  serviceSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private vacanciesService: VacanciesService
  ) {}

  ngOnInit(): void {
    this.vacancyId = this.route.snapshot.params['vacancyId'];
    this.isLoading = true;
    this.serviceSub = this.vacanciesService
      .fetchVacancy(this.vacancyId)
      .subscribe({
        next: (vacancy) => {
          console.log(vacancy);
          this.vacancy = vacancy;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.serviceSub.unsubscribe();
  }
}
