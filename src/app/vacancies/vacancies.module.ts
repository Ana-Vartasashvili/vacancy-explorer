import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { VacanciesFilterBarComponent } from './vacancies-filter/vacancies-filter-bar/vacancies-filter-bar.component';
import { VacanciesFilterComponent } from './vacancies-filter/vacancies-filter.component';
import { VacanciesListComponent } from './vacancies-list/vacancies-list.component';
import { VacanciesRoutingModule } from './vacancies-routing.module';
import { VacanciesComponent } from './vacancies.component';
import { AddVacancyComponent } from './add-vacancy/add-vacancy.component';

@NgModule({
  declarations: [
    VacanciesListComponent,
    VacanciesComponent,
    VacanciesFilterComponent,
    VacanciesFilterBarComponent,
    AddVacancyComponent,
  ],
  imports: [
    VacanciesRoutingModule,
    MatIconModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class VacanciesModule {}
