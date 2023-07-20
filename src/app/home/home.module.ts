import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { HeroComponent } from './hero/hero.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent, HeroComponent],
  imports: [RouterModule, HomeRoutingModule, MatIconModule],
})
export class HomeModule {}
