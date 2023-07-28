import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FlashMessageComponent } from './flash-message/flash-message.component';
import { FormContainerComponent } from './form-container/form-container.component';
import { InputComponent } from './input/input.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SelectMultipleComponent } from './select-multiple/select-multiple.component';
import { SelectComponent } from './select/select.component';
import { VacancyCardComponent } from './vacancy-card/vacancy-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    VacancyCardComponent,
    FlashMessageComponent,
    NotFoundComponent,
    FormContainerComponent,
    InputComponent,
    SelectComponent,
    SelectMultipleComponent,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  imports: [
    MatIconModule,
    CommonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  exports: [
    VacancyCardComponent,
    FlashMessageComponent,
    FormContainerComponent,
    InputComponent,
    SelectComponent,
    SelectMultipleComponent,
  ],
})
export class SharedModule {}
