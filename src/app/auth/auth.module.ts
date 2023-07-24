import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AuthInputComponent } from './auth-input/auth-input.component';
import { AuthFormContainerComponent } from './auth-form-container/auth-form-container.component';

@NgModule({
  declarations: [SignupComponent, LoginComponent, AuthInputComponent, AuthFormContainerComponent],
  imports: [CommonModule, AuthRoutingModule, FormsModule, ReactiveFormsModule],
})
export class AuthModule {}
