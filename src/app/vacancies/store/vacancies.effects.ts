import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { addDoc, collection } from 'firebase/firestore';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { db } from 'src/app/firebase/firebase-config';
import { AppState } from 'src/app/store/app.reducer';
import * as VacanciesActions from './vacancies.actions';
import { clearAddVacancyMessage } from './vacancies.actions';

@Injectable()
export class VacanciesEffects {
  constructor(private actions$: Actions, private store: Store<AppState>) {}

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
          addDoc(
            collection(db, 'vacancies'),
            this.getVacancyData(startAddingVacancyAction)
          )
        ).pipe(
          map(() => {
            setTimeout(() => {
              this.store.dispatch(clearAddVacancyMessage());
            }, 3500);

            return VacanciesActions.addVacancySuccess();
          }),
          catchError(() => {
            setTimeout(() => {
              this.store.dispatch(clearAddVacancyMessage());
            }, 3500);

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

  private getVacancyData(action) {
    return {
      jobTitle: action.jobTitle.trim(),
      companyName: action.companyName.trim(),
      category: action.category.trim(),
      city: action.city.trim(),
      employementType: action.employementType.trim(),
      experience: action.experience.trim(),
      jobDescription: action.jobDescription.trim(),
      workingType: action.workingType.trim(),
      salary: action.salary,
      status: 'pending',
    };
  }
}
