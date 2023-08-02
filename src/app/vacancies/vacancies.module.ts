import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { EditorModule } from '@tinymce/tinymce-angular';
import { SharedModule } from '../shared/shared.module';
import { AddVacancyComponent } from './add-vacancy/add-vacancy.component';
import { MyVacanciesComponent } from './my-vacancies/my-vacancies.component';
import { VacanciesFilterComponent } from './vacancies-filter/vacancies-filter.component';
import { VacanciesListComponent } from './vacancies-list/vacancies-list.component';
import { VacanciesRoutingModule } from './vacancies-routing.module';
import { VacanciesComponent } from './vacancies.component';
import { VacancyDetailsComponent } from './vacancy-details/vacancy-details.component';

@NgModule({
  declarations: [
    VacanciesListComponent,
    VacanciesComponent,
    VacanciesFilterComponent,
    AddVacancyComponent,
    VacancyDetailsComponent,
    MyVacanciesComponent,
  ],
  imports: [
    VacanciesRoutingModule,
    MatIconModule,
    MatCardModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    RouterModule,
    EditorModule,
  ],
})
export class VacanciesModule {}
