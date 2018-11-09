import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SecureInterceptor } from './auth/secure-interceptor.service';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { CallbackComponent } from './pages/callback.component';
import { DinosaursComponent } from './pages/dinosaurs/dinosaurs.component';
import { DinosaurDetailsComponent } from './pages/dinosaur-details/dinosaur-details.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'dinosaurs',
    component: DinosaursComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'dinosaur/:name',
    component: DinosaurDetailsComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SecureInterceptor,
      multi: true
    }
  ]
})
export class AppRoutingModule { }
