import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SecureComponent } from './pages/secure/secure.component';
import { AuthHeaderComponent } from './auth/auth-header/auth-header.component';
import { LoadingComponent } from './loading.component';
import { ErrorComponent } from './error.component';
import { DinoComponent } from './pages/home/dino/dino.component';
import { DragonComponent } from './pages/secure/dragon/dragon.component';
import { LoginComponent } from './pages/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    SecureComponent,
    AuthHeaderComponent,
    LoadingComponent,
    ErrorComponent,
    DinoComponent,
    DragonComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
