import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./home/home.module').then((module) => module.HomeModule),
  },
  {
    path: 'vacancies',
    loadChildren: () =>
      import('./vacancies/vacancies.module').then(
        (module) => module.VacanciesModule
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((module) => module.AuthModule),
  },

  {
    path: 'page-not-found',
    component: NotFoundComponent,
  },

  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
