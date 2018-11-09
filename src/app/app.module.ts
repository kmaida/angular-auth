import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AuthHeaderComponent } from './auth/auth-header/auth-header.component';
import { LoadingComponent } from './shared/loading.component';
import { ErrorComponent } from './shared/error.component';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DinosaursComponent } from './pages/dinosaurs/dinosaurs.component';
import { DinoComponent } from './pages/dinosaurs/dino/dino.component';
import { DinosaurDetailsComponent } from './pages/dinosaur-details/dinosaur-details.component';
import { CallbackComponent } from './pages/callback.component';
import { ProfileComponent } from './pages/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DinosaursComponent,
    DinoComponent,
    DinosaurDetailsComponent,
    CallbackComponent,
    ProfileComponent,
    AuthHeaderComponent,
    LoadingComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
