import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SecureInterceptor } from './auth/secure-interceptor.service';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from './auth/auth.guard';
import { SecureComponent } from './pages/secure/secure.component';
import { CallbackComponent } from './pages/callback.component';
import { PublicComponent } from './pages/public/public.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'secure',
    component: SecureComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'public',
    component: PublicComponent
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
