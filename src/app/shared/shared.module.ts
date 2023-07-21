import { NgModule } from '@angular/core';
import { VacancyCardComponent } from './vacancy-card/vacancy-card.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [VacancyCardComponent],
  imports: [MatIconModule],
  exports: [VacancyCardComponent],
})
export class SharedModule {}
