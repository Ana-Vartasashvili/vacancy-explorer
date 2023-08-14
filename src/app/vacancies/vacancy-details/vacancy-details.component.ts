import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { user } from 'src/app/auth/store/auth.selectors';
import { AppState } from 'src/app/store/app.reducer';
import { deleteVacancy, updateVacancy } from '../store/vacancies.actions';
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
  plainTextContent: string;
  modalIsOpen: boolean;
  isOnVacanciesPage: boolean;
  userSub: Subscription;
  userRole: string;

  constructor(
    private route: ActivatedRoute,
    private vacanciesService: VacanciesService,
    private store: Store<AppState>,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.vacancyId = this.route.snapshot.params['vacancyId'];
    this.isLoading = true;
    this.serviceSub = this.vacanciesService
      .fetchVacancy(this.vacancyId)
      .subscribe({
        next: (vacancy) => {
          this.vacancy = vacancy;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message;
          setTimeout(() => {
            this.errorMessage = null;
          }, 3500);
          this.isLoading = false;
        },
      });

    this.userSub = this.store.select(user).subscribe((user) => {
      if (user) {
        this.userRole = user.role;
      }
    });
  }

  onDeleteBtnClick(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.setModalIsOpen(true);
  }

  onDelete() {
    this.store.dispatch(deleteVacancy({ vacancyId: this.vacancy.id }));
    this.location.back();
  }

  approveVacancy(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.store.dispatch(
      updateVacancy({
        fieldName: 'status',
        updatedValue: 'active',
        vacancyId: this.vacancy.id,
      })
    );
    this.location.back();
  }

  setModalIsOpen(isOpen: boolean) {
    this.modalIsOpen = isOpen;
  }

  ngOnDestroy(): void {
    this.serviceSub.unsubscribe();
  }
}
