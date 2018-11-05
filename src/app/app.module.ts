import { BrowserModule } from '@angular/platform-browser';
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
import { CallbackComponent } from './pages/callback.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DragonsComponent } from './pages/dragons/dragons.component';
import { DragonComponent } from './pages/dragons/dragon/dragon.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DinosaursComponent,
    DinoComponent,
    CallbackComponent,
    ProfileComponent,
    DragonsComponent,
    DragonComponent,
    AuthHeaderComponent,
    LoadingComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
