import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddVacancyComponent } from './add-vacancy/add-vacancy.component';
import { VacanciesComponent } from './vacancies.component';
import { authGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: '', component: VacanciesComponent },
  { path: 'add', component: AddVacancyComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class VacanciesRoutingModule {}
