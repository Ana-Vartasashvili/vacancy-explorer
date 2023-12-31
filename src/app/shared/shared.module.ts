import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { FlashMessageComponent } from './flash-message/flash-message.component';
import { FormContainerComponent } from './form-container/form-container.component';
import { InputComponent } from './input/input.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CamelCaseToTitleCasePipe } from './pipes/camel-case-to-title-case.pipe';
import { DatePipe } from './pipes/date.pipe';
import { SelectComponent } from './select/select.component';
import { VacancyCardComponent } from './vacancy-card/vacancy-card.component';

@NgModule({
  declarations: [
    VacancyCardComponent,
    FlashMessageComponent,
    NotFoundComponent,
    FormContainerComponent,
    InputComponent,
    SelectComponent,
    DatePipe,
    LoadingSpinnerComponent,
    CamelCaseToTitleCasePipe,
    ConfirmationModalComponent,
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
    RouterModule,
  ],
  exports: [
    VacancyCardComponent,
    FlashMessageComponent,
    FormContainerComponent,
    InputComponent,
    SelectComponent,
    LoadingSpinnerComponent,
    CamelCaseToTitleCasePipe,
    ConfirmationModalComponent,
  ],
})
export class SharedModule {}
