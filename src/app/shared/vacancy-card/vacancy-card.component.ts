import { Component, Input } from '@angular/core';
import { FieldValue, Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-vacancy-card',
  templateUrl: './vacancy-card.component.html',
  styleUrls: ['./vacancy-card.component.scss'],
})
export class VacancyCardComponent {
  @Input() vacancyTitle: string;
  @Input() companyName: string;
  @Input() cityName: string;
  @Input() createdAt: FieldValue;
  @Input() vacancyId: string;
}
