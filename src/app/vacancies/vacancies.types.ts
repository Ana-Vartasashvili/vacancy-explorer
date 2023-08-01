import { FieldValue, Timestamp } from 'firebase/firestore';

export interface Vacancy {
  category: string;
  workingType: string;
  employementType: string;
  experience: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  city: string;
  salary: number;
  id: string;
  status: string;
  createdAt: FieldValue;
  userId: string;
}
