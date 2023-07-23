import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { VacanciesFilterBlockComponent } from './vacancies-filter/vacancies-filter-block/vacancies-filter-block.component';
import { VacanciesFilterOptionComponent } from './vacancies-filter/vacancies-filter-option/vacancies-filter-option.component';
import { VacanciesFilterComponent } from './vacancies-filter/vacancies-filter.component';
import { VacanciesFilterBarComponent } from './vacancies-filter/vacancies-filter-bar/vacancies-filter-bar.component';
import { VacanciesListComponent } from './vacancies-list/vacancies-list.component';
import { VacanciesRoutingModule } from './vacancies-routing.module';
import { VacanciesComponent } from './vacancies.component';

@NgModule({
  declarations: [
    VacanciesListComponent,
    VacanciesComponent,
    VacanciesFilterComponent,
    VacanciesFilterBlockComponent,
    VacanciesFilterOptionComponent,
    VacanciesFilterBarComponent,
  ],
  imports: [VacanciesRoutingModule, MatIconModule, SharedModule, CommonModule],
})
export class VacanciesModule {}
