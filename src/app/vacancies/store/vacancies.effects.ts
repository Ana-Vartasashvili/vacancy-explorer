import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { addDoc, collection } from 'firebase/firestore';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { db } from 'src/app/firebase/firebase-config';
import * as VacanciesActions from './vacancies.actions';

@Injectable()
export class VacanciesEffects {
  constructor(private actions$: Actions) {}

  addVacancy = createEffect(() =>
    this.actions$.pipe(
      ofType(VacanciesActions.startAddingVacancy),
      switchMap((startAddingVacancyAction) => {
        const user = localStorage.getItem('userData');
        if (!user) {
          return of(
            VacanciesActions.addVacancyFailed({
              errorMessage: 'User is not authenticated!',
            })
          );
        }

        return from(
          addDoc(collection(db, 'vacancies'), {
            jobTitle: startAddingVacancyAction.jobTitle.trim(),
            companyName: startAddingVacancyAction.companyName.trim(),
            category: startAddingVacancyAction.category.trim(),
            city: startAddingVacancyAction.city.trim(),
            employementType: startAddingVacancyAction.employementType.trim(),
            experience: startAddingVacancyAction.experience.trim(),
            jobDescription: startAddingVacancyAction.jobDescription.trim(),
            workingType: startAddingVacancyAction.workingType.trim(),
            salary: startAddingVacancyAction.salary,
            status: 'pending',
          })
        ).pipe(
          map(() => VacanciesActions.addVacancySuccess()),
          catchError(() => {
            return of(
              VacanciesActions.addVacancyFailed({
                errorMessage: 'Could not add new vacancy',
              })
            );
          })
        );
      })
    )
  );
}
