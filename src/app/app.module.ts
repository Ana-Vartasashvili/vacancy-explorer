import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { EditorModule } from '@tinymce/tinymce-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthEffects } from './auth/store/auth.effects';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './header/navbar/navbar.component';
import { SidebarComponent } from './header/sidebar/sidebar.component';
import { appReducer } from './store/app.reducer';
import { VacanciesEffects } from './vacancies/store/vacancies.effects';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    MatIconModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    EditorModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([AuthEffects, VacanciesEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
