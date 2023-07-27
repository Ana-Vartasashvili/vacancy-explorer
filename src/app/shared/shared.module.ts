import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FlashMessageComponent } from './flash-message/flash-message.component';
import { FormContainerComponent } from './form-container/form-container.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { VacancyCardComponent } from './vacancy-card/vacancy-card.component';
import { InputComponent } from './input/input.component';

@NgModule({
  declarations: [
    VacancyCardComponent,
    FlashMessageComponent,
    NotFoundComponent,
    FormContainerComponent,
    InputComponent,
  ],
  imports: [MatIconModule, CommonModule],
  exports: [
    VacancyCardComponent,
    FlashMessageComponent,
    FormContainerComponent,
    InputComponent,
  ],
})
export class SharedModule {}
