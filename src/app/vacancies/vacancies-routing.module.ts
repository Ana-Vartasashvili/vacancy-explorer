import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VacanciesAddComponent } from './vacancies-add/vacancies-add.component';
import { VacanciesComponent } from './vacancies.component';

const routes: Routes = [
  { path: '', component: VacanciesComponent },
  { path: 'add', component: VacanciesAddComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class VacanciesRoutingModule {}
