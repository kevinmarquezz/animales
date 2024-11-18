import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { Error404Component } from './pages/error404/error404.component';
import { IndevComponent } from './pages/indev/indev.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuardLoginService } from './services/auth/auth-guard-login.service';
import { AdoptionRequestComponent } from './pages/adoption-request/adoption-request.component';

const routes: Routes = [
  ({path: '', component: HomeComponent}),
  ({path: 'registro', component: RegisterComponent, canActivate: [AuthGuardLoginService]}),
  ({path: 'inicio-sesion', component: LoginComponent, canActivate: [AuthGuardLoginService]}),
  ({path: 'comofunciona', component: IndevComponent}),
  ({path: 'solicitud-adopcion/:id', component: AdoptionRequestComponent}),
  ({path: '**', component: Error404Component}),
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
