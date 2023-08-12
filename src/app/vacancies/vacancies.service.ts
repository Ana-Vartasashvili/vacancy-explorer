import { Injectable } from '@angular/core';
import { doc, getDoc } from 'firebase/firestore';
import { catchError, from, map } from 'rxjs';
import { db } from '../firebase/firebase-config';
import { Vacancy } from './vacancies.types';

@Injectable({
  providedIn: 'root',
})
export class VacanciesService {
  constructor() {}

  fetchVacancy(vacancyId: string) {
    const docRef = doc(db, 'vacancies', vacancyId);

    return from(getDoc(docRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          const vacancyData = docSnap.data() as Vacancy;
          return vacancyData;
        } else {
          throw new Error('Vacancy can not be found.');
        }
      })
    );
  }
}
