import { Component, Input } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-vacancy-card',
  templateUrl: './vacancy-card.component.html',
  styleUrls: ['./vacancy-card.component.scss'],
})
export class VacancyCardComponent {
  @Input() vacancyTitle: string;
  @Input() companyName: string;
  @Input() cityName: string;
  @Input() createdAt: Timestamp;
  @Input() vacancyId: string;
}
