import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../shared/shared.module';
import { VacanciesFilterBlockComponent } from './vacancies-filter/vacancies-filter-block/vacancies-filter-block.component';
import { VacanciesFilterComponent } from './vacancies-filter/vacancies-filter.component';
import { VacanciesListComponent } from './vacancies-list/vacancies-list.component';
import { VacanciesRoutingModule } from './vacancies-routing.module';
import { VacanciesComponent } from './vacancies.component';
import { VacanciesFilterOptionComponent } from './vacancies-filter/vacancies-filter-option/vacancies-filter-option.component';

@NgModule({
  declarations: [
    VacanciesListComponent,
    VacanciesComponent,
    VacanciesFilterComponent,
    VacanciesFilterBlockComponent,
    VacanciesFilterOptionComponent,
  ],
  imports: [VacanciesRoutingModule, MatIconModule, SharedModule, CommonModule],
})
export class VacanciesModule {}
