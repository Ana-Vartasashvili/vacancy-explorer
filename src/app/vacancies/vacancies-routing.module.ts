import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../auth/auth.guard';
import { AddVacancyComponent } from './add-vacancy/add-vacancy.component';
import { MyVacanciesComponent } from './my-vacancies/my-vacancies.component';
import { SavedVacanciesComponent } from './saved-vacancies/saved-vacancies.component';
import { VacanciesComponent } from './vacancies.component';
import { VacancyDetailsComponent } from './vacancy-details/vacancy-details.component';

const routes: Routes = [
  { path: '', component: VacanciesComponent },
  { path: 'add', component: AddVacancyComponent, canActivate: [authGuard] },
  {
    path: 'my-vacancies',
    component: MyVacanciesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'saved-vacancies',
    component: SavedVacanciesComponent,
    canActivate: [authGuard],
  },
  { path: ':vacancyId', component: VacancyDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class VacanciesRoutingModule {}
