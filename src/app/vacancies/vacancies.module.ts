import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { AddVacancyComponent } from './add-vacancy/add-vacancy.component';
import { VacanciesFilterComponent } from './vacancies-filter/vacancies-filter.component';
import { VacanciesListComponent } from './vacancies-list/vacancies-list.component';
import { VacanciesRoutingModule } from './vacancies-routing.module';
import { VacanciesComponent } from './vacancies.component';
import { VacancyDetailsComponent } from './vacancy-details/vacancy-details.component';
import { MyVacanciesComponent } from './my-vacancies/my-vacancies.component';

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
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
  ],
})
export class VacanciesModule {}
