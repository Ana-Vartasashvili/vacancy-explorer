import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddVacancyComponent } from './add-vacancy/add-vacancy.component';
import { VacanciesComponent } from './vacancies.component';

const routes: Routes = [
  { path: '', component: VacanciesComponent },
  { path: 'add', component: AddVacancyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class VacanciesRoutingModule {}
