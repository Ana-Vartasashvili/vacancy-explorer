import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { VacanciesListComponent } from './vacancies-list/vacancies-list.component';
import { VacanciesRoutingModule } from './vacancies-routing.module';
import { VacanciesComponent } from './vacancies.component';

@NgModule({
  declarations: [VacanciesListComponent, VacanciesComponent],
  imports: [VacanciesRoutingModule, MatIconModule, SharedModule],
})
export class VacanciesModule {}
