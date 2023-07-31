import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../auth/auth.guard';
import { AddVacancyComponent } from './add-vacancy/add-vacancy.component';
import { VacanciesComponent } from './vacancies.component';
import { VacancyDetailsComponent } from './vacancy-details/vacancy-details.component';

const routes: Routes = [
  { path: '', component: VacanciesComponent },
  { path: 'add', component: AddVacancyComponent, canActivate: [authGuard] },
  { path: ':vacancyId', component: VacancyDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class VacanciesRoutingModule {}
