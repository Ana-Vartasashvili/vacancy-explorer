import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FlashMessageComponent } from './flash-message/flash-message.component';
import { VacancyCardComponent } from './vacancy-card/vacancy-card.component';

@NgModule({
  declarations: [VacancyCardComponent, FlashMessageComponent],
  imports: [MatIconModule, CommonModule],
  exports: [VacancyCardComponent, FlashMessageComponent],
})
export class SharedModule {}
