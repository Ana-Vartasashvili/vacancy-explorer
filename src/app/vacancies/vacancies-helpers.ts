import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  doc,
  getDoc,
} from 'firebase/firestore';
import { Observable, forkJoin } from 'rxjs';
import { db } from '../firebase/firebase-config';
import { Vacancy } from './vacancies.types';

export const getSavedVacanciesDocSnaps = (
  docRefs: DocumentReference[]
): Observable<DocumentSnapshot<DocumentData, DocumentData>[]> => {
  const vacanciesDocs = docRefs.map((docRef) => {
    const docReference = doc(db, 'vacancies', docRef.id);
    return getDoc(docReference);
  });

  return forkJoin(vacanciesDocs);
};

export const getVacanciesList = (
  vacanciesDocSnaps: DocumentSnapshot<Vacancy>[]
) => {
  return vacanciesDocSnaps
    .filter((vacancyDocSnap: DocumentSnapshot<Vacancy>) =>
      vacancyDocSnap.exists()
    )
    .map((filteredVacancyDocSnap: DocumentSnapshot<Vacancy>) =>
      filteredVacancyDocSnap.data()
    );
};
